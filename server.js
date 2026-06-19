const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_500_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function extractJson(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return JSON.parse(fenced[1]);
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return JSON.parse(trimmed.slice(first, last + 1));
  throw new Error("Model did not return parseable JSON");
}

function buildPrompt({ story, genre, target, minutes }) {
  return `
You are GLOW Story Studio, a source-grounded AI story adaptation council.

Mission:
Turn the user's story/audio transcript into an international-level film adaptation package.

Non-negotiable rules:
- Do not invent characters, relationships, props, locations, events, or backstory as facts.
- Every factual claim must cite an evidence ID from the source sentence list.
- You may propose creative additions only inside "creative_additions_for_approval".
- Keep GLOW/WIT DNA: human truth, no preaching, no manipulation, silence as transformation, remove before add.
- Write in Vietnamese unless prompt fields are technical prompt strings for AI image/video tools.
- Output JSON only. No markdown wrapper.

Genre: ${genre}
Target platform: ${target}
Target length minutes: ${minutes}

Required JSON shape:
{
  "agent_mode": "ai",
  "evidence": [{"id":"E1","text":"...","function":"setup/conflict/reveal/payoff"}],
  "characters": [{"name":"...","role":"...","evidence":["E1"]}],
  "props_places": [{"name":"...","type":"prop/place/event","evidence":["E1"]}],
  "story_diagnosis": {
    "logline":"...",
    "human_truth":{"text":"...","evidence":["E1"],"confidence":0.0},
    "wound":{"text":"...","evidence":["E1"],"confidence":0.0},
    "desire":{"text":"...","evidence":["E1"],"confidence":0.0},
    "false_belief":{"text":"...","evidence":["E1"],"confidence":0.0},
    "symbol":{"text":"...","evidence":["E1"],"confidence":0.0}
  },
  "viral_strategy": {
    "thesis":"...",
    "audience_mirror":"...",
    "share_trigger":"...",
    "retention_curve":[{"time":"0:00","job":"...","device":"..."}]
  },
  "hooks": [{"type":"visual/psychological/share","text":"...","evidence":["E1"],"why_it_works":"...","copy_lift_percent":0}],
  "detailed_script": [
    {
      "time":"0:00-0:08",
      "beat":"...",
      "source_evidence":["E1"],
      "visual":"...",
      "narration":"...",
      "dialogue":"...",
      "sound":"...",
      "retention_job":"...",
      "glow_check":"..."
    }
  ],
  "storyboard": [
    {
      "scene":1,
      "duration":"...",
      "evidence":["E1"],
      "action":"...",
      "emotion":"...",
      "camera":"...",
      "transition":"...",
      "sound_design":"..."
    }
  ],
  "image_prompts": [{"scene":1,"prompt":"...","negative":"...","continuity_anchors":["..."],"evidence":["E1"]}],
  "motion_prompts": [{"scene":1,"prompt":"...","first_frame":"...","last_frame":"...","sound":"...","evidence":["E1"]}],
  "creative_additions_for_approval": [{"idea":"...","why":"...","risk":"..."}],
  "qa": [{"level":"ok/warn/risk","title":"...","note":"..."}],
  "critic_notes": ["..."]
}

SOURCE STORY:
${story}
`;
}

async function callOpenAI(payload) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("Missing OPENAI_API_KEY");
    error.status = 401;
    throw error;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      reasoning: { effort: "high" },
      input: [
        {
          role: "developer",
          content: "You are a rigorous source-grounded multi-agent story adaptation system. Return valid JSON only."
        },
        {
          role: "user",
          content: buildPrompt(payload)
        }
      ]
    })
  });

  const raw = await response.text();
  if (!response.ok) {
    const error = new Error(raw);
    error.status = response.status;
    throw error;
  }
  const json = JSON.parse(raw);
  const text = json.output_text || json.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("\n") || "";
  return extractJson(text);
}

function serveStatic(req, res) {
  const rawPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const file = path.resolve(ROOT, `.${rawPath}`);
  if (!file.startsWith(ROOT)) return send(res, 403, "forbidden", "text/plain; charset=utf-8");
  fs.readFile(file, (error, data) => {
    if (error) return send(res, 404, "not found", "text/plain; charset=utf-8");
    send(res, 200, data, MIME[path.extname(file)] || "application/octet-stream");
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  if (req.url === "/api/health") {
    return send(res, 200, JSON.stringify({ ok: true, hasKey: Boolean(process.env.OPENAI_API_KEY), model: MODEL }));
  }
  if (req.url === "/api/analyze" && req.method === "POST") {
    try {
      const payload = await readJson(req);
      const result = await callOpenAI(payload);
      return send(res, 200, JSON.stringify(result));
    } catch (error) {
      return send(res, error.status || 500, JSON.stringify({ error: error.message || String(error) }));
    }
  }
  serveStatic(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`GLOW Story Studio running at http://127.0.0.1:${PORT}`);
  console.log(`AI backend: ${process.env.OPENAI_API_KEY ? `enabled (${MODEL})` : "disabled - set OPENAI_API_KEY"}`);
});

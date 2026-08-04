const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

// CẤU HÌNH AI PROVIDER
// Hỗ trợ 2 nhà cung cấp: 'openai' hoặc 'gemini'
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; 
const MODEL = process.env.OPENAI_MODEL || process.env.GEMINI_MODEL || "gpt-4o";
const API_KEY = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
const JSON_CREDENTIAL_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let aiConfig = { provider: AI_PROVIDER, mode: 'none', client: null };

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

// Hàm khởi tạo Client AI (Hỗ trợ 2 Option)
async function initAIClient() {
  console.log(`[AI] Đang khởi tạo provider: ${AI_PROVIDER.toUpperCase()}...`);

  if (AI_PROVIDER === 'gemini') {
    // --- OPTION 1: GOOGLE GEMINI ---
    
    // Chế độ A: Service Account JSON (Trả phí/Enterprise)
    if (JSON_CREDENTIAL_PATH && fs.existsSync(JSON_CREDENTIAL_PATH)) {
      console.log(`[AI] Phát hiện file JSON: ${JSON_CREDENTIAL_PATH}. Kích hoạt chế độ Service Account.`);
      try {
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
          keyFile: JSON_CREDENTIAL_PATH,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        aiConfig = { provider: 'gemini', mode: 'json', auth };
        console.log('[AI] ✅ Đã khởi tạo Gemini thành công với Service Account JSON.');
        return;
      } catch (err) {
        console.error('[AI] Lỗi khởi tạo JSON Auth:', err.message);
        console.log('[AI] Hint: Chạy "npm install google-auth-library"');
      }
    } 
    
    // Chế độ B: API Key (Miễn phí/Standard)
    if (API_KEY) {
      console.log('[AI] Sử dụng API Key cho Gemini.');
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(API_KEY);
        aiConfig = { 
          provider: 'gemini', 
          mode: 'key', 
          model: genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-pro" }) 
        };
        console.log('[AI] ✅ Đã khởi tạo Gemini thành công với API Key.');
        return;
      } catch (err) {
        console.error('[AI] Lỗi khởi tạo API Key:', err.message);
        console.log('[AI] Hint: Chạy "npm install @google/generative-ai"');
      }
    }
    
    console.warn('[AI] ⚠️ Không tìm thấy cấu hình hợp lệ cho Gemini (Thiếu API Key hoặc File JSON).');

  } else if (AI_PROVIDER === 'openai') {
    // --- OPTION 2: OPENAI ---
    if (!API_KEY) {
      console.warn('[AI] ⚠️ Thiếu OPENAI_API_KEY. Chức năng AI bị vô hiệu hóa.');
      return;
    }
    try {
      const { Configuration, OpenAIApi } = require('openai');
      const configuration = new Configuration({ apiKey: API_KEY });
      aiConfig = { provider: 'openai', mode: 'key', api: new OpenAIApi(configuration) };
      console.log(`[AI] ✅ Đã khởi tạo OpenAI thành công (Model: ${MODEL}).`);
    } catch (err) {
      console.error('[AI] Lỗi khởi tạo OpenAI:', err.message);
      console.log('[AI] Hint: Chạy "npm install openai"');
    }
  }
}

async function callOpenAI(payload) {
  if (aiConfig.provider === 'openai' && aiConfig.mode === 'key') {
    // Gọi OpenAI truyền thống
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        reasoning: { effort: "high" },
        input: [
          { role: "developer", content: "You are a rigorous source-grounded multi-agent story adaptation system. Return valid JSON only." },
          { role: "user", content: buildPrompt(payload) }
        ]
      })
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(raw);
    const json = JSON.parse(raw);
    const text = json.output_text || json.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("\n") || "";
    return extractJson(text);
  } 
  
  else if (aiConfig.provider === 'gemini') {
    // Gọi Google Gemini
    const promptText = buildPrompt(payload);
    
    if (aiConfig.mode === 'key') {
      // Chế độ API Key
      const result = await aiConfig.model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      return extractJson(text);
    } 
    
    else if (aiConfig.mode === 'json') {
      // Chế độ Service Account JSON (Gọi REST API trực tiếp)
      const client = await aiConfig.auth.getClient();
      const accessToken = await client.getAccessToken();
      const project = process.env.GCP_PROJECT_ID || "your-project-id"; // Cần biến môi trường này nếu dùng Vertex AI endpoint
      
      // Lưu ý: Endpoint này giả định dùng Vertex AI hoặc Gemini Enterprise qua OAuth2
      // Nếu bạn dùng tài khoản dịch vụ chuẩn, hãy đảm bảo URL endpoint đúng với dự án của bạn
      const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/publishers/google/models/gemini-pro:predict`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${accessToken.token}`
        },
        body: JSON.stringify({
          instances: [{ prompt: promptText }],
          parameters: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      });
      
      const raw = await response.text();
      if (!response.ok) throw new Error(raw);
      const json = JSON.parse(raw);
      // Cấu trúc phản hồi của Vertex AI khác một chút
      const text = json.predictions?.[0]?.content || json.predictions?.[0]?.candidates?.[0]?.content || "";
      return extractJson(text);
    }
  }

  throw new Error("AI Provider chưa được cấu hình đúng hoặc không hỗ trợ phương thức gọi này.");
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
    return send(res, 200, JSON.stringify({ 
      ok: true, 
      provider: aiConfig.provider,
      mode: aiConfig.mode,
      hasKey: Boolean(API_KEY || JSON_CREDENTIAL_PATH), 
      model: MODEL 
    }));
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

// Khởi động
initAIClient().then(() => {
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`GLOW Story Studio running at http://127.0.0.1:${PORT}`);
    console.log(`---------------------------------------------`);
    if (aiConfig.mode === 'none') {
       console.log(`AI backend: DISABLED (Cần set API_KEY hoặc GOOGLE_APPLICATION_CREDENTIALS)`);
    } else {
       console.log(`AI backend: ENABLED [${aiConfig.provider.toUpperCase()} - Mode: ${aiConfig.mode}]`);
       console.log(`Model: ${MODEL}`);
    }
    console.log(`---------------------------------------------`);
  });
});

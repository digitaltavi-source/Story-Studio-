// GLOW Story Studio - Main Application
// Refactored for modularity and maintainability

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION & CONSTANTS
  // ============================================================================
  
  const CONFIG = {
    AI_BACKEND_URL: 'http://127.0.0.1:4173',
    DEFAULT_GENRE: 'wit',
    DEFAULT_PLATFORM: 'shorts',
    DEFAULT_DURATION: 1,
    MAX_WORD_COUNT: 5000
  };

  const GENRE_PRESETS = {
    wit: {
      title: "WIT Daily / Healing Story",
      promise: "Người xem thấy mình trong một khoảnh khắc đời thường và lặng đi vài giây.",
      narration: "18-28% narration. Giọng kể là người chứng kiến, không dạy đời.",
      style: "quiet human cinema, honest faces, lived-in details, soft natural light",
      palette: ["#F9E6D0", "#A1C7E0", "#FFB7B2", "#FFFFFF"],
      music: "piano rất mỏng, room tone, foley nhỏ, khoảng lặng có chủ đích"
    },
    children: {
      title: "Thiếu nhi / cổ tích",
      promise: "Trẻ hiểu bằng hình ảnh rõ, người lớn cảm bằng tầng nghĩa mềm.",
      narration: "25-35% narration. Lời kể ngắn, sáng, không lên lớp.",
      style: "premium storybook cinema, warm light, expressive faces, clean composition",
      palette: ["#F8B84E", "#6BBF8A", "#4F7CAC", "#F6EFE3"],
      music: "piano nhẹ, woodwind mềm, foley đời thường"
    },
    fable: {
      title: "Ngụ ngôn / bài học mềm",
      promise: "Bài học được khán giả tự nhận ra qua setup/payoff.",
      narration: "28-38% narration. Giữ chất kể, tránh kết luận trực diện.",
      style: "timeless fable, symbolic staging, balanced theatrical framing",
      palette: ["#C78C3B", "#315F4B", "#B8C2A1", "#F7F0DF"],
      music: "nhạc cụ mộc, nhấn nhẹ ở khoảnh khắc nhận ra"
    },
    inspiration: {
      title: "Truyền cảm hứng",
      promise: "Từ vết nứt nhỏ đi tới một lựa chọn khiến người xem muốn đứng dậy.",
      narration: "20-30% narration. Đẩy montage và visual metaphor.",
      style: "premium inspirational short film, intimate close-ups, hopeful lighting",
      palette: ["#1F4F5F", "#F2A541", "#E6E1D6", "#8FB8A8"],
      music: "strings tối giản, build chậm, không ép cao trào"
    },
    history: {
      title: "Lịch sử / giáo dục",
      promise: "Thông tin chính xác nhưng vẫn có con người, lựa chọn và cái giá.",
      narration: "40-55% narration. Bảo toàn bối cảnh và sự kiện.",
      style: "historical cinematic realism, authentic costumes, textured environments",
      palette: ["#5B4636", "#9A7B4F", "#2F5D62", "#DDD0B7"],
      music: "ambient lịch sử, nhạc cụ vùng miền nếu có căn cứ"
    },
    horror: {
      title: "Kinh dị nhẹ",
      promise: "Sợ vì sự im lặng và điều chưa nói, không vì jumpscare rẻ.",
      narration: "15-25% narration. Để không khí tự kể.",
      style: "soft suspense cinema, narrow framing, practical shadows, restrained reveals",
      palette: ["#202124", "#5E6B64", "#9B7B52", "#D4D0C8"],
      music: "drone thấp, tiếng phòng, tiếng gió, nhịp thưa"
    },
    romance: {
      title: "Tình cảm",
      promise: "Micro emotion và khoảng dừng làm người xem nhớ một người.",
      narration: "20-30% narration. Ưu tiên ánh mắt, tay, silence và dialogue ít.",
      style: "intimate romantic drama, soft daylight, subtle gestures, gentle camera",
      palette: ["#A95C68", "#F0C7A9", "#596F62", "#F8F3ED"],
      music: "guitar/piano mềm, silence ở điểm cảm xúc"
    }
  };

  const PLATFORM_RULES = {
    shorts: {
      title: "Shorts / Reels / TikTok",
      opening: "0-2 giây phải có hình ảnh nghịch lý hoặc câu hỏi nội tâm.",
      retention: ["0s pattern interrupt", "3s context lock", "8s emotional turn", "18s reveal", "last 3s share line"],
      scriptUnit: "45-75 giây, mỗi câu thoại/narration dưới 11 từ."
    },
    youtube: {
      title: "YouTube 3-8 phút",
      opening: "15 giây đầu đặt lời hứa cảm xúc và một câu hỏi chưa trả lời.",
      retention: ["0:00 cold open", "0:15 premise", "1:00 first turn", "2:30 low point", "4:00 meaning shift", "end callback"],
      scriptUnit: "3-8 phút, mỗi 30-45 giây phải có một emotional beat."
    },
    festival: {
      title: "Festival short film",
      opening: "Mở bằng visual question, ít lời, biểu tượng mạnh.",
      retention: ["opening image", "silent setup", "pressure", "choice", "visual payoff"],
      scriptUnit: "Ít narration, nhiều hành động, motif và khoảng lặng."
    },
    education: {
      title: "Giáo dục / lớp học",
      opening: "Mở bằng tình huống quen thuộc để người học tự liên hệ.",
      retention: ["question", "case", "conflict", "insight", "reflection prompt"],
      scriptUnit: "Rõ thông tin, nhưng vẫn cần nhân vật và lựa chọn."
    }
  };

  const AGENT_DEFINITIONS = [
    {
      name: "Story Truth Analyst",
      tier: "Chiến lược",
      mission: "Tìm sự thật con người ẩn dưới cốt truyện.",
      inspiration: "WIT Daily DNA, Pixar story spine, Robert McKee, GLOW Soul Manifesto.",
      rules: ["Theme phải đến từ lựa chọn, không từ lời giảng.", "Nhân vật phải có wound, desire, false belief.", "Nếu câu chuyện chưa có sự thật con người, yêu cầu làm rõ trước khi viết."],
      output: "Human truth, emotional wound, desire, false belief, symbol, transformation seed.",
      fail: "Không tìm được điều khiến người xem thấy mình trong câu chuyện.",
      metric: "Truth lift"
    },
    {
      name: "Audience Psychologist",
      tier: "Chiến lược",
      mission: "Xác định vì sao người xem dừng lại, xem tiếp, bình luận và chia sẻ.",
      inspiration: "Behavioral storytelling, audience empathy mapping, ethical retention design.",
      rules: ["Không tối ưu view bằng sợ hãi rẻ hoặc thao túng.", "Mỗi insight phải nối với một cảm xúc phổ quát.", "Luôn tách audience pain khỏi platform trick."],
      output: "Audience mirror, pain point, share motive, comment motive, retention risk.",
      fail: "Chỉ nói chung chung 'cảm động' mà không chỉ ra ai sẽ cảm và vì sao.",
      metric: "Mirror score"
    },
    {
      name: "Viral Hook Architect",
      tier: "Chiến lược",
      mission: "Thiết kế 3 giây đầu có lực kéo nhưng không clickbait.",
      inspiration: "Gary Halbert, Joe Sugarman, Maria Veloso, Claude Hopkins, modern short-form retention.",
      rules: ["Hook phải mở một vòng tò mò thật.", "Không hứa điều video không trả.", "Ưu tiên hình ảnh nghịch lý hơn câu chữ phô trương."],
      output: "Visual hook, psychological hook, share hook, first-frame brief, A/B variants.",
      fail: "Hook gây tò mò nhưng phản bội tinh thần câu chuyện.",
      metric: "Hook lift"
    },
    {
      name: "Glow Copywriter",
      tier: "Chiến lược",
      mission: "Tối ưu mọi câu chữ để rõ, chạm, ngắn, tự nhiên và có sức chuyển hóa.",
      inspiration: "Maria Veloso, Joe Sugarman, Gary Halbert, Claude Hopkins, WIT Audio restraint.",
      rules: ["Giữ giọng của người viết, không bóp méo ý định gốc.", "Loại fluff, giữ precision và emotional clarity.", "Nếu input mơ hồ, phải yêu cầu làm rõ trước khi tối ưu.", "Luôn ước tính phần trăm cải thiện ở cuối bản tối ưu."],
      output: "Optimized hook, narration, CTA, caption, title, improvement percentage.",
      fail: "Câu chữ nghe quảng cáo, quá bóng bẩy hoặc mất sự thật.",
      metric: "Copy lift"
    },
    {
      name: "Screenwriter",
      tier: "Sản xuất",
      mission: "Chuyển story truth thành script có beat, hành động, silence và payoff.",
      inspiration: "Pixar shorts, Disney emotional clarity, cinematic dramatic writing.",
      rules: ["Mỗi beat phải đổi trạng thái cảm xúc.", "Đối thoại chỉ dùng khi hình ảnh không nói tốt hơn.", "Kết thúc mở reflection, không đóng bằng đạo lý."],
      output: "Beat sheet, dialogue, narration, silent moments, visual payoff.",
      fail: "Script chỉ kể lại truyện thay vì tái thiết kế trải nghiệm.",
      metric: "Drama lift"
    },
    {
      name: "Narration Surgeon",
      tier: "Sản xuất",
      mission: "Cắt lời kể dư và chuyển chữ thành hình ảnh, âm thanh, hành động.",
      inspiration: "Show-don't-tell editing, WIT Audio remove-before-add doctrine.",
      rules: ["Không kể thứ camera đã cho thấy.", "Triết lý phải biến thành lựa chọn hoặc callback.", "Giữ narration như nhịp thở, không như bài giảng."],
      output: "Keep, cut, compress, image, dialogue, reaction, silence map.",
      fail: "Video vẫn giống audiobook có hình minh họa.",
      metric: "Narration reduction"
    },
    {
      name: "Cinematic Director",
      tier: "Sản xuất",
      mission: "Biến script thành ngôn ngữ điện ảnh có camera, blocking và rhythm.",
      inspiration: "Pixar visual storytelling, live-action short film grammar, visual poetry.",
      rules: ["Camera move phải có lý do cảm xúc.", "Reaction shot quan trọng ngang action shot.", "Mỗi transition phải giữ nghĩa, không chỉ đẹp."],
      output: "Shot intention, lens, camera motion, blocking, transition, rhythm notes.",
      fail: "Cảnh đẹp nhưng không làm cảm xúc tiến thêm.",
      metric: "Cinematic lift"
    },
    {
      name: "Art Director",
      tier: "Sản xuất",
      mission: "Xây thế giới, nhân vật, đạo cụ và màu sắc giữ đúng linh hồn.",
      inspiration: "Production design, character bible, GLOW brand warmth and clarity.",
      rules: ["Style không được lấn át sự thật.", "Symbol phải đổi nghĩa qua phim.", "Mỗi chi tiết lớn phải có continuity anchor."],
      output: "Character bible, prop bible, world bible, palette, texture, style guardrails.",
      fail: "Đẹp nhưng generic, không có ký ức sống thật.",
      metric: "World lift"
    },
    {
      name: "Sound Director",
      tier: "Sản xuất",
      mission: "Thiết kế trải nghiệm cho tai mà không ra lệnh cảm xúc.",
      inspiration: "WIT Audio manifesto, foley storytelling, restrained score design.",
      rules: ["Nhạc nâng nền, không nói thay.", "Im lặng là nơi chuyển hóa.", "Nếu nghe thấy kỹ thuật trước sự thật, giảm lớp âm thanh."],
      output: "Voice direction, room tone, foley, music cue, silence map, mix restraint.",
      fail: "Âm thanh kéo nước mắt thay vì cho người xem tự chạm.",
      metric: "Audio truth"
    },
    {
      name: "Image Prompt Engineer",
      tier: "Sản xuất",
      mission: "Tạo keyframe prompts nhất quán, có cinematic taste và continuity.",
      inspiration: "AI image production bibles, visual continuity, lens/composition grammar.",
      rules: ["Prompt phải có subject, environment, light, lens, emotion, style.", "Mỗi nhân vật/đạo cụ cần anchor cố định.", "Không viết prompt trang trí rỗng."],
      output: "Keyframe prompt pack, negative prompt, reference anchors, style tokens.",
      fail: "Ảnh đẹp nhưng nhân vật/đạo cụ trôi qua từng cảnh.",
      metric: "Keyframe consistency"
    },
    {
      name: "Motion Prompt Engineer",
      tier: "Sản xuất",
      mission: "Tạo video prompt có chuyển động thật: nhân vật, camera, môi trường, cảm xúc.",
      inspiration: "Veo/Runway/Kling prompt craft, animation blocking, shot continuity.",
      rules: ["Không chỉ mô tả hành động bề mặt.", "Luôn có emotional change trong 8 giây.", "Secondary motion và environment motion phải hỗ trợ cảm xúc."],
      output: "8-second clip prompts, first/last frame notes, motion layers, sound cue.",
      fail: "Prompt chỉ viết 'nhân vật chạy/cười/khóc' mà không có động cơ.",
      metric: "Motion clarity"
    },
    {
      name: "Continuity Supervisor",
      tier: "Kiểm định",
      mission: "Chống drift nhân vật, đạo cụ, thời gian, ánh sáng, cảm xúc.",
      inspiration: "Film continuity, AI video drift prevention, production QA.",
      rules: ["Mỗi clip phải có state before/after.", "Costume, prop, weather, time phải nối logic.", "Cảm xúc không được nhảy cóc."],
      output: "Continuity checklist, risk flags, fix notes, reference requirements.",
      fail: "Video mất niềm tin vì mặt, đồ, thời gian hoặc cảm xúc bị trôi.",
      metric: "Continuity score"
    },
    {
      name: "Festival Quality Critic",
      tier: "Kiểm định",
      mission: "Soát tác phẩm theo tiêu chuẩn quốc tế: restraint, originality, clarity, impact.",
      inspiration: "Festival shorts, Pixar taste, GLOW ethics, human-centered criticism.",
      rules: ["Nói thẳng điểm yếu, không tâng bốc.", "Nếu quá lộ bài học, trả về rewrite.", "Tìm một chi tiết có thể làm phim đáng nhớ hơn."],
      output: "Creative diagnosis, rewrite priority, taste notes, improvement percentage.",
      fail: "Bản dựng đúng quy trình nhưng không chạm.",
      metric: "Festival lift"
    }
  ];

  const SAMPLE_STORY = `Ngày xưa, ở một ngôi làng nhỏ ven sông, có một cậu bé tên An sống cùng mẹ trong căn nhà cũ. An chỉ có một chiếc áo đã sờn vai, nhưng cậu luôn giữ nó rất sạch.

Một ngày nọ, thầy giáo nói rằng lớp sẽ có buổi biểu diễn cuối năm. Ai cũng háo hức chuẩn bị quần áo đẹp. An lặng lẽ nhìn chiếc áo cũ của mình rồi cúi đầu.

Đêm đó, mẹ vá lại từng đường chỉ dưới ánh đèn dầu. An nhận ra chiếc áo không chỉ là vải, mà là tình yêu và sự hy sinh của mẹ.

Trong buổi biểu diễn, An bước lên sân khấu. Ban đầu cậu run rẩy, nhưng khi nhìn thấy mẹ mỉm cười, cậu hát bằng tất cả trái tim. Cả lớp đứng dậy vỗ tay.

Từ hôm ấy, An hiểu rằng giá trị không nằm ở thứ ta mặc bên ngoài, mà ở điều ta tạo ra bằng lòng biết ơn và can đảm.`;

  // ============================================================================
  // DOM ELEMENT CACHE
  // ============================================================================
  
  const DOM = {};

  function cacheDOMElements() {
    DOM.storyInput = document.querySelector("#storyInput");
    DOM.wordCount = document.querySelector("#wordCount");
    DOM.sampleBtn = document.querySelector("#sampleBtn");
    DOM.clearBtn = document.querySelector("#clearBtn");
    DOM.generateBtn = document.querySelector("#generateBtn");
    DOM.genreSelect = document.querySelector("#genreSelect");
    DOM.targetSelect = document.querySelector("#targetSelect");
    DOM.lengthRange = document.querySelector("#lengthRange");
    DOM.lengthOutput = document.querySelector("#lengthOutput");
    DOM.aiMode = document.querySelector("#aiMode");
    DOM.aiStatus = document.querySelector("#aiStatus");
    
    // Output containers
    DOM.storyCore = document.querySelector("#storyCore");
    DOM.viralThesis = document.querySelector("#viralThesis");
    DOM.retentionCurve = document.querySelector("#retentionCurve");
    DOM.glowAlignment = document.querySelector("#glowAlignment");
    DOM.agentCouncil = document.querySelector("#agentCouncil");
    DOM.hookLab = document.querySelector("#hookLab");
    DOM.scriptDraft = document.querySelector("#scriptDraft");
    DOM.shareTriggers = document.querySelector("#shareTriggers");
    DOM.commentPrompts = document.querySelector("#commentPrompts");
    DOM.narrationPlan = document.querySelector("#narrationPlan");
    DOM.mediumMap = document.querySelector("#mediumMap");
    DOM.genrePreset = document.querySelector("#genrePreset");
    DOM.visualBible = document.querySelector("#visualBible");
    DOM.characterLock = document.querySelector("#characterLock");
    DOM.worldLock = document.querySelector("#worldLock");
    DOM.evidenceLedger = document.querySelector("#evidenceLedger");
    DOM.approvalList = document.querySelector("#approvalList");
    DOM.sceneCount = document.querySelector("#sceneCount");
    DOM.storyboardList = document.querySelector("#storyboardList");
    DOM.imagePrompts = document.querySelector("#imagePrompts");
    DOM.motionPrompts = document.querySelector("#motionPrompts");
    DOM.continuityList = document.querySelector("#continuityList");
    DOM.criticNotes = document.querySelector("#criticNotes");
    DOM.aiRewriteRoom = document.querySelector("#aiRewriteRoom");
    
    // Score elements
    DOM.hookScore = document.querySelector("#hookScore");
    DOM.emotionScore = document.querySelector("#emotionScore");
    DOM.viralScore = document.querySelector("#viralScore");
    DOM.glowScore = document.querySelector("#glowScore");
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  function getWords(text) {
    return text.trim().split(/\s+/).filter(Boolean);
  }

  function updateWordCount() {
    DOM.wordCount.textContent = `${getWords(DOM.storyInput.value).length} từ`;
  }

  function getSentences(text) {
    return text.replace(/\n+/g, " ").split(/(?<=[.!?。！？])\s+/).map((s) => s.trim()).filter(Boolean);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ 
      "&": "&amp;", 
      "<": "&lt;", 
      ">": "&gt;", 
      '"': "&quot;", 
      "'": "&#039;" 
    })[char]);
  }

  function renderList(items) {
    if (!items || items.length === 0) return '';
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  // ============================================================================
  // AI BACKEND COMMUNICATION
  // ============================================================================
  
  async function checkAiBackend() {
    try {
      const response = await fetch(`${CONFIG.AI_BACKEND_URL}/api/health`, { cache: "no-store" });
      const data = await response.json();
      if (data.ok && data.hasKey) {
        DOM.aiStatus.textContent = `AI backend đang hoạt động: ${data.model}. Agent sẽ dùng model thật.`;
        DOM.aiStatus.className = "ai-status ok";
        return true;
      }
      DOM.aiStatus.textContent = "Backend có chạy nhưng chưa có OPENAI_API_KEY. App sẽ dùng rule engine fallback.";
      DOM.aiStatus.className = "ai-status warn";
      return false;
    } catch {
      DOM.aiStatus.textContent = "Chưa kết nối AI backend. Chạy node server.js để bật agent thật.";
      DOM.aiStatus.className = "ai-status warn";
      return false;
    }
  }

  async function callAiStudio(text, preset, platform) {
    const response = await fetch(`${CONFIG.AI_BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        story: text,
        genre: preset.title,
        target: platform.title,
        minutes: Number(DOM.lengthRange.value)
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI backend failed");
    return data;
  }

function inferCore(text) {
  const sentences = getSentences(text);
  const lower = text.toLowerCase();
  const symbol = lower.includes("áo") ? "chiếc áo cũ" : lower.includes("đèn") ? "ánh đèn" : lower.includes("sông") ? "dòng sông" : "một chi tiết lặp lại";
  const protagonistMatch = text.match(/(?:tên|là)\s+([A-ZÀ-Ỹ][\p{L}]*)/u);
  const protagonist = protagonistMatch ? protagonistMatch[1] : "nhân vật chính";
  const wound = lower.includes("nghèo") || lower.includes("cũ") ? "mặc cảm vì thiếu thốn" : "một điều chưa dám đối diện";
  const desire = lower.includes("biểu diễn") || lower.includes("sân khấu") ? "được bước ra và được nhìn nhận" : "được hiểu, được thấy, hoặc được tha thứ";
  const truth = lower.includes("mẹ") ? "tình yêu thường nằm trong những việc rất nhỏ" : "giá trị thật xuất hiện khi con người dám chọn điều đúng";

  return {
    logline: sentences[0] || "Một câu chuyện cần được chuyển thể thành trải nghiệm điện ảnh.",
    protagonist,
    symbol,
    wound,
    desire,
    falseBelief: "Mình chỉ có giá trị khi bên ngoài đủ đẹp hoặc đủ hoàn hảo.",
    truth,
    promise: `Người xem nhận ra: ${truth}.`,
    emotionalSpine: ["tò mò", "nhói nhẹ", "áp lực", "lặng", "can đảm", "ấm lại"]
  };
}

function classifySentence(sentence, index) {
  const lower = sentence.toLowerCase();
  if (index === 0 || lower.includes("ngày xưa") || lower.includes("nhiều năm")) return ["GIỮ LÀM CẦU DẪN", "Dùng rất ngắn để đặt thời gian, nơi chốn, chất kể."];
  if (lower.includes("hiểu") || lower.includes("nhận ra") || lower.includes("giá trị")) return ["CHUYỂN THÀNH SILENT PAYOFF", "Không nói bài học. Dùng ánh mắt, đạo cụ, callback."];
  if (lower.includes("nói") || lower.includes("hỏi") || lower.includes("thầy")) return ["CHUYỂN THÀNH ĐỐI THOẠI", "Cho thông tin đi qua hành vi nhân vật."];
  if (lower.includes("run") || lower.includes("cúi") || lower.includes("mỉm cười") || lower.includes("lặng")) return ["CHUYỂN THÀNH REACTION SHOT", "Giữ cảm xúc bằng mặt, tay, hơi thở, nhịp im."];
  return ["CHUYỂN THÀNH HÌNH ẢNH", "Dựng bằng đạo cụ, không gian, hành động và âm thanh."];
}

function makeHooks(core, platform) {
  return [
    `Nếu một ${core.symbol} có thể nói, nó sẽ kể điều gì về ${core.protagonist}?`,
    `${core.protagonist} tưởng mình thiếu một thứ để được nhìn thấy. Nhưng điều thiếu nhất lại không nằm trên người.`,
    `Có những món đồ cũ không làm ta xấu đi. Chúng chỉ đang giữ hộ một tình yêu mà ta chưa kịp hiểu.`
  ].map((hook, index) => ({
    label: index === 0 ? "Visual Hook" : index === 1 ? "Psychological Hook" : "Share Hook",
    hook,
    why: index === 0 ? platform.opening : "Mở vòng tò mò nhưng vẫn giữ sự thật cảm xúc."
  }));
}

function copyImprove(line) {
  const tighter = line
    .replace("Có những", "Đôi khi,")
    .replace("không làm ta xấu đi", "không làm ta nhỏ lại")
    .replace("điều thiếu nhất", "thứ thiếu nhất");
  const originalWords = getWords(line).length || 1;
  const newWords = getWords(tighter).length || 1;
  const clarityLift = tighter !== line ? 12 : 6;
  const concisionLift = Math.max(0, originalWords - newWords) * 3;
  return {
    text: tighter,
    improvement: Math.min(38, clarityLift + concisionLift)
  };
}

function makeScriptBeats(core, platform) {
  return [
    ["Cold open", `Cận cảnh ${core.symbol}. Một vết cũ hiện lên trước khi ta thấy mặt ${core.protagonist}.`, "Không giải thích. Chỉ room tone và một hơi thở nhỏ.", "Open loop bằng hình ảnh."],
    ["Mirror setup", `${core.protagonist} nhìn người khác có thứ mình thiếu. Tay vô thức chạm vào ${core.symbol}.`, "Một câu kể ngắn: Có những ngày ta thấy mình nhỏ hơn mọi người.", "Người xem tự nhận ra nỗi quen."],
    ["Pressure", `Một sự kiện buộc ${core.protagonist} phải xuất hiện trước người khác.`, "Giảm nhạc, tăng foley tay áo, tiếng ghế, tiếng chân.", "Tạo căng thẳng không cần drama."],
    ["Silent turn", `Nhân vật nhìn thấy ai đó âm thầm sửa chữa, giữ gìn hoặc hy sinh cho mình.`, "Khoảng lặng 2-4 giây. Không lời.", "Nơi chuyển hóa xảy ra."],
    ["Choice", `${core.protagonist} vẫn bước ra, không vì đã hoàn hảo mà vì đã hiểu mình được yêu.`, "Nhạc chỉ nâng nền sau hành động, không kéo trước.", "Cao trào bằng lựa chọn."],
    ["Payoff", `${core.symbol} trở lại trong khung hình cuối, nhưng nghĩa đã đổi.`, "Câu cuối mở: Có những thứ cũ chỉ chờ ta đủ lớn để hiểu.", "Dễ share, không dạy đời."]
  ].map(([beat, visual, audio, job], index) => ({
    beat,
    time: platform.retention[index] || `Beat ${index + 1}`,
    visual,
    audio,
    job
  }));
}

function makeScenes(core, preset, platform, minutes) {
  const scriptBeats = makeScriptBeats(core, platform);
  const sceneDuration = Math.max(8, Math.round((minutes * 60) / scriptBeats.length));
  return scriptBeats.map((beat, index) => ({
    number: index + 1,
    duration: `${sceneDuration}s`,
    title: beat.beat,
    purpose: beat.job,
    action: beat.visual,
    narration: beat.audio,
    emotion: core.emotionalSpine[index],
    camera: index % 2 === 0 ? "close-up có chủ đích, camera gần nhân vật" : "medium shot, dolly-in rất chậm",
    sound: index === 3 ? "silence, room tone, foley nhỏ" : preset.music
  }));
}

function renderWarRoom(core, preset, platform, text) {
  document.querySelector("#storyCore").classList.remove("empty");
  document.querySelector("#storyCore").innerHTML = `
    <p><strong>Logline:</strong> ${escapeHtml(core.logline)}</p>
    <p><strong>Human truth:</strong> ${escapeHtml(core.truth)}</p>
    <p><strong>Wound:</strong> ${escapeHtml(core.wound)}</p>
    <p><strong>Desire:</strong> ${escapeHtml(core.desire)}</p>
    <p><strong>False belief:</strong> ${escapeHtml(core.falseBelief)}</p>
    <div class="pill-list">
      <span class="pill">Nhân vật: ${escapeHtml(core.protagonist)}</span>
      <span class="pill">Symbol: ${escapeHtml(core.symbol)}</span>
      <span class="pill">${escapeHtml(preset.title)}</span>
      <span class="pill">${escapeHtml(platform.title)}</span>
    </div>`;

  document.querySelector("#viralThesis").classList.remove("empty");
  document.querySelector("#viralThesis").innerHTML = renderList([
    "Viral angle: một chi tiết nhỏ bẻ khóa một cảm xúc lớn.",
    "Audience mirror: ai từng thấy mình chưa đủ tốt sẽ dừng lại.",
    "Share reason: gửi cho người đã từng âm thầm yêu thương mình.",
    `Promise: ${preset.promise}`
  ]);

  document.querySelector("#retentionCurve").classList.remove("empty");
  document.querySelector("#retentionCurve").innerHTML = platform.retention.map((label, index) => `<div class="curve-step" style="height:${64 + index * 14}px"><strong>${index + 1}</strong><span>${escapeHtml(label)}</span></div>`).join("");

  document.querySelector("#glowAlignment").classList.remove("empty");
  document.querySelector("#glowAlignment").innerHTML = renderList([
    "Không giảng đạo. Để người xem tự chạm.",
    "Không thao túng bằng nhạc, bi kịch hoặc twist cưỡng ép.",
    "Nếu một kỹ thuật làm sự thật mờ đi, bỏ kỹ thuật đó.",
    "Mỗi output phải đi qua Observe -> Understand -> Reflect -> Create -> Evolve.",
    `Câu hỏi cuối: người xem có mềm lại hoặc hiểu mình hơn sau ${getWords(text).length} từ này không?`
  ]);
}

function renderAgents() {
  document.querySelector("#agentCouncil").innerHTML = AGENT_DEFINITIONS.map((agent, index) => `
    <article class="agent-card">
      <div class="agent-index">${String(index + 1).padStart(2, "0")}</div>
      <h3>${escapeHtml(agent.name)}</h3>
      <span>${escapeHtml(agent.tier)}</span>
      <p><strong>Mission:</strong> ${escapeHtml(agent.mission)}</p>
      <p><strong>Inspiration:</strong> ${escapeHtml(agent.inspiration)}</p>
      <div class="agent-rules">
        ${agent.rules.map((rule) => `<em>${escapeHtml(rule)}</em>`).join("")}
      </div>
      <p><strong>Output:</strong> ${escapeHtml(agent.output)}</p>
      <p><strong>Fail nếu:</strong> ${escapeHtml(agent.fail)}</p>
      <p><strong>Metric:</strong> ${escapeHtml(agent.metric)} + estimated improvement %</p>
    </article>
  `).join("");
}

function renderScriptLab(core, platform) {
  const hooks = makeHooks(core, platform);
  document.querySelector("#hookLab").classList.remove("empty");
  document.querySelector("#hookLab").innerHTML = hooks.map((item) => `
    <div class="prompt-item">
      <strong>${escapeHtml(item.label)}</strong>
      <p>${escapeHtml(item.hook)}</p>
      <p><b>Glow Copywriter:</b> ${escapeHtml(copyImprove(item.hook).text)} <span class="improvement">+${copyImprove(item.hook).improvement}% improved</span></p>
      <p>${escapeHtml(item.why)}</p>
    </div>`).join("");

  const beats = makeScriptBeats(core, platform);
  document.querySelector("#scriptDraft").classList.remove("empty");
  document.querySelector("#scriptDraft").innerHTML = beats.map((beat, index) => `
    <div class="script-row">
      <div><strong>${index + 1}. ${escapeHtml(beat.beat)}</strong><span>${escapeHtml(beat.time)}</span></div>
      <p><b>Visual:</b> ${escapeHtml(beat.visual)}</p>
      <p><b>Audio:</b> ${escapeHtml(beat.audio)}</p>
      <p><b>Retention job:</b> ${escapeHtml(beat.job)}</p>
    </div>`).join("");

  document.querySelector("#shareTriggers").classList.remove("empty");
  document.querySelector("#shareTriggers").innerHTML = renderList([
    "Gửi cho mẹ/cha/người từng âm thầm hy sinh.",
    "Gửi cho người đang thấy mình chưa đủ tốt.",
    "Gửi cho ai cần một câu chuyện không dạy đời nhưng vẫn sáng."
  ]);

  document.querySelector("#commentPrompts").classList.remove("empty");
  document.querySelector("#commentPrompts").innerHTML = renderList([
    "Bạn từng giữ một món đồ cũ vì nó chứa một người không?",
    "Có điều gì đến rất muộn bạn mới hiểu về gia đình mình?",
    "Khoảnh khắc nào từng làm bạn thấy mình được yêu?"
  ]);
}

function renderAdaptation(text, preset) {
  const sentences = getSentences(text).slice(0, 10);
  document.querySelector("#narrationPlan").classList.remove("empty");
  document.querySelector("#narrationPlan").innerHTML = sentences.map((sentence, index) => {
    const [type, note] = classifySentence(sentence, index);
    return `<div class="prompt-item"><strong>${escapeHtml(type)}</strong><p>${escapeHtml(sentence)}</p><p>${escapeHtml(note)}</p></div>`;
  }).join("");

  document.querySelector("#mediumMap").classList.remove("empty");
  document.querySelector("#mediumMap").innerHTML = renderList([
    "Chữ mô tả nội tâm -> ánh mắt, tay, hơi thở, khoảng ngừng.",
    "Chữ mô tả hoàn cảnh -> bối cảnh, đạo cụ, phục trang, texture.",
    "Triết lý -> visual callback hoặc lựa chọn của nhân vật.",
    "Cao trào audio -> hành động không thể rút lại trên màn hình."
  ]);

  document.querySelector("#genrePreset").classList.remove("empty");
  document.querySelector("#genrePreset").innerHTML = `
    <p><strong>${escapeHtml(preset.title)}</strong></p>
    <p>${escapeHtml(preset.promise)}</p>
    <p><strong>Tỷ lệ kể:</strong> ${escapeHtml(preset.narration)}</p>
    <p><strong>Style:</strong> ${escapeHtml(preset.style)}</p>`;
}

function renderBible(core, preset) {
  const cards = [
    ["Character Bible", `${core.protagonist}: có vết yếu thật, không hoàn hảo, chuyển từ co lại sang dám hiện diện.`],
    ["Symbol Bible", `${core.symbol}: xuất hiện ba lần, mỗi lần đổi nghĩa sâu hơn.`],
    ["World Bible", "Thế giới phải có dấu vết người sống thật: đồ cũ, ánh sáng không hoàn hảo, khoảng trống có ký ức."],
    ["Camera Bible", "Close-up cho sự thật, wide shot cho cô đơn, dolly-in chỉ khi nhân vật nhận ra điều gì."],
    ["Sound Bible", preset.music],
    ["GLOW Taste", "Ít hơn nhưng đúng hơn. Đẹp không được phản bội sự thật."]
  ];
  document.querySelector("#visualBible").innerHTML = cards.map(([title, body]) => `
    <div class="bible-card">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
      <div class="color-row">${preset.palette.map((color) => `<span class="swatch" style="background:${color}"></span>`).join("")}</div>
      <p><em>${escapeHtml(preset.style)}</em></p>
    </div>`).join("");
}

function renderStoryboard(scenes) {
  document.querySelector("#sceneCount").textContent = `${scenes.length} scene`;
  const list = document.querySelector("#storyboardList");
  list.classList.remove("empty");
  list.innerHTML = scenes.map((scene) => `
    <div class="scene-card">
      <div class="scene-num">Scene ${scene.number}<br>${escapeHtml(scene.duration)}</div>
      <div>
        <h4>${escapeHtml(scene.title)}</h4>
        <p>${escapeHtml(scene.purpose)}</p>
        <p><strong>Action:</strong> ${escapeHtml(scene.action)}</p>
        <p><strong>Narration/Sound:</strong> ${escapeHtml(scene.narration)}</p>
      </div>
      <div class="scene-meta">
        <span><strong>Emotion:</strong> ${escapeHtml(scene.emotion)}</span>
        <span><strong>Camera:</strong> ${escapeHtml(scene.camera)}</span>
        <span><strong>Sound:</strong> ${escapeHtml(scene.sound)}</span>
      </div>
    </div>`).join("");
}

function renderPrompts(scenes, core, preset) {
  document.querySelector("#imagePrompts").classList.remove("empty");
  document.querySelector("#motionPrompts").classList.remove("empty");
  document.querySelector("#imagePrompts").innerHTML = scenes.map((scene) => `
    <div class="prompt-item">
      <strong>Keyframe ${scene.number}: ${escapeHtml(scene.title)}</strong>
      <p>${escapeHtml(scene.action)} Subject continuity: ${escapeHtml(core.protagonist)}. Symbol continuity: ${escapeHtml(core.symbol)}. Lighting follows "${escapeHtml(scene.emotion)}". Style: ${escapeHtml(preset.style)}.</p>
    </div>`).join("");
  document.querySelector("#motionPrompts").innerHTML = scenes.map((scene) => `
    <div class="prompt-item">
      <strong>Clip ${scene.number}A</strong>
      <p>8-second cinematic shot. Character motion: subtle, emotionally motivated. Secondary motion: hands, fabric, breath. Environment motion: natural ambience. Camera: ${escapeHtml(scene.camera)}. Emotional change: ${escapeHtml(scene.emotion)}. Sound: ${escapeHtml(scene.sound)}.</p>
    </div>`).join("");
}

function renderQa(core, preset, platform) {
  const checks = [
    ["ok", "Hook honesty", "Hook mở vòng tò mò nhưng không clickbait, không phản bội câu chuyện."],
    ["ok", "Human truth", `Mọi scene phải bảo vệ sự thật: ${core.truth}.`],
    ["warn", "Narration risk", `${preset.narration}. Nếu còn giống audiobook, chuyển thêm câu kể thành reaction hoặc symbol.`],
    ["warn", "Retention", `${platform.scriptUnit} Kiểm tra mỗi beat có lý do để xem tiếp.`],
    ["risk", "AI video drift", "Mỗi clip phải có character, prop, costume, lighting anchors để chống trôi continuity."],
    ["risk", "Moral drift", "Nếu bản dựng cố làm người xem khóc bằng bi kịch cưỡng ép, rewrite."]
  ];
  document.querySelector("#continuityList").classList.remove("empty");
  document.querySelector("#continuityList").innerHTML = checks.map(([level, title, body]) => `
    <div class="check-item ${level}">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
    </div>`).join("");

  document.querySelector("#criticNotes").classList.remove("empty");
  document.querySelector("#criticNotes").innerHTML = renderList([
    "Nâng cấp mạnh nhất: tìm một chi tiết đời thật chưa ai để ý và biến nó thành symbol.",
    "Cắt mọi câu giải thích sau khi hình ảnh đã nói được.",
    "Đừng cố làm phim lớn. Làm một khoảnh khắc nhỏ nhưng đúng đến mức người xem thấy mình.",
    "Kết thúc phải mở ra reflection, không đóng bằng đạo lý."
  ]);
}

function renderAiPackage(data, preset, platform, text) {
  DOM.aiStatus.textContent = "AI agents đã phân tích xong bằng model thật. Output là AI-generated và source-grounded.";
  DOM.aiStatus.className = "ai-status ok";

  const evidence = data.evidence || [];
  const characters = data.characters || [];
  const props = data.props_places || [];
  const diagnosis = data.story_diagnosis || {};
  const viral = data.viral_strategy || {};

  document.querySelector("#storyCore").classList.remove("empty");
  document.querySelector("#storyCore").innerHTML = `
    <p><strong>Logline:</strong> ${escapeHtml(diagnosis.logline || "")}</p>
    <p><strong>Human truth:</strong> ${escapeHtml(diagnosis.human_truth?.text || "")} <em>${escapeHtml((diagnosis.human_truth?.evidence || []).join(", "))}</em></p>
    <p><strong>Wound:</strong> ${escapeHtml(diagnosis.wound?.text || "")} <em>${escapeHtml((diagnosis.wound?.evidence || []).join(", "))}</em></p>
    <p><strong>Desire:</strong> ${escapeHtml(diagnosis.desire?.text || "")} <em>${escapeHtml((diagnosis.desire?.evidence || []).join(", "))}</em></p>
    <p><strong>False belief:</strong> ${escapeHtml(diagnosis.false_belief?.text || "")}</p>
    <div class="pill-list"><span class="pill">Mode: AI agents</span><span class="pill">${escapeHtml(preset.title)}</span><span class="pill">${escapeHtml(platform.title)}</span></div>`;

  document.querySelector("#viralThesis").classList.remove("empty");
  document.querySelector("#viralThesis").innerHTML = renderList([viral.thesis, viral.audience_mirror, viral.share_trigger].filter(Boolean));
  document.querySelector("#retentionCurve").classList.remove("empty");
  document.querySelector("#retentionCurve").innerHTML = (viral.retention_curve || []).map((item, index) => `<div class="curve-step" style="height:${64 + index * 14}px"><strong>${escapeHtml(item.time || String(index + 1))}</strong><span>${escapeHtml(item.job || item.device || "")}</span></div>`).join("");

  document.querySelector("#characterLock").classList.remove("empty");
  document.querySelector("#characterLock").innerHTML = characters.map((item) => `<div class="evidence-item"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.role || "")} | ${escapeHtml((item.evidence || []).join(", "))}</p></div>`).join("") || "<div class='evidence-item'><strong>Không phát hiện</strong><p>AI không khóa được nhân vật rõ.</p></div>";

  document.querySelector("#worldLock").classList.remove("empty");
  document.querySelector("#worldLock").innerHTML = props.map((item) => `<div class="evidence-item"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.type || "")} | ${escapeHtml((item.evidence || []).join(", "))}</p></div>`).join("") || "<div class='evidence-item'><strong>Không phát hiện</strong><p>AI không khóa được prop/place rõ.</p></div>";

  document.querySelector("#evidenceLedger").classList.remove("empty");
  document.querySelector("#evidenceLedger").innerHTML = evidence.map((item) => `<div class="evidence-item"><strong>${escapeHtml(item.id)}</strong><p>${escapeHtml(item.text)}<br>${escapeHtml(item.function || "")}</p></div>`).join("");

  document.querySelector("#approvalList").classList.remove("empty");
  document.querySelector("#approvalList").innerHTML = (data.creative_additions_for_approval || []).map((item) => `<div class="check-item warn"><strong>${escapeHtml(item.idea || "Đề xuất")}</strong><p>${escapeHtml(item.why || "")} ${escapeHtml(item.risk || "")}</p></div>`).join("") || "<div class='check-item ok'><strong>Không có đề xuất ngoài nguồn</strong><p>AI không yêu cầu thêm chi tiết sáng tạo.</p></div>";

  document.querySelector("#hookLab").classList.remove("empty");
  document.querySelector("#hookLab").innerHTML = (data.hooks || []).map((item) => `<div class="prompt-item"><strong>${escapeHtml(item.type || "Hook")} | ${escapeHtml((item.evidence || []).join(", "))}</strong><p>${escapeHtml(item.text || "")}</p><p>${escapeHtml(item.why_it_works || "")} <span class="improvement">+${escapeHtml(item.copy_lift_percent || 0)}% improved</span></p></div>`).join("");

  document.querySelector("#scriptDraft").classList.remove("empty");
  document.querySelector("#scriptDraft").innerHTML = (data.detailed_script || []).map((beat, index) => `<div class="script-row">
    <div><strong>${index + 1}. ${escapeHtml(beat.beat || "")}</strong><span>${escapeHtml(beat.time || "")} | ${escapeHtml((beat.source_evidence || []).join(", "))}</span></div>
    <p><b>Visual:</b> ${escapeHtml(beat.visual || "")}</p>
    <p><b>Narration:</b> ${escapeHtml(beat.narration || "")}</p>
    <p><b>Dialogue:</b> ${escapeHtml(beat.dialogue || "")}</p>
    <p><b>Sound:</b> ${escapeHtml(beat.sound || "")}</p>
    <p><b>Retention:</b> ${escapeHtml(beat.retention_job || "")}</p>
    <p><b>GLOW:</b> ${escapeHtml(beat.glow_check || "")}</p>
  </div>`).join("");

  document.querySelector("#aiRewriteRoom").classList.remove("empty");
  document.querySelector("#aiRewriteRoom").innerHTML = (data.critic_notes || []).map((note, index) => `<div class="script-row"><div><strong>Rewrite Note ${index + 1}</strong><span>AI critic</span></div><p>${escapeHtml(note)}</p></div>`).join("");

  document.querySelector("#sceneCount").textContent = `${(data.storyboard || []).length} scene`;
  document.querySelector("#storyboardList").classList.remove("empty");
  document.querySelector("#storyboardList").innerHTML = (data.storyboard || []).map((scene) => `<div class="scene-card">
    <div class="scene-num">Scene ${escapeHtml(scene.scene || "")}<br>${escapeHtml(scene.duration || "")}<br>${escapeHtml((scene.evidence || []).join(", "))}</div>
    <div><h4>${escapeHtml(scene.action || "")}</h4><p><strong>Emotion:</strong> ${escapeHtml(scene.emotion || "")}</p><p><strong>Transition:</strong> ${escapeHtml(scene.transition || "")}</p></div>
    <div class="scene-meta"><span><strong>Camera:</strong> ${escapeHtml(scene.camera || "")}</span><span><strong>Sound:</strong> ${escapeHtml(scene.sound_design || "")}</span></div>
  </div>`).join("");

  document.querySelector("#imagePrompts").classList.remove("empty");
  document.querySelector("#imagePrompts").innerHTML = (data.image_prompts || []).map((item) => `<div class="prompt-item"><strong>Scene ${escapeHtml(item.scene || "")} | ${escapeHtml((item.evidence || []).join(", "))}</strong><p>${escapeHtml(item.prompt || "")}</p><p><b>Negative:</b> ${escapeHtml(item.negative || "")}</p><p><b>Anchors:</b> ${escapeHtml((item.continuity_anchors || []).join(", "))}</p></div>`).join("");

  document.querySelector("#motionPrompts").classList.remove("empty");
  document.querySelector("#motionPrompts").innerHTML = (data.motion_prompts || []).map((item) => `<div class="prompt-item"><strong>Scene ${escapeHtml(item.scene || "")} | ${escapeHtml((item.evidence || []).join(", "))}</strong><p>${escapeHtml(item.prompt || "")}</p><p><b>First:</b> ${escapeHtml(item.first_frame || "")}</p><p><b>Last:</b> ${escapeHtml(item.last_frame || "")}</p><p><b>Sound:</b> ${escapeHtml(item.sound || "")}</p></div>`).join("");

  document.querySelector("#continuityList").classList.remove("empty");
  document.querySelector("#continuityList").innerHTML = (data.qa || []).map((item) => `<div class="check-item ${escapeHtml(item.level || "warn")}"><strong>${escapeHtml(item.title || "")}</strong><p>${escapeHtml(item.note || "")}</p></div>`).join("");
  document.querySelector("#criticNotes").classList.remove("empty");
  document.querySelector("#criticNotes").innerHTML = renderList(data.critic_notes || []);

  renderAgents();
  renderAdaptation(text, preset);
  renderBible(groundedCore(text), preset);
  updateScores(text, groundedCore(text));
}

function updateScores(text, core) {
  const lower = text.toLowerCase();
  const hook = Math.min(98, 70 + (lower.includes("?") ? 8 : 0) + (core.symbol !== "một chi tiết lặp lại" ? 10 : 0) + Math.min(10, getSentences(text).length));
  const emotion = Math.min(98, 68 + ["mẹ", "cha", "sợ", "buồn", "lặng", "run", "mỉm cười", "nhận ra"].filter((w) => lower.includes(w)).length * 4);
  const viral = Math.min(96, 62 + (core.symbol !== "một chi tiết lặp lại" ? 12 : 0) + (lower.includes("hiểu") || lower.includes("nhận ra") ? 10 : 0) + (lower.includes("mẹ") || lower.includes("cha") ? 8 : 0));
  const glow = Math.min(99, 72 + (lower.includes("lặng") ? 8 : 0) + (lower.includes("giá trị") ? 6 : 0) + (lower.includes("hy sinh") ? 7 : 0));
  document.querySelector("#hookScore").textContent = hook;
  document.querySelector("#emotionScore").textContent = emotion;
  document.querySelector("#viralScore").textContent = viral;
  document.querySelector("#glowScore").textContent = glow;
}

function generatePackage() {
  const text = DOM.storyInput.value.trim() || SAMPLE_STORY;
  if (!DOM.storyInput.value.trim()) {
    DOM.storyInput.value = SAMPLE_STORY;
    updateWordCount();
  }
  const preset = GENRE_PRESETS[DOM.genreSelect.value];
  const platform = PLATFORM_RULES[DOM.targetSelect.value];
  const core = inferCore(text);
  const scenes = makeScenes(core, preset, platform, Number(DOM.lengthRange.value));

  renderWarRoom(core, preset, platform, text);
  renderAgents();
  renderScriptLab(core, platform);
  renderAdaptation(text, preset);
  renderBible(core, preset);
  renderStoryboard(scenes);
  renderPrompts(scenes, core, preset);
  renderQa(core, preset, platform);
  updateScores(text, core);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .tab-panel").forEach((node) => node.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
  });
});

DOM.storyInput.addEventListener("input", updateWordCount);
DOM.sampleBtn.addEventListener("click", () => {
  DOM.storyInput.value = SAMPLE_STORY;
  updateWordCount();
});
DOM.clearBtn.addEventListener("click", () => {
  DOM.storyInput.value = "";
  updateWordCount();
});
DOM.lengthRange.addEventListener("input", () => {
  DOM.lengthOutput.textContent = `${DOM.lengthRange.value} phút`;
});
DOM.generateBtn.addEventListener("click", generatePackage);

updateWordCount();

function analyzeSource(text) {
  const sentences = getSentences(text);
  const evidence = sentences.map((sentence, index) => ({
    id: `E${index + 1}`,
    text: sentence,
    lower: sentence.toLowerCase()
  }));
  const allLower = text.toLowerCase();
  const addUnique = (list, item) => {
    if (item && !list.some((existing) => existing.name === item.name)) list.push(item);
  };

  const characters = [];
  const nameMatches = [...text.matchAll(/(?:tên|là)\s+([A-ZÀ-Ỹ][\p{L}]{1,20})/gu)];
  nameMatches.forEach((match) => {
    const found = evidence.find((item) => item.text.includes(match[1]));
    addUnique(characters, { name: match[1], type: "named", evidence: found?.id || "E?" });
  });

  [
    ["mẹ", "family"],
    ["má", "family"],
    ["cha", "family"],
    ["bố", "family"],
    ["ba", "family"],
    ["ông", "family"],
    ["bà", "family"],
    ["thầy giáo", "school"],
    ["cô giáo", "school"],
    ["thầy", "school"],
    ["cô", "school"],
    ["cả lớp", "collective"],
    ["bạn", "collective"]
  ].forEach(([name, type]) => {
    if (allLower.includes(name)) {
      const found = evidence.find((item) => item.lower.includes(name));
      addUnique(characters, { name, type, evidence: found?.id || "E?" });
    }
  });

  const props = [];
  [
    "áo", "đèn", "đèn dầu", "nhà", "sông", "sân khấu", "lớp", "quần áo", "bàn ăn",
    "cửa", "ghế", "vải", "đường chỉ", "bài hát", "buổi biểu diễn"
  ].forEach((name) => {
    if (allLower.includes(name)) {
      const found = evidence.find((item) => item.lower.includes(name));
      addUnique(props, { name, evidence: found?.id || "E?" });
    }
  });

  const mainCharacter = characters.find((item) => item.type === "named")?.name || characters[0]?.name || "nhân vật chính chưa định danh";
  const symbol = props.find((item) => ["áo", "đèn dầu", "đường chỉ", "bài hát"].includes(item.name))?.name || props[0]?.name || "chi tiết trung tâm chưa rõ";
  const hasFamily = characters.some((item) => item.type === "family");
  const hasSchool = characters.some((item) => item.type === "school" || item.type === "collective");
  const hasRealization = allLower.includes("nhận ra") || allLower.includes("hiểu") || allLower.includes("bỗng");

  const approvals = [];
  if (mainCharacter.includes("chưa định danh")) approvals.push("Chưa tìm thấy tên/nhân vật chính rõ ràng. App dùng nhãn tạm và cần bạn xác nhận.");
  if (symbol.includes("chưa rõ")) approvals.push("Chưa tìm thấy biểu tượng trung tâm đủ rõ. Cần chọn một đạo cụ/chi tiết làm motif.");
  approvals.push("Theme, wound và viral angle là SUY LUẬN từ bằng chứng, cần human approval trước sản xuất.");

  return {
    sentences,
    evidence,
    characters,
    props,
    mainCharacter,
    symbol,
    hasFamily,
    hasSchool,
    hasRealization,
    approvals
  };
}

function groundedCore(text) {
  const source = analyzeSource(text);
  const lower = text.toLowerCase();
  const truth = source.hasFamily
    ? "tình yêu thường nằm trong những việc nhỏ mà ta từng xem là bình thường"
    : source.hasRealization
      ? "con người thay đổi khi tự nhận ra điều thật, không phải khi bị giảng giải"
      : "một lựa chọn nhỏ có thể làm lộ ra giá trị thật của nhân vật";
  const wound = lower.includes("cũ") || lower.includes("nghèo") || lower.includes("thiếu")
    ? "mặc cảm vì thiếu thốn hoặc vì thấy mình kém hơn người khác"
    : "một khoảng thiếu bên trong chưa được gọi tên rõ";
  const desire = source.hasSchool
    ? "được xuất hiện trước người khác mà không xấu hổ"
    : "được nhìn nhận mà vẫn giữ được phẩm giá thật";

  return {
    ...source,
    logline: source.sentences[0] || "Chưa có đủ dữ liệu truyện.",
    protagonist: source.mainCharacter,
    falseBelief: "Mình chỉ có giá trị khi bên ngoài đủ tốt hoặc đủ được công nhận.",
    wound,
    desire,
    truth,
    promise: `Người xem nhận ra: ${truth}.`,
    emotionalSpine: ["mở tò mò", "tự soi", "áp lực", "lặng nhận ra", "lựa chọn", "dư âm"]
  };
}

function evidenceLabel(source, text) {
  const lower = text.toLowerCase();
  const hit = source.evidence.find((item) => lower.includes(item.text.toLowerCase().slice(0, 24)) || item.text.toLowerCase().includes(lower.slice(0, 24)));
  return hit?.id || source.evidence[0]?.id || "E?";
}

function transformSentenceToVisual(sentence, core) {
  const lower = sentence.toLowerCase();
  if (lower.includes("nhận ra") || lower.includes("hiểu")) return `Giữ máy trên ${core.protagonist}; không nói bài học, để ánh mắt dừng lại trên ${core.symbol}.`;
  if (lower.includes("nói")) return `Đưa thông tin thành hành động nghe - phản ứng; máy bắt phản ứng của ${core.protagonist} sau câu nói.`;
  if (lower.includes("cúi") || lower.includes("run") || lower.includes("lặng")) return `Cận tay/mắt/hơi thở của ${core.protagonist}; để cơ thể kể cảm xúc thay lời.`;
  if (lower.includes("áo") || lower.includes("đèn") || lower.includes("nhà")) return `Dùng chi tiết vật thể và không gian trong câu nguồn để kể hoàn cảnh, không thêm nhân vật mới.`;
  return `Dựng lại hành động đúng theo câu nguồn, ưu tiên quan sát hơn giải thích.`;
}

function makeGroundedScript(core, platform, minutes) {
  const usable = core.evidence.slice(0, Math.max(4, Math.min(10, core.evidence.length)));
  const totalSeconds = minutes * 60;
  const perBeat = Math.max(8, Math.floor(totalSeconds / Math.max(usable.length, 1)));
  return usable.map((item, index) => {
    const start = index * perBeat;
    const end = start + perBeat;
    const isOpening = index === 0;
    const isLast = index === usable.length - 1;
    return {
      beat: isOpening ? "Opening Image" : isLast ? "Emotional Payoff" : `Grounded Beat ${index + 1}`,
      time: `${Math.floor(start / 60)}:${String(start % 60).padStart(2, "0")} - ${Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")}`,
      evidence: item.id,
      source: item.text,
      visual: isOpening
        ? `Mở bằng một hình ảnh lấy trực tiếp từ ${item.id}: ${transformSentenceToVisual(item.text, core)}`
        : transformSentenceToVisual(item.text, core),
      narration: item.lower.includes("nhận ra") || item.lower.includes("hiểu")
        ? "GIẢM LỜI: chỉ giữ một câu rất ngắn hoặc bỏ narration để hình ảnh trả nghĩa."
        : `Narration gợi ý, bám nguồn: "${item.text.length > 120 ? item.text.slice(0, 117) + "..." : item.text}"`,
      dialogue: item.lower.includes("nói") ? "Có thể chuyển phần 'nói rằng' thành thoại ngắn, không thêm nội dung ngoài câu nguồn." : "Không thêm thoại nếu câu nguồn không có lời nói.",
      sound: isLast ? "Giảm nhạc, để room tone và dư âm; không ép nước mắt." : "Foley cụ thể từ vật thể/bối cảnh trong câu nguồn; nhạc rất tiết chế.",
      retention: platform.retention[index] || "Giữ bằng một câu hỏi cảm xúc chưa trả lời."
    };
  });
}

function makeGroundedScenes(core, preset, platform, minutes) {
  return makeGroundedScript(core, platform, minutes).map((beat, index) => ({
    number: index + 1,
    duration: beat.time,
    title: beat.beat,
    purpose: beat.retention,
    action: beat.visual,
    narration: beat.narration,
    dialogue: beat.dialogue,
    emotion: core.emotionalSpine[Math.min(index, core.emotionalSpine.length - 1)],
    camera: index === 0 ? "locked close-up or slow reveal from source object" : "motivated camera only; no decorative movement",
    sound: beat.sound,
    evidence: beat.evidence,
    source: beat.source,
    style: preset.style
  }));
}

function renderEvidence(core) {
  document.querySelector("#characterLock").classList.remove("empty");
  document.querySelector("#characterLock").innerHTML = core.characters.length
    ? core.characters.map((item) => `<div class="evidence-item"><strong>${escapeHtml(item.name)}</strong><p>Type: ${escapeHtml(item.type)} | Evidence: ${escapeHtml(item.evidence)}</p></div>`).join("")
    : `<div class="evidence-item"><strong>Cần xác nhận</strong><p>Không phát hiện nhân vật rõ ràng. App không được tự thêm ông/bà/mẹ/cha nếu input không có.</p></div>`;

  document.querySelector("#worldLock").classList.remove("empty");
  document.querySelector("#worldLock").innerHTML = core.props.length
    ? core.props.map((item) => `<div class="evidence-item"><strong>${escapeHtml(item.name)}</strong><p>Evidence: ${escapeHtml(item.evidence)}</p></div>`).join("")
    : `<div class="evidence-item"><strong>Cần xác nhận</strong><p>Chưa phát hiện đạo cụ/bối cảnh đủ rõ để khóa continuity.</p></div>`;

  document.querySelector("#evidenceLedger").classList.remove("empty");
  document.querySelector("#evidenceLedger").innerHTML = core.evidence.map((item) => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.id)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </div>`).join("");

  document.querySelector("#approvalList").classList.remove("empty");
  document.querySelector("#approvalList").innerHTML = core.approvals.map((item) => `
    <div class="check-item warn">
      <strong>Cần duyệt</strong>
      <p>${escapeHtml(item)}</p>
    </div>`).join("");
}

function makeGroundedHooks(core, platform) {
  const evidence = core.evidence[0]?.id || "E?";
  const objectHook = core.symbol.includes("chưa rõ")
    ? `Có một chi tiết trong câu chuyện này đang giữ phần thật nhất của ${core.protagonist}.`
    : `Nếu ${core.symbol} có thể lên tiếng, nó sẽ kể điều gì về ${core.protagonist}?`;
  const innerHook = `${core.protagonist} không thiếu giá trị. ${core.protagonist} chỉ chưa nhìn thấy giá trị ấy đúng cách.`;
  const sourceHook = `Từ ${evidence}: một khoảnh khắc rất nhỏ mở ra cả câu chuyện.`;
  return [
    ["Visual Hook", objectHook, platform.opening, evidence],
    ["Psychological Hook", innerHook, "Mở bằng wound, không thêm sự kiện mới.", evidence],
    ["Source-Grounded Hook", sourceHook, "Hook này công khai bám bằng chứng, giảm nguy cơ bịa.", evidence]
  ];
}

function renderWarRoom(core, preset, platform, text) {
  document.querySelector("#storyCore").classList.remove("empty");
  document.querySelector("#storyCore").innerHTML = `
    <p><strong>Logline nguồn:</strong> ${escapeHtml(core.logline)}</p>
    <p><strong>Human truth [SUY LUẬN]:</strong> ${escapeHtml(core.truth)}</p>
    <p><strong>Wound [SUY LUẬN]:</strong> ${escapeHtml(core.wound)}</p>
    <p><strong>Desire [SUY LUẬN]:</strong> ${escapeHtml(core.desire)}</p>
    <p><strong>False belief [SUY LUẬN]:</strong> ${escapeHtml(core.falseBelief)}</p>
    <div class="pill-list">
      <span class="pill">Nhân vật khóa: ${escapeHtml(core.protagonist)}</span>
      <span class="pill">Symbol khóa: ${escapeHtml(core.symbol)}</span>
      <span class="pill">${escapeHtml(preset.title)}</span>
      <span class="pill">${escapeHtml(platform.title)}</span>
    </div>`;

  document.querySelector("#viralThesis").classList.remove("empty");
  document.querySelector("#viralThesis").innerHTML = renderList([
    `Viral angle [SUY LUẬN]: ${core.symbol} biến một cảm xúc nhỏ thành câu hỏi lớn.`,
    `Audience mirror [SUY LUẬN]: người từng thấy mình chưa đủ tốt sẽ dừng lại.`,
    `Share reason: gửi cho người liên quan trực tiếp tới nhân vật có trong nguồn: ${core.characters.map((item) => item.name).join(", ") || "chưa xác định"}.`,
    `Promise: ${preset.promise}`
  ]);

  document.querySelector("#retentionCurve").classList.remove("empty");
  document.querySelector("#retentionCurve").innerHTML = platform.retention.map((label, index) => `<div class="curve-step" style="height:${64 + index * 14}px"><strong>${index + 1}</strong><span>${escapeHtml(label)}</span></div>`).join("");

  document.querySelector("#glowAlignment").classList.remove("empty");
  document.querySelector("#glowAlignment").innerHTML = renderList([
    "Không thêm nhân vật ngoài Character Lock.",
    "Không biến suy luận thành dữ kiện.",
    "Không dùng bất kỳ vai nhân vật nào nếu input không có bằng chứng cho vai đó.",
    "Mỗi scene, hook, prompt phải có evidence ID.",
    `Nguồn hiện có ${core.evidence.length} câu, ${core.characters.length} nhân vật/nhóm, ${core.props.length} đạo cụ/bối cảnh được khóa.`
  ]);
}

function renderScriptLab(core, platform) {
  const hooks = makeGroundedHooks(core, platform);
  document.querySelector("#hookLab").classList.remove("empty");
  document.querySelector("#hookLab").innerHTML = hooks.map(([label, hook, why, evidence]) => {
    const improved = copyImprove(hook);
    return `
      <div class="prompt-item">
        <strong>${escapeHtml(label)} | ${escapeHtml(evidence)}</strong>
        <p>${escapeHtml(hook)}</p>
        <p><b>Glow Copywriter:</b> ${escapeHtml(improved.text)} <span class="improvement">+${improved.improvement}% improved</span></p>
        <p>${escapeHtml(why)}</p>
      </div>`;
  }).join("");

  const beats = makeGroundedScript(core, platform, Number(DOM.lengthRange.value));
  document.querySelector("#scriptDraft").classList.remove("empty");
  document.querySelector("#scriptDraft").innerHTML = beats.map((beat, index) => `
    <div class="script-row">
      <div><strong>${index + 1}. ${escapeHtml(beat.beat)}</strong><span>${escapeHtml(beat.time)} | ${escapeHtml(beat.evidence)}</span></div>
      <p><b>Câu nguồn:</b> ${escapeHtml(beat.source)}</p>
      <p><b>Visual:</b> ${escapeHtml(beat.visual)}</p>
      <p><b>Narration:</b> ${escapeHtml(beat.narration)}</p>
      <p><b>Dialogue:</b> ${escapeHtml(beat.dialogue)}</p>
      <p><b>Sound:</b> ${escapeHtml(beat.sound)}</p>
      <p><b>Retention job:</b> ${escapeHtml(beat.retention)}</p>
    </div>`).join("");

  const characterShare = core.characters.map((item) => item.name).filter(Boolean);
  document.querySelector("#shareTriggers").classList.remove("empty");
  document.querySelector("#shareTriggers").innerHTML = renderList([
    characterShare.length ? `Gửi cho người liên quan tới: ${characterShare.join(", ")}.` : "Chưa có nhân vật rõ để tạo share trigger cá nhân hóa.",
    `Gửi cho người đang có wound tương tự: ${core.wound}.`,
    "Gửi cho người thích câu chuyện nhỏ, thật, không lên lớp."
  ]);

  document.querySelector("#commentPrompts").classList.remove("empty");
  document.querySelector("#commentPrompts").innerHTML = renderList([
    `Bạn từng có một "${core.symbol}" trong đời mình không?`,
    "Có điều gì rất muộn bạn mới hiểu ra?",
    "Câu nào trong câu chuyện này giống bạn nhất?"
  ]);
}

function renderBible(core, preset) {
  const cards = [
    ["Character Lock", core.characters.length ? core.characters.map((item) => `${item.name} (${item.evidence})`).join("; ") : "Không thêm nhân vật mới nếu chưa được duyệt."],
    ["Symbol Lock", `${core.symbol}. Chỉ dùng làm motif nếu có evidence trong Prop & Place Lock.`],
    ["World Lock", core.props.length ? core.props.map((item) => `${item.name} (${item.evidence})`).join("; ") : "Bối cảnh cần được bạn xác nhận thêm."],
    ["Camera Law", "Camera chỉ làm rõ lựa chọn/cảm xúc trong câu nguồn. Không dùng cảnh đẹp vô nghĩa."],
    ["Sound Law", preset.music],
    ["GLOW Taste", "Ít hơn nhưng đúng hơn. Mọi suy luận phải được gắn nhãn."]
  ];
  document.querySelector("#visualBible").innerHTML = cards.map(([title, body]) => `
    <div class="bible-card">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
      <div class="color-row">${preset.palette.map((color) => `<span class="swatch" style="background:${color}"></span>`).join("")}</div>
      <p><em>${escapeHtml(preset.style)}</em></p>
    </div>`).join("");
}

function renderStoryboard(scenes) {
  document.querySelector("#sceneCount").textContent = `${scenes.length} scene`;
  const list = document.querySelector("#storyboardList");
  list.classList.remove("empty");
  list.innerHTML = scenes.map((scene) => `
    <div class="scene-card">
      <div class="scene-num">Scene ${scene.number}<br>${escapeHtml(scene.duration)}<br>${escapeHtml(scene.evidence)}</div>
      <div>
        <h4>${escapeHtml(scene.title)}</h4>
        <p><strong>Câu nguồn:</strong> ${escapeHtml(scene.source)}</p>
        <p><strong>Purpose:</strong> ${escapeHtml(scene.purpose)}</p>
        <p><strong>Action:</strong> ${escapeHtml(scene.action)}</p>
        <p><strong>Narration:</strong> ${escapeHtml(scene.narration)}</p>
        <p><strong>Dialogue:</strong> ${escapeHtml(scene.dialogue)}</p>
      </div>
      <div class="scene-meta">
        <span><strong>Emotion:</strong> ${escapeHtml(scene.emotion)}</span>
        <span><strong>Camera:</strong> ${escapeHtml(scene.camera)}</span>
        <span><strong>Sound:</strong> ${escapeHtml(scene.sound)}</span>
      </div>
    </div>`).join("");
}

function renderPrompts(scenes, core, preset) {
  const characterAnchor = core.characters.map((item) => `${item.name} from ${item.evidence}`).join(", ") || "no new character without approval";
  const propAnchor = core.props.map((item) => `${item.name} from ${item.evidence}`).join(", ") || "no invented prop";
  document.querySelector("#imagePrompts").classList.remove("empty");
  document.querySelector("#motionPrompts").classList.remove("empty");
  document.querySelector("#imagePrompts").innerHTML = scenes.map((scene) => `
    <div class="prompt-item">
      <strong>Keyframe ${scene.number}: ${escapeHtml(scene.title)} | ${escapeHtml(scene.evidence)}</strong>
      <p><b>Prompt:</b> ${escapeHtml(scene.action)} Cinematic still, ${escapeHtml(preset.style)}, emotionally truthful, grounded in source sentence: "${scene.source}". Character anchors: ${escapeHtml(characterAnchor)}. Prop/place anchors: ${escapeHtml(propAnchor)}. Lens: natural close observational lens. Lighting follows "${escapeHtml(scene.emotion)}".</p>
      <p><b>Negative:</b> no extra characters, no invented old man, no unrelated props, no melodrama, no glossy advertisement look, no inconsistent costume.</p>
    </div>`).join("");
  document.querySelector("#motionPrompts").innerHTML = scenes.map((scene) => `
    <div class="prompt-item">
      <strong>Clip ${scene.number}A | ${escapeHtml(scene.evidence)}</strong>
      <p><b>Video prompt:</b> 8-second grounded cinematic shot based only on ${escapeHtml(scene.evidence)}. Character motion: subtle and motivated by the source sentence. Secondary motion: hands, fabric, breath, or object movement only if present in evidence. Camera: ${escapeHtml(scene.camera)}. Emotional change: ${escapeHtml(scene.emotion)}. Sound: ${escapeHtml(scene.sound)}.</p>
      <p><b>Continuity:</b> characters = ${escapeHtml(characterAnchor)}; props/places = ${escapeHtml(propAnchor)}; do not introduce any person, costume, setting, weather, or object not listed.</p>
    </div>`).join("");
}

function renderQa(core, preset, platform) {
  const checks = [
    ["ok", "Source grounding", `Có ${core.evidence.length} evidence item. Mọi output phải trỏ về E-id.`],
    ["ok", "Character lock", core.characters.length ? `Chỉ dùng: ${core.characters.map((item) => item.name).join(", ")}.` : "Chưa có nhân vật rõ; không được tự thêm."],
    ["warn", "Inference boundary", "Theme/wound/desire là suy luận, cần bạn duyệt trước khi sản xuất."],
    ["warn", "Narration risk", `${preset.narration}. Nếu còn giống audiobook, chuyển thêm câu kể thành reaction hoặc symbol.`],
    ["risk", "Hallucination ban", "Cấm thêm bất kỳ nhân vật, quan hệ, đạo cụ hoặc bối cảnh nào nằm ngoài Character Lock và Prop/Place Lock."],
    ["risk", "Award-level gap", "Muốn đạt giải, cần vòng human rewrite sau bản grounded draft: thêm taste, bất ngờ tinh tế và đạo diễn thật sự."]
  ];
  document.querySelector("#continuityList").classList.remove("empty");
  document.querySelector("#continuityList").innerHTML = checks.map(([level, title, body]) => `
    <div class="check-item ${level}">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
    </div>`).join("");

  document.querySelector("#criticNotes").classList.remove("empty");
  document.querySelector("#criticNotes").innerHTML = renderList([
    "Bản app giờ ưu tiên đúng trước khi hay: không còn tự bịa nhân vật.",
    "Muốn script chạm hơn nữa, cần bạn cung cấp bản truyện đủ dài hoặc cho phép app đề xuất thêm cảnh có gắn nhãn.",
    "Prompt đã có negative constraint chống thêm nhân vật/đạo cụ ngoài nguồn.",
    "Đẳng cấp festival không đến từ nhiều agent, mà từ rewrite nhiều vòng trên một human truth rất chính xác."
  ]);
}

async function generatePackage() {
  const text = DOM.storyInput.value.trim() || SAMPLE_STORY;
  if (!DOM.storyInput.value.trim()) {
    DOM.storyInput.value = SAMPLE_STORY;
    updateWordCount();
  }
  const preset = GENRE_PRESETS[DOM.genreSelect.value];
  const platform = PLATFORM_RULES[DOM.targetSelect.value];

  if (DOM.aiMode.checked) {
    DOM.aiStatus.textContent = "Đang gọi AI agents qua backend...";
    DOM.aiStatus.className = "ai-status";
    try {
      const aiResult = await callAiStudio(text, preset, platform);
      renderAiPackage(aiResult, preset, platform, text);
      return;
    } catch (error) {
      DOM.aiStatus.textContent = `AI backend chưa chạy hoặc lỗi: ${error.message}. Đang dùng fallback rule engine.`;
      DOM.aiStatus.className = "ai-status warn";
    }
  }

  const core = groundedCore(text);
  const scenes = makeGroundedScenes(core, preset, platform, Number(DOM.lengthRange.value));

  renderWarRoom(core, preset, platform, text);
  renderEvidence(core);
  renderAgents();
  renderScriptLab(core, platform);
  document.querySelector("#aiRewriteRoom").classList.add("empty");
  document.querySelector("#aiRewriteRoom").innerHTML = "Fallback rule engine đang chạy. Muốn có AI rewrite thật, hãy bật backend bằng OPENAI_API_KEY.";
  renderAdaptation(text, preset);
  renderBible(core, preset);
  renderStoryboard(scenes);
  renderPrompts(scenes, core, preset);
  renderQa(core, preset, platform);
  updateScores(text, core);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .tab-panel").forEach((node) => node.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
  });
});

DOM.storyInput.addEventListener("input", updateWordCount);
DOM.sampleBtn.addEventListener("click", () => {
  DOM.storyInput.value = SAMPLE_STORY;
  updateWordCount();
});
DOM.clearBtn.addEventListener("click", () => {
  DOM.storyInput.value = "";
  updateWordCount();
});
DOM.lengthRange.addEventListener("input", () => {
  DOM.lengthOutput.textContent = `${DOM.lengthRange.value} phút`;
});
DOM.generateBtn.addEventListener("click", generatePackage);

// ============================================================================
// SETTINGS MODAL LOGIC
// ============================================================================

function initSettingsModal() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const apiKeySection = document.getElementById('apiKeySection');
  const jsonSection = document.getElementById('jsonSection');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const testConnectionBtn = document.getElementById('testConnectionBtn');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const jsonFileInput = document.getElementById('jsonFileInput');
  const connectionIndicator = document.getElementById('connectionIndicator');
  const connectionText = document.getElementById('connectionText');

  // Load saved settings from localStorage
  function loadSettings() {
    const savedApiKey = localStorage.getItem('ai_api_key');
    const savedMode = localStorage.getItem('ai_mode') || 'key';
    
    if (savedApiKey) {
      apiKeyInput.value = savedApiKey;
    }
    
    // Set active toggle button
    toggleBtns.forEach(btn => {
      if (btn.dataset.mode === savedMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Show/hide sections based on mode
    if (savedMode === 'json') {
      apiKeySection.classList.add('hidden');
      jsonSection.classList.remove('hidden');
    } else {
      apiKeySection.classList.remove('hidden');
      jsonSection.classList.add('hidden');
    }
  }

  // Save settings to localStorage
  function saveSettings() {
    const currentMode = document.querySelector('.toggle-btn.active').dataset.mode;
    localStorage.setItem('ai_mode', currentMode);
    
    if (currentMode === 'key' && apiKeyInput.value.trim()) {
      localStorage.setItem('ai_api_key', apiKeyInput.value.trim());
      updateConnectionStatus(true, 'Đã lưu API Key');
    } else if (currentMode === 'json' && jsonFileInput.files.length > 0) {
      const file = jsonFileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          localStorage.setItem('ai_json_config', JSON.stringify(jsonContent));
          updateConnectionStatus(true, 'Đã lưu file JSON');
        } catch (err) {
          updateConnectionStatus(false, 'File JSON không hợp lệ');
        }
      };
      reader.readAsText(file);
    } else {
      updateConnectionStatus(false, 'Chưa có cấu hình');
    }
  }

  // Update connection status display
  function updateConnectionStatus(connected, text) {
    if (connected) {
      connectionIndicator.className = 'status-dot connected';
      connectionText.textContent = text;
    } else {
      connectionIndicator.className = 'status-dot error';
      connectionText.textContent = text;
    }
  }

  // Test connection to backend
  async function testConnection() {
    const apiKey = apiKeyInput.value.trim();
    const currentMode = document.querySelector('.toggle-btn.active').dataset.mode;
    
    if (currentMode === 'key' && !apiKey) {
      updateConnectionStatus(false, 'Vui lòng nhập API Key');
      return;
    }
    
    updateConnectionStatus(false, 'Đang kiểm tra...');
    
    try {
      const response = await fetch(`${CONFIG.AI_BACKEND_URL}/api/health`);
      const data = await response.json();
      
      if (data.ok) {
        updateConnectionStatus(true, `Kết nối OK - ${data.provider.toUpperCase()} (${data.mode})`);
      } else {
        updateConnectionStatus(false, 'Backend chưa phản hồi');
      }
    } catch (error) {
      updateConnectionStatus(false, `Lỗi: ${error.message}`);
    }
  }

  // Event listeners
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    loadSettings();
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const mode = btn.dataset.mode;
      if (mode === 'json') {
        apiKeySection.classList.add('hidden');
        jsonSection.classList.remove('hidden');
      } else {
        apiKeySection.classList.remove('hidden');
        jsonSection.classList.add('hidden');
      }
    });
  });

  saveSettingsBtn.addEventListener('click', saveSettings);
  testConnectionBtn.addEventListener('click', testConnection);
  
  jsonFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      document.getElementById('jsonStatus').textContent = `Đã chọn: ${e.target.files[0].name}`;
    }
  });
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMElements();
  initSettingsModal();
  updateWordCount();
  checkAiBackend();
});

})(); // End of IIFE

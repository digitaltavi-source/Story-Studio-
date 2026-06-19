const storyInput = document.querySelector("#storyInput");
const wordCount = document.querySelector("#wordCount");
const sampleBtn = document.querySelector("#sampleBtn");
const clearBtn = document.querySelector("#clearBtn");
const generateBtn = document.querySelector("#generateBtn");
const genreSelect = document.querySelector("#genreSelect");
const targetSelect = document.querySelector("#targetSelect");
const lengthRange = document.querySelector("#lengthRange");
const lengthOutput = document.querySelector("#lengthOutput");

const sampleStory = `Ngày xưa, ở một ngôi làng nhỏ ven sông, có một cậu bé tên An sống cùng mẹ trong căn nhà cũ. An chỉ có một chiếc áo đã sờn vai, nhưng cậu luôn giữ nó rất sạch.

Một ngày nọ, thầy giáo nói rằng lớp sẽ có buổi biểu diễn cuối năm. Ai cũng háo hức chuẩn bị quần áo đẹp. An lặng lẽ nhìn chiếc áo cũ của mình rồi cúi đầu.

Đêm đó, mẹ vá lại từng đường chỉ dưới ánh đèn dầu. An nhận ra chiếc áo không chỉ là vải, mà là tình yêu và sự hy sinh của mẹ.

Trong buổi biểu diễn, An bước lên sân khấu. Ban đầu cậu run rẩy, nhưng khi nhìn thấy mẹ mỉm cười, cậu hát bằng tất cả trái tim. Cả lớp đứng dậy vỗ tay.

Từ hôm ấy, An hiểu rằng giá trị không nằm ở thứ ta mặc bên ngoài, mà ở điều ta tạo ra bằng lòng biết ơn và can đảm.`;

const genrePresets = {
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

const platformRules = {
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

const agents = [
  ["Story Truth Analyst", "Tìm sự thật con người", "Theme, wound, desire, false belief", "Nếu không tìm được nỗi thật, dừng sản xuất."],
  ["Audience Psychologist", "Hiểu lý do người xem dừng lại", "Audience pain, mirror moment, share motive", "Không tối ưu view bằng thao túng cảm xúc."],
  ["Viral Hook Architect", "Thiết kế 3 giây đầu", "Pattern interrupt, open loop, first image", "Hook phải thật với câu chuyện, không clickbait."],
  ["Screenwriter", "Viết lại thành script phim", "Scene intention, dialogue, narration, silence", "Mỗi đoạn phải có đổi trạng thái cảm xúc."],
  ["Narration Surgeon", "Cắt lời kể dư", "Keep, cut, image, dialogue, silence", "Không kể thứ hình ảnh đã tự kể được."],
  ["Cinematic Director", "Dựng ngôn ngữ điện ảnh", "Blocking, lens, camera, rhythm, transition", "Camera move phải có lý do cảm xúc."],
  ["Art Director", "Giữ thế giới và biểu tượng", "Character, prop, location, color, texture", "Không để style đẹp nhưng rỗng."],
  ["Sound Director", "Thiết kế tai nghe cảm xúc", "Voice, room tone, foley, music, silence", "Nhạc nâng nền, không ra lệnh."],
  ["Image Prompt Engineer", "Tạo keyframe nhất quán", "Subject, environment, lighting, lens, style", "Prompt phải có continuity anchors."],
  ["Motion Prompt Engineer", "Tạo video prompt dùng được", "Character, secondary, camera, environment motion", "Không chỉ viết 'nhân vật chạy'."],
  ["Continuity Supervisor", "Chống trôi nhân vật và đạo cụ", "Face, costume, time, weather, prop state", "Mỗi clip cần reference hoặc note nối cảnh."],
  ["Festival Quality Critic", "Soát tầm quốc tế", "Originality, clarity, taste, restraint, impact", "Nếu quá lộ bài học, trả về rewrite."]
];

function getWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function updateWordCount() {
  wordCount.textContent = `${getWords(storyInput.value).length} từ`;
}

function getSentences(text) {
  return text.replace(/\n+/g, " ").split(/(?<=[.!?。！？])\s+/).map((s) => s.trim()).filter(Boolean);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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
  document.querySelector("#agentCouncil").innerHTML = agents.map(([name, mission, output, fail], index) => `
    <article class="agent-card">
      <div class="agent-index">${String(index + 1).padStart(2, "0")}</div>
      <h3>${escapeHtml(name)}</h3>
      <p><strong>Vai trò:</strong> ${escapeHtml(mission)}</p>
      <p><strong>Output:</strong> ${escapeHtml(output)}</p>
      <p><strong>Luật sống còn:</strong> ${escapeHtml(fail)}</p>
      <span>${escapeHtml(index < 3 ? "Chiến lược" : index < 8 ? "Sản xuất" : "Kiểm định")}</span>
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
  const text = storyInput.value.trim() || sampleStory;
  if (!storyInput.value.trim()) {
    storyInput.value = sampleStory;
    updateWordCount();
  }
  const preset = genrePresets[genreSelect.value];
  const platform = platformRules[targetSelect.value];
  const core = inferCore(text);
  const scenes = makeScenes(core, preset, platform, Number(lengthRange.value));

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

storyInput.addEventListener("input", updateWordCount);
sampleBtn.addEventListener("click", () => {
  storyInput.value = sampleStory;
  updateWordCount();
});
clearBtn.addEventListener("click", () => {
  storyInput.value = "";
  updateWordCount();
});
lengthRange.addEventListener("input", () => {
  lengthOutput.textContent = `${lengthRange.value} phút`;
});
generateBtn.addEventListener("click", generatePackage);

updateWordCount();

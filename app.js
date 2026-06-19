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
  children: {
    title: "Truyện thiếu nhi/cổ tích",
    adaptation: "Hybrid Emotional Cinema, hình ảnh rõ, cảm xúc ấm, biểu tượng dễ nhớ.",
    narration: "25-35% narration, ưu tiên lời kể ngắn và dịu.",
    style: "storybook cinema, warm natural light, expressive faces, clean composition",
    palette: ["#f8b84e", "#6bbf8a", "#4f7cac", "#f6efe3"],
    music: "piano nhẹ, woodwind mềm, foley đời thường"
  },
  fable: {
    title: "Truyện ngụ ngôn",
    adaptation: "Tập trung setup/payoff, bài học rõ, hình ảnh mang tính biểu tượng.",
    narration: "30-40% narration để giữ chất kể dân gian.",
    style: "timeless fable, symbolic staging, balanced theatrical framing",
    palette: ["#c78c3b", "#315f4b", "#b8c2a1", "#f7f0df"],
    music: "nhạc cụ mộc, nhấn ở khoảnh khắc nhận ra bài học"
  },
  inspiration: {
    title: "Truyện truyền cảm hứng",
    adaptation: "Đẩy emotional low, montage nỗ lực, ánh sáng chuyển từ tối sang sáng.",
    narration: "20-30% narration, nhiều visual metaphor.",
    style: "premium inspirational short film, intimate close-ups, hopeful lighting",
    palette: ["#1f4f5f", "#f2a541", "#e6e1d6", "#8fb8a8"],
    music: "strings tối giản, build dần về cuối"
  },
  history: {
    title: "Truyện lịch sử/giáo dục",
    adaptation: "Ưu tiên chính xác bối cảnh, phục trang, đạo cụ và timeline.",
    narration: "40-55% narration để bảo toàn thông tin.",
    style: "historical cinematic realism, authentic costumes, textured environments",
    palette: ["#5b4636", "#9a7b4f", "#2f5d62", "#ddd0b7"],
    music: "ambient lịch sử, nhạc cụ vùng miền nếu có căn cứ"
  },
  horror: {
    title: "Truyện kinh dị nhẹ",
    adaptation: "Dùng khoảng lặng, âm thanh nhỏ, reveal chậm, không lạm dụng jumpscare.",
    narration: "15-25% narration, để không khí tự kể.",
    style: "soft suspense cinema, narrow framing, practical shadows, restrained reveals",
    palette: ["#202124", "#5e6b64", "#9b7b52", "#d4d0c8"],
    music: "drone thấp, tiếng phòng, tiếng gió, nhịp thưa"
  },
  romance: {
    title: "Truyện tình cảm",
    adaptation: "Micro emotion, ánh mắt, khoảng ngừng, chi tiết tay và không gian gần.",
    narration: "20-30% narration, ưu tiên đối thoại và phản ứng.",
    style: "intimate romantic drama, soft daylight, subtle gestures, gentle camera",
    palette: ["#a95c68", "#f0c7a9", "#596f62", "#f8f3ed"],
    music: "guitar/piano mềm, silence ở điểm cảm xúc"
  }
};

const glowDna = {
  principles: [
    {
      title: "Sự thật con người",
      body: "Câu chuyện phải có cảm xúc, phản ứng và lựa chọn nội tâm chân thật. Không cần twist lớn nếu người xem thấy mình trong đó."
    },
    {
      title: "Không dạy đời",
      body: "Thông điệp không được áp đặt. Ý nghĩa nên được người xem tự nhận ra qua hành động, hình ảnh và khoảng lặng."
    },
    {
      title: "Đơn giản, rõ ràng, dễ cảm",
      body: "Tránh triết lý nặng và phô diễn kỹ thuật. Sự sâu sắc đến từ trải nghiệm, không từ câu chữ lớn."
    },
    {
      title: "Cảm xúc không bi lụy",
      body: "Được buồn, được đau, nhưng không khai thác khổ đau để gây thương hại hoặc giữ người xem trong tuyệt vọng."
    },
    {
      title: "Im lặng là nơi chuyển hóa",
      body: "Silence không phải khoảng trống. Đó là nơi khán giả nghe lại chính mình và để sự thật kịp chạm."
    },
    {
      title: "Remove Before Add",
      body: "Trước khi thêm hiệu ứng, nhạc, thoại hoặc camera move, phải hỏi: nó có đưa người xem gần hơn với sự thật không?"
    },
    {
      title: "Không thao túng",
      body: "Không dùng nhạc, voice, drama hoặc dựng cảnh để ép cảm xúc. Công cụ phải nâng nền, không ra lệnh."
    },
    {
      title: "Cảm trước, tính sau",
      body: "GLOW ưu tiên compassion, awareness, reflection và ethical consistency trước tối ưu máy móc."
    },
    {
      title: "Hạt mầm chuyển hóa",
      body: "Sau phim, người xem nên mềm lại, hiểu mình hơn, nhìn điều quen thuộc khác đi hoặc lặng vài giây."
    }
  ],
  storyChecks: [
    "Nhân vật có điểm yếu, mâu thuẫn hoặc lựa chọn thật.",
    "Thông điệp không bị nói thẳng như bài học.",
    "Kết thúc có ánh sáng nhỏ dù không bắt buộc happy ending.",
    "Không có drama cưỡng ép chỉ để tạo xúc động.",
    "Câu chuyện tạo khoảnh khắc dừng lại."
  ],
  audioChecks: [
    "Giọng kể là người chứng kiến, không diễn thay nỗi đau.",
    "Nhạc nâng nền, không nói thay cảm xúc.",
    "Có khoảng lặng đúng lúc, không sợ im lặng.",
    "Hiệu ứng âm thanh không lấn át sự thật.",
    "Nếu nghi ngờ, làm ít hơn."
  ]
};

const beatTemplates = [
  ["Hook", "Một hình ảnh/âm thanh mở đầu đặt câu hỏi cảm xúc cho khán giả."],
  ["Setup", "Giới thiệu nhân vật, thiếu thốn, ước muốn và biểu tượng trung tâm."],
  ["Pressure", "Xung đột làm nhân vật buộc phải đối diện nỗi sợ hoặc mặc cảm."],
  ["Silent Turn", "Một khoảnh khắc lặng khiến ý nghĩa thật sự của câu chuyện xuất hiện."],
  ["Choice", "Nhân vật hành động khác với bản thân ở đầu phim."],
  ["Payoff", "Biểu tượng quay lại với nghĩa mới và thông điệp được cảm bằng hình ảnh."]
];

function getWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function updateWordCount() {
  wordCount.textContent = `${getWords(storyInput.value).length} từ`;
}

function getSentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?。！？])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function inferCore(text) {
  const sentences = getSentences(text);
  const lower = text.toLowerCase();
  const symbol = lower.includes("áo")
    ? "Chiếc áo cũ"
    : lower.includes("sông")
      ? "Dòng sông"
      : lower.includes("đèn")
        ? "Ánh đèn"
        : "Một vật/chi tiết lặp lại trong truyện";

  const protagonistMatch = text.match(/(?:tên|là)\s+([A-ZÀ-Ỹ][\p{L}]*)/u);
  const protagonist = protagonistMatch ? protagonistMatch[1] : "Nhân vật chính";

  return {
    logline: sentences[0] || "Một câu chuyện cần được chuyển thể thành trải nghiệm điện ảnh.",
    theme: "Giá trị thật được tạo ra từ lựa chọn, lòng biết ơn và sự thay đổi bên trong.",
    protagonist,
    arc: `${protagonist} đi từ mặc cảm/thiếu tự tin sang can đảm thể hiện giá trị thật.`,
    symbol,
    emotionalSpine: ["Tò mò", "Thiếu thốn", "Áp lực", "Lặng", "Can đảm", "Ấm áp"]
  };
}

function classifySentence(sentence, index) {
  const lower = sentence.toLowerCase();
  if (index === 0 || lower.includes("ngày xưa") || lower.includes("nhiều năm")) {
    return ["GIỮ NARRATION", "Dùng làm cầu dẫn thời gian và bối cảnh."];
  }
  if (lower.includes("hiểu") || lower.includes("nhận ra") || lower.includes("giá trị")) {
    return ["CHUYỂN THÀNH SILENT MOMENT", "Thay triết lý bằng ánh mắt, đạo cụ và khoảng lặng."];
  }
  if (lower.includes("nói") || lower.includes("hỏi") || lower.includes("thưa")) {
    return ["CHUYỂN THÀNH ĐỐI THOẠI", "Giữ thông tin nhưng cho nhân vật tự bộc lộ."];
  }
  if (lower.includes("buồn") || lower.includes("run") || lower.includes("sợ") || lower.includes("mỉm cười")) {
    return ["CHUYỂN THÀNH REACTION SHOT", "Để cảm xúc hiện qua mặt, tay, nhịp thở."];
  }
  return ["CHUYỂN THÀNH HÌNH ẢNH", "Dựng thành hành động, môi trường, đạo cụ và blocking."];
}

function makeScenes(core, preset, minutes) {
  const seconds = minutes * 60;
  const sceneDuration = Math.max(18, Math.round(seconds / beatTemplates.length));
  return beatTemplates.map(([beat, purpose], index) => ({
    number: index + 1,
    beat,
    duration: `${sceneDuration}s`,
    title: `${beat}: ${core.symbol}`,
    purpose,
    action:
      index === 0
        ? `Mở bằng chi tiết ${core.symbol.toLowerCase()} trong không gian sống của ${core.protagonist}.`
        : index === 3
          ? `${core.protagonist} im lặng quan sát biểu tượng trung tâm, ý nghĩa chuyển từ vật chất sang tình cảm.`
          : `${core.protagonist} đối diện thử thách của beat "${beat}" bằng hành động cụ thể.`,
    emotion: core.emotionalSpine[index],
    camera: index % 2 === 0 ? "Close-up chậm, handheld rất nhẹ" : "Medium shot, dolly-in tinh tế",
    sound: index === 3 ? "Gần như im lặng, chỉ còn foley và hơi thở" : preset.music
  }));
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderStoryCore(core) {
  document.querySelector("#storyCore").classList.remove("empty");
  document.querySelector("#storyCore").innerHTML = `
    <p><strong>Logline:</strong> ${core.logline}</p>
    <p><strong>Theme:</strong> ${core.theme}</p>
    <p><strong>Character Arc:</strong> ${core.arc}</p>
    <div class="pill-list">
      <span class="pill">Nhân vật: ${core.protagonist}</span>
      <span class="pill">Symbol: ${core.symbol}</span>
      <span class="pill">Mode: Hybrid Emotional Cinema</span>
    </div>
  `;

  document.querySelector("#emotionArc").innerHTML = core.emotionalSpine
    .map((label, index) => `<div class="arc-bar" style="height:${64 + index * 18}px">${label}</div>`)
    .join("");

  document.querySelector("#symbolTracker").classList.remove("empty");
  document.querySelector("#symbolTracker").innerHTML = renderList([
    `Xuất hiện lần 1: ${core.symbol} như dấu hiệu thiếu thốn.`,
    `Xuất hiện lần 2: ${core.symbol} gắn với hy sinh hoặc ký ức.`,
    `Xuất hiện cuối: ${core.symbol} đổi nghĩa thành lòng biết ơn/can đảm.`
  ]);
}

function renderGlowDna(text, core) {
  document.querySelector("#glowPrinciples").innerHTML = glowDna.principles
    .map(
      (principle) => `
        <div class="dna-card">
          <strong>${principle.title}</strong>
          <p>${principle.body}</p>
        </div>
      `
    )
    .join("");

  const lower = text.toLowerCase();
  const storySignals = [
    lower.includes("nhận ra") || lower.includes("hiểu") || lower.includes("lặng"),
    lower.includes("mẹ") || lower.includes("cha") || lower.includes("bạn") || lower.includes("người"),
    lower.includes("sợ") || lower.includes("buồn") || lower.includes("run") || lower.includes("mỉm cười"),
    !lower.includes("bài học là") && !lower.includes("chúng ta phải"),
    lower.includes(core.symbol.toLowerCase().split(" ")[0])
  ];

  const audioSignals = [
    true,
    !lower.includes("cao trào dữ dội"),
    lower.includes("lặng") || lower.includes("im lặng") || lower.includes("cúi đầu"),
    true,
    true
  ];

  document.querySelector("#witStoryCheck").classList.remove("empty");
  document.querySelector("#witStoryCheck").innerHTML = glowDna.storyChecks
    .map((check, index) => {
      const level = storySignals[index] ? "ok" : "warn";
      return `<div class="check-item ${level}"><strong>${storySignals[index] ? "Đạt" : "Cần gia cố"}</strong><p>${check}</p></div>`;
    })
    .join("");

  document.querySelector("#witAudioCheck").classList.remove("empty");
  document.querySelector("#witAudioCheck").innerHTML = glowDna.audioChecks
    .map((check, index) => {
      const level = audioSignals[index] ? "ok" : "warn";
      return `<div class="check-item ${level}"><strong>${audioSignals[index] ? "Giữ" : "Xem lại"}</strong><p>${check}</p></div>`;
    })
    .join("");

  document.querySelector("#glowAlignment").classList.remove("empty");
  document.querySelector("#glowAlignment").innerHTML = renderList([
    `Linh hồn cần giữ: ${core.theme}`,
    `Biểu tượng chuyển hóa: ${core.symbol}`,
    "Mọi prompt phải ưu tiên sự thật cảm xúc trước kỹ thuật đẹp.",
    "Không thêm nhạc, thoại, hiệu ứng hoặc twist nếu chúng làm người xem bị dẫn dắt thay vì tự chạm.",
    "QA cuối cùng phải hỏi: phim này có gieo một hạt mầm chuyển hóa không?"
  ]);
}

function renderAdaptation(text, preset) {
  const sentences = getSentences(text).slice(0, 8);
  const plan = sentences.map((sentence, index) => {
    const [type, note] = classifySentence(sentence, index);
    return `<div class="prompt-item"><strong>${type}</strong><p>${sentence}</p><p>${note}</p></div>`;
  });
  document.querySelector("#narrationPlan").classList.remove("empty");
  document.querySelector("#narrationPlan").innerHTML = plan.join("");

  document.querySelector("#mediumMap").classList.remove("empty");
  document.querySelector("#mediumMap").innerHTML = renderList([
    "Chữ miêu tả nội tâm -> ánh mắt, hơi thở, khoảng dừng.",
    "Chữ miêu tả hoàn cảnh -> bối cảnh, đạo cụ, trang phục.",
    "Triết lý cuối truyện -> visual callback thay vì giảng giải.",
    "Cao trào audio -> hành động có lựa chọn rõ trên màn hình."
  ]);

  document.querySelector("#genrePreset").classList.remove("empty");
  document.querySelector("#genrePreset").innerHTML = `
    <p><strong>${preset.title}</strong></p>
    <p>${preset.adaptation}</p>
    <p><strong>Tỷ lệ kể:</strong> ${preset.narration}</p>
  `;
}

function renderVisualBible(core, preset) {
  const cards = [
    ["Character Bible", `${core.protagonist}: diện mạo ổn định, trang phục có một chi tiết nhận diện, cảm xúc tiến từ khép kín sang mở sáng.`],
    ["Prop Bible", `${core.symbol}: giữ hình dáng, chất liệu, màu chủ đạo và vị trí xuất hiện có chủ đích.`],
    ["World Bible", "Không gian được kể bằng dấu vết sinh hoạt, ánh sáng, đồ vật và texture thay vì lời giải thích."],
    ["Camera Bible", "Ưu tiên close-up cảm xúc, reaction shot, match cut và camera motion có lý do cảm xúc."],
    ["Lighting Bible", "Ánh sáng phản ánh arc: đầu phim hẹp và thấp, cuối phim rộng và ấm hơn."],
    ["Sound Bible", preset.music]
  ];

  document.querySelector("#visualBible").innerHTML = cards
    .map(
      ([title, body]) => `
        <div class="bible-card">
          <strong>${title}</strong>
          <p>${body}</p>
          <div class="color-row">
            ${preset.palette.map((color) => `<span class="swatch" style="background:${color}"></span>`).join("")}
          </div>
          <p><em>${preset.style}</em></p>
        </div>
      `
    )
    .join("");
}

function renderStoryboard(scenes) {
  document.querySelector("#sceneCount").textContent = `${scenes.length} scene`;
  const list = document.querySelector("#storyboardList");
  list.classList.remove("empty");
  list.innerHTML = scenes
    .map(
      (scene) => `
        <div class="scene-card">
          <div class="scene-num">Scene ${scene.number}<br>${scene.duration}</div>
          <div>
            <h4>${scene.title}</h4>
            <p>${scene.purpose}</p>
            <p><strong>Action:</strong> ${scene.action}</p>
          </div>
          <div class="scene-meta">
            <span><strong>Emotion:</strong> ${scene.emotion}</span>
            <span><strong>Camera:</strong> ${scene.camera}</span>
            <span><strong>Sound:</strong> ${scene.sound}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderPrompts(scenes, core, preset) {
  document.querySelector("#imagePrompts").classList.remove("empty");
  document.querySelector("#motionPrompts").classList.remove("empty");

  document.querySelector("#imagePrompts").innerHTML = scenes
    .slice(0, 4)
    .map(
      (scene) => `
        <div class="prompt-item">
          <strong>Keyframe ${scene.number}</strong>
          <p>${scene.action} ${preset.style}. Subject: ${core.protagonist}. Prop continuity: ${core.symbol}. Lighting follows emotion "${scene.emotion}".</p>
        </div>
      `
    )
    .join("");

  document.querySelector("#motionPrompts").innerHTML = scenes
    .slice(0, 4)
    .map(
      (scene) => `
        <div class="prompt-item">
          <strong>Clip ${scene.number}A</strong>
          <p>8-second cinematic shot. Character motion: subtle purposeful movement. Secondary motion: fabric, hands, breath. Environment motion: natural ambience. Camera: ${scene.camera}. Emotional change: move toward "${scene.emotion}". Sound: ${scene.sound}.</p>
        </div>
      `
    )
    .join("");
}

function renderQa(core, preset, target) {
  const checks = [
    ["ok", "Character consistency", `Giữ ${core.protagonist} bằng character bible và reference prompt cố định.`],
    ["ok", "Prop consistency", `${core.symbol} cần cùng chất liệu, màu, trạng thái qua toàn phim.`],
    ["warn", "Narration risk", `${preset.narration}. Nếu video còn giống audiobook, tăng reaction shot và silent moment.`],
    ["warn", "Audience fit", `Target "${target}" cần kiểm lại nhịp dựng, độ rõ thông điệp và mức phức tạp hình ảnh.`],
    ["risk", "Model drift", "Mỗi clip AI video nên có first frame/last frame hoặc image reference để giảm trôi continuity."]
  ];

  document.querySelector("#continuityList").classList.remove("empty");
  document.querySelector("#continuityList").innerHTML = checks
    .map(
      ([level, title, body]) => `
        <div class="check-item ${level}">
          <strong>${title}</strong>
          <p>${body}</p>
        </div>
      `
    )
    .join("");

  document.querySelector("#criticNotes").classList.remove("empty");
  document.querySelector("#criticNotes").innerHTML = renderList([
    "Tăng sức quốc tế bằng cảm xúc phổ quát: mất mát, hy vọng, can đảm, biết ơn.",
    "Giảm lời giải thích ở cao trào; để hình ảnh tạo payoff.",
    "Mỗi scene cần một thay đổi cảm xúc cụ thể, không chỉ minh họa nội dung.",
    "Kết thúc nên có visual callback rõ với biểu tượng trung tâm."
  ]);
}

function updateScores(text, minutes) {
  const words = getWords(text).length;
  const density = Math.min(20, Math.round(words / 20));
  document.querySelector("#cinemaScore").textContent = Math.min(96, 72 + density);
  document.querySelector("#continuityScore").textContent = Math.min(94, 78 + Math.round(minutes * 1.5));
  document.querySelector("#narrationScore").textContent = Math.max(68, 92 - Math.round(words / 80));
}

function generatePackage() {
  const text = storyInput.value.trim() || sampleStory;
  if (!storyInput.value.trim()) {
    storyInput.value = sampleStory;
    updateWordCount();
  }

  const preset = genrePresets[genreSelect.value];
  const core = inferCore(text);
  const scenes = makeScenes(core, preset, Number(lengthRange.value));

  renderStoryCore(core);
  renderGlowDna(text, core);
  renderAdaptation(text, preset);
  renderVisualBible(core, preset);
  renderStoryboard(scenes);
  renderPrompts(scenes, core, preset);
  renderQa(core, preset, targetSelect.options[targetSelect.selectedIndex].text);
  updateScores(text, Number(lengthRange.value));
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

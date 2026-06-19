# AI Storytelling Studio

Web app hỗ trợ chuyển thể script truyện đọc hoặc transcript audio thành một film adaptation package có định hướng viral, cinematic và GLOW DNA:

- Story Core
- Creative War Room
- Agent Council
- Viral Hook Lab
- Million-View Script Draft
- Retention Curve
- Narration Surgery
- Visual Bible
- Master Storyboard
- Image Prompts
- Motion Prompts
- Continuity QA
- GLOW DNA Guardrails

## Chạy app

Mở `index.html` trực tiếp bằng trình duyệt.

## Chạy với AI thật

Bản HTML mở trực tiếp chỉ chạy rule engine fallback. Muốn các agent gọi model thật:

```powershell
cd "E:\Video Narrator"
$env:OPENAI_API_KEY="sk-..."
node server.js
```

Sau đó mở:

```text
http://127.0.0.1:4173
```

Backend dùng OpenAI Responses API qua `server.js`, giữ API key ở máy local thay vì đưa key vào trình duyệt.

## Triết lý

App này không chỉ minh họa từng câu chuyện bằng hình ảnh. Nó giữ phần lõi của truyện, dịch trải nghiệm từ chữ sang tai và mắt, rồi nâng cấp thành ngôn ngữ điện ảnh có hook, retention, share trigger và kiểm định GLOW.

## DNA GLOW

Thư mục `glow-dna-source/` chỉ dùng làm nguồn tham khảo cục bộ và được bỏ qua bởi Git. App chỉ tích hợp bản chưng cất thành guardrails để giữ tinh thần GLOW/WIT:

- sự thật con người
- không dạy đời, không thao túng
- đơn giản, rõ ràng, dễ cảm
- im lặng là nơi chuyển hóa
- cảm trước, tính sau
- gieo một hạt mầm chuyển hóa sau khi xem/nghe

App cũng chưng cất thêm từ bộ GLOW Codex Markdown:

- Four-Plane Cognitive Model: Essence, Cognitive, Operational, Expansion
- Reflective Intelligence Cycle: Observe, Understand, Reflect, Create, Evolve
- Five Flames: Truth, Empathy, Integrity, Growth, Awareness
- Persona Continuity: giữ identity core, thích ứng mà không lệch hướng
- Cultural Lens: mở rộng toàn cầu bằng thấu hiểu, không đồng nhất hóa

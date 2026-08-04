const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // API Routes
    if (req.url === '/api/generate' && req.method === 'POST') {
        handleGenerate(req, res);
        return;
    }
    
    if (req.url === '/api/test' && req.method === 'POST') {
        handleTest(req, res);
        return;
    }
    
    // Static files - serve from root directory
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

async function handleGenerate(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const { prompt, type, apiKey, jsonData } = data;
            
            if (!prompt) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Thiếu prompt' }));
                return;
            }
            
            // Here you would call your AI API
            // For now, return a mock response
            const story = `Đây là câu chuyện mẫu dựa trên ý tưởng: "${prompt}".\n\nTrong tương lai, AI sẽ giúp bạn viết nên những câu chuyện tuyệt vời hơn nữa. Hãy cấu hình API Key hoặc file JSON để bắt đầu sử dụng tính năng này.`;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, story }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

async function handleTest(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const { type, apiKey, jsonData } = data;
            
            // Test connection logic
            let success = false;
            let error = '';
            
            if (type === 'apikey' && apiKey) {
                // Validate API key format
                if (apiKey.length > 10) {
                    success = true;
                } else {
                    error = 'API Key không hợp lệ';
                }
            } else if (type === 'json' && jsonData) {
                // Validate JSON structure
                if (jsonData.client_email || jsonData.project_id) {
                    success = true;
                } else {
                    error = 'File JSON không chứa thông tin xác thực hợp lệ';
                }
            } else {
                error = 'Chưa cấu hình API Key hoặc file JSON';
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success, error }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

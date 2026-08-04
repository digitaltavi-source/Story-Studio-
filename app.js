// DOM Elements
const storyInput = document.getElementById('storyInput');
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');
const outputContent = document.getElementById('outputContent');
const wordCountEl = document.getElementById('wordCount');

// Settings Modal Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const apiKeyInput = document.getElementById('apiKeyInput');
const jsonFileInput = document.getElementById('jsonFileInput');
const testConnectionBtn = document.getElementById('testConnectionBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const connectionStatus = document.getElementById('connectionStatus');

// State
let currentConfig = {
    type: 'apikey', // 'apikey' or 'json'
    apiKey: '',
    jsonData: null
};

// Load saved config from localStorage
function loadConfig() {
    const saved = localStorage.getItem('aiConfig');
    if (saved) {
        try {
            currentConfig = JSON.parse(saved);
            if (currentConfig.type === 'apikey' && currentConfig.apiKey) {
                apiKeyInput.value = currentConfig.apiKey;
            }
            updateConnectionStatus(true);
        } catch (e) {
            console.error('Error loading config:', e);
        }
    }
}

// Save config to localStorage
function saveConfig() {
    localStorage.setItem('aiConfig', JSON.stringify(currentConfig));
}

// Update word count
function updateWordCount() {
    const text = storyInput.value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    wordCountEl.textContent = count;
}

// Show/Hide Modal
function openModal() {
    settingsModal.classList.remove('hidden');
}

function closeModal() {
    settingsModal.classList.add('hidden');
}

// Tab switching
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
    currentConfig.type = tabName;
}

// Update connection status UI
function updateConnectionStatus(connected, error = false) {
    connectionStatus.classList.remove('connected', 'error');
    const statusText = connectionStatus.querySelector('.status-text');
    
    if (connected) {
        connectionStatus.classList.add('connected');
        statusText.textContent = 'Đã kết nối';
    } else if (error) {
        connectionStatus.classList.add('error');
        statusText.textContent = 'Kết nối thất bại';
    } else {
        statusText.textContent = 'Chưa kết nối';
    }
}

// Test connection
async function testConnection() {
    const configToSend = currentConfig.type === 'apikey' 
        ? { type: 'apikey', apiKey: apiKeyInput.value }
        : { type: 'json', jsonData: currentConfig.jsonData };
    
    if (currentConfig.type === 'apikey' && !apiKeyInput.value) {
        alert('Vui lòng nhập API Key');
        return;
    }
    
    testConnectionBtn.disabled = true;
    testConnectionBtn.textContent = 'Đang kiểm tra...';
    
    try {
        const response = await fetch('/api/test-connection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configToSend)
        });
        
        const result = await response.json();
        
        if (result.success) {
            updateConnectionStatus(true);
            alert('Kết nối thành công!');
        } else {
            updateConnectionStatus(false, true);
            alert('Kết nối thất bại: ' + (result.error || 'Lỗi không xác định'));
        }
    } catch (error) {
        updateConnectionStatus(false, true);
        alert('Lỗi kết nối: ' + error.message);
    } finally {
        testConnectionBtn.disabled = false;
        testConnectionBtn.textContent = 'Kiểm tra kết nối';
    }
}

// Save settings
function handleSaveSettings() {
    if (currentConfig.type === 'apikey') {
        const key = apiKeyInput.value.trim();
        if (!key) {
            alert('Vui lòng nhập API Key');
            return;
        }
        currentConfig.apiKey = key;
        currentConfig.jsonData = null;
    } else {
        if (!currentConfig.jsonData) {
            alert('Vui lòng tải lên file JSON');
            return;
        }
        currentConfig.apiKey = '';
    }
    
    saveConfig();
    updateConnectionStatus(true);
    closeModal();
    alert('Đã lưu cấu hình!');
}

// Generate story
async function generateStory() {
    const prompt = storyInput.value.trim();
    if (!prompt) {
        alert('Vui lòng nhập ý tưởng câu chuyện');
        return;
    }
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Đang tạo...';
    resultArea.classList.add('hidden');
    
    try {
        const configToSend = currentConfig.type === 'apikey'
            ? { type: 'apikey', apiKey: currentConfig.apiKey }
            : { type: 'json', jsonData: currentConfig.jsonData };
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, config: configToSend })
        });
        
        const result = await response.json();
        
        if (result.success) {
            outputContent.innerHTML = result.story.replace(/\n/g, '<br>');
            resultArea.classList.remove('hidden');
            // Scroll to result
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            alert('Lỗi: ' + (result.error || 'Không thể tạo câu chuyện'));
        }
    } catch (error) {
        alert('Lỗi kết nối: ' + error.message);
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Tạo câu chuyện';
    }
}

// Event Listeners
storyInput.addEventListener('input', updateWordCount);
generateBtn.addEventListener('click', generateStory);

settingsBtn.addEventListener('click', openModal);
closeSettings.addEventListener('click', closeModal);
settingsModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

jsonFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                currentConfig.jsonData = JSON.parse(event.target.result);
                alert('Đã tải file JSON thành công!');
            } catch (error) {
                alert('File JSON không hợp lệ');
            }
        };
        reader.readAsText(file);
    }
});

testConnectionBtn.addEventListener('click', testConnection);
saveSettingsBtn.addEventListener('click', handleSaveSettings);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Initialize
loadConfig();
updateWordCount();

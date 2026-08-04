// DOM Elements
const storyInput = document.getElementById('storyInput');
const generateBtn = document.getElementById('generateBtn');
const resultContainer = document.getElementById('resultContainer');
const storyOutput = document.getElementById('storyOutput');
const wordCountEl = document.getElementById('wordCount');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const apiKeyInput = document.getElementById('apiKeyInput');
const jsonFileInput = document.getElementById('jsonFileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const testConnectionBtn = document.getElementById('testConnectionBtn');
const connectionStatus = document.getElementById('connectionStatus');
const tabBtns = document.querySelectorAll('.tab-btn');
const apikeyTab = document.getElementById('apikeyTab');
const jsonTab = document.getElementById('jsonTab');

// State
let currentConfig = {
    type: 'apikey', // 'apikey' or 'json'
    apiKey: '',
    jsonData: null,
    jsonFileName: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateWordCount();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Story input
    storyInput.addEventListener('input', updateWordCount);
    
    // Generate button
    generateBtn.addEventListener('click', generateStory);
    
    // Settings modal
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });
    
    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // JSON file input
    jsonFileInput.addEventListener('change', handleJsonFile);
    
    // Save settings
    saveSettings.addEventListener('click', saveCurrentSettings);
    
    // Test connection
    testConnectionBtn.addEventListener('click', testConnection);
}

// Word Count
function updateWordCount() {
    const text = storyInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCountEl.textContent = words;
}

// Settings Modal
function openSettings() {
    settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

function switchTab(tab) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    apikeyTab.classList.toggle('active', tab === 'apikey');
    jsonTab.classList.toggle('active', tab === 'json');
    
    currentConfig.type = tab;
}

function handleJsonFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target.result);
            currentConfig.jsonData = json;
            currentConfig.jsonFileName = file.name;
            fileNameDisplay.textContent = `✓ Đã tải: ${file.name}`;
            fileNameDisplay.style.color = 'var(--success-color)';
        } catch (err) {
            fileNameDisplay.textContent = '✗ File JSON không hợp lệ';
            fileNameDisplay.style.color = 'var(--error-color)';
            currentConfig.jsonData = null;
        }
    };
    reader.readAsText(file);
}

function loadSettings() {
    const saved = localStorage.getItem('aiStoryConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            currentConfig = { ...currentConfig, ...config };
            
            if (currentConfig.apiKey) {
                apiKeyInput.value = currentConfig.apiKey;
            }
            
            if (currentConfig.jsonFileName) {
                fileNameDisplay.textContent = `✓ Đã tải: ${currentConfig.jsonFileName}`;
                fileNameDisplay.style.color = 'var(--success-color)';
            }
            
            updateConnectionStatus(currentConfig.apiKey || currentConfig.jsonData ? true : false);
        } catch (err) {
            console.error('Error loading settings:', err);
        }
    }
}

function saveCurrentSettings() {
    if (currentConfig.type === 'apikey') {
        currentConfig.apiKey = apiKeyInput.value.trim();
        currentConfig.jsonData = null;
        currentConfig.jsonFileName = '';
    } else {
        // JSON mode - keep existing jsonData
        if (!currentConfig.jsonData) {
            alert('Vui lòng tải lên file JSON trước khi lưu');
            return;
        }
        currentConfig.apiKey = '';
    }
    
    localStorage.setItem('aiStoryConfig', JSON.stringify(currentConfig));
    updateConnectionStatus(currentConfig.apiKey || currentConfig.jsonData ? true : false);
    closeSettingsModal();
    alert('Đã lưu cấu hình thành công!');
}

function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.textContent = 'Đã kết nối';
        connectionStatus.className = 'status-badge connected';
    } else {
        connectionStatus.textContent = 'Chưa kết nối';
        connectionStatus.className = 'status-badge disconnected';
    }
}

async function testConnection() {
    const hasConfig = currentConfig.apiKey || currentConfig.jsonData;
    
    if (!hasConfig) {
        alert('Vui lòng nhập API Key hoặc tải lên file JSON trước');
        return;
    }
    
    testConnectionBtn.disabled = true;
    testConnectionBtn.textContent = 'Đang kiểm tra...';
    
    try {
        const response = await fetch('/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: currentConfig.type,
                apiKey: currentConfig.apiKey,
                jsonData: currentConfig.jsonData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            updateConnectionStatus(true);
            alert('Kết nối thành công!');
        } else {
            updateConnectionStatus(false);
            alert('Kết nối thất bại: ' + (result.error || 'Lỗi không xác định'));
        }
    } catch (err) {
        updateConnectionStatus(false);
        alert('Không thể kết nối server: ' + err.message);
    } finally {
        testConnectionBtn.disabled = false;
        testConnectionBtn.textContent = 'Kiểm tra kết nối';
    }
}

// Generate Story
async function generateStory() {
    const prompt = storyInput.value.trim();
    
    if (!prompt) {
        alert('Vui lòng nhập ý tưởng câu chuyện');
        return;
    }
    
    const hasConfig = currentConfig.apiKey || currentConfig.jsonData;
    if (!hasConfig) {
        alert('Vui lòng cấu hình API Key hoặc file JSON trong Cài đặt trước khi sử dụng');
        openSettings();
        return;
    }
    
    // UI Loading state
    const btnText = generateBtn.querySelector('span');
    const spinner = generateBtn.querySelector('.spinner');
    btnText.textContent = 'Đang tạo...';
    spinner.classList.remove('hidden');
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                type: currentConfig.type,
                apiKey: currentConfig.apiKey,
                jsonData: currentConfig.jsonData
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            storyOutput.textContent = data.story;
            resultContainer.classList.remove('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Lỗi: ' + (data.error || 'Không thể tạo câu chuyện'));
        }
    } catch (err) {
        alert('Lỗi kết nối: ' + err.message);
    } finally {
        btnText.textContent = 'Tạo câu chuyện';
        spinner.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

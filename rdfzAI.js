fetchAvailableModels()
let messages = [];
let displayMessages = []; // 用于显示的完整消息历史
let currentController = null;
const md = window.markdownit({
    breaks: true,  // 启用换行符转换
    linkify: true, // 将URL转换为链接
    typographer: true, // 启用一些语言中性的替换和引号美化
    html: true     // 允许HTML标签
}).use(texmath, {
    engine: katex,
    delimiters: ['dollars', 'brackets'],  // 支持 $...$ 和 \[...\] 格式
    katexOptions: {
        macros: {'\\RR': '\\mathbb{R}'},
        throwOnError: false,  // 不要因为解析错误而中断渲染
        displayMode: true     // 默认使用显示模式
    }
});

// 更新temperature显示值
document.getElementById('temperature').addEventListener('input', function (e) {
    document.getElementById('temperatureValue').textContent = e.target.value;
});

// 更新contextCount显示值和消息数组
document.getElementById('contextCount').addEventListener('input', function (e) {
    document.getElementById('contextCountValue').textContent = e.target.value;
    updateContextCount();
});

// 更新上下文携带数目
function updateContextCount() {
    const contextCount = parseInt(document.getElementById('contextCount').value);
    const chatContainer = document.getElementById('chatContainer');

    // 更新AI使用的消息数组
    if (displayMessages.length > contextCount) {
        messages = displayMessages.slice(-contextCount);
    } else {
        messages = [...displayMessages];
    }

    // 更新聊天界面（显示所有历史消息）
    chatContainer.innerHTML = '';
    displayMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.role}-message`;
        if (msg.role === 'assistant') {
            messageDiv.classList.add('markdown-body');
            messageDiv.innerHTML = md.render(msg.content);
        } else {
            messageDiv.textContent = msg.content;
        }
        chatContainer.appendChild(messageDiv);
    });
}

// 高级设置的折叠/展开功能
function toggleAdvancedSettings() {
    const advancedSettings = document.getElementById('advancedSettings');
    const toggleButton = document.querySelector('.advanced-toggle');
    advancedSettings.classList.toggle('show');
    toggleButton.textContent = advancedSettings.classList.contains('show') ? '高级设置 ▲' : '高级设置 ▼';
}

// 获取可用模型列表
async function fetchAvailableModels() {
    const apiKey = document.getElementById('apiKey').value || 'sk-ChCzqxK2bcjznVVg3e571b93Dd9d4bE798631a7bB4770fFf';
    if (!apiKey) return;

    const baseUrl = document.getElementById('baseUrl').value || 'https://one.aiskt.com/v1';
    const modelSelect = document.getElementById('model');

    try {
        const response = await fetch(`${baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // 清空现有选项
            modelSelect.innerHTML = '';
            // 添加新的模型选项
            data.data.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.id;
                if (model.id === 'gpt-4o-mini') {
                    option.selected = true;
                }
                modelSelect.appendChild(option);
            });
        } else {
            console.error('获取模型列表失败');
        }
    } catch (error) {
        console.error('获取模型列表出错:', error);
    }
}

function stopOutput() {
    if (currentController) {
        currentController.abort();
        currentController = null;
        document.getElementById('stopButton').style.display = 'none';
        document.getElementById('sendButton').style.display = 'block';
    }
}

function estimateTokens(text) {
    // 简单估算：中文字符按2个token计算，英文单词按1个token计算
    const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishCount = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseCount * 2 + englishCount;
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatContainer = document.getElementById('chatContainer');
    const model = document.getElementById('model').value;
    const apiKey = document.getElementById('apiKey').value || 'sk-ChCzqxK2bcjznVVg3e571b93Dd9d4bE798631a7bB4770fFf';
    const baseUrl = document.getElementById('baseUrl').value;
    const systemPrompt = document.getElementById('systemPrompt').value;
    const maxTokens = parseInt(document.getElementById('maxTokens').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const contextCount = parseInt(document.getElementById('contextCount').value);

    if (!userInput.value.trim()) return;
    if (!apiKey) {
        alert('请输入API Key');
        return;
    }

    // 检查单次输入的token数
    const inputTokens = estimateTokens(userInput.value);
    if (inputTokens > 2000) {
        alert('单次输入超过2000 tokens限制，请减少输入内容');
        return;
    }

    // 更新上下文携带数目
    updateContextCount();

    // 检查token数限制
    let totalTokens = messages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0) + inputTokens;
    if (totalTokens > 10000) {
        while (totalTokens > 10000 && messages.length > 0) {
            const removedMsg = messages.shift();
            totalTokens -= estimateTokens(removedMsg.content);
        }
    }

    // 添加用户消息到界面
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = userInput.value;

    chatContainer.appendChild(userMessage);

    // 构建消息对象
    let messageContent = {
        role: 'user',
        content: userInput.value
    };

    // 添加到显示消息数组
    displayMessages.push(messageContent);

    // 更新AI使用的消息数组
    if (displayMessages.length > contextCount) {
        messages = displayMessages.slice(-contextCount);
    } else {
        messages = [...displayMessages];
    }

    sendRequest(messageContent);

    // 清空输入
    userInput.value = '';
    //滚动到页面底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendRequest(messageContent) {
    // 如果是第一条消息，添加system prompt
    if (messages.length === 0 && document.getElementById('systemPrompt').value) {
        messages.push({
            role: 'system',
            content: document.getElementById('systemPrompt').value
        });
    }

    const model = document.getElementById('model').value;
    const apiKey = document.getElementById('apiKey').value || 'sk-ChCzqxK2bcjznVVg3e571b93Dd9d4bE798631a7bB4770fFf';
    const baseUrl = document.getElementById('baseUrl').value || 'https://one.aiskt.com/v1';
    const maxTokens = parseInt(document.getElementById('maxTokens').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const streamOutput = document.getElementById('streamOutput').checked;

    const endpoint = `${baseUrl}/chat/completions`;

    // 创建AI消息元素
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message markdown-body';
    chatContainer.appendChild(aiMessage);

    if (streamOutput) {
        // 显示停止按钮，隐藏发送按钮
        document.getElementById('stopButton').style.display = 'block';
        document.getElementById('sendButton').style.display = 'none';

        // 创建新的 AbortController
        currentController = new AbortController();
        const signal = currentController.signal;

        // 流式输出
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: maxTokens,
                temperature: temperature,
                stream: true
            }),
            signal: signal
        }).then(response => {
            const reader = response.body.getReader();
            let accumulatedResponse = '';

            function readStream() {
                return reader.read().then(({done, value}) => {
                    if (done) {
                        displayMessages.push({
                            role: 'assistant',
                            content: accumulatedResponse
                        });
                        // 更新上下文携带数目
                        updateContextCount();
                        // 恢复按钮状态
                        document.getElementById('stopButton').style.display = 'none';
                        document.getElementById('sendButton').style.display = 'block';
                        return;
                    }

                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n');

                    lines.forEach(line => {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.substring(6));
                                if (data.choices[0].delta.content) {
                                    accumulatedResponse += data.choices[0].delta.content;
                                    aiMessage.innerHTML = md.render(accumulatedResponse);

                                    // 处理代码块的显示
                                    aiMessage.querySelectorAll('pre code').forEach(block => {
                                        block.style.display = 'block';
                                        block.style.whiteSpace = 'pre';
                                    });

                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                }
                            } catch (e) {
                                console.error('Error parsing stream:', e);
                            }
                        }
                    });

                    return readStream();
                });
            }

            return readStream();
        }).catch(error => {
            if (error.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error('Error:', error);
                alert('发送消息失败，请检查您的设置和网络连接');
            }
            // 恢复按钮状态
            document.getElementById('stopButton').style.display = 'none';
            document.getElementById('sendButton').style.display = 'block';
        });
    } else {
        // 非流式输出
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: maxTokens,
                temperature: temperature
            })
        })
            .then(response => response.json())
            .then(data => {
                const aiResponse = data.choices[0].message.content;

                // 处理换行并使用markdown-it渲染内容
                const formattedResponse = aiResponse.replace(/\n/g, '  \n'); // 确保Markdown换行正确
                aiMessage.innerHTML = md.render(formattedResponse);

                // 处理代码块的显示
                aiMessage.querySelectorAll('pre code').forEach(block => {
                    block.style.display = 'block';
                    block.style.whiteSpace = 'pre';
                });

                // 添加AI回复到显示消息数组
                displayMessages.push({
                    role: 'assistant',
                    content: aiResponse
                });

                // 更新上下文携带数目
                updateContextCount();

                // 滚动到底部
                chatContainer.scrollTop = chatContainer.scrollHeight;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('发送消息失败，请检查您的设置和网络连接');
            });
    }
}

// 添加回车发送功能
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 保存聊天记录功能
function saveChat() {
    if (displayMessages.length === 0) {
        alert('没有聊天记录可供保存');
        return;
    }

    const chatContent = displayMessages.map(msg => {
        return `${msg.role}: ${msg.content}`;
    }).join('\n\n');

    const blob = new Blob([chatContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `聊天记录_${new Date().toLocaleString().replace(/[\/\s:]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggleSidebar() {
    const sidebar = document.getElementById('settingSidebar');
    if (sidebar.style.display === 'none'){
        sidebar.style.display = "block";
    }else{
        sidebar.style.display = "none";
    }

}

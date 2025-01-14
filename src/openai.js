
function createOpenAIClient(apiKey, baseURL = "https://api.aiskt.com/v1") {
    return new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL
    });
}

// 发送聊天请求
async function sendChatRequest({
    apiKey,
    baseURL,
    model = "gpt-4o-mini",
    systemPrompt = "You are a helpful assistant.",
    userMessage,
    maxTokens = 2000,
    temperature = 0.7,
    stream = false
}) {
    try {
        const openai = createOpenAIClient(apiKey, baseURL);
        
        const messages = [];
        if(systemPrompt) {
            messages.push({ role: "system", content: systemPrompt });
        }
        messages.push({ role: "user", content: userMessage });

        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
            max_tokens: maxTokens,
            temperature: temperature,
            stream: stream
        });

        if(stream) {
            return completion;
        } else {
            return completion.choices[0].message;
        }
        
    } catch(error) {
        console.error("OpenAI API 请求失败:", error);
        throw error;
    }
}

export { createOpenAIClient, sendChatRequest };
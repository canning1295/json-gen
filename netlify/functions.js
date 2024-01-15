const fetch = require("node-fetch"); // Ensure node-fetch is available

exports.handler = async (event) => {
    const apiKey = process.env.gpt_key; // Access the API key from the environment variable
    const url = 'https://api.openai.com/v1/chat/completions';

    // Parse the incoming request to get the prompt
    const payload = JSON.parse(event.body);
    const prompt = payload.prompt;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 4096
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        const data = await response.json();
        console.log('response from ChatGPT:', data);

        // Return the response data as JSON
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error occurred while processing your request' })
        };
    }
};

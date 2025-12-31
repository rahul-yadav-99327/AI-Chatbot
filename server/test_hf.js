require('dotenv').config();
const OpenAI = require('openai');

async function testHF() {
    console.log("Testing Hugging Face API...");
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    console.log("API Key found:", apiKey ? apiKey.substring(0, 5) + "..." : "No");

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://router.huggingface.co/v1"
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say hello!" }],
            model: "google/gemma-2-9b-it",
            max_tokens: 50
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

testHF();

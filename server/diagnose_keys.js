require('dotenv').config();
const OpenAI = require('openai');

async function diagnose() {
    console.log("--- DIAGNOSTIC START ---");

    // 1. Check OpenAI
    console.log("\n1. Checking OpenAI...");
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
        console.error("❌ OpenAI Key NOT found in process.env");
    } else {
        console.log("✅ OpenAI Key found (starts with: " + openAIKey.substring(0, 7) + "...)");
        try {
            const openai = new OpenAI({ apiKey: openAIKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: "ping" }],
                model: "gpt-3.5-turbo",
            });
            console.log("✅ OpenAI Request Successful: " + completion.choices[0].message.content);
        } catch (error) {
            console.error("❌ OpenAI Request Failed: " + error.message);
        }
    }

    // 2. Check Hugging Face
    console.log("\n2. Checking Hugging Face...");
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) {
        console.error("❌ HUGGINGFACE_API_KEY NOT found in process.env");
    } else {
        console.log("✅ HF Key found (starts with: " + hfKey.substring(0, 4) + "...)");
        try {
            const hf = new OpenAI({
                apiKey: hfKey,
                baseURL: "https://router.huggingface.co/v1"
            });
            const completion = await hf.chat.completions.create({
                messages: [{ role: "user", content: "ping" }],
                model: "google/gemma-2-9b-it",
                max_tokens: 20
            });
            console.log("✅ Hugging Face Request Successful: " + completion.choices[0].message.content);
        } catch (error) {
            console.error("❌ Hugging Face Request Failed: " + error.message);
        }
    }
    console.log("\n--- DIAGNOSTIC END ---");
}

diagnose();

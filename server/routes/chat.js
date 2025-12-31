const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Article = require('../models/Article');
const Analytics = require('../models/Analytics');
const OpenAI = require('openai');


const apiKey = (process.env.OPENAI_API_KEY || '').trim();
const openai = new OpenAI({
    apiKey: apiKey,
});
console.log("Chat Route Loaded. API Key starts with:", apiKey.substring(0, 10) + "...");

const memoryStore = require('../memoryStore');

// In-memory fallback
const localConversations = {};

router.post('/', async (req, res) => {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ message: 'Session ID and message are required' });
    }

    console.log(`[Chat] Received message: "${message}" (Session: ${sessionId})`);

    try {
        let conversation;
        let context = "";
        let contextFound = false;

        // Shared variable for found articles
        let foundArticles = [];

        // Try to access DB, but fallback if it fails or timeouts
        try {
            console.log("[Chat] Checking DB connection...");
            // Check if mongoose is connected (readyState 1 = connected)
            if (mongoose.connection.readyState === 1) {
                console.log("[Chat] DB Connected. Fetching context...");
                conversation = await Conversation.findOne({ sessionId });
                if (!conversation) {
                    conversation = new Conversation({ sessionId, messages: [] });
                }

                // RAG Search (DB)
                const articles = await Article.find(
                    { $text: { $search: message } },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).limit(3);

                if (articles.length > 0) {
                    contextFound = true;
                    foundArticles = articles; // store for fallback cleanup
                    context = "Context from Knowledge Base:\n" + articles.map(a => `Title: ${a.title}\nContent: ${a.content}`).join("\n\n");
                    console.log(`[Chat] Found ${articles.length} articles for context.`);
                } else {
                    console.log("[Chat] No context found.");
                }
            } else {
                console.log("[Chat] DB NOT connected (readyState: " + mongoose.connection.readyState + ")");
                throw new Error("DB Disconnected");
            }
        } catch (dbErr) {
            console.warn("[Chat] Database unavailable/error, using in-memory store.", dbErr.message);

            // Fallback: Get Conversation
            if (!memoryStore.conversations[sessionId]) {
                memoryStore.conversations[sessionId] = [];
            }
            conversation = { messages: memoryStore.conversations[sessionId] };

            // Fallback: RAG Search (Simple keyword match in memoryStore.articles)
            const keywords = message.toLowerCase().split(' ');
            const relevantDocs = memoryStore.articles.filter(doc => {
                const text = (doc.title + " " + doc.content).toLowerCase();
                return keywords.some(k => k.length > 3 && text.includes(k));
            }).slice(0, 3);

            if (relevantDocs.length > 0) {
                contextFound = true;
                foundArticles = relevantDocs; // store for fallback cleanup
                context = "Context from Knowledge Base (Memory):\n" + relevantDocs.map(a => `Title: ${a.title}\nContent: ${a.content}`).join("\n\n");
                console.log(`[Chat] Found ${relevantDocs.length} articles in memory.`);
            }
        }

        // Add User Message (in memory or DB object)
        const userMsg = { role: 'user', content: message, timestamp: new Date() };
        conversation.messages.push(userMsg);

        // Construct System Prompt
        const systemPrompt = `You are a helpful AI assistant. You have access to a knowledge base (provided below), but you should also use your general knowledge to answer questions. \n\n${context}`;

        // Call AI Service (OpenAI -> Grok -> Offline)
        console.log("[Chat] Calling OpenAI...");
        const recentMessages = conversation.messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
        const messagesPayload = [
            { role: "system", content: systemPrompt },
            ...recentMessages
        ];

        try {
            // 1. Try OpenAI
            const completion = await openai.chat.completions.create({
                messages: messagesPayload,
                model: "gpt-3.5-turbo",
            });
            assistantMessage = completion.choices[0].message.content;
            console.log("[Chat] OpenAI Responded.");
        } catch (openaiErr) {
            console.error("[Chat] OpenAI API Failed:", openaiErr.message);

            try {
                // 2. Try Hugging Face (Mistral-7B)
                console.log("[Chat] Attempting Fallback to Hugging Face...");
                const hfApiKey = (process.env.HUGGINGFACE_API_KEY || '').trim();
                if (!hfApiKey || hfApiKey === 'hf-placeholder-key') throw new Error("Hugging Face API Key not configured");

                const hf = new OpenAI({
                    apiKey: hfApiKey,
                    baseURL: "https://router.huggingface.co/v1"
                });

                const hfCompletion = await hf.chat.completions.create({
                    messages: messagesPayload,
                    model: "google/gemma-2-9b-it",
                    max_tokens: 500
                });
                assistantMessage = hfCompletion.choices[0].message.content;
                console.log("[Chat] Hugging Face Responded.");

            } catch (hfErr) {
                console.error("[Chat] Hugging Face API Failed:", hfErr.message);

                // 3. Offline Fallback
                if (contextFound && foundArticles.length > 0) {
                    assistantMessage = foundArticles.map(a => `### ${a.title}\n${a.content}`).join("\n\n---\n\n");
                } else {
                    // Smart Fallback: Suggest topics
                    let titles = [];
                    try {
                        const memoryTitles = memoryStore.articles.map(a => a.title);
                        if (mongoose.connection.readyState === 1) {
                            const docs = await Article.find({}, 'title').limit(5);
                            const dbTitles = docs.map(d => d.title);
                            titles = [...new Set([...dbTitles, ...memoryTitles])].slice(0, 5);
                        } else {
                            titles = memoryTitles.slice(0, 5);
                        }
                    } catch (e) {
                        console.error("Fallback fetch failed", e);
                        titles = memoryStore.articles.map(a => a.title).slice(0, 5);
                    }

                    if (titles.length > 0) {
                        assistantMessage = "I'm having trouble connecting to both AI services (OpenAI & Hugging Face), but I can help you with these topics from our Knowledge Base:\n\n" +
                            titles.map(t => "• " + t).join("\n") +
                            "\n\nPlease try asking about one of these.";
                    } else {
                        assistantMessage = "I'm currently offline. Please check your system configuration.";
                    }
                }
            }
        }

        const aiMsg = { role: 'assistant', content: assistantMessage, timestamp: new Date() };

        // Save (Try DB, fallback to memory)
        conversation.messages.push(aiMsg);

        try {
            if (mongoose.connection.readyState === 1 && typeof conversation.save === 'function') {
                conversation.lastActive = Date.now();
                await conversation.save();

                // Log Analytics
                const analytics = new Analytics({
                    query: message,
                    sessionId: sessionId,
                    responseGenerated: true,
                    ragContextFound: contextFound
                });
                await analytics.save();
                console.log("[Chat] Saved to DB.");
            }
        } catch (saveErr) {
            console.warn("[Chat] Failed to save to DB, kept in memory.");
            // Update shared memory store if getting purely from memory
            if (!memoryStore.conversations[sessionId]) memoryStore.conversations[sessionId] = [];
            // Assuming 'conversation' object is a reference to the array in memory
            // If it's a mongoose doc, we might need to push to memory manually if save failed.
            if (typeof conversation.save === 'function') {
                // It was a mongoose doc but save failed. Sync to memory.
                memoryStore.conversations[sessionId] = conversation.messages.map(m => ({ role: m.role, content: m.content }));
            }
        }

        res.json({ response: assistantMessage });

    } catch (err) {
        console.error("[Chat] Fatal Error:", err);
        // Fallback response if OpenAI fails too? 
        // No, usually OpenAI is what we want. If that fails, real 500.
        res.status(500).json({ message: "Internal Server Error: " + err.message });
    }
});

router.get('/history/:sessionId', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const conversation = await Conversation.findOne({ sessionId: req.params.sessionId });
            res.json(conversation ? conversation.messages : []);
        } else {
            // Return in-memory or empty
            res.json(memoryStore.conversations[req.params.sessionId] || []);
        }
    } catch (err) {
        // Fallback to local
        res.json(memoryStore.conversations[req.params.sessionId] || []);
    }
});

module.exports = router;

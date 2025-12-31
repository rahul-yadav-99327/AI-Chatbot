const memoryStore = {
    articles: [
        {
            _id: 'default_1',
            title: 'Welcome to AI Chatbot',
            content: 'This is an AI-powered Knowledge Base chatbot. You can add articles to the knowledge base, and I will use them to answer your questions! If you provide a valid OpenAI API Key, I can also answer general questions.',
            tags: ['help', 'guide'],
            createdAt: new Date()
        },
        {
            _id: 'default_2',
            title: 'React',
            content: 'React is a library for building user interfaces. It is component-based and declarative.',
            tags: ['react', 'technology'],
            createdAt: new Date()
        },
        {
            _id: 'default_3',
            title: 'Node.js Basics',
            content: 'Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It is widely used for building scalable network applications.',
            tags: ['nodejs', 'backend', 'javascript'],
            createdAt: new Date()
        },
        {
            _id: 'default_4',
            title: 'Express.js Routing',
            content: 'Express.js is a minimal Node.js web application framework. Routing refers to how an application’s endpoints (URIs) respond to client requests. basic routing looks like: app.get("/", (req, res) => res.send("Hello World!"))',
            tags: ['express', 'routing', 'backend'],
            createdAt: new Date()
        },
        {
            _id: 'default_5',
            title: 'MongoDB Atlas Interface',
            content: 'MongoDB Atlas is a fully-managed cloud database service. To connect, you need to whitelist your IP address in Network Access and create a Database User in Database Access. Then use the connection string in your .env file.',
            tags: ['mongodb', 'database', 'cloud'],
            createdAt: new Date()
        },
        {
            _id: 'default_6',
            title: 'Trobleshooting API Errors (401)',
            content: 'A 401 Unauthorized error typically means the OpenAI API Key in your .env file is missing, invalid, or expired. You must generate a new key at platform.openai.com/api-keys and restart the server.',
            tags: ['troubleshooting', 'api', 'errors'],
            createdAt: new Date()
        }
    ],
    conversations: {},
    analytics: []
};

module.exports = memoryStore;

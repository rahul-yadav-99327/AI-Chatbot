# AI Knowledge Base Chatbot

A full-stack AI-powered chatbot application with a custom Knowledge Base (RAG), Authentication, and Admin Dashboard. Built with the MERN stack (MongoDB, Express, React, Node.js).

![Project Banner](https://via.placeholder.com/1200x400?text=AI+Knowledge+Base+Chatbot)

## 🚀 Live Demo

- **Frontend:** [https://ai-chatbot321.netlify.app](https://ai-chatbot321.netlify.app)
- **Backend:** [https://ai-chatbot-123.vercel.app](https://ai-chatbot-123.vercel.app)

## ✨ Features

- **🤖 AI Chatbot:** Intelligent conversational agent powered by OpenAI (GPT-3.5/4) with failover to Hugging Face (Mistral-7B).
- **📚 RAG (Retrieval-Augmented Generation):** Custom knowledge base management. Upload articles and the AI uses them to answer context-aware queries.
- **🔐 Secure Authentication:** User Signup/Login with JWT (JSON Web Tokens) and secure password hashing (bcryptjs).
- **📊 Admin Dashboard:** 
  - Manage Knowledge Base articles (Create, Read, Delete).
  - View real-time Analytics (Total Queries, RAG Success Rate, Recent interactions).
- **💾 Private History:** Chat history is saved locally and scoped per user account.
- **⚡ Modern UI:** Responsive design built with React, Vite, Tailwind CSS, and Lucide Icons.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB (Atlas) & Mongoose
- OpenAI API & Hugging Face Inference API
- JWT & Bcryptjs

**Deployment:**
- Frontend: Netlify
- Backend: Vercel (Serverless)

---

## 🏗️ Local Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/rahul-yadav-99327/AI-Chatbot.git
cd AI-Chatbot
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_db_user>:<password>@cluster0.mongodb.net/ai-kb-chat
JWT_SECRET=your_super_secret_key_123
OPENAI_API_KEY=sk-proj-xxxx...
HUGGINGFACE_API_KEY=hf_xxxx...
```

Start the Server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
```

Start the Client:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🌍 Deployment

### Backend (Vercel)
1. Push code to GitHub.
2. Import `server` directory project into Vercel.
3. Add Environment Variables (`MONGO_URI`, `OPENAI_API_KEY`, etc.) in Vercel Settings.
4. Redeploy to ensure variables are loaded.

### Frontend (Netlify)
1. Import `client` directory as base into Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. **Crucial:** Add Environment Variable:
   - `VITE_API_URL`: `https://your-vercel-backend.vercel.app` (The URL from the Vercel step above).

---

## 📂 Project Structure

```
AI-Chatbot/
├── client/                 # React Frontend
│   ├── public/             # Static assets (_redirects for Netlify)
│   ├── src/
│   │   ├── components/     # Reusable components (ChatWidget, AdminDashboard)
│   │   ├── pages/          # Page views (Home, Login, Signup)
│   │   └── App.jsx         # Main router
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose Schemas (User, Article, Analytics)
│   ├── routes/             # API Endpoints (auth, chat, kb, analytics)
│   ├── server.js           # Entry point
│   └── vercel.json         # Vercel configuration
│
└── README.md
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
MIT License

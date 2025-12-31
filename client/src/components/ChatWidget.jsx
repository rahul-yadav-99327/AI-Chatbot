import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, History, Plus, MessageSquare, Sparkles } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatWidget = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [chatSessions, setChatSessions] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!userId) return; // Don't load if no user
        const storageKey = `chat_sessions_${userId}`;
        const storedSessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setChatSessions(storedSessions);
        startNewChat();
    }, [userId]);

    const startNewChat = () => {
        const newSessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        setSessionId(newSessionId);
        setMessages([{
            role: 'assistant',
            content: "Hello! 👋 I'm your AI Knowledge Assistant. How can I help you today?"
        }]);
        setShowHistory(false);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async (id) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/chat/history/${id}`);
            if (res.data && res.data.length > 0) {
                setMessages(res.data);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const loadSession = (session) => {
        setSessionId(session.id);
        fetchHistory(session.id);
        setShowHistory(false);
    };

    const saveSessionToHistory = (currentMsg) => {
        if (!userId) return;
        const existing = chatSessions.find(s => s.id === sessionId);
        if (!existing) {
            const newSession = {
                id: sessionId,
                preview: currentMsg.substring(0, 30) + (currentMsg.length > 30 ? '...' : ''),
                date: new Date().toLocaleDateString()
            };
            const updatedSessions = [newSession, ...chatSessions];
            setChatSessions(updatedSessions);
            localStorage.setItem(`chat_sessions_${userId}`, JSON.stringify(updatedSessions));
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        saveSessionToHistory(userMsg.content);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/chat`, {
                sessionId,
                message: userMsg.content
            });

            const assistantMsg = { role: 'assistant', content: res.data.response };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error("Chat error", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-110 active:scale-95"
                >
                    <MessageCircle size={32} className="text-white animate-pulse" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-[24rem] sm:w-[28rem] h-[600px] flex flex-col border border-white/20 overflow-hidden animate-fade-in-up ring-1 ring-black/5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Sparkles size={20} className="text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-wide">AI Assistant</h3>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <p className="text-xs font-medium">Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Chat History"
                            >
                                <History size={20} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {showHistory ? (
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                            <button
                                onClick={startNewChat}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl mb-6 hover:shadow-lg transition-all transform active:scale-95 font-medium"
                            >
                                <Plus size={18} /> Start New Conversation
                            </button>

                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Recent History</h4>

                            <div className="space-y-3">
                                {chatSessions.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <History size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No chat history yet</p>
                                    </div>
                                )}
                                {chatSessions.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => loadSession(session)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${sessionId === session.id
                                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                            : 'bg-white border-gray-100 hover:border-indigo-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-indigo-100/50 p-2 rounded-full text-indigo-600 mt-0.5">
                                                <MessageSquare size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{session.preview}</p>
                                                <p className="text-xs text-gray-500 mt-1">{session.date}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 flex flex-col gap-4 scroll-smooth">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                        <div
                                            className={`max-w-[85%] p-4 text-sm shadow-sm ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
                                                }`}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none prose-indigo leading-relaxed">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {String(msg.content || "")}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="leading-relaxed">{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start animate-pulse">
                                        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={sendMessage} className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your question..."
                                        className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-400 shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-300 transition-all active:scale-95 shadow-lg shadow-indigo-200"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-gray-400">
                                        Powered by AI Knowledge Base
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatWidget;

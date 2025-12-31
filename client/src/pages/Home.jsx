import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';
import AdminDashboard from '../components/AdminDashboard';
import { LayoutDashboard, MessageSquare, LogOut, BookOpen, Code2, LifeBuoy, Zap } from 'lucide-react';

const Home = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
            {/* Navbar - Floating Glass */}
            <nav className="fixed top-0 w-full z-40 px-4 sm:px-6 lg:px-8 py-4 pointer-events-none">
                <div className="max-w-7xl mx-auto pointer-events-auto">
                    <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 rounded-2xl px-6 h-16 flex justify-between items-center border border-white/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-lg shadow-md shadow-indigo-200">
                                <MessageSquare size={20} />
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">AI Knowledge</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-slate-600 text-xs font-medium">{user.username}</span>
                                </div>
                            )}
                            <button
                                onClick={() => setIsAdmin(!isAdmin)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm ${isAdmin
                                    ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <LayoutDashboard size={18} />
                                {isAdmin ? 'View Site' : 'Dashboard'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {isAdmin ? (
                    <div className="animate-fade-in-up">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                            <p className="text-slate-500 mt-2">Manage your knowledge base and view analytics</p>
                        </div>
                        <AdminDashboard />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[70vh]">
                        {/* Hero Section */}
                        <div className="text-center space-y-8 max-w-3xl mx-auto relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold animate-fade-in-down">
                                <Zap size={16} className="fill-current" />
                                <span>Powered by Advanced AI</span>
                            </div>

                            <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                Instant answers from your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                                    Knowledge Base
                                </span>
                            </h1>

                            <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
                                Don't waste time searching through documents. Just ask our AI assistant and get precise, context-aware answers in seconds.
                            </p>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -z-10 animate-blob"></div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
                            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Documentation</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Comprehensive guides and references for all our products and services.
                                </p>
                            </div>

                            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Code2 size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">API Reference</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Detailed API documentation for developers to integrate our services.
                                </p>
                            </div>

                            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <LifeBuoy size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Help Center</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Browse FAQs or contact our support team for specialized assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Chat Widget sits on top of everything */}
            <ChatWidget />
        </div>
    );
};

export default Home;

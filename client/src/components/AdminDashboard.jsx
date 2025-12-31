import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, PieChart, Book, RefreshCw, Search, FileText, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'analytics'
    const [articles, setArticles] = useState([]);
    const [analytics, setAnalytics] = useState({ stats: { total: 0, withContext: 0 }, recent: [] });
    const [newArticle, setNewArticle] = useState({ title: '', content: '', tags: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'articles') {
                const res = await axios.get('/api/kb');
                setArticles(Array.isArray(res.data) ? res.data : []);
            } else {
                const res = await axios.get('/api/analytics');
                setAnalytics(res.data);
            }
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateArticle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/kb', {
                ...newArticle,
                tags: newArticle.tags.split(',').map(t => t.trim())
            });
            setNewArticle({ title: '', content: '', tags: '' });
            loadData();
            // Could add toast notification here
        } catch (err) {
            alert("Error saving article");
        }
    };

    const handleDeleteArticle = async (id) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            await axios.delete(`/api/kb/${id}`);
            loadData();
        } catch (err) {
            alert("Error deleting article");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 min-h-[600px]">
            {/* Sidebar / Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${activeTab === 'articles'
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                        }`}
                >
                    <Book size={18} /> Knowledge Base
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${activeTab === 'analytics'
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                        }`}
                >
                    <PieChart size={18} /> Analytics & Insights
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'articles' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Create Article Form */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                                    <Plus size={20} className="text-indigo-600" /> Add Article
                                </h3>
                                <form onSubmit={handleCreateArticle} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            value={newArticle.title}
                                            onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                                            required
                                            placeholder="e.g., How to reset password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Content</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none h-48 resize-none"
                                            value={newArticle.content}
                                            onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                                            required
                                            placeholder="Write your article content here..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tags</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            value={newArticle.tags}
                                            onChange={e => setNewArticle({ ...newArticle, tags: e.target.value })}
                                            placeholder="Comma separated (e.g., account, billing)"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition active:scale-95 shadow-lg shadow-indigo-200">
                                        Save Article
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* List Articles */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                                    <FileText size={24} className="text-slate-400" /> Library
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{articles.length}</span>
                                </h3>
                                <button
                                    onClick={loadData}
                                    className={`p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all ${isLoading ? 'animate-spin' : ''}`}
                                    title="Refresh"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {articles.map(article => (
                                    <div key={article._id} className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-4">
                                                <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{article.title}</h4>
                                                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{article.content}</p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {(Array.isArray(article.tags) ? article.tags : []).map(tag => (
                                                        tag && <span key={tag} className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteArticle(article._id)}
                                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Article"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {articles.length === 0 && (
                                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                        <Book size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-medium">No articles found.</p>
                                        <p className="text-slate-400 text-sm">Add one to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Analytics Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-2">Total Queries</h4>
                                    <p className="text-5xl font-extrabold">{analytics.stats.total}</p>
                                </div>
                                <Search className="absolute right-4 bottom-4 text-white/10 w-24 h-24" />
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Success Rate</h4>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-5xl font-extrabold text-slate-800">{analytics.stats.withContext}</p>
                                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            {analytics.stats.total > 0 ? Math.round((analytics.stats.withContext / analytics.stats.total) * 100) : 0}% RAG Hit
                                        </span>
                                    </div>
                                </div>
                                <BarChart3 className="absolute right-4 bottom-4 text-slate-100 w-24 h-24" />
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800">Recent User Queries</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {analytics.recent.map((item, idx) => (
                                    <div key={idx} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                                        <div>
                                            <p className="font-medium text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.query}</p>
                                            <p className="text-xs text-slate-400 mt-1 font-mono">{new Date(item.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            {item.ragContextFound ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Context Found
                                                </span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">
                                                    General AI
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {analytics.recent.length === 0 && <p className="p-8 text-center text-slate-400">No data available yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

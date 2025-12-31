import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Mail, Lock, User, ArrowRight, Bot } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Panel - Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-700 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-800 opacity-90"></div>
                {/* Different background image for variety */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-ad506d134c11?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-24 w-full">
                    <div className="mb-8 p-3 bg-white/10 w-fit rounded-xl backdrop-blur-sm border border-white/20">
                        <User size={32} className="text-green-300" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Future of Work</span>
                    </h1>
                    <p className="text-purple-100 text-lg mb-8 max-w-md">
                        Create your account today and start building your personal knowledge assistant. It's free and takes less than a minute.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Sparkles size={20} className="text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">AI-Powered Search</h3>
                                <p className="text-sm text-purple-200">Find anything instantly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Bot size={20} className="text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Smart Assistant</h3>
                                <p className="text-sm text-purple-200">24/7 automated support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-24 -right-24 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 -left-24 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4">
                            <User size={24} />
                        </div>
                        <h2 className="text-3xl font-extra-bold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Start your journey with us today.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder="Create a password (min 6 chars)"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the <a href="#" className="text-purple-600 hover:text-purple-500">Terms</a> and <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight size={20} className="ml-2" />}
                        </button>
                    </form>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-purple-600 hover:text-purple-500 font-bold">
                            Sign in to your account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

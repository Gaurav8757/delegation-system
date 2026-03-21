import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Button } from '../../components/ui/button.jsx';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;
        login({ email, password });
    };

    return (
        <div className="min-h-[calc(100vh-1.4rem)] w-auto flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-4 transition-colors">
            {/* Background Blob Decoration */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
            {/* <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div> */}

            <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden relative z-10 transition-all hover:shadow-2xl">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 mb-4 animate-bounce-slow">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to Account</h1>
                        <p className="text-muted-foreground text-sm mt-2">Enter credentials to access your dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between pl-1">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoggingIn ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account? <span onClick={() => navigate('/auth/secret-register')} className="text-primary font-semibold hover:underline cursor-pointer">Contact SuperAdmin</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

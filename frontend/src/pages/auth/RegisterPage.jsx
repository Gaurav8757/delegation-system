import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo1.png';
import { Button } from '../../components/ui/button.jsx';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isRegistering, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        register({ name, email, password, role: 'superadmin' });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] dark:bg-[#020617] p-4 transition-colors">
            {/* Background Mesh Gradient */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 relative z-10 transition-all hover:scale-[1.01]">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Secret Setup</h1>
                    <p className="text-muted-foreground text-sm mt-3 px-4">Initialize the system by creating the primary **Super Admin** account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/80 pl-1" htmlFor="name">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-10 h-12 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/80 pl-1" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                id="email"
                                type="email"
                                placeholder="superadmin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-10 h-12 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/80 pl-1" htmlFor="password">Security Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-10 h-12 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                                required
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground pl-1 mt-1 italic">Note: Role will be forced to **Super Admin** for this secret route.</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full h-12 rounded-xl font-bold"
                    >
                        {isRegistering ? (
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Create Master Account <ArrowRight size={18} />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
                    <Button 
                        variant="link"
                        onClick={() => navigate('/auth/login')}
                        className="text-sm font-semibold h-auto p-0"
                    >
                        Already have an account? Login
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-widest border border-destructive/20">
                        <ShieldCheck size={12} /> RESTRICTED ACCESS
                    </div>
                </div>
            </div>
        </div>
    );
}

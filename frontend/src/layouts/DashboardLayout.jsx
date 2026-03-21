import { Outlet, Navigate, useLocation } from 'react-router';
import { Sidebar } from './Sidebar.jsx';
// import { useAuthStore } from '../../store/authStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { useState, useEffect } from 'react';

// Main dashboard shell: Sidebar + Responsive Content Area + Top Header.
export const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Toggle Dark Mode (handled via .dark class on html/body as per tailwind setup)
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar onLogout={logout} />

            {/* Right Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                                type="text"
                                placeholder="Search everything..."
                                className="w-full bg-muted/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="rounded-full text-muted-foreground transition-colors hover:bg-muted"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        {/* Notifications */}
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="rounded-full text-muted-foreground relative hover:bg-muted"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-card"></span>
                        </Button>

                        <div className="h-8 w-[1px] bg-border mx-1"></div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold border-2 border-background shadow-sm">
                                {user?.name?.charAt(0) || <User size={18} />}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
                    <div className="flex-1 mx-auto">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
};

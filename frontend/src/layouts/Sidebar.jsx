import { Link, useLocation } from 'react-router';
import logo from '../assets/logo1.png';
import { useAuthStore } from '../store/authStore.js';
import { 
    LayoutDashboard, 
    Users, 
    ClipboardList, 
    BarChart3, 
    LogOut,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils.js';
import { Button } from '../components/ui/button.jsx';

// Global navigation configuration based on roles.
const MENU_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['superadmin', 'admin', 'user'] },
    { name: 'User Management', icon: Users, path: '/users', roles: ['superadmin'] },
    { name: 'Delegations', icon: ClipboardList, path: '/delegations', roles: ['superadmin', 'admin', 'user'] },
    { name: 'Reports', icon: BarChart3, path: '/reports', roles: ['superadmin', 'admin'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['superadmin', 'admin', 'user'] },
];

export const Sidebar = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const role = useAuthStore((state) => state.role);

    const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(role));

    return (
        <aside 
            className={cn(
                "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col relative",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center gap-3">
                <img src={logo} alt="Logo" className={cn("object-contain transition-all", isCollapsed ? "w-10 h-10" : "w-12 h-12")} />
                {/* {!isCollapsed && (
                    <span className="font-bold text-lg tracking-tight truncate">
                        Delegation<span className="text-muted-foreground">App</span>
                    </span>
                )} */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2">
                {filteredMenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
                                isActive 
                                    ? "bg-primary text-primary-foreground" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon size={22} className="shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-border mt-auto">
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start gap-3 px-4 py-3 h-auto text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                </Button>
            </div>

            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center hover:bg-muted z-20 shadow-sm"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
        </aside>
    );
};

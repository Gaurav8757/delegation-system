import { useQuery } from '@tanstack/react-query';
import { apiServices, API_ENDPOINTS } from '../../api/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
    Users, 
    ClipboardCheck, 
    Clock, 
    TrendingUp, 
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import Loader from '../../shared/loader/Loader.jsx';
import { Button } from '../../components/ui/button.jsx';
import { useAuthStore } from '../../store/authStore.js';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
export default function DashboardPage() {
    const role = useAuthStore((state) => state.role);
    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => apiServices.get(API_ENDPOINTS.REPORTS.DASHBOARD),
        refetchOnWindowFocus: true,
    });

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;
    if (isError) return <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20">Error loading dashboard data. Please try again later.</div>;

    const stats = data?.data || {};
    const { delegationsByStatus, usersByRole, totalUsers, totalDelegations, recentActivity } = stats;

    const isAdminOrSuper = role === 'admin' || role === 'superadmin';

    // Transform data for charts
    const delegationData = Object.entries(delegationsByStatus || {}).map(([name, value]) => ({ name: name.toUpperCase(), value }));
    const roleData = Object.entries(usersByRole || {}).map(([name, value]) => ({ name: name.toUpperCase(), value }));

    const cards = [
        isAdminOrSuper && { title: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500/10 text-blue-500', trend: '+12%' },
        { title: isAdminOrSuper ? 'Total Delegations' : 'My Delegations', value: totalDelegations, icon: ClipboardCheck, color: 'bg-emerald-500/10 text-emerald-500', trend: '+5%' },
        { title: isAdminOrSuper ? 'Pending Tasks' : 'My Pending Tasks', value: delegationsByStatus?.pending || 0, icon: Clock, color: 'bg-amber-500/10 text-amber-500', trend: '-2%' },
        { title: 'Completion Rate', value: `${totalDelegations ? Math.round(((delegationsByStatus?.completed || 0) / totalDelegations) * 100) : 0}%`, icon: TrendingUp, color: 'bg-purple-500/10 text-purple-500', trend: '+8%' },
    ].filter(Boolean);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Real-time insights and monitoring for your delegation system.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live System Status
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 rounded-xl", card.color)}>
                                <card.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                {card.trend} <ArrowUpRight size={14} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                            <h3 className="text-2xl font-bold tracking-tight mt-1">{card.value}</h3>
                        </div>
                        <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform">
                            <card.icon size={80} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className={cn("grid gap-8", isAdminOrSuper ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
                {/* Bar Chart: Delegations */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">{isAdminOrSuper ? "System-wide Delegation Status" : "My Task Progression"}</h2>
                        <Button 
                            variant="link" 
                            className="text-xs font-bold h-auto p-0"
                            onClick={() => window.location.href = '/delegations'}
                        >
                            {isAdminOrSuper ? "VIEW FULL REPORT" : "MANAGE TASKS"}
                        </Button>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={delegationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0 / 20%)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'oklch(0.97 0 0 / 50%)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="oklch(0.205 0 0)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: User Roles (Admin Only) */}
                {isAdminOrSuper && (
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-8">User Roles Distribution</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity Table (Admin Only) */}
            {isAdminOrSuper && (
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary" size={20} />
                        <h2 className="text-xl font-bold">Recent System Activity</h2>
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {recentActivity?.length > 0 ? (
                        recentActivity.slice(0, 5).map((log) => (
                            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                                        {log.user_name?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-tight">{log.action}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Performed by {log.user_name} • <span className="capitalize">{log.user_role}</span></p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-muted-foreground italic">No recent activity found.</div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { useAuthStore } from '../../store/authStore';
import { 
    FileText, 
    Download, 
    Filter, 
    Calendar as CalendarIcon, 
    User, 
    History,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Button } from '../../components/ui/button.jsx';

export default function ReportsPage() {
    const role = useAuthStore((state) => state.role);
    const [filters, setFilters] = useState({ role: '', date: '' });
    const { logs, isLogsLoading, isLogsError, stats, refetchLogs } = useReports(filters);

    const isSuperAdmin = role === 'superadmin';

    // Mock data for trends
    const trendData = (logs || []).slice(0, 7).reverse().map((log) => ({
        name: new Date(log.created_at).toLocaleDateString([], { weekday: 'short' }),
        activity: Math.floor(Math.random() * 10) + 1,
    }));

    const handleRefresh = () => {
        refetchLogs();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">System Reports</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Detailed audit logs and system activity analysis.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        className="rounded-xl h-11 w-11"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={isLogsLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button className="gap-2 h-11 px-6 rounded-xl font-bold">
                        <Download size={18} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Top Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Activity Summary</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Actions Logged</span>
                                <span className="text-md font-bold">{logs?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Pending Tasks</span>
                                <span className="text-md font-bold text-amber-500">{stats?.delegationsByStatus?.pending || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Completion Rate</span>
                                <span className="text-md font-bold text-emerald-500">
                                    {stats?.totalDelegations ? Math.round((stats.delegationsByStatus.completed / stats.totalDelegations) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Audit Policy</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                            All system actions are permanently logged with timestamps and user origins for security compliance.
                        </p>
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold">Action Density (Last 7 Days)</h3>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-1 rounded">Visual Analytics</div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="oklch(0.205 0 0)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="oklch(0.205 0 0)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0 / 10%)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="activity" stroke="oklch(0.205 0 0)" fillOpacity={1} fill="url(#colorActivity)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground min-w-max">
                        <Filter size={18} /> Filter Logs:
                    </div>
                    {isSuperAdmin && (
                        <select 
                            value={filters.role}
                            onChange={(e) => setFilters({...filters, role: e.target.value})}
                            className="bg-muted/50 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer min-w-[120px]"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    )}
                    <div className="relative group min-w-[160px]">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                            className="w-full bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2+0.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all font-medium py-2"
                        />
                    </div>
                </div>
                
                <Button 
                    variant="link"
                    onClick={() => setFilters({ role: '', date: '' })}
                    className="text-xs font-bold hover:underline underline-offset-4 px-4 h-auto"
                >
                    RESET FILTERS
                </Button>
            </div>

            {/* Activity Logs Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-border flex items-center gap-2">
                    <History className="text-primary" size={20} />
                    <h2 className="text-xl font-bold">Audit Trail</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Origin</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLogsLoading ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-muted-foreground">Loading audit trail...</td></tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                    <FileText size={14} />
                                                </div>
                                                <p className="text-sm font-semibold text-foreground/90">{log.action}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="text-muted-foreground" size={14} />
                                                <span className="text-sm text-foreground/80">{log.user_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-muted/60 text-muted-foreground border-border",
                                                log.user_role === 'admin' && "text-amber-600 border-amber-500/10 bg-amber-500/5",
                                                log.user_role === 'superadmin' && "text-purple-600 border-purple-500/10 bg-purple-500/5"
                                            )}>
                                                {log.user_role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-xs font-bold text-foreground/70">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(log.created_at).toLocaleDateString()}</p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-muted-foreground italic">No logs found for the selected filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

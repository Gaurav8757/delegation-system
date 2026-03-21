import { useState } from 'react';
import { useDelegations } from '../../hooks/useDelegations';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/authStore';
import { 
    Plus, 
    Filter, 
    Search, 
    Trash2, 
    Clock, 
    CheckCircle2, 
    Loader2,
    Calendar,
    User,
    ChevronDown,
    X,
    FileText,
    Check,
    Edit2
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Button } from '../../components/ui/button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmModal } from '../../components/ui/ConfirmModal.jsx';

const STATUS_CONFIG = {
    'pending': { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock },
    'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2 },
    'completed': { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: CheckCircle2 },
};

export default function DelegationManagement() {
    const role = useAuthStore((state) => state.role);
    const { 
        delegations, 
        isLoading, 
        createDelegation, 
        isCreating, 
        updateDelegation,
        isUpdating,
        updateStatus, 
        deleteDelegation,
        isDeleting
    } = useDelegations();
    const { users } = useUsers();
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Data States
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', assigned_to: '', status: 'pending' });

    const filteredDelegations = delegations.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                             task.description?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const resetForm = () => {
        setFormData({ title: '', description: '', assigned_to: '', status: 'pending' });
        setSelectedTask(null);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createDelegation(formData, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetForm();
            }
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        updateDelegation({ id: selectedTask.id, ...formData }, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetForm();
            }
        });
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setFormData({ 
            title: task.title, 
            description: task.description || '', 
            assigned_to: task.assigned_to_id,
            status: task.status
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteDelegation(selectedTask.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
            }
        });
    };

    const isAdminOrSuper = role === 'admin' || role === 'superadmin';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Delegations</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Track and manage task assignments across the team.</p>
                </div>
                {isAdminOrSuper && (
                    <Button 
                        onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} /> New Assignment
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-muted-foreground" size={18} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-muted/50 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Task List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground">Loading delegations...</div>
                ) : filteredDelegations.length > 0 ? (
                    filteredDelegations.map((task) => {
                        const Config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                        return (
                            <div key={task.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5", Config.color)}>
                                        <Config.icon size={12} className={task.status === 'in-progress' ? 'animate-spin' : ''} />
                                        {Config.label}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isAdminOrSuper && (
                                            <Button 
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditModal(task)}
                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                                title="Edit Task"
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                        )}
                                        {role === 'superadmin' && (
                                            <Button 
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openDeleteModal(task)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                                title="Delete Task"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold leading-snug mb-2 line-clamp-1">{task.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 italic">
                                    {task.description || "No description provided."}
                                </p>

                                <div className="space-y-4 pt-4 border-t border-border mt-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary-foreground font-bold text-[10px]">
                                                {task.assigned_to_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground text-[9px] uppercase tracking-tighter">Assigned To</span>
                                                <span className="leading-none">{task.assigned_to_name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-muted-foreground text-[9px] uppercase tracking-tighter block">Created At</span>
                                            <span className="text-[10px] font-bold">{new Date(task.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Status Transition Control */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <select 
                                            value={task.status}
                                            onChange={(e) => updateStatus({ id: task.id, status: e.target.value })}
                                            className="w-full bg-muted/30 hover:bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none cursor-pointer transition-colors"
                                        >
                                            <option value="pending">Mark Pending</option>
                                            <option value="in-progress">Mark In Progress</option>
                                            <option value="completed">Mark Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center bg-card border border-dashed border-border rounded-3xl">
                        <FileText className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                        <h3 className="text-lg font-bold">No tasks found</h3>
                        <p className="text-muted-foreground text-sm">Create a new delegation to see it here.</p>
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                title="Assign New Task"
                className="max-w-lg"
            >
                <form onSubmit={handleCreate} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Task Title</label>
                        <input 
                            type="text"
                            required
                            maxLength={100}
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="Brief task overview"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Description</label>
                        <textarea 
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                            placeholder="Enter full task details..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Assign To</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <select 
                                required
                                value={formData.assigned_to}
                                onChange={(e) => setFormData({...formData, assigned_to: parseInt(e.target.value)})}
                                className="w-full bg-muted/50 border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select a user...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 h-11 rounded-xl font-bold"
                        >
                            Discard
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 h-11 rounded-xl font-bold"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <Check size={18} className="mr-2" />
                                    Assign Task
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Task Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Task Details"
                className="max-w-lg"
            >
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Task Title</label>
                        <input 
                            type="text"
                            required
                            maxLength={100}
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Description</label>
                        <textarea 
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Assign To</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <select 
                                required
                                value={formData.assigned_to}
                                onChange={(e) => setFormData({...formData, assigned_to: parseInt(e.target.value)})}
                                className="w-full bg-muted/50 border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                            >
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold pl-1">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 h-11 rounded-xl font-bold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 h-11 rounded-xl font-bold"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={18} className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Task"
                description={`Are you sure you want to delete the task "${selectedTask?.title}"? This action cannot be undone.`}
                confirmText="Delete Task"
            />
        </div>
    );
}

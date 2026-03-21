import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { 
    UserPlus, 
    Search, 
    Trash2, 
    UserCog,
    Check,
    Loader2,
    Edit2
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Button } from '../../components/ui/button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmModal } from '../../components/ui/ConfirmModal.jsx';

export default function UserManagement() {
    const { 
        users, 
        isLoading, 
        createUser, 
        isCreating, 
        updateUser, 
        isUpdating, 
        updateRole, 
        isUpdatingRole,
        deleteUser,
        isDeleting
    } = useUsers();

    const [search, setSearch] = useState('');
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Data States
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setSelectedUser(null);
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        createUser(formData, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetForm();
            }
        });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        updateUser({ id: selectedUser.id, ...formData }, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetForm();
            }
        });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({ 
            name: user.name, 
            email: user.email, 
            role: user.role,
            password: '' // Keep empty unless changing
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteUser(selectedUser.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const handleRoleChange = (id, currentRole) => {
        const nextRole = currentRole === 'admin' ? 'user' : 'admin';
        updateRole({ id, role: nextRole });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage system administrators and standard users.</p>
                </div>
                <Button 
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20"
                >
                    <UserPlus size={20} /> Add New User
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">Loading users...</td></tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                user.role === 'admin' 
                                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                                                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button 
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(user)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRoleChange(user.id, user.role)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                                                    title="Toggle Admin/User Role"
                                                >
                                                    <UserCog size={18} />
                                                </Button>
                                                <Button 
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteModal(user)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-muted-foreground italic">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                title="Add New User"
                className="max-w-md"
            >
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Full Name</label>
                        <input 
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="Enter user name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Email Address</label>
                        <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Password</label>
                        <input 
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Role</label>
                        <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 h-11 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 h-11 rounded-xl"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check size={18} className="mr-2" />
                                    Create User
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User Details"
                className="max-w-md"
            >
                <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Full Name</label>
                        <input 
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Email Address</label>
                        <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium pl-1">Role</label>
                        <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 h-11 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 h-11 rounded-xl"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                    Updating...
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
                title="Delete User"
                description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone and will permanently remove their access.`}
                confirmText="Delete User"
            />
        </div>
    );
}

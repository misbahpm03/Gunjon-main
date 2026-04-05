import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { Search, Plus, ShieldAlert, Edit, Power, Shield, Users as UsersIcon, ShoppingBag, BarChart3, Settings, ShoppingCart, Tag } from 'lucide-react';
import { User } from '../types';

const rolePermissions = {
  admin: [
    { module: 'Dashboard', access: 'Full Access', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Products', access: 'Full Access', icon: <ShoppingBag className="h-4 w-4" /> },
    { module: 'Orders', access: 'Full Access', icon: <ShoppingCart className="h-4 w-4" /> },
    { module: 'Customers', access: 'Full Access', icon: <UsersIcon className="h-4 w-4" /> },
    { module: 'Offers & Banners', access: 'Full Access', icon: <Tag className="h-4 w-4" /> },
    { module: 'Reports', access: 'Full Access', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Users & Roles', access: 'Full Access', icon: <Shield className="h-4 w-4" /> },
    { module: 'Settings', access: 'Full Access', icon: <Settings className="h-4 w-4" /> },
  ],
  manager: [
    { module: 'Dashboard', access: 'View Only', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Products', access: 'Full Access', icon: <ShoppingBag className="h-4 w-4" /> },
    { module: 'Orders', access: 'Full Access', icon: <ShoppingCart className="h-4 w-4" /> },
    { module: 'Customers', access: 'Full Access', icon: <UsersIcon className="h-4 w-4" /> },
    { module: 'Offers & Banners', access: 'Full Access', icon: <Tag className="h-4 w-4" /> },
    { module: 'Reports', access: 'View Only', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Users & Roles', access: 'No Access', icon: <Shield className="h-4 w-4" /> },
    { module: 'Settings', access: 'No Access', icon: <Settings className="h-4 w-4" /> },
  ],
  cashier: [
    { module: 'POS', access: 'Full Access', icon: <ShoppingCart className="h-4 w-4" /> },
    { module: 'Orders', access: 'View Only', icon: <ShoppingCart className="h-4 w-4" /> },
    { module: 'Products', access: 'View Only', icon: <ShoppingBag className="h-4 w-4" /> },
    { module: 'Customers', access: 'View Only', icon: <UsersIcon className="h-4 w-4" /> },
    { module: 'Dashboard', access: 'No Access', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Offers & Banners', access: 'No Access', icon: <Tag className="h-4 w-4" /> },
    { module: 'Reports', access: 'No Access', icon: <BarChart3 className="h-4 w-4" /> },
    { module: 'Users & Roles', access: 'No Access', icon: <Shield className="h-4 w-4" /> },
    { module: 'Settings', access: 'No Access', icon: <Settings className="h-4 w-4" /> },
  ]
};

export function Users() {
  const { users, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'cashier'>('admin');
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'manager' | 'cashier'>('cashier');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      try {
        await api.updateUser(userId, { status: user.status === 'Active' ? 'Inactive' : 'Active' });
      } catch (error) {
        console.error('Failed to toggle user status', error);
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, {
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
        });
      } else {
        await api.addUser({
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          status: 'Active'
        });
      }
      setIsAddUserModalOpen(false);
      setEditingUser(null);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('cashier');
      setNewUserPassword('');
    } catch (error: any) {
      console.error('Failed to add user', error);
      alert('Failed to add user: ' + (error?.message || 'Check if "users" table is correctly set up in the database.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin': return 'Super Admin';
      case 'manager': return 'Manager';
      case 'cashier': return 'Sales Staff';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system access and roles.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsPermissionsModalOpen(true)}>
            <Shield className="mr-2 h-4 w-4" /> View Permissions
          </Button>
          <Button onClick={() => {
            setEditingUser(null);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole('cashier');
            setIsAddUserModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      {user.role === 'admin' && <ShieldAlert className="h-4 w-4 text-indigo-600 mr-2" />}
                      {getRoleDisplayName(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                        onClick={() => {
                          setEditingUser(user);
                          setNewUserName(user.name);
                          setNewUserEmail(user.email);
                          setNewUserRole(user.role);
                          setIsAddUserModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ৳{user.status === 'Active' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit User Modal */}
      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title={editingUser ? "Edit User" : "Add New User"}>
        <form className="space-y-4" onSubmit={handleAddUser}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input placeholder="e.g., John Doe" required value={newUserName} onChange={e => setNewUserName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email / Phone</label>
            <Input placeholder="e.g., john@example.com" required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value as any)}
            >
              <option value="admin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Sales Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password (Optional)</label>
            <Input type="password" placeholder="Enter password (Optional)" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">Users should receive an invite or magic link to set their own password if using Supabase Auth.</p>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Add User')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={isPermissionsModalOpen} onClose={() => setIsPermissionsModalOpen(false)} title="Role Permissions">
        <div className="space-y-6">
          <div className="flex space-x-2 border-b border-gray-200 pb-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-md ৳{selectedRole === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedRole('admin')}
            >
              Super Admin
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-md ৳{selectedRole === 'manager' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedRole('manager')}
            >
              Manager
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-md ৳{selectedRole === 'cashier' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedRole('cashier')}
            >
              Sales Staff
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="mr-2 h-4 w-4 text-indigo-600" />
              {getRoleDisplayName(selectedRole)} Permissions
            </h3>
            <div className="space-y-3">
              {rolePermissions[selectedRole].map((perm, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <div className="mr-3 text-gray-400">{perm.icon}</div>
                    {perm.module}
                  </div>
                  <Badge variant={
                    perm.access === 'Full Access' ? 'success' : 
                    perm.access === 'View Only' ? 'warning' : 'secondary'
                  }>
                    {perm.access}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button onClick={() => setIsPermissionsModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

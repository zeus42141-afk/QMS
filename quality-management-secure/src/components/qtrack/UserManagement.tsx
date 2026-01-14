import React, { useState } from 'react';
import { User, UserRole } from '@/types/qtrack';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  Shield,
  Mail,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  X,
  Save,
  UserPlus
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onEditUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'standard' as UserRole,
    departement: '',
    isActive: true,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    const badges: Record<UserRole, { label: string; color: string }> = {
      admin: { label: 'Administrateur', color: 'bg-purple-100 text-purple-700' },
      qualite: { label: 'Qualité', color: 'bg-blue-100 text-blue-700' },
      production: { label: 'Production', color: 'bg-green-100 text-green-700' },
      maintenance: { label: 'Maintenance', color: 'bg-orange-100 text-orange-700' },
      standard: { label: 'Standard', color: 'bg-gray-100 text-gray-700' },
    };
    return badges[role];
  };

  const departements = [
    'Direction',
    'Qualité',
    'Production',
    'Maintenance',
    'Logistique',
    'Achats',
    'Service Client',
    'R&D',
  ];

  const handleOpenAddModal = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      role: 'standard',
      departement: '',
      isActive: true,
    });
    setEditingUser(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      departement: user.departement,
      isActive: user.isActive,
    });
    setEditingUser(user);
    setShowAddModal(true);
    setActiveMenu(null);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      onEditUser(editingUser.id, formData);
    } else {
      onAddUser(formData);
    }
    setShowAddModal(false);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    qualite: users.filter(u => u.role === 'qualite').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérez les comptes et les permissions</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors shadow-lg shadow-[#3498db]/30"
        >
          <UserPlus size={20} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total utilisateurs</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-green-600">Actifs</p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-100 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
          <p className="text-sm text-purple-600">Administrateurs</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.qualite}</p>
          <p className="text-sm text-blue-600">Équipe Qualité</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="qualite">Qualité</option>
            <option value="production">Production</option>
            <option value="maintenance">Maintenance</option>
            <option value="standard">Standard</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#3498db] to-[#2c3e50] rounded-full flex items-center justify-center text-white font-semibold">
                          {user.prenom[0]}{user.nom[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.prenom} {user.nom}</p>
                          <p className="text-xs text-gray-500">Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building size={14} className="text-gray-400" />
                        {user.departement}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle size={12} />
                            Actif
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Inactif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(user.lastLogin).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400">Jamais connecté</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                        {activeMenu === user.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit size={14} /> Modifier
                            </button>
                            <button
                              onClick={() => {
                                onDeleteUser(user.id);
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Shield size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3498db] rounded-lg flex items-center justify-center">
                  <UserPlus size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="qualite">Qualité</option>
                    <option value="production">Production</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <select
                    value={formData.departement}
                    onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                  >
                    <option value="">Sélectionner...</option>
                    {departements.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#3498db] border-gray-300 rounded focus:ring-[#3498db]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Compte actif
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                disabled={!formData.nom || !formData.prenom || !formData.email || !formData.departement}
                className="flex items-center gap-2 px-6 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {editingUser ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
};

export default UserManagement;

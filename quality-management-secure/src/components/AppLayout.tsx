import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ViewType, NonConformite, ActionCorrective, User, Notification } from '@/types/qtrack';
import { 
  nonConformites as initialNCs, 
  users as initialUsers, 
  kpiData, 
  notifications as initialNotifications,
  departements,
  postes
} from '@/data/mockData';

// Import components
import Sidebar from './qtrack/Sidebar';
import Header from './qtrack/Header';
import Dashboard from './qtrack/Dashboard';
import NCList from './qtrack/NCList';
import NCDetail from './qtrack/NCDetail';
import NCForm from './qtrack/NCForm';
import Reports from './qtrack/Reports';
import UserManagement from './qtrack/UserManagement';
import Settings from './qtrack/Settings';
import DeleteConfirmModal from './qtrack/DeleteConfirmModal';
import LoginModal from './qtrack/LoginModal';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout, sessionExpiresAt } = useAuth();
  const isMobile = useIsMobile();

  // State management
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Data state
  const [nonConformites, setNonConformites] = useState<NonConformite[]>(initialNCs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // UI state
  const [selectedNC, setSelectedNC] = useState<NonConformite | null>(null);
  const [showNCForm, setShowNCForm] = useState(false);
  const [editingNC, setEditingNC] = useState<NonConformite | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'nc' | 'user'; item: any } | null>(null);

  // Convert auth user to app user format
  const currentUser: User | null = authUser ? {
    id: authUser.id,
    nom: authUser.nom,
    prenom: authUser.prenom,
    email: authUser.email,
    role: authUser.role as any,
    departement: authUser.departement,
    createdAt: authUser.created_at,
    lastLogin: authUser.last_login || undefined,
    isActive: authUser.is_active,
  } : null;

  // Navigation handlers
  const handleViewChange = useCallback((view: ViewType) => {
    // Check if user needs to be authenticated for certain views
    const protectedViews: ViewType[] = ['nc_list', 'nc_detail', 'rapports', 'utilisateurs', 'parametres'];
    
    if (protectedViews.includes(view) && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setCurrentView(view);
    setSelectedNC(null);
    setMobileMenuOpen(false);
  }, [isAuthenticated]);

  const handleViewNC = useCallback((nc: NonConformite) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedNC(nc);
    setCurrentView('nc_detail');
  }, [isAuthenticated]);

  const handleBackToList = useCallback(() => {
    setSelectedNC(null);
    setCurrentView('nc_list');
  }, []);

  // NC CRUD handlers
  const handleCreateNC = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setEditingNC(null);
    setShowNCForm(true);
  }, [isAuthenticated]);

  const handleEditNC = useCallback((nc: NonConformite) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setEditingNC(nc);
    setShowNCForm(true);
  }, [isAuthenticated]);

  const handleSaveNC = useCallback((ncData: Partial<NonConformite>) => {
    if (!currentUser) return;
    
    if (editingNC) {
      // Update existing NC
      setNonConformites(prev => 
        prev.map(nc => 
          nc.id === editingNC.id 
            ? { ...nc, ...ncData } 
            : nc
        )
      );
      if (selectedNC?.id === editingNC.id) {
        setSelectedNC(prev => prev ? { ...prev, ...ncData } : null);
      }
    } else {
      // Create new NC
      const newNC: NonConformite = {
        id: `nc${Date.now()}`,
        reference: `NC-2026-${String(nonConformites.length + 1).padStart(3, '0')}`,
        titre: ncData.titre || '',
        description: ncData.description || '',
        type: ncData.type || 'produit',
        gravite: ncData.gravite || 'mineure',
        statut: 'ouvert',
        poste: ncData.poste || '',
        departement: ncData.departement || '',
        declarantId: currentUser.id,
        declarantNom: `${currentUser.prenom} ${currentUser.nom}`,
        responsableId: ncData.responsableId,
        responsableNom: ncData.responsableNom,
        dateDeclaration: new Date().toISOString().split('T')[0],
        dateDetection: ncData.dateDetection || new Date().toISOString().split('T')[0],
        causeRacine: ncData.causeRacine,
        impactDescription: ncData.impactDescription,
        actions: [],
      };
      setNonConformites(prev => [newNC, ...prev]);
    }
    setShowNCForm(false);
    setEditingNC(null);
  }, [editingNC, nonConformites.length, selectedNC?.id, currentUser]);

  const handleDeleteNC = useCallback((nc: NonConformite) => {
    setDeleteConfirm({ type: 'nc', item: nc });
  }, []);

  const confirmDeleteNC = useCallback(() => {
    if (deleteConfirm?.type === 'nc') {
      setNonConformites(prev => prev.filter(nc => nc.id !== deleteConfirm.item.id));
      if (selectedNC?.id === deleteConfirm.item.id) {
        setSelectedNC(null);
        setCurrentView('nc_list');
      }
    }
    setDeleteConfirm(null);
  }, [deleteConfirm, selectedNC?.id]);

  const handleUpdateNCStatus = useCallback((ncId: string, newStatus: NonConformite['statut']) => {
    const updates: Partial<NonConformite> = { statut: newStatus };
    if (newStatus === 'clos') {
      updates.dateCloture = new Date().toISOString().split('T')[0];
    }
    
    setNonConformites(prev =>
      prev.map(nc =>
        nc.id === ncId ? { ...nc, ...updates } : nc
      )
    );
    
    if (selectedNC?.id === ncId) {
      setSelectedNC(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedNC?.id]);

  // Action handlers
  const handleAddAction = useCallback((ncId: string, actionData: Omit<ActionCorrective, 'id' | 'ncId'>) => {
    const newAction: ActionCorrective = {
      id: `a${Date.now()}`,
      ncId,
      ...actionData,
    };

    setNonConformites(prev =>
      prev.map(nc =>
        nc.id === ncId
          ? { ...nc, actions: [...nc.actions, newAction] }
          : nc
      )
    );

    if (selectedNC?.id === ncId) {
      setSelectedNC(prev =>
        prev ? { ...prev, actions: [...prev.actions, newAction] } : null
      );
    }
  }, [selectedNC?.id]);

  const handleUpdateAction = useCallback((actionId: string, updates: Partial<ActionCorrective>) => {
    setNonConformites(prev =>
      prev.map(nc => ({
        ...nc,
        actions: nc.actions.map(action =>
          action.id === actionId
            ? { 
                ...action, 
                ...updates,
                dateRealisation: updates.statut === 'termine' 
                  ? new Date().toISOString().split('T')[0] 
                  : action.dateRealisation
              }
            : action
        ),
      }))
    );

    if (selectedNC) {
      setSelectedNC(prev =>
        prev
          ? {
              ...prev,
              actions: prev.actions.map(action =>
                action.id === actionId
                  ? { 
                      ...action, 
                      ...updates,
                      dateRealisation: updates.statut === 'termine' 
                        ? new Date().toISOString().split('T')[0] 
                        : action.dateRealisation
                    }
                  : action
              ),
            }
          : null
      );
    }
  }, [selectedNC]);

  // User handlers
  const handleAddUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...userData,
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const handleEditUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setDeleteConfirm({ type: 'user', item: user });
    }
  }, [users]);

  const confirmDeleteUser = useCallback(() => {
    if (deleteConfirm?.type === 'user') {
      setUsers(prev => prev.filter(user => user.id !== deleteConfirm.item.id));
    }
    setDeleteConfirm(null);
  }, [deleteConfirm]);

  const handleToggleUserStatus = useCallback((userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  }, []);

  // Notification handlers
  const handleMarkNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, lu: true } : notif
      )
    );
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await logout();
    setCurrentView('dashboard');
    setSelectedNC(null);
  }, [logout]);

  // Render loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3498db] to-[#27ae60] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Q-TRACK</h2>
          <p className="text-gray-500 mt-1">Chargement...</p>
        </div>
      </div>
    );
  }

  // Render protected content placeholder for unauthenticated users
  const renderProtectedContent = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Lock size={40} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès restreint</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Connectez-vous pour accéder à cette fonctionnalité et gérer vos non-conformités.
      </p>
      <button
        onClick={() => setShowLoginModal(true)}
        className="px-6 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium"
      >
        Se connecter
      </button>
    </div>
  );

  // Render current view
  const renderContent = () => {
    // Dashboard is always accessible
    if (currentView === 'dashboard') {
      return (
        <Dashboard
          kpiData={kpiData}
          recentNCs={nonConformites}
          onViewNC={handleViewNC}
          onViewAllNCs={() => handleViewChange('nc_list')}
        />
      );
    }

    // Other views require authentication
    if (!isAuthenticated) {
      return renderProtectedContent();
    }

    switch (currentView) {
      case 'nc_list':
        return (
          <NCList
            nonConformites={nonConformites}
            onViewNC={handleViewNC}
            onEditNC={handleEditNC}
            onDeleteNC={handleDeleteNC}
            onCreateNC={handleCreateNC}
          />
        );
      case 'nc_detail':
        return selectedNC ? (
          <NCDetail
            nc={selectedNC}
            users={users}
            onBack={handleBackToList}
            onEdit={handleEditNC}
            onDelete={handleDeleteNC}
            onUpdateStatus={handleUpdateNCStatus}
            onAddAction={handleAddAction}
            onUpdateAction={handleUpdateAction}
          />
        ) : null;
      case 'rapports':
        return <Reports nonConformites={nonConformites} kpiData={kpiData} />;
      case 'utilisateurs':
        // Only admins can access user management
        if (authUser?.role !== 'admin') {
          return (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès non autorisé</h2>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Seuls les administrateurs peuvent accéder à la gestion des utilisateurs.
              </p>
            </div>
          );
        }
        return (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      case 'parametres':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isCollapsed={isMobile ? false : sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2942] transform transition-transform duration-300 lg:hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Header */}
        <Header
          user={authUser}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
          onLogout={handleLogout}
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenSettings={() => handleViewChange('parametres')}
          isAuthenticated={isAuthenticated}
          sessionExpiresAt={sessionExpiresAt}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* NC Form Modal */}
      {showNCForm && currentUser && (
        <NCForm
          nc={editingNC}
          users={users}
          departements={departements}
          postes={postes}
          onSave={handleSaveNC}
          onClose={() => {
            setShowNCForm(false);
            setEditingNC(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          title={deleteConfirm.type === 'nc' ? 'Supprimer la NC' : 'Supprimer l\'utilisateur'}
          message={
            deleteConfirm.type === 'nc'
              ? 'Êtes-vous sûr de vouloir supprimer cette non-conformité ?'
              : 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
          }
          itemName={
            deleteConfirm.type === 'nc'
              ? `${deleteConfirm.item.reference} - ${deleteConfirm.item.titre}`
              : `${deleteConfirm.item.prenom} ${deleteConfirm.item.nom}`
          }
          onConfirm={deleteConfirm.type === 'nc' ? confirmDeleteNC : confirmDeleteUser}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default AppLayout;

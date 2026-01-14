import React, { useState } from 'react';
import { Notification } from '@/types/qtrack';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  User as UserIcon,
  Settings,
  Menu,
  X,
  LogIn,
  Key,
  Shield
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  departement: string;
}

interface HeaderProps {
  user: AuthUser | null;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenSettings: () => void;
  isAuthenticated: boolean;
  sessionExpiresAt?: Date | null;
}

const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onMarkNotificationRead,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onLogout,
  onOpenLogin,
  onOpenSettings,
  isAuthenticated,
  sessionExpiresAt,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.lu).length;

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      admin: { label: 'Administrateur', color: 'bg-purple-100 text-purple-700' },
      qualite: { label: 'Qualité', color: 'bg-blue-100 text-blue-700' },
      production: { label: 'Production', color: 'bg-green-100 text-green-700' },
      maintenance: { label: 'Maintenance', color: 'bg-orange-100 text-orange-700' },
      standard: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-700' },
    };
    return badges[role] || badges.standard;
  };

  const formatNotificationTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons: Record<string, string> = {
      nc_nouvelle: 'bg-blue-500',
      nc_assignee: 'bg-purple-500',
      action_echeance: 'bg-red-500',
      nc_cloturee: 'bg-green-500',
      systeme: 'bg-gray-500',
    };
    return icons[type] || 'bg-gray-500';
  };

  const formatSessionExpiry = () => {
    if (!sessionExpiresAt) return null;
    const now = new Date();
    const diff = sessionExpiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Expirée';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const badge = user ? getRoleBadge(user.role) : null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher une NC, un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {isAuthenticated && user ? (
          <>
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {unreadCount} nouvelles
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                            !notif.lu ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationIcon(notif.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notif.lu ? 'font-semibold' : ''} text-gray-800 truncate`}>
                              {notif.titre}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatNotificationTime(notif.date)}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-[#3498db] hover:text-[#2980b9] font-medium">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 lg:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#3498db] to-[#2c3e50] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.prenom[0]}{user.nom[0]}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user.prenom} {user.nom}
                  </p>
                  {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <ChevronDown size={16} className="hidden lg:block text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {sessionExpiresAt && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Shield size={12} />
                        <span>Session expire dans: {formatSessionExpiry()}</span>
                      </div>
                    )}
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserIcon size={18} />
                      <span>Mon profil</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSettings();
                      }}
                      className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Paramètres</span>
                    </button>
                    <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Key size={18} />
                      <span>Changer mot de passe</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Sign In Button for unauthenticated users */
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors font-medium"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Se connecter</span>
          </button>
        )}
      </div>

      {/* Click outside handler */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;

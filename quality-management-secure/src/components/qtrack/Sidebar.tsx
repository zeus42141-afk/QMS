import React from 'react';
import { ViewType } from '@/types/qtrack';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { id: 'nc_list', label: 'Non-Conformités', icon: <AlertTriangle size={20} /> },
    { id: 'rapports', label: 'Rapports', icon: <FileText size={20} /> },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: <Users size={20} /> },
    { id: 'parametres', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#1a2942] text-white transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2c3e50]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3498db] to-[#27ae60] rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">Q-TRACK</span>
              <span className="text-xs text-gray-400 block -mt-1">by RIAHI</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-[#3498db] to-[#27ae60] rounded-lg flex items-center justify-center mx-auto">
            <Shield size={18} className="text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-[#3498db] text-white shadow-lg shadow-[#3498db]/30'
                    : 'text-gray-300 hover:bg-[#2c3e50] hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={isCollapsed ? 'mx-auto' : ''}>{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-[#2c3e50]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#2c3e50] hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="text-sm">Réduire</span>}
        </button>
      </div>

      {/* Version Info */}
      {!isCollapsed && (
        <div className="px-4 pb-4 text-center">
          <span className="text-xs text-gray-500">Version 1.0.0</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

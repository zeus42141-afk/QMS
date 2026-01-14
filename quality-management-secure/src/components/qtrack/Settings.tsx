import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Globe,
  Palette,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Clock
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      companyName: 'RIAHI Solutions',
      timezone: 'Europe/Paris',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
    },
    notifications: {
      emailNotifications: true,
      ncCreated: true,
      ncAssigned: true,
      actionDue: true,
      ncClosed: true,
      dailyDigest: false,
      weeklyReport: true,
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      loginAttempts: 5,
    },
    quality: {
      autoCloseNC: false,
      autoCloseDays: 30,
      requireApproval: true,
      defaultGravity: 'mineure',
      ncPrefix: 'NC',
    },
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Globe size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={18} /> },
    { id: 'quality', label: 'Qualité', icon: <SettingsIcon size={18} /> },
    { id: 'system', label: 'Système', icon: <Database size={18} /> },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
        <input
          type="text"
          value={settings.general.companyName}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, companyName: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, timezone: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          >
            <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="Africa/Tunis">Africa/Tunis (UTC+1)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
          <select
            value={settings.general.language}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, language: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Format de date</label>
        <select
          value={settings.general.dateFormat}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, dateFormat: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-gray-500" />
          <div>
            <p className="font-medium text-gray-800">Notifications par email</p>
            <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, emailNotifications: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3498db]"></div>
        </label>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Types de notifications</h4>
        {[
          { key: 'ncCreated', label: 'Nouvelle NC créée' },
          { key: 'ncAssigned', label: 'NC assignée' },
          { key: 'actionDue', label: 'Action arrivant à échéance' },
          { key: 'ncClosed', label: 'NC clôturée' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <span className="text-gray-600">{item.label}</span>
            <input
              type="checkbox"
              checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, [item.key]: e.target.checked }
              })}
              className="w-4 h-4 text-[#3498db] border-gray-300 rounded focus:ring-[#3498db]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-800">Rapports automatiques</h4>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-600">Résumé quotidien</span>
          <input
            type="checkbox"
            checked={settings.notifications.dailyDigest}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, dailyDigest: e.target.checked }
            })}
            className="w-4 h-4 text-[#3498db] border-gray-300 rounded focus:ring-[#3498db]"
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-600">Rapport hebdomadaire</span>
          <input
            type="checkbox"
            checked={settings.notifications.weeklyReport}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, weeklyReport: e.target.checked }
            })}
            className="w-4 h-4 text-[#3498db] border-gray-300 rounded focus:ring-[#3498db]"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiration de session (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiration mot de passe (jours)
          </label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tentatives de connexion avant blocage
        </label>
        <input
          type="number"
          value={settings.security.loginAttempts}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, loginAttempts: parseInt(e.target.value) }
          })}
          className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-gray-500" />
          <div>
            <p className="font-medium text-gray-800">Authentification à deux facteurs</p>
            <p className="text-sm text-gray-500">Sécurité renforcée pour tous les comptes</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorAuth: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3498db]"></div>
        </label>
      </div>
    </div>
  );

  const renderQualitySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Préfixe des NC</label>
        <input
          type="text"
          value={settings.quality.ncPrefix}
          onChange={(e) => setSettings({
            ...settings,
            quality: { ...settings.quality, ncPrefix: e.target.value }
          })}
          className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
        />
        <p className="text-sm text-gray-500 mt-1">Ex: NC-2026-001</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gravité par défaut</label>
        <select
          value={settings.quality.defaultGravity}
          onChange={(e) => setSettings({
            ...settings,
            quality: { ...settings.quality, defaultGravity: e.target.value }
          })}
          className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
        >
          <option value="mineure">Mineure</option>
          <option value="majeure">Majeure</option>
          <option value="critique">Critique</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-800">Approbation requise</p>
          <p className="text-sm text-gray-500">Exiger une approbation pour clôturer une NC</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.quality.requireApproval}
            onChange={(e) => setSettings({
              ...settings,
              quality: { ...settings.quality, requireApproval: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3498db]"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-800">Clôture automatique</p>
          <p className="text-sm text-gray-500">Clôturer automatiquement les NC inactives</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.quality.autoCloseNC}
            onChange={(e) => setSettings({
              ...settings,
              quality: { ...settings.quality, autoCloseNC: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3498db]"></div>
        </label>
      </div>

      {settings.quality.autoCloseNC && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Délai avant clôture automatique (jours)
          </label>
          <input
            type="number"
            value={settings.quality.autoCloseDays}
            onChange={(e) => setSettings({
              ...settings,
              quality: { ...settings.quality, autoCloseDays: parseInt(e.target.value) }
            })}
            className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
          />
        </div>
      )}
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-green-600" />
          <div>
            <p className="font-medium text-green-800">Système opérationnel</p>
            <p className="text-sm text-green-600">Tous les services fonctionnent normalement</p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive size={20} className="text-gray-500" />
            <span className="font-medium text-gray-800">Base de données</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Taille</span>
              <span className="font-medium">2.4 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Enregistrements</span>
              <span className="font-medium">15,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dernière sauvegarde</span>
              <span className="font-medium">14/01/2026 06:00</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-gray-500" />
            <span className="font-medium text-gray-800">Performance</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Temps de réponse</span>
              <span className="font-medium text-green-600">45ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Uptime</span>
              <span className="font-medium">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Actions système</h4>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <RefreshCw size={18} />
            Vider le cache
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
            <Database size={18} />
            Sauvegarder maintenant
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
            <AlertTriangle size={18} />
            Vérifier l'intégrité
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-gray-500 mt-1">Configurez votre plateforme Q-TRACK</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[#3498db] text-white hover:bg-[#2980b9]'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle size={18} />
              Enregistré !
            </>
          ) : (
            <>
              <Save size={18} />
              Enregistrer
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-[#3498db] border-b-2 border-[#3498db] bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'quality' && renderQualitySettings()}
          {activeTab === 'system' && renderSystemSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

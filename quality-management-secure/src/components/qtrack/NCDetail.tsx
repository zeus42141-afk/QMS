import React, { useState } from 'react';
import { NonConformite, ActionCorrective, ActionStatut, User } from '@/types/qtrack';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  User as UserIcon,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  ChevronRight,
  Save,
  X
} from 'lucide-react';

interface NCDetailProps {
  nc: NonConformite;
  users: User[];
  onBack: () => void;
  onEdit: (nc: NonConformite) => void;
  onDelete: (nc: NonConformite) => void;
  onUpdateStatus: (ncId: string, newStatus: NonConformite['statut']) => void;
  onAddAction: (ncId: string, action: Omit<ActionCorrective, 'id' | 'ncId'>) => void;
  onUpdateAction: (actionId: string, updates: Partial<ActionCorrective>) => void;
}

const NCDetail: React.FC<NCDetailProps> = ({
  nc,
  users,
  onBack,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddAction,
  onUpdateAction,
}) => {
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState({
    description: '',
    responsableId: '',
    dateEcheance: '',
  });

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; color: string; bgColor: string }> = {
      ouvert: { label: 'Ouvert', color: 'text-blue-700', bgColor: 'bg-blue-100' },
      en_analyse: { label: 'En analyse', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      action_lancee: { label: 'Action lancée', color: 'text-purple-700', bgColor: 'bg-purple-100' },
      clos: { label: 'Clos', color: 'text-green-700', bgColor: 'bg-green-100' },
    };
    return badges[statut] || badges.ouvert;
  };

  const getGraviteBadge = (gravite: string) => {
    const badges: Record<string, { label: string; color: string; bgColor: string }> = {
      critique: { label: 'Critique', color: 'text-red-700', bgColor: 'bg-red-100' },
      majeure: { label: 'Majeure', color: 'text-orange-700', bgColor: 'bg-orange-100' },
      mineure: { label: 'Mineure', color: 'text-gray-700', bgColor: 'bg-gray-100' },
    };
    return badges[gravite] || badges.mineure;
  };

  const getActionStatutBadge = (statut: ActionStatut) => {
    const badges: Record<ActionStatut, { label: string; color: string; icon: React.ReactNode }> = {
      non_demarre: { label: 'Non démarré', color: 'text-gray-600 bg-gray-100', icon: <Clock size={14} /> },
      en_cours: { label: 'En cours', color: 'text-blue-600 bg-blue-100', icon: <Clock size={14} /> },
      termine: { label: 'Terminé', color: 'text-green-600 bg-green-100', icon: <CheckCircle size={14} /> },
      en_retard: { label: 'En retard', color: 'text-red-600 bg-red-100', icon: <AlertTriangle size={14} /> },
    };
    return badges[statut];
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      produit: 'Produit',
      processus: 'Processus',
      fournisseur: 'Fournisseur',
      client: 'Client',
      service: 'Service',
    };
    return badges[type] || type;
  };

  const statutBadge = getStatutBadge(nc.statut);
  const graviteBadge = getGraviteBadge(nc.gravite);

  const workflowSteps = [
    { id: 'ouvert', label: 'Déclaration', completed: true },
    { id: 'en_analyse', label: 'Analyse', completed: ['en_analyse', 'action_lancee', 'clos'].includes(nc.statut) },
    { id: 'action_lancee', label: 'Action', completed: ['action_lancee', 'clos'].includes(nc.statut) },
    { id: 'clos', label: 'Clôture', completed: nc.statut === 'clos' },
  ];

  const handleAddAction = () => {
    if (newAction.description && newAction.responsableId && newAction.dateEcheance) {
      const responsable = users.find(u => u.id === newAction.responsableId);
      onAddAction(nc.id, {
        description: newAction.description,
        responsableId: newAction.responsableId,
        responsableNom: responsable ? `${responsable.prenom} ${responsable.nom}` : '',
        dateEcheance: newAction.dateEcheance,
        statut: 'non_demarre',
      });
      setNewAction({ description: '', responsableId: '', dateEcheance: '' });
      setShowAddAction(false);
    }
  };

  const nextStatus = (): NonConformite['statut'] | null => {
    switch (nc.statut) {
      case 'ouvert': return 'en_analyse';
      case 'en_analyse': return 'action_lancee';
      case 'action_lancee': return 'clos';
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{nc.reference}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${graviteBadge.bgColor} ${graviteBadge.color}`}>
                {graviteBadge.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statutBadge.bgColor} ${statutBadge.color}`}>
                {statutBadge.label}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{nc.titre}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nextStatus() && (
            <button
              onClick={() => onUpdateStatus(nc.id, nextStatus()!)}
              className="flex items-center gap-2 px-4 py-2 bg-[#27ae60] text-white rounded-lg hover:bg-[#219a52] transition-colors"
            >
              <ChevronRight size={18} />
              Passer à {getStatutBadge(nextStatus()!).label}
            </button>
          )}
          <button
            onClick={() => onEdit(nc)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit size={18} />
            Modifier
          </button>
          <button
            onClick={() => onDelete(nc)}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Progression du workflow</h3>
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-[#27ae60] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.completed ? <CheckCircle size={20} /> : <span>{index + 1}</span>}
                </div>
                <span className={`text-sm mt-2 ${step.completed ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded ${step.completed ? 'bg-[#27ae60]' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#3498db]" />
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{nc.description}</p>
          </div>

          {/* Cause Racine */}
          {nc.causeRacine && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                Cause racine
              </h3>
              <p className="text-gray-600 leading-relaxed">{nc.causeRacine}</p>
            </div>
          )}

          {/* Impact */}
          {nc.impactDescription && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-red-500" />
                Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">{nc.impactDescription}</p>
            </div>
          )}

          {/* Actions Correctives */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle size={20} className="text-[#27ae60]" />
                Actions correctives ({nc.actions.length})
              </h3>
              <button
                onClick={() => setShowAddAction(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#3498db] text-white text-sm rounded-lg hover:bg-[#2980b9] transition-colors"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>

            {/* Add Action Form */}
            {showAddAction && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Nouvelle action</h4>
                  <button onClick={() => setShowAddAction(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newAction.description}
                      onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                      rows={2}
                      placeholder="Décrivez l'action à réaliser..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                      <select
                        value={newAction.responsableId}
                        onChange={(e) => setNewAction({ ...newAction, responsableId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                      >
                        <option value="">Sélectionner...</option>
                        {users.filter(u => u.isActive).map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.prenom} {user.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Échéance</label>
                      <input
                        type="date"
                        value={newAction.dateEcheance}
                        onChange={(e) => setNewAction({ ...newAction, dateEcheance: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddAction}
                    disabled={!newAction.description || !newAction.responsableId || !newAction.dateEcheance}
                    className="flex items-center gap-2 px-4 py-2 bg-[#27ae60] text-white rounded-lg hover:bg-[#219a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} />
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {/* Actions List */}
            {nc.actions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
                <p>Aucune action corrective définie</p>
                <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter" pour créer une action</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nc.actions.map((action) => {
                  const actionBadge = getActionStatutBadge(action.statut);
                  return (
                    <div key={action.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{action.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon size={14} />
                              {action.responsableNom}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              Échéance: {new Date(action.dateEcheance).toLocaleDateString('fr-FR')}
                            </span>
                            {action.dateRealisation && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={14} />
                                Réalisé: {new Date(action.dateRealisation).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${actionBadge.color}`}>
                            {actionBadge.icon}
                            {actionBadge.label}
                          </span>
                          {action.statut !== 'termine' && (
                            <select
                              value={action.statut}
                              onChange={(e) => onUpdateAction(action.id, { statut: e.target.value as ActionStatut })}
                              className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                            >
                              <option value="non_demarre">Non démarré</option>
                              <option value="en_cours">En cours</option>
                              <option value="termine">Terminé</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Type</label>
                <p className="font-medium text-gray-800">{getTypeBadge(nc.type)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Département</label>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  {nc.departement}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Poste</label>
                <p className="font-medium text-gray-800">{nc.poste}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="text-sm text-gray-500">Déclarant</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 bg-[#3498db] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {nc.declarantNom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-gray-800">{nc.declarantNom}</span>
                </div>
              </div>
              {nc.responsableNom && (
                <div>
                  <label className="text-sm text-gray-500">Responsable</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 bg-[#27ae60] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {nc.responsableNom.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-800">{nc.responsableNom}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dates</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Date de détection</label>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(nc.dateDetection).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date de déclaration</label>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(nc.dateDeclaration).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {nc.dateCloture && (
                <div>
                  <label className="text-sm text-gray-500">Date de clôture</label>
                  <p className="font-medium text-green-600 flex items-center gap-2">
                    <CheckCircle size={16} />
                    {new Date(nc.dateCloture).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCDetail;

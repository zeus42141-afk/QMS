import React, { useState, useEffect } from 'react';
import { NonConformite, NCGravite, NCStatut, NCType, User } from '@/types/qtrack';
import { X, Save, AlertTriangle } from 'lucide-react';

interface NCFormProps {
  nc?: NonConformite | null;
  users: User[];
  departements: string[];
  postes: string[];
  onSave: (nc: Partial<NonConformite>) => void;
  onClose: () => void;
}

const NCForm: React.FC<NCFormProps> = ({
  nc,
  users,
  departements,
  postes,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'produit' as NCType,
    gravite: 'mineure' as NCGravite,
    statut: 'ouvert' as NCStatut,
    poste: '',
    departement: '',
    responsableId: '',
    dateDetection: new Date().toISOString().split('T')[0],
    causeRacine: '',
    impactDescription: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (nc) {
      setFormData({
        titre: nc.titre,
        description: nc.description,
        type: nc.type,
        gravite: nc.gravite,
        statut: nc.statut,
        poste: nc.poste,
        departement: nc.departement,
        responsableId: nc.responsableId || '',
        dateDetection: nc.dateDetection,
        causeRacine: nc.causeRacine || '',
        impactDescription: nc.impactDescription || '',
      });
    }
  }, [nc]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.departement) {
      newErrors.departement = 'Le département est requis';
    }
    if (!formData.poste) {
      newErrors.poste = 'Le poste est requis';
    }
    if (!formData.dateDetection) {
      newErrors.dateDetection = 'La date de détection est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const responsable = users.find(u => u.id === formData.responsableId);
      onSave({
        ...formData,
        responsableNom: responsable ? `${responsable.prenom} ${responsable.nom}` : undefined,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3498db] rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {nc ? 'Modifier la NC' : 'Nouvelle Non-Conformité'}
              </h2>
              <p className="text-sm text-gray-500">
                {nc ? `Modification de ${nc.reference}` : 'Déclarer une nouvelle non-conformité'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Informations générales
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => handleChange('titre', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] ${
                      errors.titre ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Titre descriptif de la non-conformité"
                  />
                  {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Décrivez en détail la non-conformité détectée..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    >
                      <option value="produit">Produit</option>
                      <option value="processus">Processus</option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="client">Client</option>
                      <option value="service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gravité</label>
                    <select
                      value={formData.gravite}
                      onChange={(e) => handleChange('gravite', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    >
                      <option value="mineure">Mineure</option>
                      <option value="majeure">Majeure</option>
                      <option value="critique">Critique</option>
                    </select>
                  </div>

                  {nc && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <select
                        value={formData.statut}
                        onChange={(e) => handleChange('statut', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                      >
                        <option value="ouvert">Ouvert</option>
                        <option value="en_analyse">En analyse</option>
                        <option value="action_lancee">Action lancée</option>
                        <option value="clos">Clos</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Localisation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departement}
                    onChange={(e) => handleChange('departement', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] ${
                      errors.departement ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionner un département</option>
                    {departements.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                  {errors.departement && <p className="text-red-500 text-sm mt-1">{errors.departement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.poste}
                    onChange={(e) => handleChange('poste', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] ${
                      errors.poste ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionner un poste</option>
                    {postes.map((poste) => (
                      <option key={poste} value={poste}>{poste}</option>
                    ))}
                  </select>
                  {errors.poste && <p className="text-red-500 text-sm mt-1">{errors.poste}</p>}
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Affectation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de détection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateDetection}
                    onChange={(e) => handleChange('dateDetection', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] ${
                      errors.dateDetection ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.dateDetection && <p className="text-red-500 text-sm mt-1">{errors.dateDetection}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsable
                  </label>
                  <select
                    value={formData.responsableId}
                    onChange={(e) => handleChange('responsableId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                  >
                    <option value="">Non assigné</option>
                    {users.filter(u => u.isActive).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom} - {user.departement}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Analyse (optionnel)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cause racine
                  </label>
                  <textarea
                    value={formData.causeRacine}
                    onChange={(e) => handleChange('causeRacine', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Identifiez la cause racine du problème..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de l'impact
                  </label>
                  <textarea
                    value={formData.impactDescription}
                    onChange={(e) => handleChange('impactDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    placeholder="Décrivez l'impact de cette non-conformité..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
          >
            <Save size={18} />
            {nc ? 'Enregistrer' : 'Créer la NC'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NCForm;

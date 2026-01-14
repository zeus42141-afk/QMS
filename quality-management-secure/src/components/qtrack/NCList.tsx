import React, { useState, useMemo } from 'react';
import { NonConformite, NCGravite, NCStatut, NCType } from '@/types/qtrack';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Grid,
  List,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface NCListProps {
  nonConformites: NonConformite[];
  onViewNC: (nc: NonConformite) => void;
  onEditNC: (nc: NonConformite) => void;
  onDeleteNC: (nc: NonConformite) => void;
  onCreateNC: () => void;
}

const NCList: React.FC<NCListProps> = ({
  nonConformites,
  onViewNC,
  onEditNC,
  onDeleteNC,
  onCreateNC,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGravite, setFilterGravite] = useState<NCGravite | 'all'>('all');
  const [filterStatut, setFilterStatut] = useState<NCStatut | 'all'>('all');
  const [filterType, setFilterType] = useState<NCType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'gravite' | 'statut'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredNCs = useMemo(() => {
    let result = [...nonConformites];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (nc) =>
          nc.reference.toLowerCase().includes(query) ||
          nc.titre.toLowerCase().includes(query) ||
          nc.description.toLowerCase().includes(query) ||
          nc.declarantNom.toLowerCase().includes(query)
      );
    }

    // Gravité filter
    if (filterGravite !== 'all') {
      result = result.filter((nc) => nc.gravite === filterGravite);
    }

    // Statut filter
    if (filterStatut !== 'all') {
      result = result.filter((nc) => nc.statut === filterStatut);
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter((nc) => nc.type === filterType);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateDeclaration).getTime() - new Date(b.dateDeclaration).getTime();
          break;
        case 'gravite':
          const graviteOrder = { critique: 3, majeure: 2, mineure: 1 };
          comparison = graviteOrder[a.gravite] - graviteOrder[b.gravite];
          break;
        case 'statut':
          const statutOrder = { ouvert: 1, en_analyse: 2, action_lancee: 3, clos: 4 };
          comparison = statutOrder[a.statut] - statutOrder[b.statut];
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [nonConformites, searchQuery, filterGravite, filterStatut, filterType, sortBy, sortOrder]);

  const getStatutBadge = (statut: NCStatut) => {
    const badges: Record<NCStatut, { label: string; color: string; icon: React.ReactNode }> = {
      ouvert: { label: 'Ouvert', color: 'bg-blue-100 text-blue-700', icon: <AlertCircle size={14} /> },
      en_analyse: { label: 'En analyse', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> },
      action_lancee: { label: 'Action lancée', color: 'bg-purple-100 text-purple-700', icon: <AlertTriangle size={14} /> },
      clos: { label: 'Clos', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
    };
    return badges[statut];
  };

  const getGraviteBadge = (gravite: NCGravite) => {
    const badges: Record<NCGravite, { label: string; color: string }> = {
      critique: { label: 'Critique', color: 'bg-red-100 text-red-700 border-red-200' },
      majeure: { label: 'Majeure', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      mineure: { label: 'Mineure', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    };
    return badges[gravite];
  };

  const getTypeBadge = (type: NCType) => {
    const badges: Record<NCType, { label: string; color: string }> = {
      produit: { label: 'Produit', color: 'bg-blue-50 text-blue-600' },
      processus: { label: 'Processus', color: 'bg-purple-50 text-purple-600' },
      fournisseur: { label: 'Fournisseur', color: 'bg-orange-50 text-orange-600' },
      client: { label: 'Client', color: 'bg-green-50 text-green-600' },
      service: { label: 'Service', color: 'bg-teal-50 text-teal-600' },
    };
    return badges[type];
  };

  const stats = useMemo(() => ({
    total: nonConformites.length,
    ouvertes: nonConformites.filter(nc => nc.statut === 'ouvert').length,
    enAnalyse: nonConformites.filter(nc => nc.statut === 'en_analyse').length,
    actionLancee: nonConformites.filter(nc => nc.statut === 'action_lancee').length,
    closes: nonConformites.filter(nc => nc.statut === 'clos').length,
  }), [nonConformites]);

  // Kanban view component
  const KanbanView = () => {
    const columns: { statut: NCStatut; label: string; color: string }[] = [
      { statut: 'ouvert', label: 'Ouvert', color: 'border-blue-400' },
      { statut: 'en_analyse', label: 'En analyse', color: 'border-yellow-400' },
      { statut: 'action_lancee', label: 'Action lancée', color: 'border-purple-400' },
      { statut: 'clos', label: 'Clos', color: 'border-green-400' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnNCs = filteredNCs.filter(nc => nc.statut === col.statut);
          return (
            <div key={col.statut} className={`bg-gray-50 rounded-xl p-4 border-t-4 ${col.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{col.label}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                  {columnNCs.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnNCs.map((nc) => {
                  const graviteBadge = getGraviteBadge(nc.gravite);
                  return (
                    <div
                      key={nc.id}
                      onClick={() => onViewNC(nc)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-[#3498db]">{nc.reference}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${graviteBadge.color}`}>
                          {graviteBadge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{nc.titre}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{nc.departement}</span>
                        <span>{new Date(nc.dateDeclaration).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Grid view component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredNCs.map((nc) => {
        const statutBadge = getStatutBadge(nc.statut);
        const graviteBadge = getGraviteBadge(nc.gravite);
        const typeBadge = getTypeBadge(nc.type);
        return (
          <div
            key={nc.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => onViewNC(nc)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-semibold text-[#3498db]">{nc.reference}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${graviteBadge.color}`}>
                {graviteBadge.label}
              </span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{nc.titre}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{nc.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 text-xs rounded-full ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${statutBadge.color}`}>
                {statutBadge.icon}
                {statutBadge.label}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                  {nc.declarantNom.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-xs text-gray-500">{nc.declarantNom}</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(nc.dateDeclaration).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Table view component
  const TableView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gravité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Déclarant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredNCs.map((nc) => {
              const statutBadge = getStatutBadge(nc.statut);
              const graviteBadge = getGraviteBadge(nc.gravite);
              const typeBadge = getTypeBadge(nc.type);
              return (
                <tr key={nc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#3498db] cursor-pointer hover:underline" onClick={() => onViewNC(nc)}>
                      {nc.reference}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 line-clamp-1 max-w-xs">{nc.titre}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${graviteBadge.color}`}>
                      {graviteBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${statutBadge.color}`}>
                      {statutBadge.icon}
                      {statutBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {nc.declarantNom.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-600">{nc.declarantNom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(nc.dateDeclaration).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === nc.id ? null : nc.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      {activeMenu === nc.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewNC(nc);
                              setActiveMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye size={14} /> Voir détails
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditNC(nc);
                              setActiveMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit size={14} /> Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNC(nc);
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
      {filteredNCs.length === 0 && (
        <div className="px-6 py-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune non-conformité trouvée</p>
          <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Non-Conformités</h1>
          <p className="text-gray-500 mt-1">Gérez et suivez toutes les non-conformités</p>
        </div>
        <button
          onClick={onCreateNC}
          className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors shadow-lg shadow-[#3498db]/30"
        >
          <Plus size={20} />
          Nouvelle NC
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.ouvertes}</p>
          <p className="text-sm text-blue-600">Ouvertes</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-100 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.enAnalyse}</p>
          <p className="text-sm text-yellow-600">En analyse</p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-100 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.actionLancee}</p>
          <p className="text-sm text-purple-600">Action lancée</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.closes}</p>
          <p className="text-sm text-green-600">Closes</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par référence, titre, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-[#3498db] text-white border-[#3498db]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            Filtres
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-[#3498db] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              title="Vue tableau"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#3498db] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              title="Vue grille"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 ${viewMode === 'kanban' ? 'bg-[#3498db] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              title="Vue Kanban"
            >
              <Calendar size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gravité</label>
              <select
                value={filterGravite}
                onChange={(e) => setFilterGravite(e.target.value as NCGravite | 'all')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              >
                <option value="all">Toutes</option>
                <option value="critique">Critique</option>
                <option value="majeure">Majeure</option>
                <option value="mineure">Mineure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value as NCStatut | 'all')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              >
                <option value="all">Tous</option>
                <option value="ouvert">Ouvert</option>
                <option value="en_analyse">En analyse</option>
                <option value="action_lancee">Action lancée</option>
                <option value="clos">Clos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as NCType | 'all')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              >
                <option value="all">Tous</option>
                <option value="produit">Produit</option>
                <option value="processus">Processus</option>
                <option value="fournisseur">Fournisseur</option>
                <option value="client">Client</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'gravite' | 'statut')}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                >
                  <option value="date">Date</option>
                  <option value="gravite">Gravité</option>
                  <option value="statut">Statut</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredNCs.length} résultat{filteredNCs.length !== 1 ? 's' : ''} trouvé{filteredNCs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'table' && <TableView />}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'kanban' && <KanbanView />}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
};

export default NCList;

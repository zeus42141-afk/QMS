import React, { useState } from 'react';
import { NonConformite, KPIData } from '@/types/qtrack';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart2,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  RefreshCw
} from 'lucide-react';

interface ReportsProps {
  nonConformites: NonConformite[];
  kpiData: KPIData;
}

const Reports: React.FC<ReportsProps> = ({ nonConformites, kpiData }) => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [filterGravite, setFilterGravite] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const reportTypes = [
    {
      id: 'nc_summary',
      title: 'Synthèse des NC',
      description: 'Vue d\'ensemble des non-conformités par période',
      icon: <BarChart2 size={24} />,
      color: 'bg-blue-500',
    },
    {
      id: 'nc_by_type',
      title: 'NC par type',
      description: 'Répartition des NC par catégorie',
      icon: <PieChart size={24} />,
      color: 'bg-purple-500',
    },
    {
      id: 'nc_trend',
      title: 'Tendances',
      description: 'Évolution des NC dans le temps',
      icon: <TrendingUp size={24} />,
      color: 'bg-green-500',
    },
    {
      id: 'actions_status',
      title: 'Suivi des actions',
      description: 'État des actions correctives',
      icon: <FileText size={24} />,
      color: 'bg-orange-500',
    },
    {
      id: 'performance',
      title: 'Performance qualité',
      description: 'Indicateurs de performance KPI',
      icon: <BarChart2 size={24} />,
      color: 'bg-teal-500',
    },
    {
      id: 'detailed_list',
      title: 'Liste détaillée',
      description: 'Export complet des NC',
      icon: <FileSpreadsheet size={24} />,
      color: 'bg-indigo-500',
    },
  ];

  const filteredNCs = nonConformites.filter(nc => {
    const ncDate = new Date(nc.dateDeclaration);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const dateMatch = ncDate >= startDate && ncDate <= endDate;
    const graviteMatch = filterGravite === 'all' || nc.gravite === filterGravite;
    const typeMatch = filterType === 'all' || nc.type === filterType;
    
    return dateMatch && graviteMatch && typeMatch;
  });

  const stats = {
    total: filteredNCs.length,
    ouvertes: filteredNCs.filter(nc => nc.statut === 'ouvert').length,
    closes: filteredNCs.filter(nc => nc.statut === 'clos').length,
    critiques: filteredNCs.filter(nc => nc.gravite === 'critique').length,
    majeures: filteredNCs.filter(nc => nc.gravite === 'majeure').length,
    mineures: filteredNCs.filter(nc => nc.gravite === 'mineure').length,
    actionsTotal: filteredNCs.reduce((sum, nc) => sum + nc.actions.length, 0),
    actionsTerminees: filteredNCs.reduce(
      (sum, nc) => sum + nc.actions.filter(a => a.statut === 'termine').length,
      0
    ),
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate export
    alert(`Export ${format.toUpperCase()} en cours de génération...`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Simple bar chart for reports
  const ReportBarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-700`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rapports & Analytics</h1>
          <p className="text-gray-500 mt-1">Générez et exportez vos rapports qualité</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Download size={18} />
            PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer size={18} />
            Imprimer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500" />
          <span className="font-medium text-gray-800">Filtres du rapport</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gravité</label>
            <select
              value={filterGravite}
              onChange={(e) => setFilterGravite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            >
              <option value="all">Toutes</option>
              <option value="critique">Critique</option>
              <option value="majeure">Majeure</option>
              <option value="mineure">Mineure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
            className={`p-5 rounded-xl border text-left transition-all ${
              selectedReport === report.id
                ? 'border-[#3498db] bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center text-white`}>
                {report.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{report.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-[#3498db]" />
            <h3 className="font-semibold text-gray-800">Aperçu du rapport</h3>
          </div>
          <button className="flex items-center gap-2 text-sm text-[#3498db] hover:text-[#2980b9]">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>

        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-blue-600">NC Totales</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.closes}</p>
              <p className="text-sm text-green-600">NC Closes</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{stats.critiques}</p>
              <p className="text-sm text-red-600">Critiques</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {stats.actionsTotal > 0 ? Math.round((stats.actionsTerminees / stats.actionsTotal) * 100) : 0}%
              </p>
              <p className="text-sm text-purple-600">Actions terminées</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NC by Gravity */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Répartition par gravité</h4>
              <ReportBarChart
                data={[
                  { label: 'Critique', value: stats.critiques, color: 'bg-red-500' },
                  { label: 'Majeure', value: stats.majeures, color: 'bg-orange-500' },
                  { label: 'Mineure', value: stats.mineures, color: 'bg-gray-400' },
                ]}
              />
            </div>

            {/* NC by Status */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Répartition par statut</h4>
              <ReportBarChart
                data={[
                  { label: 'Ouvert', value: filteredNCs.filter(nc => nc.statut === 'ouvert').length, color: 'bg-blue-500' },
                  { label: 'En analyse', value: filteredNCs.filter(nc => nc.statut === 'en_analyse').length, color: 'bg-yellow-500' },
                  { label: 'Action lancée', value: filteredNCs.filter(nc => nc.statut === 'action_lancee').length, color: 'bg-purple-500' },
                  { label: 'Clos', value: filteredNCs.filter(nc => nc.statut === 'clos').length, color: 'bg-green-500' },
                ]}
              />
            </div>

            {/* NC by Type */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Répartition par type</h4>
              <ReportBarChart
                data={[
                  { label: 'Produit', value: filteredNCs.filter(nc => nc.type === 'produit').length, color: 'bg-blue-500' },
                  { label: 'Processus', value: filteredNCs.filter(nc => nc.type === 'processus').length, color: 'bg-purple-500' },
                  { label: 'Fournisseur', value: filteredNCs.filter(nc => nc.type === 'fournisseur').length, color: 'bg-orange-500' },
                  { label: 'Client', value: filteredNCs.filter(nc => nc.type === 'client').length, color: 'bg-green-500' },
                  { label: 'Service', value: filteredNCs.filter(nc => nc.type === 'service').length, color: 'bg-teal-500' },
                ]}
              />
            </div>

            {/* KPI Summary */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Indicateurs clés</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Taux de résolution</span>
                  <span className="font-semibold text-green-600">{kpiData.tauxResolution}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Temps moyen de résolution</span>
                  <span className="font-semibold text-blue-600">{kpiData.tempsResolutionMoyen} jours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Actions en retard</span>
                  <span className="font-semibold text-red-600">{kpiData.actionsEnRetard}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">NC ouvertes</span>
                  <span className="font-semibold text-orange-600">{kpiData.ncOuvertes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent NC Table */}
          <div className="mt-8">
            <h4 className="font-semibold text-gray-800 mb-4">Dernières non-conformités</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gravité</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredNCs.slice(0, 10).map((nc) => (
                    <tr key={nc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-[#3498db]">{nc.reference}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{nc.titre}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{nc.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          nc.gravite === 'critique' ? 'bg-red-100 text-red-700' :
                          nc.gravite === 'majeure' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {nc.gravite}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          nc.statut === 'ouvert' ? 'bg-blue-100 text-blue-700' :
                          nc.statut === 'en_analyse' ? 'bg-yellow-100 text-yellow-700' :
                          nc.statut === 'action_lancee' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {nc.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(nc.dateDeclaration).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

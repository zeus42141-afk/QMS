import React from 'react';
import { KPIData, NonConformite } from '@/types/qtrack';
import KPICard from './KPICard';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  FileWarning,
  Activity
} from 'lucide-react';

interface DashboardProps {
  kpiData: KPIData;
  recentNCs: NonConformite[];
  onViewNC: (nc: NonConformite) => void;
  onViewAllNCs: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  kpiData,
  recentNCs,
  onViewNC,
  onViewAllNCs,
}) => {
  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      ouvert: { label: 'Ouvert', color: 'bg-blue-100 text-blue-700' },
      en_analyse: { label: 'En analyse', color: 'bg-yellow-100 text-yellow-700' },
      action_lancee: { label: 'Action lancée', color: 'bg-purple-100 text-purple-700' },
      clos: { label: 'Clos', color: 'bg-green-100 text-green-700' },
    };
    return badges[statut] || badges.ouvert;
  };

  const getGraviteBadge = (gravite: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      critique: { label: 'Critique', color: 'bg-red-100 text-red-700' },
      majeure: { label: 'Majeure', color: 'bg-orange-100 text-orange-700' },
      mineure: { label: 'Mineure', color: 'bg-gray-100 text-gray-700' },
    };
    return badges[gravite] || badges.mineure;
  };

  // Simple bar chart component
  const SimpleBarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Donut chart component
  const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Line chart component
  const LineChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item.value - minValue) / range) * 80 - 10;
      return { x, y, value: item.value, label: item.label };
    });
    
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L 100 100 L 0 100 Z`;
    
    return (
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3498db" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3498db" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#lineGradient)" />
          <path d={pathD} fill="none" stroke="#3498db" strokeWidth="2" className="drop-shadow-sm" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3498db" className="drop-shadow-sm" />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500">{item.label}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2c3e50] to-[#3498db] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Tableau de bord Qualité</h1>
        <p className="text-blue-100">
          Bienvenue sur Q-TRACK. Voici un aperçu de vos indicateurs qualité.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-xs text-blue-200">Dernière mise à jour</p>
            <p className="font-medium">14 janvier 2026, 14:41</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-xs text-blue-200">Période</p>
            <p className="font-medium">Janvier 2026</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="NC Ouvertes"
          value={kpiData.ncOuvertes}
          subtitle="Non-conformités actives"
          icon={<AlertTriangle size={24} />}
          color="blue"
          trend={{ value: -15, direction: 'down', label: 'vs mois dernier' }}
          onClick={onViewAllNCs}
        />
        <KPICard
          title="NC Critiques"
          value={kpiData.ncCritiques}
          subtitle="Nécessitent attention immédiate"
          icon={<AlertCircle size={24} />}
          color="red"
          trend={{ value: 0, direction: 'neutral', label: 'stable' }}
        />
        <KPICard
          title="Actions en retard"
          value={kpiData.actionsEnRetard}
          subtitle="Échéances dépassées"
          icon={<Clock size={24} />}
          color="orange"
          trend={{ value: 25, direction: 'up', label: 'vs mois dernier' }}
        />
        <KPICard
          title="Taux de résolution"
          value={`${kpiData.tauxResolution}%`}
          subtitle="NC clôturées / Total"
          icon={<Target size={24} />}
          color="green"
          trend={{ value: 5, direction: 'down', label: 'amélioration' }}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="NC Totales (2026)"
          value={kpiData.ncTotales}
          icon={<FileWarning size={24} />}
          color="purple"
        />
        <KPICard
          title="NC Majeures"
          value={kpiData.ncMajeures}
          icon={<AlertTriangle size={24} />}
          color="orange"
        />
        <KPICard
          title="NC Mineures"
          value={kpiData.ncMineures}
          icon={<Activity size={24} />}
          color="teal"
        />
        <KPICard
          title="Temps moyen résolution"
          value={`${kpiData.tempsResolutionMoyen}j`}
          subtitle="Objectif: < 15 jours"
          icon={<TrendingUp size={24} />}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NC Evolution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des NC</h3>
          <LineChart data={kpiData.ncParMois.map(d => ({ label: d.mois, value: d.count }))} />
        </div>

        {/* NC by Gravity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition par gravité</h3>
          <DonutChart
            data={[
              { label: 'Critique', value: kpiData.ncParGravite[0]?.count || 0, color: '#ef4444' },
              { label: 'Majeure', value: kpiData.ncParGravite[1]?.count || 0, color: '#f97316' },
              { label: 'Mineure', value: kpiData.ncParGravite[2]?.count || 0, color: '#6b7280' },
            ]}
          />
        </div>

        {/* NC by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">NC par type</h3>
          <SimpleBarChart
            data={kpiData.ncParType.map((d, i) => ({
              label: d.type,
              value: d.count,
              color: ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-teal-500'][i],
            }))}
          />
        </div>

        {/* NC by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">NC par statut</h3>
          <SimpleBarChart
            data={kpiData.ncParStatut.map((d, i) => ({
              label: d.statut,
              value: d.count,
              color: ['bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500'][i],
            }))}
          />
        </div>
      </div>

      {/* Recent NCs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Non-Conformités récentes</h3>
          <button
            onClick={onViewAllNCs}
            className="text-sm text-[#3498db] hover:text-[#2980b9] font-medium"
          >
            Voir tout
          </button>
        </div>
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
                  Gravité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentNCs.slice(0, 5).map((nc) => {
                const statutBadge = getStatutBadge(nc.statut);
                const graviteBadge = getGraviteBadge(nc.gravite);
                return (
                  <tr
                    key={nc.id}
                    onClick={() => onViewNC(nc)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#3498db]">{nc.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 line-clamp-1">{nc.titre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${graviteBadge.color}`}>
                        {graviteBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statutBadge.color}`}>
                        {statutBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(nc.dateDeclaration).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

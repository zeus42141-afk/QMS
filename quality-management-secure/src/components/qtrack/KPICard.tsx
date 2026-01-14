import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'teal';
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-100',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-100',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-500',
      text: 'text-orange-600',
      border: 'border-orange-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    teal: {
      bg: 'bg-teal-50',
      icon: 'bg-teal-500',
      text: 'text-teal-600',
      border: 'border-teal-100',
    },
  };

  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp size={14} />;
      case 'down':
        return <TrendingDown size={14} />;
      default:
        return <Minus size={14} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    // For most metrics, down is good (fewer issues)
    if (trend.direction === 'down') return 'text-green-600 bg-green-50';
    if (trend.direction === 'up') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-lg transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-gray-400">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KPICard;

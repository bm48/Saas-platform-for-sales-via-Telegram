import { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Target, PieChart, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const METRIC_KEYS = ['totalSales', 'revenue', 'activeUsers', 'conversionRate'] as const;

export default function Statistics() {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | '90D'>('30D');
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const weekdayLabels = t('statistics.weekdays', { returnObjects: true }) as string[];

  const data30 = useMemo(
    () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10),
    [selectedPeriod]
  );
  const data90 = useMemo(
    () => Array.from({ length: 90 }, () => Math.floor(Math.random() * 60) + 5),
    [selectedPeriod]
  );

  const timeData = {
    '7D': { labels: weekdayLabels, data: [12, 15, 8, 22, 18, 25, 20] },
    '30D': { labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`), data: data30 },
    '90D': { labels: Array.from({ length: 90 }, (_, i) => `${i + 1}`), data: data90 },
  };

  const currentData = timeData[selectedPeriod];

  const stats = METRIC_KEYS.map((key) => ({
    key,
    label: t(`statistics.metrics.${key}`),
    value: t(`statistics.values.${key}`),
    change: t(`statistics.changes.${key}`),
    icon: [Target, DollarSign, Users, TrendingUp][METRIC_KEYS.indexOf(key)],
    color: ['text-green-400', 'text-green-400', 'text-blue-400', 'text-teal-400'][METRIC_KEYS.indexOf(key)],
  }));

  const salesByProduct = [
    { nameKey: 'premium' as const, sales: 342, revenue: 15420.50, percentage: 35 },
    { nameKey: 'basic' as const, sales: 298, revenue: 8940.00, percentage: 28 },
    { nameKey: 'proTools' as const, sales: 187, revenue: 11220.00, percentage: 22 },
    { nameKey: 'consultation' as const, sales: 142, revenue: 7100.00, percentage: 15 },
  ];

  const conversionFunnel = [
    { stageKey: 'visitors' as const, count: 10500 },
    { stageKey: 'interested' as const, count: 3150 },
    { stageKey: 'cart' as const, count: 1260 },
    { stageKey: 'checkout' as const, count: 630 },
    { stageKey: 'completed' as const, count: 336 },
  ];
  const funnelTopCount = conversionFunnel[0].count;

  const activities = t('statistics.activities', { returnObjects: true }) as {
    time: string;
    action: string;
    amount: string;
  }[];

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('statistics.title')}</h1>
            <p className="text-gray-400 mt-2">{t('statistics.subtitle')}</p>
          </div>
          <div className="flex space-x-2">
            {(['7D', '30D', '90D'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {t(`statistics.period.${period}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-teal-400" />
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BarChart3 className="mr-3 text-teal-400" />
                {t('statistics.salesTrend')}
              </h3>
            </div>
            
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y * 2}
                    x2="800"
                    y2={y * 2}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}

                {currentData.data.slice(0, 20).map((value, index) => {
                  const maxValue = Math.max(...currentData.data);
                  const barHeight = (value / maxValue) * 180;
                  const x = (index / 19) * 780 + 10;
                  
                  return (
                    <rect
                      key={index}
                      x={x}
                      y={200 - barHeight}
                      width="30"
                      height={barHeight}
                      fill="#14B8A6"
                      className="hover:fill-teal-400 transition-colors"
                      rx="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="mr-3 text-teal-400" />
              {t('statistics.conversionFunnel')}
            </h3>
            
            <div className="space-y-4">
              {conversionFunnel.map((stage) => {
                const pctOfTop = (stage.count / funnelTopCount) * 100;
                const pctLabel = pctOfTop.toLocaleString(locale, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                });
                return (
                  <div key={stage.stageKey} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{t(`statistics.funnel.${stage.stageKey}`)}</span>
                      <span className="text-gray-400">
                        {stage.count.toLocaleString(locale)} ({pctLabel}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, pctOfTop)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <PieChart className="mr-3 text-teal-400" />
            {t('statistics.productsPerformance')}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesByProduct.map((product) => (
              <div key={product.nameKey} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <h4 className="text-white font-semibold mb-2">{t(`statistics.productNames.${product.nameKey}`)}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('statistics.salesLabel')}</span>
                    <span className="text-white">{product.sales}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('statistics.revenueLabel')}</span>
                    <span className="text-white">R$ {product.revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${product.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{t('statistics.percentOfTotal', { pct: product.percentage })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="mr-3 text-teal-400" />
            {t('statistics.recentActivity')}
          </h3>
          
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  index % 3 === 0 ? 'bg-green-400' :
                  index % 3 === 1 ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                {activity.amount && (
                  <span className="text-teal-400 font-semibold">{activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

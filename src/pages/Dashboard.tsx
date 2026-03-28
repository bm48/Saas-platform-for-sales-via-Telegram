import {
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SalesChart from '../components/SalesChart';
import StatsCard from '../components/StatsCard';
import RankingBanner from '../components/RankingBanner';
import UsersStats from '../components/UsersStats';
import ActivityLog from '../components/ActivityLog';

export default function Dashboard() {
  const { t } = useTranslation();
  const todayStats = {
    sales: 0,
    revenue: 0
  };

  const monthStats = {
    sales: 86,
    revenue: 1003.39
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <RankingBanner />

        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-300">{t('dashboard.viewAllBots')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">{t('dashboard.viewingMetricsFor')}</span>
            <select className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-teal-500 focus:outline-none">
              <option>{t('dashboard.allBots')}</option>
              <option>{t('dashboard.botN', { n: 1 })}</option>
              <option>{t('dashboard.botN', { n: 2 })}</option>
              <option>{t('dashboard.botN', { n: 3 })}</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <StatsCard
            title={t('dashboard.today')}
            icon={Calendar}
            sales={todayStats.sales}
            revenue={todayStats.revenue}
          />
          <StatsCard
            title={t('dashboard.month')}
            icon={TrendingUp}
            sales={monthStats.sales}
            revenue={monthStats.revenue}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>

          <div className="space-y-6">
            <UsersStats />
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}

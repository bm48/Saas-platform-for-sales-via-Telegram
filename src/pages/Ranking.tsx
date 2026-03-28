import { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const rankingData = [
  { position: 1, username: 'ProSeller2025', sales: 342, revenue: 15420.50, avatar: '🏆', badge: 'Gold' },
  { position: 2, username: 'SalesKing', sales: 298, revenue: 13240.20, avatar: '🥇', badge: 'Silver' },
  { position: 3, username: 'TopBot', sales: 267, revenue: 11890.75, avatar: '🥈', badge: 'Bronze' },
  { position: 4, username: 'MegaSales', sales: 234, revenue: 10456.30, avatar: '⭐', badge: 'Rising' },
  { position: 5, username: 'BotMaster', sales: 198, revenue: 8942.15, avatar: '🚀', badge: 'Pro' },
  { position: 6, username: 'SalesBot Pro', sales: 187, revenue: 8321.40, avatar: '💎', badge: 'Elite' },
  { position: 7, username: 'AutoSeller', sales: 165, revenue: 7234.80, avatar: '🔥', badge: 'Hot' },
  { position: 8, username: 'QuickBot', sales: 142, revenue: 6789.25, avatar: '⚡', badge: 'Fast' },
  { position: 9, username: 'SmartSales', sales: 128, revenue: 5892.60, avatar: '🧠', badge: 'Smart' },
  { position: 10, username: 'PowerBot', sales: 115, revenue: 5234.90, avatar: '💪', badge: 'Strong' },
];

const PERIODS = ['daily', 'weekly', 'monthly'] as const;

export default function Ranking() {
  const { t, i18n } = useTranslation();
  const [timeframe, setTimeframe] = useState<(typeof PERIODS)[number]>('monthly');
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold': return 'bg-yellow-500 text-yellow-900';
      case 'Silver': return 'bg-gray-400 text-gray-900';
      case 'Bronze': return 'bg-orange-500 text-orange-900';
      default: return 'bg-teal-500 text-teal-900';
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Trophy className="text-gray-400" size={24} />;
      case 3: return <Medal className="text-orange-400" size={24} />;
      default: return <Star className="text-teal-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('ranking.title')}</h1>
          <p className="text-gray-400 text-lg">{t('ranking.subtitle')}</p>
        </div>

        <div className="flex justify-center space-x-4">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                timeframe === period
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t(`ranking.period.${period}`)}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <div className="flex items-end justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="relative bg-gradient-to-br from-gray-400 to-gray-600 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trophy className="text-gray-900" size={40} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2°
                </div>
              </div>
              <h3 className="text-white font-bold text-lg">{rankingData[1].username}</h3>
              <p className="text-gray-400">{t('ranking.salesCount', { count: rankingData[1].sales })}</p>
              <p className="text-xl font-bold text-white">R$ {rankingData[1].revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-24 h-24 rounded-full flex items-center justify-center mb-4 mx-auto relative">
                <Crown className="text-yellow-900" size={48} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1°
                </div>
              </div>
              <h3 className="text-white font-bold text-xl">{rankingData[0].username}</h3>
              <p className="text-gray-400">{t('ranking.salesCount', { count: rankingData[0].sales })}</p>
              <p className="text-2xl font-bold text-white">R$ {rankingData[0].revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="text-center">
              <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Medal className="text-orange-900" size={40} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-orange-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3°
                </div>
              </div>
              <h3 className="text-white font-bold text-lg">{rankingData[2].username}</h3>
              <p className="text-gray-400">{t('ranking.salesCount', { count: rankingData[2].sales })}</p>
              <p className="text-xl font-bold text-white">R$ {rankingData[2].revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 text-teal-400" />
              {t('ranking.completeRanking')}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('ranking.table.position')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('ranking.table.user')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('ranking.table.sales')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('ranking.table.revenue')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('ranking.table.badge')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rankingData.map((user) => (
                  <tr key={user.position} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(user.position)}
                        <span className="text-white font-bold">#{user.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <span className="text-white font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{user.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">
                        R$ {user.revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(user.badge)}`}>
                        {t(`ranking.badges.${user.badge}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

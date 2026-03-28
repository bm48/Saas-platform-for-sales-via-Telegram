import { Users, Calendar, TrendingUp, UserCheck, UserPlus, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UsersStats() {
  const { t } = useTranslation();

  const userStats = [
    { labelKey: 'today' as const, value: 1, icon: Calendar },
    { labelKey: 'month' as const, value: 283, icon: TrendingUp },
    { labelKey: 'active' as const, value: 1961, icon: Users },
    { labelKey: 'total' as const, value: 2611, icon: UserCheck },
    { labelKey: 'blocked' as const, value: 650, icon: UserPlus },
    { labelKey: 'subscriptions' as const, value: 255, icon: Award },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users size={24} className="text-teal-500" />
        <h3 className="text-xl font-bold text-white">{t('usersStats.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {userStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.labelKey} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon size={16} className="text-gray-400" />
                <span className="text-gray-300">{t(`usersStats.${stat.labelKey}`)}</span>
              </div>
              <span className="text-white font-semibold">{stat.value.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

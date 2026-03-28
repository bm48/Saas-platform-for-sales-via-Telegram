import { Activity, MessageCircle, DollarSign, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ActivityItem = { message: string; detail: string; time: string };
type ActivityKind = 'message' | 'sale' | 'payment' | 'error';

const ACTIVITY_KINDS: ActivityKind[] = [
  'message', 'sale', 'sale', 'message', 'payment', 'error', 'sale', 'message', 'payment', 'sale',
];

export default function ActivityLog() {
  const { t } = useTranslation();
  const activities = t('dashboard.activity', { returnObjects: true }) as ActivityItem[];

  const getIcon = (kind: ActivityKind) => {
    switch (kind) {
      case 'message':
        return MessageCircle;
      case 'sale':
      case 'payment':
        return DollarSign;
      case 'error':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (kind: ActivityKind) => {
    switch (kind) {
      case 'sale':
      case 'payment':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'message':
        return 'text-blue-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity size={24} className="text-teal-500" />
        <h3 className="text-xl font-bold text-white">{t('activityLog.title')}</h3>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const kind = ACTIVITY_KINDS[index] ?? 'message';
          const Icon = getIcon(kind);
          return (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
              <Icon size={16} className={`mt-1 ${getStatusColor(kind)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{activity.message}</p>
                <p className="text-gray-400 text-xs">{activity.detail}</p>
              </div>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

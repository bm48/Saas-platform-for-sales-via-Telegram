import { useMemo, useState } from 'react';
import { Activity, Eye, MousePointer, Users, TrendingUp, Calendar, Filter, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type EventKey = 'pageView' | 'buttonClick' | 'formSubmit' | 'purchase' | 'download' | 'videoPlay';
type DeviceKey = 'desktop' | 'mobile' | 'tablet';

const trackingData: {
  id: number;
  event: EventKey;
  page: string;
  userId: number;
  timestamp: string;
  ip: string;
  device: DeviceKey;
}[] = [
  { id: 1, event: 'pageView', page: '/landing', userId: 4825, timestamp: '2025-01-10 14:32:15', ip: '192.168.1.100', device: 'desktop' },
  { id: 2, event: 'buttonClick', page: '/product', userId: 4826, timestamp: '2025-01-10 14:31:42', ip: '10.0.0.25', device: 'mobile' },
  { id: 3, event: 'formSubmit', page: '/contact', userId: 4827, timestamp: '2025-01-10 14:30:18', ip: '172.16.0.5', device: 'tablet' },
  { id: 4, event: 'purchase', page: '/checkout', userId: 4828, timestamp: '2025-01-10 14:29:55', ip: '192.168.1.200', device: 'desktop' },
  { id: 5, event: 'download', page: '/resources', userId: 4829, timestamp: '2025-01-10 14:28:33', ip: '10.0.0.50', device: 'mobile' },
  { id: 6, event: 'videoPlay', page: '/demo', userId: 4830, timestamp: '2025-01-10 14:27:21', ip: '172.16.0.10', device: 'desktop' },
  { id: 7, event: 'pageView', page: '/about', userId: 4831, timestamp: '2025-01-10 14:26:44', ip: '192.168.1.150', device: 'mobile' },
  { id: 8, event: 'formSubmit', page: '/products', userId: 4832, timestamp: '2025-01-10 14:25:17', ip: '10.0.0.75', device: 'tablet' },
  { id: 9, event: 'purchase', page: '/register', userId: 4833, timestamp: '2025-01-10 14:24:03', ip: '172.16.0.15', device: 'desktop' },
  { id: 10, event: 'formSubmit', page: '/shop', userId: 4834, timestamp: '2025-01-10 14:22:39', ip: '192.168.1.75', device: 'mobile' },
];

const pageViews = [
  { page: '/landing', views: 2847, uniqueVisitors: 1923, bounceRate: '23.4%' },
  { page: '/product', views: 1654, uniqueVisitors: 1245, bounceRate: '18.7%' },
  { page: '/checkout', views: 892, uniqueVisitors: 756, bounceRate: '12.3%' },
  { page: '/about', views: 743, uniqueVisitors: 634, bounceRate: '35.2%' },
  { page: '/contact', views: 567, uniqueVisitors: 489, bounceRate: '28.6%' },
  { page: '/demo', views: 456, uniqueVisitors: 389, bounceRate: '31.8%' },
  { page: '/resources', views: 398, uniqueVisitors: 321, bounceRate: '42.1%' },
  { page: '/shop', views: 287, uniqueVisitors: 234, bounceRate: '15.9%' },
  { page: '/register', views: 234, uniqueVisitors: 198, bounceRate: '8.4%' },
  { page: '/products', views: 189, uniqueVisitors: 156, bounceRate: '25.7%' },
];

const EVENT_OPTIONS: (EventKey | 'all')[] = ['all', 'pageView', 'buttonClick', 'formSubmit', 'purchase', 'download', 'videoPlay'];
const DEVICE_OPTIONS: (DeviceKey | 'all')[] = ['all', 'desktop', 'mobile', 'tablet'];

export default function Tracking() {
  const { t, i18n } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<EventKey | 'all'>('all');
  const [selectedDevice, setSelectedDevice] = useState<DeviceKey | 'all'>('all');
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const timeOpts = t('tracking.timeOpts', { returnObjects: true }) as string[];

  const stats = useMemo(
    () => [
      { labelKey: 'totalEvents' as const, valueKey: 'e' as const, changeKey: 'e' as const, icon: Activity, color: 'text-green-400' },
      { labelKey: 'pageViews' as const, valueKey: 'pv' as const, changeKey: 'pv' as const, icon: Eye, color: 'text-blue-400' },
      { labelKey: 'uniqueVisitors' as const, valueKey: 'uv' as const, changeKey: 'uv' as const, icon: Users, color: 'text-teal-400' },
      { labelKey: 'conversionRate' as const, valueKey: 'cr' as const, changeKey: 'cr' as const, icon: TrendingUp, color: 'text-purple-400' },
    ],
    []
  );

  const getEventIcon = (event: EventKey) => {
    switch (event) {
      case 'pageView':
        return <Eye size={16} className="text-blue-400" />;
      case 'buttonClick':
        return <MousePointer size={16} className="text-green-400" />;
      case 'formSubmit':
        return <Activity size={16} className="text-orange-400" />;
      case 'purchase':
        return <TrendingUp size={16} className="text-green-500" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getDeviceIcon = (device: DeviceKey) => {
    switch (device) {
      case 'desktop':
        return '🖥️';
      case 'mobile':
      case 'tablet':
        return '📱';
      default:
        return '💻';
    }
  };

  const filteredData = trackingData.filter(item => {
    const matchesEvent = selectedEvent === 'all' || item.event === selectedEvent;
    const matchesDevice = selectedDevice === 'all' || item.device === selectedDevice;
    return matchesEvent && matchesDevice;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Activity className="mr-3 text-teal-400" />
              {t('tracking.title')}
              <span className="ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">{t('sidebar.badgeNew')}</span>
            </h1>
            <p className="text-gray-400 mt-2">{t('tracking.subtitle')}</p>
          </div>
          <div className="flex space-x-4">
            <button type="button" className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Calendar size={20} />
              <span>{t('tracking.last24h')}</span>
            </button>
            <button type="button" className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <ExternalLink size={20} />
              <span>{t('tracking.export')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-teal-400" />
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {t(`tracking.statChanges.${stat.changeKey}`)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{t(`tracking.statValues.${stat.valueKey}`)}</h3>
                <p className="text-gray-400 text-sm">{t(`tracking.stats.${stat.labelKey}`)}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Filter className="mr-2 text-teal-400" />
              {t('tracking.filters')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('tracking.eventType')}</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value as EventKey | 'all')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
              >
                {EVENT_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {key === 'all' ? t('tracking.allEvents') : t(`tracking.eventKeys.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('tracking.deviceType')}</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value as DeviceKey | 'all')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
              >
                {DEVICE_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {key === 'all' ? t('tracking.allDevices') : t(`tracking.deviceKeys.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('tracking.timeRange')}</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none">
                {timeOpts.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t('tracking.realtimeTitle', { count: filteredData.length })}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">{t('tracking.live')}</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredData.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                  {getEventIcon(item.event)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{t(`tracking.eventKeys.${item.event}`)}</span>
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{item.page}</span>
                      <span>•</span>
                      <span>{t('common.userWithId', { id: item.userId })}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <span>{getDeviceIcon(item.device)}</span>
                        <span>{t(`tracking.deviceKeys.${item.device}`)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {item.ip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Eye className="mr-2 text-teal-400" />
              {t('tracking.pagePerformance')}
            </h3>
            
            <div className="space-y-4">
              {pageViews.map((page) => (
                <div key={page.page} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{page.page}</span>
                    <span className="text-teal-400 text-sm">{page.views.toLocaleString(locale)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                    <div>
                      <span>{t('tracking.uniqueShort')} {page.uniqueVisitors.toLocaleString(locale)}</span>
                    </div>
                    <div>
                      <span>{t('tracking.bounceShort')} {page.bounceRate}</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(page.views / Math.max(...pageViews.map(p => p.views))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">{t('tracking.heatmapTitle')}</h3>
          
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h4 className="text-xl text-white mb-2">{t('tracking.heatmapHeading')}</h4>
            <p className="text-gray-400 mb-4">{t('tracking.heatmapDesc')}</p>
            <button type="button" className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              {t('tracking.viewHeatmap')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

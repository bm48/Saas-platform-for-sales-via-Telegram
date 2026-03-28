import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  sales: number;
  revenue: number;
}

export default function StatsCard({ title, icon: Icon, sales, revenue }: StatsCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Icon size={24} className="text-teal-500" />
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-400">{t('statsCard.sales', { count: sales })}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            R$ {revenue.toLocaleString(locale, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}

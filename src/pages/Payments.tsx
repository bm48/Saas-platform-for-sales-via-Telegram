import { useMemo, useState } from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle, Eye, Filter, Download, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const paymentData = [
  { id: '001', customer: 'João Silva', amount: 29.90, status: 'completed' as const, method: 'pix' as const, date: '2025-01-10 14:32', product: 'Premium Course' },
  { id: '002', customer: 'Maria Santos', amount: 49.90, status: 'pending' as const, method: 'credit_card' as const, date: '2025-01-10 13:15', product: 'Pro Tools' },
  { id: '003', customer: 'Carlos Lima', amount: 19.90, status: 'completed' as const, method: 'pix' as const, date: '2025-01-10 12:48', product: 'Basic Package' },
  { id: '004', customer: 'Ana Costa', amount: 99.90, status: 'failed' as const, method: 'credit_card' as const, date: '2025-01-10 11:22', product: 'Premium Course' },
  { id: '005', customer: 'Pedro Oliveira', amount: 15.50, status: 'completed' as const, method: 'pix' as const, date: '2025-01-10 10:55', product: 'Consultation' },
  { id: '006', customer: 'Julia Ferreira', amount: 79.90, status: 'completed' as const, method: 'credit_card' as const, date: '2025-01-10 09:30', product: 'Pro Tools' },
  { id: '007', customer: 'Roberto Souza', amount: 39.90, status: 'pending' as const, method: 'pix' as const, date: '2025-01-10 08:45', product: 'Basic Package' },
  { id: '008', customer: 'Fernanda Cruz', amount: 129.90, status: 'completed' as const, method: 'credit_card' as const, date: '2025-01-09 17:20', product: 'Premium Course' },
  { id: '009', customer: 'Lucas Alves', amount: 25.90, status: 'refunded' as const, method: 'pix' as const, date: '2025-01-09 16:10', product: 'Basic Package' },
  { id: '010', customer: 'Camila Rocha', amount: 59.90, status: 'completed' as const, method: 'pix' as const, date: '2025-01-09 15:33', product: 'Pro Tools' },
];

export default function Payments() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'refunded':
        return <DollarSign size={16} className="text-orange-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'pix':
        return '🔔';
      case 'credit_card':
        return '💳';
      default:
        return '💰';
    }
  };

  const filteredPayments = paymentData.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.includes(searchTerm) ||
                         payment.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = paymentData
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = paymentData
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = useMemo(
    () => [
      { labelKey: 'totalRevenue' as const, value: `R$ ${totalRevenue.toLocaleString(locale, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-400' },
      { labelKey: 'pending' as const, value: `R$ ${pendingAmount.toLocaleString(locale, { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-yellow-400' },
      { labelKey: 'transactions' as const, value: paymentData.length.toString(), icon: CreditCard, color: 'text-blue-400' },
      { labelKey: 'successRate' as const, value: `${((paymentData.filter(p => p.status === 'completed').length / paymentData.length) * 100).toFixed(1)}%`, icon: CheckCircle, color: 'text-teal-400' },
    ],
    [locale, totalRevenue, pendingAmount]
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('payments.title')}</h1>
            <p className="text-gray-400 mt-2">{t('payments.subtitle')}</p>
          </div>
          <button type="button" className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            <Download size={20} />
            <span>{t('payments.export')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{t(`payments.stats.${stat.labelKey}`)}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('payments.searchPh')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="all">{t('payments.allStatus')}</option>
              <option value="completed">{t('payments.status.completed')}</option>
              <option value="pending">{t('payments.status.pending')}</option>
              <option value="failed">{t('payments.status.failed')}</option>
              <option value="refunded">{t('payments.status.refunded')}</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="all">{t('payments.allMethods')}</option>
              <option value="pix">{t('payments.methods.pix')}</option>
              <option value="credit_card">{t('payments.methods.credit_card')}</option>
            </select>

            <button type="button" className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Filter size={20} />
              <span>{t('payments.filter')}</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="mr-3 text-teal-400" />
              {t('payments.recentTitle', { count: filteredPayments.length })}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.id')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.customer')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.product')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.amount')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.method')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.status')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.date')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('payments.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-teal-400 font-mono">{payment.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{payment.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{payment.product}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">
                        R$ {payment.amount.toLocaleString(locale, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMethodIcon(payment.method)}</span>
                        <span className="text-gray-300">{t(`payments.methods.${payment.method}`)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span>{t(`payments.status.${payment.status}`)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{payment.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button type="button" className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                        <Eye size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">{t('payments.emptyTitle')}</h3>
              <p className="text-gray-500">{t('payments.emptyDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

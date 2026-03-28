import { useCallback, useMemo, useState } from 'react';
import { ExternalLink, Plus, CreditCard as EditIcon, Trash2, Copy, BarChart3, Eye, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RedirectRow = {
  id: number;
  name: string;
  shortUrl: string;
  destination: string;
  clicks: number;
  created: string;
  status: 'active' | 'paused' | 'expired';
};

const INITIAL_REDIRECTS: RedirectRow[] = [
  { id: 1, name: 'Product Launch', shortUrl: 'tg.pro/launch', destination: 'https://example.com/product-launch', clicks: 2847, created: '2025-01-08', status: 'active' },
  { id: 2, name: 'Special Offer', shortUrl: 'tg.pro/offer50', destination: 'https://example.com/special-offer', clicks: 1923, created: '2025-01-07', status: 'active' },
  { id: 3, name: 'Free Trial', shortUrl: 'tg.pro/trial', destination: 'https://example.com/free-trial', clicks: 1654, created: '2025-01-06', status: 'active' },
  { id: 4, name: 'Demo Video', shortUrl: 'tg.pro/demo', destination: 'https://youtube.com/watch?v=demo123', clicks: 1245, created: '2025-01-05', status: 'active' },
  { id: 5, name: 'Support Center', shortUrl: 'tg.pro/help', destination: 'https://help.example.com', clicks: 892, created: '2025-01-04', status: 'active' },
  { id: 6, name: 'Webinar Registration', shortUrl: 'tg.pro/webinar', destination: 'https://zoom.us/webinar/123', clicks: 756, created: '2025-01-03', status: 'paused' },
  { id: 7, name: 'Blog Article', shortUrl: 'tg.pro/blog-ai', destination: 'https://blog.example.com/ai-trends', clicks: 634, created: '2025-01-02', status: 'active' },
  { id: 8, name: 'Contact Form', shortUrl: 'tg.pro/contact', destination: 'https://example.com/contact-us', clicks: 543, created: '2025-01-01', status: 'active' },
  { id: 9, name: 'Pricing Page', shortUrl: 'tg.pro/pricing', destination: 'https://example.com/pricing', clicks: 432, created: '2024-12-31', status: 'active' },
  { id: 10, name: 'Download App', shortUrl: 'tg.pro/app', destination: 'https://app.example.com/download', clicks: 321, created: '2024-12-30', status: 'active' },
];

export default function Redirectors() {
  const { t, i18n } = useTranslation();
  const [redirectList, setRedirectList] = useState<RedirectRow[]>(() => [...INITIAL_REDIRECTS]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRedirect, setNewRedirect] = useState({
    name: '',
    shortUrl: '',
    destination: '',
    description: ''
  });
  const [toast, setToast] = useState<string | null>(null);
  const [viewRow, setViewRow] = useState<RedirectRow | null>(null);
  const [editRow, setEditRow] = useState<RedirectRow | null>(null);
  const [editDraft, setEditDraft] = useState({ name: '', shortUrl: '', destination: '' });

  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const totalClicks = redirectList.reduce((sum, r) => sum + r.clicks, 0);
  const activeRedirects = redirectList.filter(r => r.status === 'active').length;

  const stats = useMemo(() => {
    const len = redirectList.length || 1;
    return [
      { labelKey: 'total' as const, value: redirectList.length.toString(), icon: ExternalLink, color: 'text-blue-400' },
      { labelKey: 'active' as const, value: activeRedirects.toString(), icon: TrendingUp, color: 'text-green-400' },
      { labelKey: 'clicks' as const, value: totalClicks.toLocaleString(locale), icon: BarChart3, color: 'text-teal-400' },
      { labelKey: 'avg' as const, value: Math.round(totalClicks / len).toString(), icon: Eye, color: 'text-purple-400' },
    ];
  }, [redirectList.length, activeRedirects, totalClicks, locale]);

  const handleCreateRedirect = () => {
    if (newRedirect.name.trim() && newRedirect.shortUrl.trim() && newRedirect.destination.trim()) {
      const slug = newRedirect.shortUrl.replace(/^tg\.pro\//, '').trim();
      const id = Math.max(0, ...redirectList.map((r) => r.id)) + 1;
      setRedirectList((list) => [
        ...list,
        {
          id,
          name: newRedirect.name.trim(),
          shortUrl: `tg.pro/${slug}`,
          destination: newRedirect.destination.trim(),
          clicks: 0,
          created: new Date().toISOString().slice(0, 10),
          status: 'active',
        },
      ]);
      showToast(t('common.saved'));
    }
    setShowCreateModal(false);
    setNewRedirect({ name: '', shortUrl: '', destination: '', description: '' });
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(`https://${text}`);
    showToast(t('common.copied'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const openEdit = (r: RedirectRow) => {
    setEditRow(r);
    setEditDraft({ name: r.name, shortUrl: r.shortUrl.replace(/^tg\.pro\//, ''), destination: r.destination });
  };

  const saveEdit = () => {
    if (!editRow) return;
    const slug = editDraft.shortUrl.replace(/^tg\.pro\//, '').trim();
    setRedirectList((list) =>
      list.map((x) =>
        x.id === editRow.id
          ? {
              ...x,
              name: editDraft.name.trim() || x.name,
              shortUrl: slug ? `tg.pro/${slug}` : x.shortUrl,
              destination: editDraft.destination.trim() || x.destination,
            }
          : x
      )
    );
    setEditRow(null);
    showToast(t('common.saved'));
  };

  const deleteRow = (id: number) => {
    setRedirectList((list) => list.filter((r) => r.id !== id));
    showToast(t('common.deleted'));
  };

  const maxClicks = Math.max(...redirectList.map((r) => r.clicks), 1);

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg bg-teal-600 text-white text-sm shadow-lg max-w-sm">
          {toast}
        </div>
      )}

      {viewRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{t('common.redirectDetails')}</h3>
            <dl className="space-y-2 text-sm text-gray-300">
              <div><dt className="text-gray-500">{t('redirectors.table.name')}</dt><dd className="text-white">{viewRow.name}</dd></div>
              <div><dt className="text-gray-500">{t('redirectors.table.shortUrl')}</dt><dd className="text-teal-400 font-mono">{viewRow.shortUrl}</dd></div>
              <div><dt className="text-gray-500">{t('redirectors.table.destination')}</dt><dd className="break-all">{viewRow.destination}</dd></div>
              <div><dt className="text-gray-500">{t('redirectors.table.clicks')}</dt><dd>{viewRow.clicks.toLocaleString(locale)}</dd></div>
              <div><dt className="text-gray-500">{t('redirectors.table.status')}</dt><dd>{t(`redirectors.status.${viewRow.status}`)}</dd></div>
            </dl>
            <button type="button" onClick={() => setViewRow(null)} className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-lg">
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{t('common.editRedirect')}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">{t('redirectors.redirectName')}</label>
                <input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">{t('redirectors.shortUrl')} (path)</label>
                <input
                  value={editDraft.shortUrl}
                  onChange={(e) => setEditDraft((d) => ({ ...d, shortUrl: e.target.value }))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  placeholder="tg.pro/..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">{t('redirectors.destinationUrl')}</label>
                <input
                  value={editDraft.destination}
                  onChange={(e) => setEditDraft((d) => ({ ...d, destination: e.target.value }))}
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={saveEdit} className="px-4 py-2 bg-teal-500 text-white rounded-lg">
                {t('common.save')}
              </button>
              <button type="button" onClick={() => setEditRow(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('redirectors.title')}</h1>
            <p className="text-gray-400 mt-2">{t('redirectors.subtitle')}</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus size={20} />
            <span>{t('redirectors.newRedirect')}</span>
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
                <p className="text-gray-400 text-sm">{t(`redirectors.stats.${stat.labelKey}`)}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <ExternalLink className="mr-3 text-teal-400" />
              {t('redirectors.yourRedirects', { count: redirectList.length })}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.name')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.shortUrl')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.destination')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.clicks')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.status')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.created')}</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">{t('redirectors.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {redirectList.map((redirect) => (
                  <tr key={redirect.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{redirect.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-teal-400 font-mono text-sm">{redirect.shortUrl}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(redirect.shortUrl)}
                          className="p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                        >
                          <Copy size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm truncate max-w-xs block">
                        {redirect.destination}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <BarChart3 size={16} className="text-teal-400" />
                        <span className="text-white font-semibold">{redirect.clicks.toLocaleString(locale)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(redirect.status)}`}>
                        {t(`redirectors.status.${redirect.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{redirect.created}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button type="button" onClick={() => setViewRow(redirect)} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                          <Eye size={16} className="text-gray-400" />
                        </button>
                        <button type="button" onClick={() => openEdit(redirect)} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                          <EditIcon size={16} className="text-gray-400" />
                        </button>
                        <button type="button" onClick={() => deleteRow(redirect.id)} className="p-2 bg-gray-700 rounded hover:bg-red-600 transition-colors">
                          <Trash2 size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{t('redirectors.modalTitle')}</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('redirectors.redirectName')}</label>
                  <input
                    type="text"
                    value={newRedirect.name}
                    onChange={(e) => setNewRedirect({...newRedirect, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    placeholder={t('redirectors.redirectNamePh')}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">{t('redirectors.shortUrl')}</label>
                  <div className="flex items-center">
                    <span className="bg-gray-700 px-4 py-3 text-gray-300 border border-gray-600 rounded-l-lg border-r-0">
                      tg.pro/
                    </span>
                    <input
                      type="text"
                      value={newRedirect.shortUrl}
                      onChange={(e) => setNewRedirect({...newRedirect, shortUrl: e.target.value})}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-r-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                      placeholder="your-custom-path"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{t('redirectors.shortUrlHint')}</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">{t('redirectors.destinationUrl')}</label>
                  <input
                    type="url"
                    value={newRedirect.destination}
                    onChange={(e) => setNewRedirect({...newRedirect, destination: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    placeholder={t('redirectors.destinationPh')}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">{t('redirectors.description')}</label>
                  <textarea
                    rows={3}
                    value={newRedirect.description}
                    onChange={(e) => setNewRedirect({...newRedirect, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                    placeholder={t('redirectors.descriptionPh')}
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCreateRedirect}
                    className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
                  >
                    {t('redirectors.create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    {t('redirectors.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">{t('redirectors.topPerforming')}</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redirectList.slice(0, 6).map((redirect) => (
              <div key={redirect.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold truncate">{redirect.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(redirect.status)}`}>
                    {t(`redirectors.status.${redirect.status}`)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('redirectors.shortUrlLabel')}</span>
                    <span className="text-teal-400 font-mono">{redirect.shortUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('redirectors.clicksLabel')}</span>
                    <span className="text-white font-semibold">{redirect.clicks.toLocaleString(locale)}</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(redirect.clicks / maxClicks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useMemo, useState } from 'react';
import { Mail, Send, Users, Calendar, Eye, CreditCard as EditIcon, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Campaign = {
  id: number;
  name: string;
  recipients: number;
  sent: string;
  openRate: string;
  status: 'completed' | 'scheduled' | 'draft';
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Welcome Series', recipients: 1247, sent: '2025-01-10', openRate: '24.5%', status: 'completed' },
  { id: 2, name: 'Product Launch', recipients: 892, sent: '2025-01-09', openRate: '18.2%', status: 'completed' },
  { id: 3, name: 'Holiday Special', recipients: 1534, sent: '2025-01-08', openRate: '31.7%', status: 'completed' },
  { id: 4, name: 'Abandoned Cart', recipients: 456, sent: '2025-01-07', openRate: '15.3%', status: 'completed' },
  { id: 5, name: 'Re-engagement', recipients: 623, sent: '2025-01-06', openRate: '12.8%', status: 'completed' },
  { id: 6, name: 'Newsletter #12', recipients: 1789, sent: '2025-01-05', openRate: '28.4%', status: 'completed' },
  { id: 7, name: 'Flash Sale', recipients: 1023, sent: '2025-01-04', openRate: '35.6%', status: 'completed' },
  { id: 8, name: 'Customer Survey', recipients: 567, sent: '2025-01-03', openRate: '19.2%', status: 'completed' },
  { id: 9, name: 'New Features', recipients: 1456, sent: '2025-01-02', openRate: '22.1%', status: 'completed' },
  { id: 10, name: 'Year End Review', recipients: 2134, sent: '2025-01-01', openRate: '29.8%', status: 'completed' },
];

type Template = {
  id: number;
  name: string;
  category: string;
  lastUsed: string;
  body: string;
};

const INITIAL_TEMPLATES: Template[] = [
  { id: 1, name: 'Welcome Email', category: 'Onboarding', lastUsed: '2025-01-10', body: 'Hi {{name}}, welcome aboard!' },
  { id: 2, name: 'Product Announcement', category: 'Marketing', lastUsed: '2025-01-09', body: 'We are excited to announce...' },
  { id: 3, name: 'Cart Abandonment', category: 'Sales', lastUsed: '2025-01-08', body: 'You left items in your cart.' },
  { id: 4, name: 'Newsletter Template', category: 'Content', lastUsed: '2025-01-07', body: 'Monthly newsletter issue.' },
  { id: 5, name: 'Special Offer', category: 'Promotions', lastUsed: '2025-01-06', body: 'Limited time: 20% off!' },
];

type TabId = 'campaigns' | 'templates' | 'compose';

export default function Mailing() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => [...INITIAL_CAMPAIGNS]);
  const [templates, setTemplates] = useState<Template[]>(() => [...INITIAL_TEMPLATES]);
  const [toast, setToast] = useState<string | null>(null);

  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editCampaignDraft, setEditCampaignDraft] = useState({ name: '', recipients: '' });

  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [editTemplateDraft, setEditTemplateDraft] = useState({ name: '', category: '', body: '' });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    recipients: 'all',
    template: '',
    content: ''
  });

  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const statConfig = useMemo(
    () =>
      [
        { labelKey: 'totalSent' as const, valueKey: 'totalSent' as const, icon: Mail, color: 'text-blue-400' },
        { labelKey: 'openRate' as const, valueKey: 'openRate' as const, icon: Eye, color: 'text-green-400' },
        { labelKey: 'activeSubscribers' as const, valueKey: 'activeSubscribers' as const, icon: Users, color: 'text-teal-400' },
        { labelKey: 'thisMonth' as const, valueKey: 'thisMonth' as const, icon: Calendar, color: 'text-purple-400' },
      ] as const,
    []
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const navTabs: { id: TabId; icon: typeof Mail }[] = [
    { id: 'campaigns', icon: Mail },
    { id: 'templates', icon: EditIcon },
    { id: 'compose', icon: Plus },
  ];

  const openEditCampaign = (c: Campaign) => {
    setEditCampaign(c);
    setEditCampaignDraft({
      name: c.name,
      recipients: String(c.recipients),
    });
  };

  const saveEditCampaign = () => {
    if (!editCampaign) return;
    const n = parseInt(editCampaignDraft.recipients, 10);
    setCampaigns((list) =>
      list.map((x) =>
        x.id === editCampaign.id
          ? {
              ...x,
              name: editCampaignDraft.name.trim() || x.name,
              recipients: Number.isFinite(n) ? n : x.recipients,
            }
          : x
      )
    );
    setEditCampaign(null);
    showToast(t('common.saved'));
  };

  const deleteCampaign = (id: number) => {
    setCampaigns((list) => list.filter((c) => c.id !== id));
    showToast(t('common.deleted'));
  };

  const openEditTemplate = (tpl: Template) => {
    setEditTemplate(tpl);
    setEditTemplateDraft({ name: tpl.name, category: tpl.category, body: tpl.body });
  };

  const saveEditTemplate = () => {
    if (!editTemplate) return;
    setTemplates((list) =>
      list.map((tpl) =>
        tpl.id === editTemplate.id
          ? {
              ...tpl,
              name: editTemplateDraft.name.trim() || tpl.name,
              category: editTemplateDraft.category.trim() || tpl.category,
              body: editTemplateDraft.body,
            }
          : tpl
      )
    );
    showToast(t('common.saved'));
    setEditTemplate(null);
  };

  const useTemplate = (tpl: Template) => {
    setNewCampaign((nc) => ({
      ...nc,
      template: String(tpl.id),
      content: tpl.body,
      subject: nc.subject || tpl.name,
    }));
    setActiveTab('compose');
    showToast(t('common.templateApplied'));
  };

  const handleComposeSend = () => {
    if (!newCampaign.name.trim() || !newCampaign.subject.trim()) {
      showToast(t('common.fillComposeFields'));
      return;
    }
    showToast(t('common.emailSent'));
  };

  const handleComposeDraft = () => {
    showToast(t('common.draftSaved'));
  };

  const handleComposeSchedule = () => {
    showToast(t('common.scheduled'));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg bg-teal-600 text-white text-sm shadow-lg max-w-sm">
          {toast}
        </div>
      )}

      {viewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{t('common.campaignDetails')}</h3>
            <dl className="space-y-2 text-gray-300 text-sm">
              <div><dt className="text-gray-500">{t('mailing.table.campaign')}</dt><dd className="text-white">{viewCampaign.name}</dd></div>
              <div><dt className="text-gray-500">{t('mailing.table.recipients')}</dt><dd>{viewCampaign.recipients.toLocaleString(locale)}</dd></div>
              <div><dt className="text-gray-500">{t('mailing.table.sentDate')}</dt><dd>{viewCampaign.sent}</dd></div>
              <div><dt className="text-gray-500">{t('mailing.table.openRate')}</dt><dd>{viewCampaign.openRate}</dd></div>
            </dl>
            <button type="button" onClick={() => setViewCampaign(null)} className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-lg">
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{t('common.editCampaign')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">{t('mailing.campaignName')}</label>
                <input
                  value={editCampaignDraft.name}
                  onChange={(e) => setEditCampaignDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">{t('mailing.table.recipients')}</label>
                <input
                  type="number"
                  value={editCampaignDraft.recipients}
                  onChange={(e) => setEditCampaignDraft((d) => ({ ...d, recipients: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={saveEditCampaign} className="px-4 py-2 bg-teal-500 text-white rounded-lg">
                {t('common.save')}
              </button>
              <button type="button" onClick={() => setEditCampaign(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">{viewTemplate.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{viewTemplate.category}</p>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">{viewTemplate.body}</pre>
            <button type="button" onClick={() => setViewTemplate(null)} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg">
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{t('mailing.templatesTitle')}</h3>
            <div className="space-y-3">
              <input
                value={editTemplateDraft.name}
                onChange={(e) => setEditTemplateDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <input
                value={editTemplateDraft.category}
                onChange={(e) => setEditTemplateDraft((d) => ({ ...d, category: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <textarea
                rows={6}
                value={editTemplateDraft.body}
                onChange={(e) => setEditTemplateDraft((d) => ({ ...d, body: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={saveEditTemplate} className="px-4 py-2 bg-teal-500 text-white rounded-lg">
                {t('common.save')}
              </button>
              <button type="button" onClick={() => setEditTemplate(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('mailing.title')}</h1>
            <p className="text-gray-400 mt-2">{t('mailing.subtitle')}</p>
          </div>
          <button 
            type="button"
            onClick={() => setActiveTab('compose')}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus size={20} />
            <span>{t('mailing.newCampaign')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{t(`mailing.statValues.${stat.valueKey}`)}</h3>
                <p className="text-gray-400 text-sm">{t(`mailing.stats.${stat.labelKey}`)}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gray-700 text-teal-400 border-b-2 border-teal-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-750'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{t(`mailing.tabs.${tab.id}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'campaigns' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">{t('mailing.campaignsTitle')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.campaign')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.recipients')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.sentDate')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.openRate')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.status')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('mailing.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-750 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{campaign.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300">{campaign.recipients.toLocaleString(locale)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400">{campaign.sent}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-teal-400 font-semibold">{campaign.openRate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                              {t(`mailing.status.${campaign.status}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button type="button" onClick={() => setViewCampaign(campaign)} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors" aria-label="View">
                                <Eye size={16} className="text-gray-400" />
                              </button>
                              <button type="button" onClick={() => openEditCampaign(campaign)} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors" aria-label="Edit">
                                <EditIcon size={16} className="text-gray-400" />
                              </button>
                              <button type="button" onClick={() => deleteCampaign(campaign.id)} className="p-2 bg-gray-700 rounded hover:bg-red-600 transition-colors" aria-label="Delete">
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
            )}

            {activeTab === 'templates' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{t('mailing.templatesTitle')}</h3>
                  <button
                    type="button"
                    onClick={() => showToast(t('common.newTemplateNote'))}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>{t('mailing.newTemplate')}</span>
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">{template.name}</h4>
                        <div className="flex space-x-2">
                          <button type="button" onClick={() => setViewTemplate(template)} className="p-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                            <Eye size={16} className="text-gray-400" />
                          </button>
                          <button type="button" onClick={() => openEditTemplate(template)} className="p-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                            <EditIcon size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">{t('mailing.category')} <span className="text-teal-400">{template.category}</span></p>
                        <p className="text-sm text-gray-400">{t('mailing.lastUsed')} {template.lastUsed}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => useTemplate(template)}
                        className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                      >
                        {t('mailing.useTemplate')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compose' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">{t('mailing.createTitle')}</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">{t('mailing.campaignName')}</label>
                      <input
                        type="text"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                        placeholder={t('mailing.campaignNamePh')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">{t('mailing.subjectLine')}</label>
                      <input
                        type="text"
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                        placeholder={t('mailing.subjectPh')}
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">{t('mailing.recipients')}</label>
                      <select
                        value={newCampaign.recipients}
                        onChange={(e) => setNewCampaign({...newCampaign, recipients: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                      >
                        <option value="all">{t('mailing.recipientOpts.all')}</option>
                        <option value="active">{t('mailing.recipientOpts.active')}</option>
                        <option value="new">{t('mailing.recipientOpts.new')}</option>
                        <option value="premium">{t('mailing.recipientOpts.premium')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">{t('mailing.template')}</label>
                      <select
                        value={newCampaign.template}
                        onChange={(e) => setNewCampaign({...newCampaign, template: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                      >
                        <option value="">{t('mailing.selectTemplate')}</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">{t('mailing.emailContent')}</label>
                    <textarea
                      rows={15}
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none resize-none"
                      placeholder={t('mailing.contentPh')}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button type="button" onClick={handleComposeSend} className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2">
                    <Send size={20} />
                    <span>{t('mailing.sendNow')}</span>
                  </button>
                  <button type="button" onClick={handleComposeDraft} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    {t('mailing.saveDraft')}
                  </button>
                  <button type="button" onClick={handleComposeSchedule} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('mailing.schedule')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

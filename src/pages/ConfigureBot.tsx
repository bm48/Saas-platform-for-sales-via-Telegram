import { useCallback, useMemo, useState } from 'react';
import { Bot, Settings, Key, Share, Code, Zap, Users, Webhook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tab = 'profile' | 'variables' | 'shareKey' | 'configKey' | 'edit' | 'downsell' | 'upsell' | 'salesCode' | 'autoApproval' | 'leadCapture' | 'webhook';

const TAB_IDS: Tab[] = [
  'profile', 'variables', 'shareKey', 'configKey', 'edit', 'downsell', 'upsell',
  'salesCode', 'autoApproval', 'leadCapture', 'webhook',
];

const TAB_ICONS: Record<Tab, typeof Bot> = {
  profile: Bot,
  variables: Code,
  shareKey: Share,
  configKey: Key,
  edit: Settings,
  downsell: Zap,
  upsell: Zap,
  salesCode: Code,
  autoApproval: Settings,
  leadCapture: Users,
  webhook: Webhook,
};

type BotSettings = {
  antiClone: boolean;
  startAnywhere: boolean;
  autoResponse: boolean;
  leadCapture: boolean;
  webhook: boolean;
};

const INITIAL_SETTINGS: BotSettings = {
  antiClone: true,
  startAnywhere: false,
  autoResponse: true,
  leadCapture: true,
  webhook: false,
};

const DEFAULT_SALES_TEMPLATE =
  '🎯 Exclusive Offer!\n\n💰 Special price: R$ {price}\n📦 Instant delivery\n✅ 30-day guarantee\n\n🔥 Limited time offer!\n\nClick the button below to purchase:';

export default function ConfigureBot() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const [savedEdit, setSavedEdit] = useState<{ settings: BotSettings; username: string }>({
    settings: { ...INITIAL_SETTINGS },
    username: '',
  });
  const [editDraft, setEditDraft] = useState<{ settings: BotSettings; username: string }>({
    settings: { ...INITIAL_SETTINGS },
    username: '',
  });

  const [salesTemplate, setSalesTemplate] = useState(DEFAULT_SALES_TEMPLATE);
  const [salesPreviewOpen, setSalesPreviewOpen] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const webhookEvents = useMemo(
    () => t('configureBot.events', { returnObjects: true }) as string[],
    [t]
  );
  const [eventChecks, setEventChecks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      (t('configureBot.events', { returnObjects: true }) as string[]).map((e) => [e, false])
    )
  );

  const handleToggle = (key: keyof BotSettings) => {
    setEditDraft((d) => ({
      ...d,
      settings: { ...d.settings, [key]: !d.settings[key] },
    }));
  };

  const handleSaveEdit = () => {
    setSavedEdit({ settings: { ...editDraft.settings }, username: editDraft.username });
    showToast(t('common.saved'));
  };

  const handleResetEdit = () => {
    setEditDraft({ settings: { ...savedEdit.settings }, username: savedEdit.username });
    showToast(t('common.resetToSaved'));
  };

  const handleSaveSalesTemplate = () => {
    showToast(t('common.saved'));
  };

  const handleSaveWebhook = () => {
    showToast(t('common.saved'));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'edit':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <p className="text-gray-400 text-sm">{t('configureBot.createdOn')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{t('configureBot.antiClone.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('configureBot.antiClone.desc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('antiClone')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editDraft.settings.antiClone ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editDraft.settings.antiClone ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{t('configureBot.startAnywhere.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('configureBot.startAnywhere.desc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('startAnywhere')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editDraft.settings.startAnywhere ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editDraft.settings.startAnywhere ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{t('configureBot.autoResponse.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('configureBot.autoResponse.desc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoResponse')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editDraft.settings.autoResponse ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editDraft.settings.autoResponse ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{t('configureBot.leadCaptureToggle.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('configureBot.leadCaptureToggle.desc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('leadCapture')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editDraft.settings.leadCapture ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editDraft.settings.leadCapture ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{t('configureBot.webhookToggle.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('configureBot.webhookToggle.desc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('webhook')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editDraft.settings.webhook ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editDraft.settings.webhook ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <label className="block text-white font-medium mb-2">{t('configureBot.username')}</label>
                  <input
                    type="text"
                    value={editDraft.username}
                    onChange={(e) => setEditDraft((d) => ({ ...d, username: e.target.value }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                    placeholder={t('configureBot.usernamePh')}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                {t('configureBot.saveChanges')}
              </button>
              <button
                type="button"
                onClick={handleResetEdit}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('configureBot.reset')}
              </button>
            </div>
          </div>
        );

      case 'salesCode':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('configureBot.salesCodeTitle')}</h3>
            <div className="bg-gray-700 rounded-lg p-6">
              <label className="block text-white font-medium mb-4">{t('configureBot.salesTemplate')}</label>
              <textarea
                rows={10}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                placeholder={t('configureBot.salesTemplatePh')}
                value={salesTemplate}
                onChange={(e) => setSalesTemplate(e.target.value)}
              />
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={handleSaveSalesTemplate}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  {t('configureBot.saveTemplate')}
                </button>
                <button
                  type="button"
                  onClick={() => setSalesPreviewOpen(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  {t('configureBot.preview')}
                </button>
              </div>
            </div>

            {salesPreviewOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">{t('common.templatePreview')}</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {salesTemplate}
                  </pre>
                  <button
                    type="button"
                    onClick={() => setSalesPreviewOpen(false)}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    {t('common.close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('configureBot.webhookTitle')}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">{t('configureBot.webhookUrl')}</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                    placeholder={t('configureBot.webhookUrlPh')}
                  />
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">{t('configureBot.secretKey')}</label>
                  <input
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                    placeholder={t('configureBot.secretPh')}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveWebhook}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  {t('configureBot.saveChanges')}
                </button>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">{t('configureBot.webhookEvents')}</h4>
                <div className="space-y-2">
                  {webhookEvents.map((event) => (
                    <label key={event} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-teal-500"
                        checked={eventChecks[event] ?? false}
                        onChange={() =>
                          setEventChecks((c) => ({ ...c, [event]: !c[event] }))
                        }
                      />
                      <span className="text-gray-300">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl text-white mb-2">{t(`configureBot.tabs.${activeTab}`)}</h3>
            <p className="text-gray-400">{t('configureBot.underDev')}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg bg-teal-600 text-white text-sm shadow-lg max-w-sm">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex overflow-x-auto">
              {TAB_IDS.map((tabId) => {
                const Icon = TAB_ICONS[tabId];
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap font-medium transition-colors ${
                      activeTab === tabId
                        ? 'bg-gray-700 text-teal-400 border-b-2 border-teal-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-750'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{t(`configureBot.tabs.${tabId}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

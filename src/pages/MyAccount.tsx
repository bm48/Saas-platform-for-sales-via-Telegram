import { useCallback, useState } from 'react';
import { User, Settings, Bell, Shield, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TabId = 'profile' | 'security' | 'billing' | 'notifications' | 'preferences';

const TAB_IDS: TabId[] = ['profile', 'security', 'billing', 'notifications', 'preferences'];
const TAB_ICONS: Record<TabId, typeof User> = {
  profile: User,
  security: Shield,
  billing: CreditCard,
  notifications: Bell,
  preferences: Settings,
};

const INITIAL_PROFILE = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  company: 'TechCorp Inc.',
  timezone: 'UTC-3',
};

const INITIAL_BILLING_ROWS = [
  { date: '2025-01-01', amount: 'R$ 99.90', status: 'paid' },
  { date: '2024-12-01', amount: 'R$ 99.90', status: 'paid' },
  { date: '2024-11-01', amount: 'R$ 99.90', status: 'paid' },
  { date: '2024-10-01', amount: 'R$ 99.90', status: 'paid' },
  { date: '2024-09-01', amount: 'R$ 99.90', status: 'paid' },
  { date: '2024-08-01', amount: 'R$ 49.90', status: 'paid' },
  { date: '2024-07-01', amount: 'R$ 49.90', status: 'paid' },
  { date: '2024-06-01', amount: 'R$ 49.90', status: 'paid' },
  { date: '2024-05-01', amount: 'R$ 49.90', status: 'paid' },
  { date: '2024-04-01', amount: 'R$ 49.90', status: 'paid' },
];

export default function MyAccount() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [toast, setToast] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const [settings, setSettings] = useState({
    darkMode: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorEnabled: false
  });

  const billingDescriptions = t('myAccount.billingDescriptions', { returnObjects: true }) as string[];
  const sessionsData = t('myAccount.sessions', { returnObjects: true }) as {
    device: string;
    location: string;
    lastActive: string;
  }[];
  const notifItems = t('myAccount.notifItems', { returnObjects: true }) as { label: string; desc: string }[];

  const [activeSessionIndices, setActiveSessionIndices] = useState<number[]>(() =>
    Array.from({ length: sessionsData.length }, (_, i) => i)
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const saveProfile = () => {
    setSavedProfile({ ...profile });
    showToast(t('common.saved'));
  };

  const cancelProfile = () => {
    setProfile({ ...savedProfile });
    showToast(t('common.resetToSaved'));
  };

  const updatePassword = () => {
    if (!pwdCurrent.trim() || !pwdNew.trim() || !pwdConfirm.trim()) {
      showToast(t('myAccount.passwordFillAll'));
      return;
    }
    if (pwdNew !== pwdConfirm) {
      showToast(t('myAccount.passwordMismatch'));
      return;
    }
    setPwdCurrent('');
    setPwdNew('');
    setPwdConfirm('');
    showToast(t('common.saved'));
  };

  const revokeSessionAt = (displayIndex: number) => {
    const origIdx = activeSessionIndices[displayIndex];
    if (origIdx === 0) return;
    setActiveSessionIndices((indices) => indices.filter((_, i) => i !== displayIndex));
    showToast(t('myAccount.sessionRevoked'));
  };

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const appLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('myAccount.profileInfo')}</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">{t('myAccount.firstName')}</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">{t('myAccount.lastName')}</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">{t('myAccount.email')}</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">{t('myAccount.phone')}</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">{t('myAccount.company')}</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={saveProfile}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                {t('myAccount.saveChanges')}
              </button>
              <button
                type="button"
                onClick={cancelProfile}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('myAccount.cancel')}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('myAccount.securityTitle')}</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.password')}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">{t('myAccount.currentPassword')}</label>
                    <input
                      type="password"
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                      placeholder={t('myAccount.currentPasswordPh')}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">{t('myAccount.newPassword')}</label>
                    <input
                      type="password"
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                      placeholder={t('myAccount.newPasswordPh')}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">{t('myAccount.confirmPassword')}</label>
                    <input
                      type="password"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                      placeholder={t('myAccount.confirmPasswordPh')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={updatePassword}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    {t('myAccount.updatePassword')}
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{t('myAccount.twoFactorTitle')}</h4>
                    <p className="text-gray-400 text-sm">{t('myAccount.twoFactorDesc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('twoFactorEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorEnabled ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.activeSessions')}</h4>
                <div className="space-y-3">
                  {activeSessionIndices.map((origIdx, displayIndex) => {
                    const session = sessionsData[origIdx];
                    if (!session) return null;
                    const isCurrent = origIdx === 0;
                    return (
                      <div key={origIdx} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{session.device}</p>
                          <p className="text-gray-400 text-sm">
                            {session.location} • {session.lastActive}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCurrent && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{t('myAccount.current')}</span>
                          )}
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => revokeSessionAt(displayIndex)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              {t('myAccount.revoke')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('myAccount.billingTitle')}</h3>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.currentPlan')}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{t('myAccount.proPlan')}</p>
                      <p className="text-gray-400">{t('myAccount.perMonth')}</p>
                      <p className="text-sm text-gray-400 mt-2">{t('myAccount.nextBilling')}</p>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => showToast(t('myAccount.billingUpgradeToast'))}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors mb-2"
                      >
                        {t('myAccount.upgrade')}
                      </button>
                      <br />
                      <button
                        type="button"
                        onClick={() => showToast(t('myAccount.billingCancelToast'))}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                      >
                        {t('myAccount.cancelPlan')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.paymentMethod')}</h4>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 rounded-lg p-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <p className="text-white font-medium">**** **** **** 1234</p>
                            <p className="text-gray-400 text-sm">Expires 12/27</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(t('myAccount.billingEditToast'))}
                          className="text-teal-400 hover:text-teal-300 text-sm"
                        >
                          {t('myAccount.edit')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.usageMonth')}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{t('myAccount.apiCalls')}</span>
                      <span className="text-white">8,432 / 10,000</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{width: '84.32%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{t('myAccount.storage')}</span>
                      <span className="text-white">2.3 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '46%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{t('myAccount.bots')}</span>
                      <span className="text-white">3 / 5</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.billingHistory')}</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-gray-400 font-medium pb-3">{t('myAccount.bhDate')}</th>
                      <th className="text-left text-gray-400 font-medium pb-3">{t('myAccount.bhDescription')}</th>
                      <th className="text-left text-gray-400 font-medium pb-3">{t('myAccount.bhAmount')}</th>
                      <th className="text-left text-gray-400 font-medium pb-3">{t('myAccount.bhStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {INITIAL_BILLING_ROWS.map((bill, index) => (
                      <tr key={index}>
                        <td className="py-3 text-gray-300">{bill.date}</td>
                        <td className="py-3 text-white">{billingDescriptions[index]}</td>
                        <td className="py-3 text-white font-semibold">{bill.amount}</td>
                        <td className="py-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                            {t('myAccount.paid')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('myAccount.notifTitle')}</h3>
            
            <div className="space-y-4">
              {notifItems.map((item, idx) => {
                const keys = ['emailNotifications', 'smsNotifications', 'pushNotifications', 'marketingEmails'] as const;
                const key = keys[idx];
                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{item.label}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[key] ? 'bg-teal-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('myAccount.prefTitle')}</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.appearance')}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{t('myAccount.darkMode')}</p>
                    <p className="text-gray-400 text-sm">{t('myAccount.darkModeDesc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('darkMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.darkMode ? 'bg-teal-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('myAccount.localization')}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">{t('myAccount.language')}</label>
                    <select
                      value={appLang}
                      onChange={(e) => void i18n.changeLanguage(e.target.value === 'pt' ? 'pt' : 'en')}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="en">{t('myAccount.langOptions.en')}</option>
                      <option value="pt">{t('myAccount.langOptions.pt')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">{t('myAccount.timezone')}</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="UTC-3">{t('myAccount.tzOptions.UTC-3')}</option>
                      <option value="UTC-5">{t('myAccount.tzOptions.UTC-5')}</option>
                      <option value="UTC+0">{t('myAccount.tzOptions.UTC+0')}</option>
                      <option value="UTC+1">{t('myAccount.tzOptions.UTC+1')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg bg-teal-600 text-white text-sm shadow-lg max-w-sm">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('myAccount.title')}</h1>
          <p className="text-gray-400 mt-2">{t('myAccount.subtitle')}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-400">{profile.email}</p>
              <p className="text-sm text-gray-500">{profile.company}</p>
            </div>
            <div className="ml-auto">
              <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm font-medium">
                {t('myAccount.proPlan')}
              </div>
            </div>
          </div>
        </div>

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
                    <span>{t(`myAccount.tabs.${tabId}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

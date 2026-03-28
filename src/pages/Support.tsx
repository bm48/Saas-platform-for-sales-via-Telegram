import { useMemo, useState } from 'react';
import { HelpCircle, MessageCircle, Search, Book, Video, Send, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ_KEYS = ['gettingStarted', 'billing', 'technical'] as const;
type FaqKey = (typeof FAQ_KEYS)[number];

type FaqBlock = { title: string; items: { q: string; a: string }[] };

export default function Support() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FaqKey>('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'medium',
    message: ''
  });

  const faqBlocks = useMemo(() => {
    return FAQ_KEYS.map((key) => ({
      key,
      ...(t(`support.faq.${key}`, { returnObjects: true }) as FaqBlock),
    }));
  }, [t]);

  const filteredFAQ = faqBlocks.filter((block) => {
    if (selectedCategory !== 'all' && block.key !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return block.items.some(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const ticketSubjects = t('support.ticketSubjects', { returnObjects: true }) as string[];

  const tickets = useMemo(
    () =>
      [
        { id: '#12345', status: 'open' as const, priority: 'high' as const, created: '2025-01-10', updated: '2025-01-10' },
        { id: '#12344', status: 'in-progress' as const, priority: 'medium' as const, created: '2025-01-09', updated: '2025-01-09' },
        { id: '#12343', status: 'resolved' as const, priority: 'low' as const, created: '2025-01-08', updated: '2025-01-09' },
        { id: '#12342', status: 'resolved' as const, priority: 'medium' as const, created: '2025-01-07', updated: '2025-01-08' },
        { id: '#12341', status: 'resolved' as const, priority: 'low' as const, created: '2025-01-06', updated: '2025-01-07' },
      ].map((row, i) => ({ ...row, subject: ticketSubjects[i] ?? '' })),
    [ticketSubjects]
  );

  const navTabs = [
    { id: 'faq' as const, icon: HelpCircle },
    { id: 'tickets' as const, icon: MessageCircle },
    { id: 'contact' as const, icon: Send },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{t('support.title')}</h1>
          <p className="text-gray-400 mt-2">{t('support.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors cursor-pointer">
            <Book size={48} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">{t('support.docs.title')}</h3>
            <p className="text-gray-400 text-sm">{t('support.docs.desc')}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors cursor-pointer">
            <Video size={48} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">{t('support.videos.title')}</h3>
            <p className="text-gray-400 text-sm">{t('support.videos.desc')}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors cursor-pointer">
            <MessageCircle size={48} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">{t('support.community.title')}</h3>
            <p className="text-gray-400 text-sm">{t('support.community.desc')}</p>
          </div>
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
                    <span>{t(`support.tabs.${tab.id}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('support.searchPh')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as 'all' | FaqKey)}
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="all">{t('support.allCategories')}</option>
                    {faqBlocks.map((block) => (
                      <option key={block.key} value={block.key}>
                        {block.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-6">
                  {filteredFAQ.map((block) => (
                    <div key={block.key} className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{block.title}</h3>
                      <div className="space-y-3">
                        {block.items.map((faq, index) => (
                          <details key={index} className="bg-gray-700 rounded-lg">
                            <summary className="p-4 cursor-pointer text-white font-medium hover:bg-gray-650 rounded-lg transition-colors">
                              {faq.q}
                            </summary>
                            <div className="px-4 pb-4">
                              <p className="text-gray-300">{faq.a}</p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{t('support.ticketsTitle')}</h3>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <Send size={18} />
                    <span>{t('support.newTicket')}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.id')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.subject')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.status')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.priority')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.created')}</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">{t('support.ticketTable.lastUpdate')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-750 transition-colors cursor-pointer">
                          <td className="px-6 py-4">
                            <span className="text-teal-400 font-mono">{ticket.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{ticket.subject}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                              {t(`support.ticketStatus.${ticket.status}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400">{ticket.created}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400">{ticket.updated}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{t('support.contactTitle')}</h3>
                  <p className="text-gray-400">{t('support.contactSubtitle')}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">{t('support.subject')}</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                      placeholder={t('support.subjectPh')}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">{t('support.priority')}</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="low">{t('support.priorityOpts.low')}</option>
                      <option value="medium">{t('support.priorityOpts.medium')}</option>
                      <option value="high">{t('support.priorityOpts.high')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">{t('support.message')}</label>
                    <textarea
                      rows={6}
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                      placeholder={t('support.messagePh')}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button type="button" className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center justify-center space-x-2">
                      <Send size={18} />
                      <span>{t('support.submitTicket')}</span>
                    </button>
                    <button type="button" className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                      {t('support.cancel')}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">{t('support.otherWays')}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="text-teal-400" size={20} />
                      <div>
                        <p className="text-white font-medium">{t('support.telegram')}</p>
                        <p className="text-gray-400 text-sm">@TelegramPro_Support</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-teal-400" size={20} />
                      <div>
                        <p className="text-white font-medium">{t('support.responseTime')}</p>
                        <p className="text-gray-400 text-sm">{t('support.responseTimeVal')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

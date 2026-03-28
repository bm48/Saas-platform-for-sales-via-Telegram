import { useState } from 'react';
import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  Bot,
  Settings,
  Mail,
  Activity,
  ExternalLink,
  CreditCard,
  User,
  HelpCircle,
  TrendingUp,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const menuItems: { id: Page; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'ranking', icon: Trophy },
  { id: 'statistics', icon: BarChart3 },
  { id: 'createBot', icon: Bot },
  { id: 'configureBot', icon: Settings },
  { id: 'mailing', icon: Mail },
  { id: 'tracking', icon: Activity, badge: 'NEW' },
  { id: 'redirectors', icon: ExternalLink },
  { id: 'payments', icon: CreditCard },
  { id: 'myAccount', icon: User },
  { id: 'support', icon: HelpCircle },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const isPt = i18n.language.startsWith('pt');
  const toggleLanguage = () => {
    void i18n.changeLanguage(isPt ? 'en' : 'pt');
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 border-r border-gray-700 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-500 p-2 rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white">TelegramPro</h1>
                <p className="text-sm text-gray-400">{t('sidebar.brandSubtitle')}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{t('sidebar.language')}</p>
              <button
                type="button"
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white transition-colors text-sm font-medium border border-gray-600"
              >
                <Languages size={18} className="text-teal-400 shrink-0" />
                <span>{isPt ? t('sidebar.switchToEn') : t('sidebar.switchToPt')}</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{t(`sidebar.nav.${item.id}`)}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {t('sidebar.badgeNew')}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">534</p>
                  <p className="text-xs text-gray-400">R$ 6.389,51</p>
                </div>
              </div>
              <Trophy size={16} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

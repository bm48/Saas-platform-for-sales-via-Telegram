import { useState } from 'react';
import { ExternalLink, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CreateBot() {
  const { t } = useTranslation();
  const [botToken, setBotToken] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = t('createBot.steps', { returnObjects: true }) as string[];

  const handleCreateBot = () => {
    if (botToken.trim()) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setBotToken('');
    }
  };

  const handleCancel = () => {
    setBotToken('');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">{t('createBot.title')}</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="botToken" className="block text-lg font-medium text-white mb-4">
                {t('createBot.botToken')}
              </label>
              <input
                id="botToken"
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder={t('createBot.placeholder')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                {t('createBot.cancel')}
              </button>
              <button
                onClick={handleCreateBot}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
              >
                {t('createBot.create')}
              </button>
            </div>

            {showSuccess && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-400">{t('createBot.success')}</span>
              </div>
            )}

            <div className="bg-gray-700 rounded-lg p-6 mt-8">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p className="mb-2">
                    {t('createBot.warning')}
                  </p>
                  <p className="text-yellow-400">@TelegramPro_Support ❤️</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ExternalLink size={20} className="text-teal-400" />
                <h3 className="text-lg font-semibold text-white">{t('createBot.howToTitle')}</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                {steps.map((text, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">{t('createBot.exampleFormat')}</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-900 px-3 py-2 rounded text-teal-400 flex-1">1234567890:ABCdefGHIjklMNOpqrsTUVwxyz</code>
                  <button type="button" className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                    <Copy size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

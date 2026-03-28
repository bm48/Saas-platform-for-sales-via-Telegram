import { Trophy, Award, Medal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RankingBanner() {
  const { t } = useTranslation();
  const rankings = [
    { position: '2°', amount: 'R$ 7.500', icon: Award },
    { position: '1°', amount: 'R$ 15.000', icon: Trophy },
    { position: '3°', amount: 'R$ 3.000', icon: Medal },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10"></div>
      
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {t('rankingBanner.line1')}
          </h1>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('rankingBanner.line2')}
          </h2>
          <p className="text-gray-300 text-lg">
            {t('rankingBanner.subtitle')}
          </p>
        </div>

        <div className="flex items-end justify-center space-x-8">
          {rankings.map((rank, index) => {
            const Icon = rank.icon;
            const isFirst = rank.position === '1°';
            
            return (
              <div key={rank.position} className={`text-center ${isFirst ? 'order-2' : index === 0 ? 'order-1' : 'order-3'}`}>
                <div className={`
                  relative mb-4 mx-auto rounded-full p-6 
                  ${isFirst 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 w-24 h-24' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600 w-20 h-20'
                  }
                `}>
                  <Icon 
                    size={isFirst ? 48 : 40} 
                    className={isFirst ? 'text-yellow-900' : 'text-gray-900'} 
                  />
                  <div className={`
                    absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                    ${isFirst ? 'bg-yellow-500' : 'bg-gray-500'} 
                    text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold
                  `}>
                    {rank.position}
                  </div>
                </div>
                <p className={`font-bold ${isFirst ? 'text-2xl text-white' : 'text-xl text-gray-300'}`}>
                  {rank.amount}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

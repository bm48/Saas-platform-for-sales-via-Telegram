import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SalesChart() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D'>('30D');

  const data7D = [10, 8, 12, 15, 18, 22, 25];
  const data30D = [10, 8, 12, 28, 30, 29, 42, 38, 35, 28, 25, 20, 15, 12, 18, 25, 30, 28, 32, 35, 40, 38, 35, 30, 28, 25, 22, 20, 18, 15];
  
  const currentData = selectedPeriod === '7D' ? data7D : data30D;
  const maxValue = Math.max(...currentData);
  const minValue = Math.min(...currentData);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{t('salesChart.title')}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('7D')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === '7D'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('salesChart.period7d')}
          </button>
          <button
            onClick={() => setSelectedPeriod('30D')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === '30D'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('salesChart.period30d')}
          </button>
        </div>
      </div>

      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y * 2}
              x2="800"
              y2={y * 2}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          <path
            d={`M ${currentData.map((value, index) => {
              const x = (index / (currentData.length - 1)) * 800;
              const y = 200 - ((value - minValue) / (maxValue - minValue)) * 180;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}`}
            fill="none"
            stroke="#14B8A6"
            strokeWidth="3"
            className="drop-shadow-lg"
          />

          {currentData.map((value, index) => {
            const x = (index / (currentData.length - 1)) * 800;
            const y = 200 - ((value - minValue) / (maxValue - minValue)) * 180;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#14B8A6"
                className="drop-shadow-lg"
              />
            );
          })}

          <path
            d={`M ${currentData.map((value, index) => {
              const x = (index / (currentData.length - 1)) * 800;
              const y = 200 - ((value - minValue) / (maxValue - minValue)) * 180;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')} L 800 200 L 0 200 Z`}
            fill="url(#gradient)"
            opacity="0.2"
          />

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>{minValue}</span>
        </div>
      </div>
    </div>
  );
}

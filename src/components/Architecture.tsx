import React from 'react';

const Architecture: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
          🏗️ Архитектура системы «ЭкоЛоток»
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Система представляет собой распределённое IoT-решение для приёма использованной яичной упаковки.
          Фандомат (киоск) оснащён сканером штрихкодов, датчиком веса и механизмом прессования.
          Все компоненты взаимодействуют через REST API.
        </p>
      </div>

      {/* Схема потоков данных */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Поток данных</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold text-blue-800">Пользователь</div>
            <div className="text-xs text-blue-600 mt-1">Сканирует QR/штрихкод</div>
          </div>
          <div className="text-center text-2xl text-gray-400 hidden md:block">→</div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🖥️</div>
            <div className="font-semibold text-green-800">Киоск (UI)</div>
            <div className="text-xs text-green-600 mt-1">Сенсорный экран</div>
          </div>
          <div className="text-center text-2xl text-gray-400 hidden md:block">→</div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold text-purple-800">FastAPI</div>
            <div className="text-xs text-purple-600 mt-1">Backend сервер</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mt-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔧</div>
            <div className="font-semibold text-orange-800">Mock Hardware</div>
            <div className="text-xs text-orange-600 mt-1">Датчик веса + пресс</div>
          </div>
          <div className="text-center text-2xl text-gray-400 hidden md:block">←</div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🗄️</div>
            <div className="font-semibold text-red-800">PostgreSQL</div>
            <div className="text-xs text-red-600 mt-1">База данных</div>
          </div>
          <div className="text-center text-2xl text-gray-400 hidden md:block">←</div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-yellow-800">Admin Panel</div>
            <div className="text-xs text-yellow-600 mt-1">Мониторинг</div>
          </div>
        </div>
      </div>

      {/* Стек технологий */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🛠️ Стек технологий</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'FastAPI', icon: '🐍', desc: 'Backend API', color: 'bg-blue-50 border-blue-200' },
            { name: 'PostgreSQL', icon: '🐘', desc: 'База данных', color: 'bg-indigo-50 border-indigo-200' },
            { name: 'SQLAlchemy', icon: '🔗', desc: 'ORM', color: 'bg-green-50 border-green-200' },
            { name: 'Alembic', icon: '📦', desc: 'Миграции', color: 'bg-yellow-50 border-yellow-200' },
            { name: 'Docker', icon: '🐳', desc: 'Контейнеры', color: 'bg-cyan-50 border-cyan-200' },
            { name: 'React/HTML', icon: '💻', desc: 'UI Киоска', color: 'bg-purple-50 border-purple-200' },
            { name: 'Pydantic', icon: '✅', desc: 'Валидация', color: 'bg-pink-50 border-pink-200' },
            { name: 'Adminer', icon: '🔍', desc: 'DB Manager', color: 'bg-orange-50 border-orange-200' },
          ].map((tech) => (
            <div key={tech.name} className={`${tech.color} border rounded-xl p-3 text-center`}>
              <div className="text-2xl mb-1">{tech.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{tech.name}</div>
              <div className="text-xs text-gray-500">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Бизнес-логика */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 Бизнес-логика (User Flow)</h3>
        <div className="space-y-3">
          {[
            { step: 1, text: 'Пользователь подносит упаковку к сканеру киоска', icon: '📱' },
            { step: 2, text: 'Киоск отправляет barcode на POST /api/v1/scan', icon: '📡' },
            { step: 3, text: 'Сервер проверяет код в БД (Product table)', icon: '🔍' },
            { step: 4, text: 'Сервер запрашивает Mock Hardware: проверить вес и габариты', icon: '⚖️' },
            { step: 5, text: 'Hardware отвечает: вес в норме → прессование выполнено', icon: '✅' },
            { step: 6, text: 'Сервер создаёт Transaction, генерирует PromoCode', icon: '🎫' },
            { step: 7, text: 'Киоск показывает промокод пользователю', icon: '🎉' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {item.step}
              </div>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Architecture;

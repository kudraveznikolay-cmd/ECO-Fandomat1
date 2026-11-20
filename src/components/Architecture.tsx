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

      {/* === ПРОБЛЕМАТИКА: Инфографика масштабов отходов === */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 border border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-3">
          🌍 Проблематика: масштабы отходов яичной упаковки
        </h2>
        <p className="text-gray-700 mb-6">
          Ежегодно в мире и Беларуси образуются миллионы тонн отходов от яичной упаковки.
          Большинство попадает на свалки, разлагаясь десятилетиями.
        </p>

        {/* Ключевые цифры */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-red-500">
            <div className="text-3xl md:text-4xl font-bold text-red-600">3.5 млрд</div>
            <div className="text-xs text-gray-600 mt-1">яиц производится в Беларуси в год</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-orange-500">
            <div className="text-3xl md:text-4xl font-bold text-orange-600">~300 млн</div>
            <div className="text-xs text-gray-600 mt-1">лотков превращаются в отходы</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-amber-500">
            <div className="text-3xl md:text-4xl font-bold text-amber-600">~24 000 т</div>
            <div className="text-xs text-gray-600 mt-1">мусора ежегодно</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-yellow-500">
            <div className="text-3xl md:text-4xl font-bold text-yellow-600">~12%</div>
            <div className="text-xs text-gray-600 mt-1">отправляется на переработку</div>
          </div>
        </div>

        {/* Сравнение сроков разложения */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⏳ Срок разложения упаковки в природе
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">📦 Картонный лоток</span>
                <span className="font-semibold text-green-700">2–5 лет</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">🥤 Пластиковый лоток (PET)</span>
                <span className="font-semibold text-orange-700">~450 лет</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">🫧 Лоток из вспененного полистирола</span>
                <span className="font-semibold text-red-700">~500+ лет</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Визуальное сравнение: что эквивалентно 24 000 тоннам */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            📐 Масштаб в понятных единицах (24 000 т отходов/год в РБ)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🚛</div>
              <div className="text-2xl font-bold text-blue-700">2 400</div>
              <div className="text-xs text-gray-600">полных фур мусора</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">⚽</div>
              <div className="text-2xl font-bold text-purple-700">3.4</div>
              <div className="text-xs text-gray-600">футбольных поля, засыпанных лотками</div>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🐘</div>
              <div className="text-2xl font-bold text-pink-700">4 000</div>
              <div className="text-xs text-gray-600">масс африканских слонов</div>
            </div>
          </div>
        </div>

        {/* Мировой контекст */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            🌐 Мировой контекст
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-3xl">🌍</span>
                <div>
                  <div className="font-semibold text-gray-800">~250 млрд яиц/год в мире</div>
                  <div className="text-xs text-gray-500">→ ~20 млн тонн упаковки</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-3xl">🇪🇺</span>
                <div>
                  <div className="font-semibold text-gray-800">ЕС: директива SUP</div>
                  <div className="text-xs text-gray-500">запрет одноразового пластика с 2021</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-3xl">🇧🇾</span>
                <div>
                  <div className="font-semibold text-gray-800">Беларусь: цель 2030</div>
                  <div className="text-xs text-gray-500">переработка 30% ТКО (сейчас ~15%)</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="font-bold text-green-800 mb-2">💡 Что решает «ЭкоЛоток»</div>
              <ul className="text-sm text-green-900 space-y-1.5">
                <li>✓ Стимулирует сдачу упаковки через промокоды</li>
                <li>✓ Сортирует по материалу (картон / пластик / полистирол)</li>
                <li>✓ Прессует → уменьшает объём в 5–7 раз</li>
                <li>✓ Передаёт сырьё переработчикам</li>
                <li>✓ Снижает нагрузку на полигоны и свалки</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CO2-след */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            🌱 Экологический эффект переработки vs захоронения
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-red-800">Захоронение (свалка)</span>
              </div>
              <div className="text-3xl font-bold text-red-600">~150 г CO₂</div>
              <div className="text-xs text-red-700 mt-1">на 1 картонный лоток (с учётом разложения)</div>
              <div className="text-xs text-gray-600 mt-2">+ выделение метана от пластика</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">♻️</span>
                <span className="font-bold text-green-800">Переработка</span>
              </div>
              <div className="text-3xl font-bold text-green-600">−80% выбросов</div>
              <div className="text-xs text-green-700 mt-1">по сравнению с производством нового</div>
              <div className="text-xs text-gray-600 mt-2">+ сохранение ресурсов и древесины</div>
            </div>
          </div>
        </div>
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

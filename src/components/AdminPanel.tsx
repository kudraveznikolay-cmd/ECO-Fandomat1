import React, { useState, useEffect } from 'react';

interface MachineData {
  id: number;
  location: string;
  status: 'online' | 'offline' | 'maintenance' | 'full';
  fillLevel: number;
  transactionsToday: number;
}

const AdminPanel: React.FC = () => {
  const [machines, setMachines] = useState<MachineData[]>([
    { id: 1, location: 'Евроопт, пр-т Дзержинского 134, Минск', status: 'online', fillLevel: 23.5, transactionsToday: 12 },
    { id: 2, location: 'Корона, ул. Маяковского 1, Брест', status: 'online', fillLevel: 67.2, transactionsToday: 8 },
    { id: 3, location: 'Санта, ул. Советская 97, Гомель', status: 'maintenance', fillLevel: 95.0, transactionsToday: 0 },
    { id: 4, location: 'Гиппо, пр-т Космонавтов 2, Витебск', status: 'online', fillLevel: 45.8, transactionsToday: 15 },
    { id: 5, location: 'Соседи, ул. Ленинградская 35, Гродно', status: 'full', fillLevel: 98.2, transactionsToday: 22 },
  ]);

  const [stats, setStats] = useState({
    totalMachines: 5,
    machinesOnline: 3,
    machinesFull: 1,
    totalTransactions: 1247,
    todayTransactions: 57,
    totalPromoIssued: 1189,
    totalPromoUsed: 834,
    averageWeight: 72.3,
  });

  // Имитация обновления данных в реальном времени
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => ({
        ...m,
        fillLevel: Math.min(100, Math.max(0, m.fillLevel + (Math.random() - 0.4) * 2)),
        transactionsToday: m.status === 'online' 
          ? m.transactionsToday + (Math.random() > 0.7 ? 1 : 0)
          : m.transactionsToday
      })));
      setStats(prev => ({
        ...prev,
        todayTransactions: prev.todayTransactions + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      online: { bg: 'bg-green-100', text: 'text-green-800', label: '🟢 Онлайн' },
      offline: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚫ Офлайн' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🟡 Обслуживание' },
      full: { bg: 'bg-red-100', text: 'text-red-800', label: '🔴 Заполнен' },
    };
    const c = config[status] || config.offline;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-red-500';
    if (level >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
        <h2 className="text-2xl font-bold text-yellow-800 mb-2 flex items-center gap-3">
          📊 Админ-панель (Дашборд)
        </h2>
        <p className="text-gray-600">
          Мониторинг состояния фандоматов в реальном времени. Данные обновляются автоматически каждые 5 секунд.
        </p>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
          <div className="text-3xl font-bold text-green-600">{stats.machinesOnline}</div>
          <div className="text-sm text-gray-500">Автоматов онлайн</div>
          <div className="text-xs text-gray-400">из {stats.totalMachines} всего</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{stats.todayTransactions}</div>
          <div className="text-sm text-gray-500">Приёмов сегодня</div>
          <div className="text-xs text-gray-400">{stats.totalTransactions} всего</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{stats.totalPromoIssued}</div>
          <div className="text-sm text-gray-500">Промокодов выдано</div>
          <div className="text-xs text-gray-400">{stats.totalPromoUsed} использовано</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
          <div className="text-3xl font-bold text-orange-600">{stats.averageWeight}г</div>
          <div className="text-sm text-gray-500">Средний вес</div>
          <div className="text-xs text-gray-400">принятой упаковки</div>
        </div>
      </div>

      {/* Таблица автоматов */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">🏭 Состояние автоматов</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Локация</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Заполненность</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Приёмов сегодня</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.map((machine) => (
                <tr key={machine.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">#{machine.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{machine.location}</td>
                  <td className="px-4 py-3">{getStatusBadge(machine.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ${getFillLevelColor(machine.fillLevel)}`}
                          style={{ width: `${Math.min(100, machine.fillLevel)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{machine.fillLevel.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{machine.transactionsToday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Торговые сети-партнёры */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">🇧🇾 Торговые сети-партнёры (Республика Беларусь)</h3>
          <p className="text-sm text-gray-500 mt-1">Фандоматы установлены в магазинах ведущих розничных сетей страны</p>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Евроопт', type: 'Гипермаркет', machines: 12, cities: 'Минск, Брест, Гомель, Гродно, Витебск, Могилёв', color: 'bg-red-50 border-red-200' },
            { name: 'Корона', type: 'Гипермаркет', machines: 5, cities: 'Минск, Брест, Гродно, Витебск', color: 'bg-blue-50 border-blue-200' },
            { name: 'Санта', type: 'Супермаркет', machines: 8, cities: 'Минск, Гомель, Брест, Могилёв', color: 'bg-green-50 border-green-200' },
            { name: 'Гиппо', type: 'Гипермаркет', machines: 4, cities: 'Витебск, Орша, Полоцк, Новополоцк', color: 'bg-purple-50 border-purple-200' },
            { name: 'Соседи', type: 'Магазин у дома', machines: 15, cities: 'Гродно, Лида, Сморгонь, Ошмяны', color: 'bg-yellow-50 border-yellow-200' },
            { name: 'Алми', type: 'Супермаркет', machines: 3, cities: 'Минск, Борисов, Солигорск', color: 'bg-orange-50 border-orange-200' },
          ].map((network) => (
            <div key={network.name} className={`${network.color} border rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800 text-lg">{network.name}</span>
                <span className="bg-white/70 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700">
                  {network.machines} автом.
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">📦 {network.type}</div>
              <div className="text-xs text-gray-500">📍 {network.cities}</div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Всего автоматов в сетях:</span>
            <span className="font-bold text-gray-800">47 фандоматов</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Покрытие областей:</span>
            <span className="font-bold text-gray-800">6 из 6 областей + г. Минск</span>
          </div>
        </div>
      </div>

      {/* Последние транзакции */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">📋 Последние транзакции</h3>
        </div>
        <div className="p-4 space-y-2">
          {[
            { id: 1247, machine: 1, barcode: '4810123400015', weight: 82.3, time: '14:32:05', promo: 'ECO-K7M9P2' },
            { id: 1246, machine: 4, barcode: '4810234500022', weight: 76.1, time: '14:28:41', promo: 'ECO-A3B8N5' },
            { id: 1245, machine: 1, barcode: '4810345600039', weight: 53.7, time: '14:25:18', promo: 'ECO-Q9W4R7' },
            { id: 1244, machine: 5, barcode: '4810456700046', weight: 84.2, time: '14:22:03', promo: 'ECO-L2X6T8' },
            { id: 1243, machine: 2, barcode: '4810567800053', weight: 79.5, time: '14:18:55', promo: 'ECO-M5Y1V3' },
          ].map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-400">#{tx.id}</span>
                <span className="text-sm text-gray-700">🏭 #{tx.machine}</span>
                <span className="text-sm font-mono text-gray-600">{tx.barcode}</span>
                <span className="text-sm text-gray-500">⚖️ {tx.weight}г</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded">{tx.promo}</span>
                <span className="text-xs text-gray-400">{tx.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График (имитация) */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Приёмы за неделю</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {[
            { day: 'Пн', value: 45 },
            { day: 'Вт', value: 62 },
            { day: 'Ср', value: 38 },
            { day: 'Чт', value: 71 },
            { day: 'Пт', value: 57 },
            { day: 'Сб', value: 89 },
            { day: 'Вс', value: 57 },
          ].map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{item.value}</span>
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.value / 100) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-600 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Response пример */}
      <div className="bg-gray-900 rounded-2xl p-6 text-sm font-mono">
        <div className="text-gray-400 mb-2">GET /api/v1/admin/stats — Пример ответа:</div>
        <pre className="text-green-300 overflow-x-auto">
{`{
  "total_machines": 5,
  "machines_online": 3,
  "machines_full": 1,
  "total_transactions": 1247,
  "today_transactions": 57,
  "total_promo_issued": 1189,
  "total_promo_used": 834,
  "average_weight_g": 72.3,
  "machine_details": [
    {
      "id": 1,
      "location": "ТЦ \\"Мега\\", вход №3",
      "status": "online",
      "fill_level": 23.5,
      "transactions_today": 12
    },
    ...
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default AdminPanel;

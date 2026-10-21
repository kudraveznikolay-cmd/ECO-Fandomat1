import React from 'react';

interface TreeNodeProps {
  name: string;
  icon: string;
  indent: number;
  description?: string;
  isFolder?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, icon, indent, description, isFolder }) => (
  <div
    className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded group"
    style={{ paddingLeft: `${indent * 20 + 8}px` }}
  >
    <span className="text-lg">{icon}</span>
    <span className={`font-mono text-sm ${isFolder ? 'font-semibold text-green-700' : 'text-gray-700'}`}>
      {name}
    </span>
    {description && (
      <span className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        — {description}
      </span>
    )}
  </div>
);

const ProjectStructure: React.FC = () => {
  const tree: TreeNodeProps[] = [
    { name: 'ecolotok/', icon: '📁', indent: 0, isFolder: true, description: 'Корень проекта' },
    { name: 'docker-compose.yml', icon: '🐳', indent: 1, description: 'Оркестрация контейнеров' },
    { name: '.env', icon: '🔒', indent: 1, description: 'Переменные окружения' },
    { name: 'README.md', icon: '📖', indent: 1, description: 'Документация проекта' },
    { name: 'backend/', icon: '📁', indent: 1, isFolder: true, description: 'FastAPI приложение' },
    { name: 'Dockerfile', icon: '📄', indent: 2, description: 'Образ бэкенда' },
    { name: 'requirements.txt', icon: '📄', indent: 2, description: 'Python зависимости' },
    { name: 'app/', icon: '📁', indent: 2, isFolder: true, description: 'Исходный код' },
    { name: 'main.py', icon: '🐍', indent: 3, description: 'Точка входа FastAPI' },
    { name: 'config.py', icon: '🐍', indent: 3, description: 'Конфигурация' },
    { name: 'database.py', icon: '🐍', indent: 3, description: 'Подключение к БД' },
    { name: 'models.py', icon: '🐍', indent: 3, description: 'SQLAlchemy модели' },
    { name: 'schemas.py', icon: '🐍', indent: 3, description: 'Pydantic схемы' },
    { name: 'routers/', icon: '📁', indent: 3, isFolder: true, description: 'API роутеры' },
    { name: 'scan.py', icon: '🐍', indent: 4, description: 'POST /scan' },
    { name: 'confirm.py', icon: '🐍', indent: 4, description: 'POST /confirm-accept' },
    { name: 'admin.py', icon: '🐍', indent: 4, description: 'GET /admin/stats' },
    { name: 'services/', icon: '📁', indent: 3, isFolder: true, description: 'Бизнес-логика' },
    { name: 'promo_service.py', icon: '🐍', indent: 4, description: 'Генерация промокодов' },
    { name: 'hardware_mock.py', icon: '🐍', indent: 4, description: 'Mock датчиков' },
    { name: 'alembic/', icon: '📁', indent: 2, isFolder: true, description: 'Миграции БД' },
    { name: 'alembic.ini', icon: '📄', indent: 2, description: 'Конфиг Alembic' },
    { name: 'kiosk/', icon: '📁', indent: 1, isFolder: true, description: 'Интерфейс киоска' },
    { name: 'index.html', icon: '🌐', indent: 2, description: 'Главная страница киоска' },
    { name: 'style.css', icon: '🎨', indent: 2, description: 'Стили для тач-экрана' },
    { name: 'app.js', icon: '📜', indent: 2, description: 'Логика интерфейса' },
    { name: 'admin/', icon: '📁', indent: 1, isFolder: true, description: 'Админ-панель' },
    { name: 'index.html', icon: '🌐', indent: 2, description: 'Дашборд администратора' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-3">
          📁 Структура проекта
        </h2>
        <p className="text-gray-600">
          Модульная архитектура с разделением на backend (FastAPI), kiosk (UI автомата) и admin (панель управления).
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border font-mono">
        {tree.map((node, index) => (
          <TreeNode key={index} {...node} />
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-amber-800">Принцип организации</p>
            <p className="text-amber-700 text-sm mt-1">
              Каждый модуль (backend, kiosk, admin) имеет свой Dockerfile и может разворачиваться независимо.
              Роутеры разделены по доменным областям (scan, confirm, admin) для чистоты кода.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStructure;

import React, { useState } from 'react';
import Architecture from './components/Architecture';
import ProjectStructure from './components/ProjectStructure';
import Database from './components/Database';
import BackendCode from './components/BackendCode';
import MockService from './components/MockService';
import KioskDemo from './components/KioskDemo';
import Docker from './components/Docker';
import AdminPanel from './components/AdminPanel';

type TabId = 'architecture' | 'structure' | 'database' | 'backend' | 'mock' | 'kiosk' | 'docker' | 'admin';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
}

const tabs: Tab[] = [
  { id: 'architecture', label: 'Архитектура', icon: '🏗️', description: 'Общая схема системы' },
  { id: 'structure', label: 'Структура', icon: '📁', description: 'Дерево файлов проекта' },
  { id: 'database', label: 'База данных', icon: '🗄️', description: 'SQLAlchemy модели' },
  { id: 'backend', label: 'Backend', icon: '⚙️', description: 'FastAPI эндпоинты' },
  { id: 'mock', label: 'Mock Hardware', icon: '🤖', description: 'Имитация датчиков' },
  { id: 'kiosk', label: 'Киоск', icon: '💻', description: 'Интерфейс автомата' },
  { id: 'docker', label: 'Docker', icon: '🐳', description: 'Контейнеризация' },
  { id: 'admin', label: 'Админка', icon: '📊', description: 'Панель управления' },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('architecture');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture': return <Architecture />;
      case 'structure': return <ProjectStructure />;
      case 'database': return <Database />;
      case 'backend': return <BackendCode />;
      case 'mock': return <MockService />;
      case 'kiosk': return <KioskDemo />;
      case 'docker': return <Docker />;
      case 'admin': return <AdminPanel />;
      default: return <Architecture />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">♻️</span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">ЭкоЛоток</h1>
                <p className="text-green-200 text-xs md:text-sm">MVP Фандомат для яичной упаковки</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="bg-green-800/50 px-3 py-1 rounded-full text-xs">v1.0.0 MVP</span>
              <span className="bg-green-800/50 px-3 py-1 rounded-full text-xs">FastAPI + PostgreSQL</span>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-green-800/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <nav className="mb-6">
          {/* Desktop tabs */}
          <div className="hidden md:flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white rounded-xl shadow-lg border p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <div>
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Active tab description (mobile) */}
          <div className="md:hidden mt-3 px-2">
            <p className="text-sm text-gray-500">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </nav>

        {/* Content */}
        <main className="pb-12">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            🌱 <span className="text-green-400 font-semibold">ЭкоЛоток</span> — MVP фандомата для приёма яичной упаковки
          </p>
          <p className="text-xs mt-2 text-gray-500">
            FastAPI • PostgreSQL • Docker • React | 2024
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React from 'react';
import CodeBlock from './CodeBlock';

const dockerCompose = `# docker-compose.yml
# Оркестрация всех сервисов проекта "ЭкоЛоток"
# Запуск: docker-compose up -d

version: '3.8'

services:
  # === PostgreSQL — основная база данных ===
  db:
    image: postgres:15-alpine
    container_name: ecolotok-db
    restart: always
    environment:
      POSTGRES_USER: ecolotok
      POSTGRES_PASSWORD: ecolotok_pass
      POSTGRES_DB: ecolotok_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Начальные данные
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ecolotok"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - ecolotok-net

  # === FastAPI Backend ===
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ecolotok-backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://ecolotok:ecolotok_pass@db:5432/ecolotok_db
      ENVIRONMENT: development
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app  # Hot-reload для разработки
    networks:
      - ecolotok-net

  # === Adminer — веб-интерфейс для управления БД ===
  adminer:
    image: adminer:latest
    container_name: ecolotok-adminer
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - ecolotok-net

  # === Nginx — раздача статики (киоск + админка) ===
  nginx:
    image: nginx:alpine
    container_name: ecolotok-nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./kiosk:/usr/share/nginx/html/kiosk:ro
      - ./admin:/usr/share/nginx/html/admin:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - backend
    networks:
      - ecolotok-net

volumes:
  postgres_data:  # Персистентное хранилище для БД

networks:
  ecolotok-net:
    driver: bridge`;

const dockerfile = `# Dockerfile для FastAPI Backend
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Системные зависимости (для psycopg2)
RUN apt-get update && apt-get install -y \\
    gcc \\
    libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

# Копируем зависимости и устанавливаем
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 8000

# Команда запуска (uvicorn с hot-reload для dev)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]`;

const requirementsTxt = `# requirements.txt — Python зависимости проекта ЭкоЛоток
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.0
pydantic==2.5.2
python-dotenv==1.0.0
asyncio==3.4.3`;

const envFile = `# .env — Переменные окружения
DATABASE_URL=postgresql://ecolotok:ecolotok_pass@db:5432/ecolotok_db
ENVIRONMENT=development
SECRET_KEY=your-secret-key-change-in-production
MACHINE_ID=1
PROMO_DISCOUNT_PERCENT=10`;

const initSql = `-- init.sql — Начальные данные для тестирования
-- Выполняется при первом запуске контейнера PostgreSQL

-- Тестовые автоматы
INSERT INTO machines (id, location, status, current_fill_level, serial_number) VALUES
(1, 'ТЦ "Мега", вход №3, г. Екатеринбург', 'online', 23.5, 'ECO-001-2024'),
(2, 'Супермаркет "Пятёрочка", ул. Ленина 42', 'online', 67.2, 'ECO-002-2024'),
(3, 'ЖК "Зелёная роща", подъезд 1', 'maintenance', 95.0, 'ECO-003-2024');

-- Справочник продуктов (штрихкоды яичной упаковки)
INSERT INTO products (id, barcode, brand, material_type, expected_weight_g, is_active) VALUES
(1, '4600001000001', 'Свердловская птицефабрика', 'cardboard', 80.0, true),
(2, '4600002000002', 'Окская птицефабрика', 'plastic', 55.0, true),
(3, '4600003000003', 'Рузское яйцо', 'cardboard', 75.0, true),
(4, '4600004000004', 'Домик в деревне', 'cardboard', 82.0, true),
(5, '4600005000005', 'Ясенево', 'plastic', 48.0, true);`;

const Docker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-bold text-cyan-800 mb-2 flex items-center gap-3">
          🐳 Контейнеризация (Docker)
        </h2>
        <p className="text-gray-600">
          Все сервисы упакованы в Docker-контейнеры. Запуск одной командой: <code className="bg-cyan-100 px-2 py-0.5 rounded">docker-compose up -d</code>
        </p>
      </div>

      {/* Схема контейнеров */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Схема контейнеров и порты</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50 text-center">
            <div className="text-3xl mb-2">🐘</div>
            <div className="font-bold text-blue-800">PostgreSQL</div>
            <div className="text-xs text-blue-600 mt-1">Порт: 5432</div>
            <div className="text-xs text-gray-500 mt-1">Хранилище данных</div>
          </div>
          <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50 text-center">
            <div className="text-3xl mb-2">🐍</div>
            <div className="font-bold text-green-800">FastAPI</div>
            <div className="text-xs text-green-600 mt-1">Порт: 8000</div>
            <div className="text-xs text-gray-500 mt-1">Backend API</div>
          </div>
          <div className="border-2 border-purple-300 rounded-xl p-4 bg-purple-50 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-bold text-purple-800">Adminer</div>
            <div className="text-xs text-purple-600 mt-1">Порт: 8080</div>
            <div className="text-xs text-gray-500 mt-1">DB Manager</div>
          </div>
          <div className="border-2 border-orange-300 rounded-xl p-4 bg-orange-50 text-center">
            <div className="text-3xl mb-2">🌐</div>
            <div className="font-bold text-orange-800">Nginx</div>
            <div className="text-xs text-orange-600 mt-1">Порт: 80</div>
            <div className="text-xs text-gray-500 mt-1">Статика (киоск)</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🐳 docker-compose.yml</h3>
        <CodeBlock code={dockerCompose} language="yaml" filename="docker-compose.yml" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 Dockerfile (Backend)</h3>
        <CodeBlock code={dockerfile} language="dockerfile" filename="backend/Dockerfile" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📦 requirements.txt</h3>
        <CodeBlock code={requirementsTxt} language="text" filename="backend/requirements.txt" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🔒 .env</h3>
        <CodeBlock code={envFile} language="bash" filename=".env" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📊 init.sql — Начальные данные</h3>
        <CodeBlock code={initSql} language="sql" filename="init.sql" />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="font-semibold text-green-800">Быстрый старт</p>
            <div className="mt-2 bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-300">
              <div>$ git clone https://github.com/your-org/ecolotok.git</div>
              <div>$ cd ecolotok</div>
              <div>$ docker-compose up -d</div>
              <div className="text-gray-500"># API: http://localhost:8000/docs</div>
              <div className="text-gray-500"># Киоск: http://localhost:80/kiosk/</div>
              <div className="text-gray-500"># Админка: http://localhost:80/admin/</div>
              <div className="text-gray-500"># БД: http://localhost:8080 (Adminer)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docker;

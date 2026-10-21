import React from 'react';
import CodeBlock from './CodeBlock';

const hardwareMock = `"""
Mock-сервис для имитации работы "железа" фандомата.
В реальном проекте этот модуль будет общаться с датчиками через Serial/GPIO/MQTT.
Здесь мы имитируем задержки и генерируем случайные, но реалистичные данные.
"""
import asyncio
import random
from typing import Dict, Any


class HardwareMock:
    """
    Имитирует аппаратное обеспечение фандомата:
    - Датчик веса (тензодатчик)
    - Механизм прессования
    - Датчик габаритов
    
    В продакшене заменяется на реальный драйвер оборудования.
    """

    # Допустимые диапазоны веса для разных материалов (в граммах)
    WEIGHT_RANGES = {
        "cardboard": {"min": 30, "max": 150, "nominal": 80},   # Картонный лоток
        "plastic": {"min": 20, "max": 100, "nominal": 55},     # Пластиковый лоток
    }

    # Допустимое отклонение от ожидаемого веса (в %)
    WEIGHT_TOLERANCE_PERCENT = 30  # ±30% от номинала

    async def check_weight(self, expected_weight: float, material_type: str) -> Dict[str, Any]:
        """
        Имитирует измерение веса упаковки на тензодатчике.
        
        Процесс:
        1. "Ждём" пока датчик стабилизируется (имитация задержки)
        2. Генерируем случайный вес в допустимом диапазоне
        3. Проверяем, соответствует ли вес ожидаемому
        
        Returns:
            dict с полями: weight, is_valid, message
        """
        # Имитация задержки стабилизации датчика (500-1500 мс)
        await asyncio.sleep(random.uniform(0.5, 1.5))

        # Получаем диапазон для данного типа материала
        weight_range = self.WEIGHT_RANGES.get(material_type, self.WEIGHT_RANGES["cardboard"])

        # Генерируем "измеренный" вес с нормальным распределением вокруг номинала
        measured_weight = random.gauss(
            mu=weight_range["nominal"],
            sigma=(weight_range["max"] - weight_range["min"]) / 6
        )
        # Ограничиваем диапазон
        measured_weight = max(weight_range["min"], min(weight_range["max"], measured_weight))
        measured_weight = round(measured_weight, 1)

        # Проверяем соответствие ожидаемому весу
        tolerance = expected_weight * (self.WEIGHT_TOLERANCE_PERCENT / 100)
        is_valid = abs(measured_weight - expected_weight) <= tolerance

        return {
            "weight": measured_weight,
            "is_valid": is_valid,
            "expected_weight": expected_weight,
            "deviation_percent": round(abs(measured_weight - expected_weight) / expected_weight * 100, 1),
            "message": "Вес в норме" if is_valid else f"Отклонение веса: {round(abs(measured_weight - expected_weight), 1)}г"
        }

    async def press_item(self) -> Dict[str, Any]:
        """
        Имитирует процесс прессования упаковки.
        
        В реальном фандомате:
        1. Активируется гидравлический/механический пресс
        2. Датчик подтверждает завершение цикла
        3. Упаковка падает в контейнер
        
        Returns:
            dict с полями: success, press_time_ms, message
        """
        # Имитация времени прессования (2-4 секунды)
        press_duration = random.uniform(2.0, 4.0)
        await asyncio.sleep(press_duration)

        # 95% шанс успешного прессования (иногда "заедает")
        success = random.random() < 0.95

        return {
            "success": success,
            "press_time_ms": round(press_duration * 1000),
            "message": "Прессование завершено успешно" if success else "Ошибка пресса — попробуйте ещё раз"
        }

    async def check_dimensions(self) -> Dict[str, Any]:
        """
        Имитирует проверку габаритов объекта (опционально).
        Может использоваться для отсеивания посторонних предметов.
        """
        await asyncio.sleep(random.uniform(0.3, 0.8))

        # Генерируем случайные "габариты" в мм
        length = random.randint(150, 250)   # Длина лотка
        width = random.randint(100, 180)    # Ширина лотка
        height = random.randint(30, 60)     # Высота лотка

        # Проверяем, что размеры в допустимых пределах
        is_valid = (100 <= length <= 300 and 80 <= width <= 200 and 20 <= height <= 80)

        return {
            "length_mm": length,
            "width_mm": width,
            "height_mm": height,
            "is_valid": is_valid,
            "message": "Габариты в норме" if is_valid else "Объект не соответствует размерам лотка"
        }

    async def get_fill_level(self) -> float:
        """
        Возвращает текущий уровень заполнения контейнера (0-100%).
        В реальности — данные с ультразвукового датчика расстояния.
        """
        await asyncio.sleep(0.2)
        return round(random.uniform(0, 100), 1)


# === Отдельный скрипт для тестирования Mock-сервиса ===

if __name__ == "__main__":
    """Запуск тестов mock-сервиса"""
    import asyncio

    async def test():
        hw = HardwareMock()
        
        print("🧪 Тестирование Mock Hardware...")
        print()
        
        # Тест проверки веса
        print("⚖️  Проверка веса (картонный лоток):")
        result = await hw.check_weight(expected_weight=80.0, material_type="cardboard")
        print(f"   Измеренный вес: {result['weight']}г")
        print(f"   Валидно: {result['is_valid']}")
        print(f"   Отклонение: {result['deviation_percent']}%")
        print()
        
        # Тест прессования
        print("🔨 Прессование:")
        result = await hw.press_item()
        print(f"   Успех: {result['success']}")
        print(f"   Время: {result['press_time_ms']}мс")
        print()
        
        # Тест габаритов
        print("📏 Габариты:")
        result = await hw.check_dimensions()
        print(f"   Размер: {result['length_mm']}x{result['width_mm']}x{result['height_mm']}мм")
        print(f"   Валидно: {result['is_valid']}")

    asyncio.run(test())`;

const promoService = `"""
Сервис генерации промокодов.
Создаёт уникальные одноразовые коды формата ECO-XXXXXX.
"""
import random
import string
from typing import Dict


def generate_promo_code(discount_percent: int = 10) -> Dict[str, any]:
    """
    Генерирует уникальный промокод для скидки.
    
    Формат: ECO-XXXXXX, где X — случайные буквы и цифры.
    Пример: ECO-K7M9P2, ECO-A3B8N5
    
    Args:
        discount_percent: Процент скидки (по умолчанию 10%)
    
    Returns:
        dict с полями: code, discount_percent
    """
    # Генерируем случайную часть кода (6 символов: буквы + цифры)
    chars = string.ascii_uppercase + string.digits
    # Исключаем похожие символы: O/0, I/1, S/5
    safe_chars = chars.replace('O', '').replace('I', '').replace('S', '')
    random_part = ''.join(random.choices(safe_chars, k=6))
    
    code = f"ECO-{random_part}"
    
    return {
        "code": code,
        "discount_percent": discount_percent
    }


# === Тестирование генерации ===
if __name__ == "__main__":
    print("🎫 Генерация промокодов:")
    for i in range(5):
        result = generate_promo_code(discount_percent=10)
        print(f"   {i+1}. {result['code']} (скидка {result['discount_percent']}%)")`;

const databasePy = `"""
Конфигурация подключения к базе данных PostgreSQL.
Использует SQLAlchemy для ORM и управление сессиями.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Строка подключения к PostgreSQL (из переменных окружения)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ecolotok:ecolotok_pass@localhost:5432/ecolotok_db"
)

# Создаём движок SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Проверка соединения перед запросом
    pool_size=10,            # Размер пула соединений
    max_overflow=20,         # Макс. дополнительных соединений
    echo=False               # Включить для отладки SQL-запросов
)

# Фабрика сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()


# Dependency для FastAPI — получение сессии БД
def get_db():
    """
    Dependency injection: создаёт сессию БД для каждого запроса.
    Автоматически закрывает сессию после обработки запроса.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`;

const MockService: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
        <h2 className="text-2xl font-bold text-orange-800 mb-2 flex items-center gap-3">
          🤖 Mock-сервис для "железа"
        </h2>
        <p className="text-gray-600">
          Имитирует работу датчиков веса, пресса и ультразвукового сенсора заполнения.
          В продакшене заменяется на реальные драйверы оборудования (GPIO/Serial/MQTT).
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Как работает имитация</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl mb-2">⚖️</div>
            <div className="font-semibold text-blue-800">Датчик веса</div>
            <p className="text-sm text-blue-700 mt-1">
              Генерирует вес по нормальному распределению вокруг номинала. Допуск ±30%.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl mb-2">🔨</div>
            <div className="font-semibold text-green-800">Пресс</div>
            <p className="text-sm text-green-700 mt-1">
              Имитирует задержку 2-4 сек. 95% успешных циклов. 5% — "заедание".
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-2xl mb-2">📏</div>
            <div className="font-semibold text-purple-800">Габариты</div>
            <p className="text-sm text-purple-700 mt-1">
              Случайные размеры в реалистичных пределах. Проверка на соответствие лотку.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🐍 hardware_mock.py</h3>
        <CodeBlock code={hardwareMock} language="python" filename="backend/app/services/hardware_mock.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🎫 promo_service.py</h3>
        <CodeBlock code={promoService} language="python" filename="backend/app/services/promo_service.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🔗 database.py</h3>
        <CodeBlock code={databasePy} language="python" filename="backend/app/database.py" />
      </div>
    </div>
  );
};

export default MockService;

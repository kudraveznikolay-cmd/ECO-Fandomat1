import React from 'react';
import CodeBlock from './CodeBlock';

const databaseModels = `from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


# === Перечисления для статусов ===

class MachineStatus(str, enum.Enum):
    """Статус фандомата"""
    ONLINE = "online"          # Работает нормально
    OFFLINE = "offline"        # Отключён
    MAINTENANCE = "maintenance" # На обслуживании
    FULL = "full"              # Контейнер заполнен


class MaterialType(str, enum.Enum):
    """Тип материала упаковки"""
    CARDBOARD = "cardboard"    # Картонный лоток
    PLASTIC = "plastic"        # Пластиковый лоток


class TransactionStatus(str, enum.Enum):
    """Статус транзакции приёма"""
    PENDING = "pending"        # Ожидает подтверждения
    ACCEPTED = "accepted"      # Принято успешно
    REJECTED = "rejected"      # Отклонено (неверный вес/код)


# === Модель: Фандомат (Machine) ===

class Machine(Base):
    """
    Представляет физический фандомат.
    Каждый автомат имеет уникальный ID, местоположение и текущий статус.
    """
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(200), nullable=False, comment="Адрес установки")
    status = Column(Enum(MachineStatus), default=MachineStatus.ONLINE)
    current_fill_level = Column(Float, default=0.0, comment="Заполненность контейнера, 0-100%")
    serial_number = Column(String(50), unique=True, nullable=False)
    installed_at = Column(DateTime, default=datetime.utcnow)

    # Связь: один автомат — много транзакций
    transactions = relationship("Transaction", back_populates="machine")


# === Модель: Продукт (Product) ===

class Product(Base):
    """
    Справочник известных штрихкодов яичной упаковки.
    Используется для валидации при сканировании.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String(50), unique=True, index=True, nullable=False, comment="Штрихкод/QR")
    brand = Column(String(100), nullable=False, comment="Производитель")
    material_type = Column(Enum(MaterialType), nullable=False, comment="Тип материала")
    expected_weight_g = Column(Float, nullable=False, comment="Ожидаемый вес в граммах")
    is_active = Column(Boolean, default=True, comment="Актуален ли продукт")


# === Модель: Промокод (PromoCode) ===

class PromoCode(Base):
    """
    Одноразовый промокод, генерируемый после успешной сдачи упаковки.
    Каждый код может быть использован только один раз.
    """
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, comment="Уникальный код, напр. ECO-X7K9M2")
    discount_percent = Column(Integer, default=10, comment="Процент скидки")
    is_used = Column(Boolean, default=False, comment="Был ли использован")
    created_at = Column(DateTime, default=datetime.utcnow)
    used_at = Column(DateTime, nullable=True)

    # Связь с транзакцией
    transaction = relationship("Transaction", back_populates="promo_code", uselist=False)


# === Модель: Транзакция (Transaction) ===

class Transaction(Base):
    """
    Запись о каждой операции приёма упаковки.
    Хранит данные о весе, статусе и привязанный промокод.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    barcode = Column(String(50), nullable=False, comment="Отсканированный код")
    weight = Column(Float, nullable=True, comment="Фактический вес в граммах")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    promo_code_id = Column(Integer, ForeignKey("promo_codes.id"), nullable=True)

    # Связи
    machine = relationship("Machine", back_populates="transactions")
    promo_code = relationship("PromoCode", back_populates="transaction")`;

const Database: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-3">
          🗄️ Схема базы данных (SQLAlchemy модели)
        </h2>
        <p className="text-gray-600">
          Четыре основные таблицы: Machine, Product, Transaction, PromoCode.
          Связи реализованы через ForeignKey с cascade-удалением.
        </p>
      </div>

      {/* Визуальная схема */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📐 ER-диаграмма (упрощённая)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50">
            <div className="font-bold text-blue-800 mb-2">🏭 Machine</div>
            <div className="text-xs space-y-1 font-mono">
              <div>🔑 id: Integer (PK)</div>
              <div>📍 location: String(200)</div>
              <div>📡 status: Enum(online/offline/...)</div>
              <div>📊 current_fill_level: Float</div>
              <div>🔢 serial_number: String(50) UNIQUE</div>
            </div>
          </div>
          <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
            <div className="font-bold text-green-800 mb-2">📦 Product</div>
            <div className="text-xs space-y-1 font-mono">
              <div>🔑 id: Integer (PK)</div>
              <div>📊 barcode: String(50) UNIQUE</div>
              <div>🏷️ brand: String(100)</div>
              <div>🧱 material_type: Enum(cardboard/plastic)</div>
              <div>⚖️ expected_weight_g: Float</div>
            </div>
          </div>
          <div className="border-2 border-purple-300 rounded-xl p-4 bg-purple-50">
            <div className="font-bold text-purple-800 mb-2">🎫 PromoCode</div>
            <div className="text-xs space-y-1 font-mono">
              <div>🔑 id: Integer (PK)</div>
              <div>🔤 code: String(20) UNIQUE</div>
              <div>💰 discount_percent: Integer</div>
              <div>✅ is_used: Boolean</div>
              <div>📅 created_at: DateTime</div>
            </div>
          </div>
          <div className="border-2 border-orange-300 rounded-xl p-4 bg-orange-50">
            <div className="font-bold text-orange-800 mb-2">📋 Transaction</div>
            <div className="text-xs space-y-1 font-mono">
              <div>🔑 id: Integer (PK)</div>
              <div>🔗 machine_id → Machine.id (FK)</div>
              <div>📊 barcode: String(50)</div>
              <div>⚖️ weight: Float</div>
              <div>📅 timestamp: DateTime</div>
              <div>📡 status: Enum(pending/accepted/rejected)</div>
              <div>🔗 promo_code_id → PromoCode.id (FK)</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Machine 1 ←→ N Transaction N ←→ 1 PromoCode
        </div>
      </div>

      {/* Код моделей */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">🐍 Код моделей (models.py)</h3>
        <CodeBlock code={databaseModels} language="python" filename="backend/app/models.py" />
      </div>
    </div>
  );
};

export default Database;

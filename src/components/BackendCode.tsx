import React from 'react';
import CodeBlock from './CodeBlock';

const mainPy = `"""
ЭкоЛоток — FastAPI Backend
Главный файл приложения. Инициализирует FastAPI, подключает роутеры и middleware.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routers import scan, confirm, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle-хук: создаём таблицы при старте (для MVP).
    В продакшене используем Alembic миграции.
    """
    # Создаём все таблицы в БД (для разработки)
    Base.metadata.create_all(bind=engine)
    yield
    # Здесь можно добавить очистку ресурсов при shutdown


# Создаём экземпляр приложения
app = FastAPI(
    title="ЭкоЛоток API",
    description="Система управления фандоматами для приёма яичной упаковки",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware — разрешаем запросы от киоска и админки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры (API endpoints)
app.include_router(scan.router, prefix="/api/v1", tags=["Сканирование"])
app.include_router(confirm.router, prefix="/api/v1", tags=["Подтверждение приёма"])
app.include_router(admin.router, prefix="/api/v1", tags=["Администрирование"])


@app.get("/health")
async def health_check():
    """Проверка работоспособности сервера"""
    return {"status": "ok", "service": "ecolotok-api"}`;

const scanRouter = `"""
Роутер сканирования штрихкода.
Эндпоинт POST /api/v1/scan — первый шаг в цепочке приёма упаковки.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas import ScanRequest, ScanResponse
from models import Product, TransactionStatus
from services.hardware_mock import HardwareMock

router = APIRouter()


@router.post("/scan", response_model=ScanResponse)
async def scan_barcode(request: ScanRequest, db: Session = Depends(get_db)):
    """
    Принимает штрихкод от киоска и проверяет его валидность.
    
    Логика:
    1. Ищем продукт по barcode в справочнике
    2. Если не найден — возвращаем ошибку
    3. Если найден — запрашиваем Mock Hardware для проверки веса
    4. Возвращаем результат валидации
    """
    # Шаг 1: Ищем продукт в базе
    product = db.query(Product).filter(
        Product.barcode == request.barcode,
        Product.is_active == True
    ).first()

    if not product:
        # Штрихкод не распознан — нет такого продукта в справочнике
        raise HTTPException(
            status_code=404,
            detail={
                "error": "product_not_found",
                "message": f"Штрихкод {request.barcode} не найден в базе данных"
            }
        )

    # Шаг 2: Запрашиваем Mock Hardware — проверка веса и габаритов
    hardware = HardwareMock()
    weight_result = await hardware.check_weight(
        expected_weight=product.expected_weight_g,
        material_type=product.material_type.value
    )

    # Шаг 3: Формируем ответ
    if weight_result["is_valid"]:
        return ScanResponse(
            status="valid",
            product_name=f"{product.brand} ({product.material_type.value})",
            barcode=request.barcode,
            weight=weight_result["weight"],
            message="Упаковка распознана. Поместите её в приёмник для подтверждения."
        )
    else:
        return ScanResponse(
            status="invalid",
            product_name=None,
            barcode=request.barcode,
            weight=weight_result["weight"],
            message=f"Вес не соответствует норме. Ожидалось ~{product.expected_weight_g}г, получено {weight_result['weight']}г"
        )`;

const confirmRouter = `"""
Роутер подтверждения приёма.
Эндпоинт POST /api/v1/confirm-accept — финальный шаг: прессование + выдача промокода.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from schemas import ConfirmRequest, ConfirmResponse
from models import Transaction, TransactionStatus, PromoCode, Machine, MachineStatus
from services.promo_service import generate_promo_code
from services.hardware_mock import HardwareMock

router = APIRouter()


@router.post("/confirm-accept", response_model=ConfirmResponse)
async def confirm_accept(request: ConfirmRequest, db: Session = Depends(get_db)):
    """
    Подтверждает приём упаковки:
    1. Проверяет статус автомата
    2. Имитирует прессование (Mock Hardware)
    3. Создаёт запись транзакции
    4. Генерирует уникальный промокод
    5. Обновляет уровень заполнения контейнера
    """
    # Шаг 1: Проверяем что автомат онлайн
    machine = db.query(Machine).filter(Machine.id == request.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Автомат не найден")
    
    if machine.status != MachineStatus.ONLINE:
        raise HTTPException(
            status_code=400,
            detail=f"Автомат не работает. Статус: {machine.status.value}"
        )

    # Шаг 2: Имитируем прессование через Mock Hardware
    hardware = HardwareMock()
    press_result = await hardware.press_item()
    
    if not press_result["success"]:
        raise HTTPException(
            status_code=500,
            detail="Ошибка пресса. Попробуйте ещё раз."
        )

    # Шаг 3: Генерируем промокод
    promo_code = generate_promo_code(discount_percent=10)
    promo_db = PromoCode(
        code=promo_code["code"],
        discount_percent=promo_code["discount_percent"],
        is_used=False,
        created_at=datetime.utcnow()
    )
    db.add(promo_db)
    db.flush()  # Получаем ID промокода

    # Шаг 4: Создаём транзакцию
    transaction = Transaction(
        machine_id=request.machine_id,
        barcode=request.barcode,
        weight=request.weight,
        timestamp=datetime.utcnow(),
        status=TransactionStatus.ACCEPTED,
        promo_code_id=promo_db.id
    )
    db.add(transaction)

    # Шаг 5: Обновляем заполненность контейнера
    # Каждый лоток ~100г, контейнер вмещает ~50кг = 500 лотков
    machine.current_fill_level = min(100.0, machine.current_fill_level + 0.2)
    if machine.current_fill_level >= 95:
        machine.status = MachineStatus.FULL

    # Сохраняем все изменения
    db.commit()
    db.refresh(transaction)

    return ConfirmResponse(
        transaction_id=transaction.id,
        promo_code=promo_db.code,
        discount_percent=promo_db.discount_percent,
        status="accepted",
        message=f"Спасибо! Ваш промокод на скидку {promo_db.discount_percent}%: {promo_db.code}"
    )`;

const adminRouter = `"""
Роутер администрирования.
Эндпоинт GET /api/v1/admin/stats — статистика для дашборда.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from database import get_db
from schemas import AdminStatsResponse, MachineStats
from models import Machine, Transaction, PromoCode, TransactionStatus

router = APIRouter()


@router.get("/admin/stats", response_model=AdminStatsResponse)
async def get_admin_stats(db: Session = Depends(get_db)):
    """
    Возвращает агрегированную статистику для админ-панели:
    - Количество автоматов и их статусы
    - Общее число транзакций за сегодня / всё время
    - Количество выданных промокодов
    - Средний вес принятой упаковки
    - Уровень заполнения контейнеров
    """
    # Статистика по автоматам
    machines = db.query(Machine).all()
    machine_stats = []
    for m in machines:
        machine_stats.append(MachineStats(
            id=m.id,
            location=m.location,
            status=m.status.value,
            fill_level=m.current_fill_level,
            transactions_today=db.query(Transaction).filter(
                Transaction.machine_id == m.id,
                Transaction.timestamp >= datetime.utcnow().replace(hour=0, minute=0, second=0)
            ).count()
        ))

    # Общие счётчики
    total_transactions = db.query(Transaction).filter(
        Transaction.status == TransactionStatus.ACCEPTED
    ).count()

    today_transactions = db.query(Transaction).filter(
        Transaction.status == TransactionStatus.ACCEPTED,
        Transaction.timestamp >= datetime.utcnow().replace(hour=0, minute=0, second=0)
    ).count()

    total_promo_codes = db.query(PromoCode).count()
    used_promo_codes = db.query(PromoCode).filter(PromoCode.is_used == True).count()

    # Средний вес
    avg_weight = db.query(func.avg(Transaction.weight)).filter(
        Transaction.status == TransactionStatus.ACCEPTED
    ).scalar() or 0

    return AdminStatsResponse(
        total_machines=len(machines),
        machines_online=sum(1 for m in machines if m.status.value == "online"),
        machines_full=sum(1 for m in machines if m.status.value == "full"),
        total_transactions=total_transactions,
        today_transactions=today_transactions,
        total_promo_issued=total_promo_codes,
        total_promo_used=used_promo_codes,
        average_weight_g=round(avg_weight, 1),
        machine_details=machine_stats
    )`;

const schemasPy = `"""
Pydantic-схемы для валидации входных/выходных данных API.
Обеспечивают типобезопасность и автодокументацию (Swagger).
"""
from pydantic import BaseModel, Field
from typing import Optional, List


# === Схемы для /scan ===

class ScanRequest(BaseModel):
    """Запрос на сканирование штрихкода"""
    barcode: str = Field(..., min_length=3, max_length=50, description="Штрихкод или QR-код")
    machine_id: int = Field(..., description="ID автомата")


class ScanResponse(BaseModel):
    """Ответ после сканирования"""
    status: str = Field(..., description="valid / invalid")
    product_name: Optional[str] = None
    barcode: str
    weight: Optional[float] = None
    message: str


# === Схемы для /confirm-accept ===

class ConfirmRequest(BaseModel):
    """Запрос на подтверждение приёма"""
    machine_id: int = Field(..., description="ID автомата")
    barcode: str = Field(..., description="Штрихкод упаковки")
    weight: float = Field(..., gt=0, description="Измеренный вес в граммах")


class ConfirmResponse(BaseModel):
    """Ответ после подтверждения"""
    transaction_id: int
    promo_code: str
    discount_percent: int
    status: str
    message: str


# === Схемы для /admin/stats ===

class MachineStats(BaseModel):
    """Статистика по одному автомату"""
    id: int
    location: str
    status: str
    fill_level: float
    transactions_today: int


class AdminStatsResponse(BaseModel):
    """Агрегированная статистика для админки"""
    total_machines: int
    machines_online: int
    machines_full: int
    total_transactions: int
    today_transactions: int
    total_promo_issued: int
    total_promo_used: int
    average_weight_g: float
    machine_details: List[MachineStats]`;

const BackendCode: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 flex items-center gap-3">
          ⚙️ Backend код (FastAPI)
        </h2>
        <p className="text-gray-600">
          Три основных эндпоинта: сканирование, подтверждение приёма и админ-статистика.
          Все данные валидируются через Pydantic-схемы.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 main.py — Точка входа</h3>
        <CodeBlock code={mainPy} language="python" filename="backend/app/main.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 schemas.py — Pydantic-схемы</h3>
        <CodeBlock code={schemasPy} language="python" filename="backend/app/schemas.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 scan.py — Роутер сканирования</h3>
        <CodeBlock code={scanRouter} language="python" filename="backend/app/routers/scan.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 confirm.py — Подтверждение приёма</h3>
        <CodeBlock code={confirmRouter} language="python" filename="backend/app/routers/confirm.py" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 admin.py — Админ-статистика</h3>
        <CodeBlock code={adminRouter} language="python" filename="backend/app/routers/admin.py" />
      </div>
    </div>
  );
};

export default BackendCode;

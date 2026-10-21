import React, { useState, useCallback } from 'react';
import CodeBlock from './CodeBlock';

type KioskStatus = 'idle' | 'scanning' | 'valid' | 'invalid' | 'pressing' | 'success' | 'error';

const kioskHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ЭкоЛоток — Приём упаковки</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="kiosk-container">
        <!-- Логотип и заголовок -->
        <header class="kiosk-header">
            <div class="logo">♻️ ЭкоЛоток</div>
            <p class="subtitle">Сдай упаковку — получи скидку!</p>
        </header>

        <!-- Основная область с состояниями -->
        <main class="kiosk-main">
            <!-- Состояние: Ожидание -->
            <div id="state-idle" class="state active">
                <div class="scan-icon">📱</div>
                <h2>Поднесите упаковку к сканеру</h2>
                <p>или введите штрихкод вручную</p>
                <div class="input-group">
                    <input type="text" id="barcode-input" 
                           placeholder="Штрихкод (напр. 4600123456789)"
                           class="barcode-input">
                    <button onclick="startScan()" class="btn btn-primary">
                        Проверить
                    </button>
                </div>
                <div class="hint">
                    💡 Тестовые коды: 4600001000001 (картон), 4600002000002 (пластик)
                </div>
            </div>

            <!-- Состояние: Проверка -->
            <div id="state-scanning" class="state">
                <div class="spinner"></div>
                <h2>Проверяем упаковку...</h2>
                <p>Пожалуйста, подождите</p>
            </div>

            <!-- Состояние: Успех — ждём подтверждения -->
            <div id="state-valid" class="state">
                <div class="success-icon">✅</div>
                <h2 id="product-name">Упаковка распознана!</h2>
                <p id="weight-info">Вес: 82г</p>
                <button onclick="confirmAccept()" class="btn btn-success btn-large">
                    🗑️ Принять и получить промокод
                </button>
                <button onclick="resetKiosk()" class="btn btn-secondary">
                    Отмена
                </button>
            </div>

            <!-- Состояние: Прессование -->
            <div id="state-pressing" class="state">
                <div class="spinner large"></div>
                <h2>Прессуем упаковку...</h2>
                <p>Это займёт несколько секунд</p>
                <div class="progress-bar">
                    <div class="progress-fill" id="press-progress"></div>
                </div>
            </div>

            <!-- Состояние: Успех — промокод -->
            <div id="state-success" class="state">
                <div class="success-icon large">🎉</div>
                <h2>Спасибо за переработку!</h2>
                <div class="promo-card">
                    <div class="promo-label">Ваш промокод на скидку 10%</div>
                    <div class="promo-code" id="promo-code">ECO-XXXXXX</div>
                    <div class="promo-hint">Используйте при следующей покупке</div>
                </div>
                <button onclick="resetKiosk()" class="btn btn-primary btn-large">
                    Принять ещё упаковку
                </button>
            </div>

            <!-- Состояние: Ошибка -->
            <div id="state-error" class="state">
                <div class="error-icon">❌</div>
                <h2 id="error-title">Ошибка</h2>
                <p id="error-message">Не удалось распознать упаковку</p>
                <button onclick="resetKiosk()" class="btn btn-primary btn-large">
                    Попробовать снова
                </button>
            </div>
        </main>

        <!-- Футер -->
        <footer class="kiosk-footer">
            <p>🌱 Каждый лоток — шаг к чистой планете</p>
        </footer>
    </div>
    <script src="app.js"></script>
</body>
</html>`;

const kioskJS = `/**
 * ЭкоЛоток — Логика интерфейса киоска
 * Управляет состояниями UI и взаимодействует с Backend API
 */

const API_BASE = 'http://localhost:8000/api/v1';
const MACHINE_ID = 1; // ID этого автомата (настраивается)

// Текущее состояние
let currentBarcode = '';
let currentWeight = 0;

/**
 * Переключение видимого состояния интерфейса
 */
function showState(stateName) {
    // Скрываем все состояния
    document.querySelectorAll('.state').forEach(el => {
        el.classList.remove('active');
    });
    // Показываем нужное
    const target = document.getElementById('state-' + stateName);
    if (target) target.classList.add('active');
}

/**
 * Начало процесса сканирования
 */
async function startScan() {
    const input = document.getElementById('barcode-input');
    const barcode = input.value.trim();
    
    if (!barcode) {
        alert('Введите штрихкод');
        return;
    }
    
    currentBarcode = barcode;
    showState('scanning'); // Показываем спиннер
    
    try {
        const response = await fetch(API_BASE + '/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                barcode: barcode,
                machine_id: MACHINE_ID
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'valid') {
            // Упаковка распознана — показываем информацию
            currentWeight = data.weight;
            document.getElementById('product-name').textContent = data.product_name;
            document.getElementById('weight-info').textContent = 'Вес: ' + data.weight + 'г';
            showState('valid');
        } else {
            // Неверный вес или продукт
            document.getElementById('error-title').textContent = 'Не распознано';
            document.getElementById('error-message').textContent = data.message;
            showState('error');
        }
    } catch (error) {
        document.getElementById('error-title').textContent = 'Ошибка соединения';
        document.getElementById('error-message').textContent = 'Не удалось связаться с сервером';
        showState('error');
    }
}

/**
 * Подтверждение приёма упаковки
 */
async function confirmAccept() {
    showState('pressing'); // Показываем процесс прессования
    
    // Анимация прогресс-бара
    animateProgress();
    
    try {
        const response = await fetch(API_BASE + '/confirm-accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                machine_id: MACHINE_ID,
                barcode: currentBarcode,
                weight: currentWeight
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'accepted') {
            // Успех! Показываем промокод
            document.getElementById('promo-code').textContent = data.promo_code;
            showState('success');
        } else {
            throw new Error(data.message || 'Ошибка приёма');
        }
    } catch (error) {
        document.getElementById('error-title').textContent = 'Ошибка';
        document.getElementById('error-message').textContent = error.message;
        showState('error');
    }
}

/**
 * Анимация прогресс-бара при прессовании
 */
function animateProgress() {
    const bar = document.getElementById('press-progress');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
        }
        bar.style.width = width + '%';
    }, 300);
}

/**
 * Сброс киоска в начальное состояние
 */
function resetKiosk() {
    currentBarcode = '';
    currentWeight = 0;
    document.getElementById('barcode-input').value = '';
    document.getElementById('press-progress').style.width = '0%';
    showState('idle');
}

// Автоматический сброс через 30 сек бездействия (для реального киоска)
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        resetKiosk();
    }, 30000);
}
document.addEventListener('click', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);`;

const KioskDemo: React.FC = () => {
  const [status, setStatus] = useState<KioskStatus>('idle');
  const [barcode, setBarcode] = useState('');
  const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  // Тестовые штрихкоды
  const testProducts: Record<string, { name: string; weight: number }> = {
    '4600001000001': { name: 'Картон', weight: 82 },
    '4600002000002': { name: 'Пластик', weight: 55 },
    '4600003000003': { name: 'Полистирол', weight: 48 },
  };

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ECO-';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const handleScan = useCallback(async () => {
    if (!barcode.trim()) return;

    setStatus('scanning');
    setErrorMessage('');

    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const product = testProducts[barcode.trim()];
    if (product) {
      setProductName(product.name);
      setWeight(product.weight + Math.floor(Math.random() * 10 - 5));
      setStatus('valid');
    } else {
      setErrorMessage(`Штрихкод "${barcode}" не найден в базе данных`);
      setStatus('error');
    }
  }, [barcode]);

  const handleConfirm = useCallback(async () => {
    setStatus('pressing');
    setProgress(0);

    // Анимация прогресса
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Имитация прессования
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval);
    setProgress(100);

    await new Promise(resolve => setTimeout(resolve, 500));
    setPromoCode(generatePromoCode());
    setStatus('success');
  }, []);

  const handleReset = () => {
    setStatus('idle');
    setBarcode('');
    setProductName('');
    setWeight(0);
    setPromoCode('');
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
        <h2 className="text-2xl font-bold text-teal-800 mb-2 flex items-center gap-3">
          💻 Интерфейс киоска (Интерактивное демо)
        </h2>
        <p className="text-gray-600">
          Попробуйте работу фандомата прямо сейчас! Введите тестовый штрихкод или используйте кнопки ниже.
        </p>
      </div>

      {/* Интерактивный демо киоска */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-b from-green-600 to-green-800 rounded-3xl p-1 shadow-2xl">
          <div className="bg-gray-900 rounded-[22px] p-6 min-h-[600px] flex flex-col">
            {/* Header киоска */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white">♻️ ЭкоЛоток</div>
              <p className="text-green-300 text-sm mt-1">Сдай упаковку — получи скидку!</p>
            </div>

            {/* Основная область */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* IDLE */}
              {status === 'idle' && (
                <div className="text-center space-y-4 w-full">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-white text-xl font-semibold">Поднесите упаковку к сканеру</h3>
                  <p className="text-gray-400 text-sm">или введите штрихкод вручную</p>
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Штрихкод..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none text-center"
                      onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    />
                    <button
                      onClick={handleScan}
                      className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors"
                    >
                      🔍 Проверить
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-500 text-xs">Тестовые коды:</p>
                    {Object.entries(testProducts).map(([code, prod]) => (
                      <button
                        key={code}
                        onClick={() => { setBarcode(code); }}
                        className="block w-full text-left px-3 py-2 bg-gray-800 rounded-lg text-gray-300 text-xs hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-green-400 font-mono">{code}</span>
                        <span className="text-gray-500 ml-2">{prod.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SCANNING */}
              {status === 'scanning' && (
                <div className="text-center space-y-4">
                  <div className="animate-spin text-6xl">⚙️</div>
                  <h3 className="text-white text-xl font-semibold">Проверяем упаковку...</h3>
                  <p className="text-gray-400">Пожалуйста, подождите</p>
                </div>
              )}

              {/* VALID */}
              {status === 'valid' && (
                <div className="text-center space-y-4 w-full">
                  <div className="text-6xl">✅</div>
                  <h3 className="text-white text-xl font-semibold">Упаковка распознана!</h3>
                  <p className="text-green-300">{productName}</p>
                  <p className="text-gray-400">Вес: {weight}г</p>
                  <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-lg transition-colors mt-4"
                  >
                    🗑️ Принять и получить промокод
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              )}

              {/* PRESSING */}
              {status === 'pressing' && (
                <div className="text-center space-y-4 w-full">
                  <div className="animate-bounce text-6xl">🔨</div>
                  <h3 className="text-white text-xl font-semibold">Прессуем упаковку...</h3>
                  <p className="text-gray-400">Это займёт несколько секунд</p>
                  <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {status === 'success' && (
                <div className="text-center space-y-4 w-full">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-white text-xl font-semibold">Спасибо за переработку!</h3>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mt-4">
                    <p className="text-gray-800 text-sm">Ваш промокод на скидку 10%</p>
                    <p className="text-3xl font-bold text-gray-900 font-mono mt-2">{promoCode}</p>
                    <p className="text-gray-700 text-xs mt-2">Используйте при следующей покупке</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors mt-4"
                  >
                    Принять ещё упаковку
                  </button>
                </div>
              )}

              {/* ERROR */}
              {status === 'error' && (
                <div className="text-center space-y-4 w-full">
                  <div className="text-6xl">❌</div>
                  <h3 className="text-white text-xl font-semibold">Ошибка</h3>
                  <p className="text-red-300">{errorMessage}</p>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors mt-4"
                  >
                    Попробовать снова
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-xs">🌱 Каждый лоток — шаг к чистой планете</p>
            </div>
          </div>
        </div>
      </div>

      {/* Исходный код */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">📄 Исходный код интерфейса</h3>
        <CodeBlock code={kioskHTML} language="html" filename="kiosk/index.html" />
        <CodeBlock code={kioskJS} language="javascript" filename="kiosk/app.js" />
      </div>
    </div>
  );
};

export default KioskDemo;

# 🚀 Инструкция по настройке DesignRating

## Быстрый старт (без внешних API)

Приложение готово к запуску в демо-режиме без настройки внешних сервисов:

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

**В демо-режиме:**
- ✅ Загрузка изображений работает
- ✅ Анализ работает с заготовленными результатами
- ✅ Оценки и рекомендации генерируются
- ⚠️ Платежи имитируются (без реальных транзакций)
- ⚠️ ИИ анализ использует заготовленные шаблоны

## Полная настройка с внешними API

### 1. OpenAI API (для реального анализа)

1. Зарегистрируйтесь на [platform.openai.com](https://platform.openai.com)
2. Создайте API ключ в разделе API Keys
3. Добавьте в `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

**Стоимость:** ~$0.01-0.03 за анализ (в зависимости от количества изображений)

### 2. Stripe (для платежей)

1. Создайте аккаунт на [stripe.com](https://stripe.com)
2. В Dashboard → Developers → API keys получите ключи
3. Добавьте в `.env.local`:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

4. Настройте webhook для событий платежей:
   - URL: `https://yourapp.com/api/payment`
   - События: `checkout.session.completed`, `payment_intent.payment_failed`
   - Добавьте webhook secret:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Структура проекта

```
/DesignRating
├── app/                    # Next.js App Router
│   ├── api/               # API маршруты
│   │   ├── analyze/       # Анализ изображений
│   │   └── payment/       # Обработка платежей
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── AnalysisResults.tsx
│   ├── Header.tsx
│   ├── ImageUpload.tsx
│   ├── LoadingSpinner.tsx
│   ├── PaymentModal.tsx
│   └── ScoreDisplay.tsx
├── lib/                   # Утилиты
│   └── utils.ts
├── types/                 # TypeScript типы
│   └── index.ts
├── public/               # Статические файлы
├── middleware.ts         # Rate limiting
└── README.md
```

## Основные функции

### 🎨 Анализ дизайна
- Загрузка до 6 изображений
- Анализ композиции, типографики, цветов
- Оценка от 1 до 100 баллов
- Детальные рекомендации

### 💳 Монетизация
- 3 бесплатных анализа
- $0.99 за дополнительный анализ
- Интеграция со Stripe

### 🛡️ Безопасность
- Rate limiting (10 запросов за 15 минут)
- Валидация файлов
- CORS защита

### 📱 UX/UI
- Адаптивный дизайн
- Drag & drop загрузка
- Анимации и переходы
- Цветовое кодирование результатов

## Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках
3. Деплой произойдет автоматически

### Другие платформы

```bash
npm run build
npm start
```

Требования:
- Node.js 18+
- Поддержка Server Actions
- HTTPS для Stripe webhooks

## Настройка webhook'ов в продакшене

1. В Stripe Dashboard → Webhooks добавьте endpoint:
   ```
   https://yourapp.com/api/payment
   ```

2. Выберите события:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`

3. Скопируйте webhook secret и добавьте в переменные окружения

## Мониторинг и аналитика

Рекомендуется добавить:
- Google Analytics для отслеживания конверсий
- Sentry для мониторинга ошибок
- PostHog для A/B тестирования

## Поддержка

- Документация: README.md
- Issues: GitHub Issues
- Email: support@designrating.com

---

✨ **Готово к продакшену!** Приложение полностью функционально и готово к использованию.
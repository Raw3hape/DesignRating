# Настройка Vercel KV для хранения email-адресов

## Текущий статус

Система сбора email-адресов **полностью реализована** в коде:
- ✅ Модальное окно для ввода email
- ✅ API endpoint для сохранения email
- ✅ Валидация и защита от ботов
- ✅ Интеграция с анализом дизайна
- ✅ Админ панель для просмотра статистики

**Осталось только подключить Vercel KV!**

## Пошаговая инструкция по настройке Vercel KV

### 1. Создание KV базы данных в Vercel

1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект **DesignRating**
3. Перейдите во вкладку **Storage**
4. Нажмите **Create Database**
5. Выберите **KV** (Redis-совместимое хранилище)
6. Дайте имя базе данных, например: `designrating-kv`
7. Выберите регион (рекомендуется тот же, где развернут проект)
8. Нажмите **Create**

### 2. Подключение KV к проекту

После создания базы данных:
1. На странице KV нажмите **Connect Project**
2. Выберите ваш проект **DesignRating**
3. Выберите окружения: **Production**, **Preview**, **Development**
4. Нажмите **Connect**

Vercel автоматически добавит переменные окружения:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### 3. Настройка локальной разработки

Для локальной разработки с реальной KV базой:

1. Скопируйте переменные из Vercel Dashboard:
   - Storage → ваша KV база → **.env.local** tab
   
2. Добавьте их в ваш локальный `.env.local`:
```env
KV_REST_API_URL=https://your-kv-instance.kv.vercel-storage.com
KV_REST_API_TOKEN=your-token-here
```

### 4. Проверка работы

После настройки проверьте работу системы:

1. **Локально:**
   ```bash
   npm run dev
   ```
   - Загрузите изображения
   - При нажатии "Analyze" должно появиться окно для ввода email
   - Email должен сохраняться в KV

2. **Админ панель:**
   - Перейдите на `/admin`
   - Введите API ключ из `ADMIN_API_KEY`
   - Вы должны увидеть статистику пользователей

### 5. Деплой на Vercel

1. Закоммитьте изменения:
   ```bash
   git add .
   git commit -m "Setup email collection with Vercel KV"
   git push
   ```

2. Vercel автоматически задеплоит проект с подключенной KV базой

## Структура данных в KV

После настройки в KV будут храниться:

```
user:{email}           - Данные пользователя
  {
    email: string,
    createdAt: string,
    analysisCount: number,
    lastAnalysis: string | null
  }

analysis:{id}          - Данные анализа
  {
    id: string,
    email: string,
    score: number,
    category: string,
    imageCount: number,
    createdAt: string
  }

stats:global           - Глобальная статистика
  {
    totalUsers: number,
    totalAnalyses: number,
    createdAt: string,
    updatedAt: string
  }

stats:daily:{date}     - Ежедневная статистика
  {
    date: string,
    analyses: number,
    uniqueUsers: string[],
    uniqueUsersCount: number
  }
```

## Альтернатива: Работа без KV

Если вы еще не готовы настроить Vercel KV, система будет работать с памятью:
- Email-адреса сохраняются в памяти сервера
- При перезапуске данные теряются
- Подходит для тестирования

## Полезные команды Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Привязка проекта
vercel link

# Получение переменных окружения
vercel env pull .env.local

# Просмотр логов KV
vercel logs
```

## Мониторинг использования

В Vercel Dashboard → Storage → ваша KV база:
- **Metrics** - просмотр запросов и использования
- **Data Browser** - просмотр сохраненных данных
- **Logs** - логи операций

## Лимиты бесплатного плана

Vercel KV на Hobby плане:
- 256MB хранилища
- 3,000 запросов в день
- 30,000 запросов в месяц

Для DesignRating этого более чем достаточно!

## Troubleshooting

### Ошибка "KV connection failed"
- Проверьте переменные окружения
- Убедитесь, что KV подключена к проекту
- Проверьте регион KV базы

### Данные не сохраняются
- Проверьте логи в `/api/auth/email`
- Убедитесь, что `ADMIN_API_KEY` установлен
- Проверьте консоль браузера на ошибки

### Rate limiting срабатывает слишком часто
- Отредактируйте лимиты в `/middleware.ts`
- Для продакшена рассмотрите Upstash Redis

## Готово! 🎉

После настройки Vercel KV ваша система сбора email-адресов полностью функциональна:
- Email-адреса сохраняются надежно
- Статистика доступна в админ панели
- Данные сохраняются между деплоями
- Масштабируется автоматически

Удачи с запуском! 🚀
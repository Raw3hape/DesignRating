# Инструкция по деплою на Vercel

## Подготовка

1. Убедитесь, что у вас есть аккаунт на [Vercel](https://vercel.com)
2. Установите Vercel CLI (опционально):
   ```bash
   npm i -g vercel
   ```

## Деплой через веб-интерфейс

1. Перейдите на https://vercel.com/new
2. Импортируйте Git репозиторий
3. Настройте переменные окружения:
   - `OPENAI_API_KEY` - ваш OpenAI API ключ
   - `STRIPE_SECRET_KEY` - секретный ключ Stripe
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - публичный ключ Stripe
4. Нажмите Deploy
5. Дождитесь завершения деплоя

## Деплой через CLI

1. В корне проекта выполните:
   ```bash
   vercel
   ```
2. Следуйте инструкциям в терминале
3. Настройте переменные окружения:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add STRIPE_SECRET_KEY
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```
4. Для продакшен деплоя:
   ```bash
   vercel --prod
   ```

## После деплоя

1. Проверьте работу приложения по предоставленному URL
2. Настройте кастомный домен (опционально)
3. Настройте Stripe webhooks для продакшен URL
4. Мониторьте логи и аналитику в панели Vercel

## Обновление

При каждом пуше в main ветку произойдет автоматический деплой.
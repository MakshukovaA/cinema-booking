# cinema-booking-frontend

Frontend проекта cinema-booking на базе Create React App (React 18).

Цель:
- работать с Django-бэкендом через прокси/NGINX или локальные API URL.

Установка и запуск

1. Установка зависимостей
- npm install
  или
- yarn install

2. Локальная разработка
- Установить переменные окружения (при необходимости)
  - REACT_APP_API_URL=http://localhost:8000/api
  - REACT_APP_WS_URL=ws://localhost:8000
- npm start

3. Сборка для продакшна
- npm run build

4. Конфигурация окружения (пример)
- В Docker окружении FRONTEND видит:
  REACT_APP_API_URL: http://localhost:8000/api
  REACT_APP_WS_URL: ws://localhost:8000
  REACT_APP_USE_REAL_API: "true"

5. Примечания
- В продакшне фронтенд может проксироваться через nginx (nginx.conf) и обращаться к API по /api.
- Если встречаешь CORS ошибки, убедись, что backend позволяет Origin http://localhost:3000, и настройки CORS активны.
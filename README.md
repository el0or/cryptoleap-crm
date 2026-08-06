````md
# CryptoLeap CRM

Масштабируемая CRM-система, построенная на архитектуре монорепозитория (NPM Workspaces). Проект включает в себя Frontend (React/Vite), Backend (NestJS) и общие контракты (Shared Types), с упором на ручной контроль стилей (CSS Modules) и надежную инфраструктуру (Docker, PostgreSQL, Prisma).

---

# 🏗 Архитектура проекта

```text
.
├── apps
│   ├── web          # Frontend (React + Vite)
│   └── server       # Backend (NestJS + Prisma)
│
├── packages
│   └── shared       # Общие TypeScript интерфейсы и типы
│
├── package.json
└── README.md
```

### Структура компонентов

| Путь | Назначение |
|------|------------|
| `apps/web` | Frontend на React + Vite |
| `apps/server` | Backend на NestJS |
| `packages/shared` | Общие интерфейсы и контракты между клиентом и сервером |

---

# 🛠 Предварительные требования

Перед запуском убедитесь, что установлены:

- Node.js **18+**
- npm **9+**
- Docker
- PostgreSQL (через Docker)
- Git

Проверить версии:

```bash
node -v
npm -v
docker -v
```

---

# 📦 Установка зависимостей

Перейдите в корень проекта:

```bash
cd CryptoLeap
```

Установите все зависимости:

```bash
npm install
```

Поскольку используется **NPM Workspaces**, локальные пакеты будут автоматически связаны между собой.

---

# ⚙️ Настройка окружения

Перейдите в папку сервера:

```bash
cd apps/server
```

Создайте файл:

```text
.env
```

Добавьте в него строку подключения:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cryptoleap-db?schema=public"
```

> **Важно:** замените `YOUR_PASSWORD` на свой пароль.

---

# 🗄 Запуск PostgreSQL через Docker

Создайте контейнер базы данных:

```bash
docker run \
  --name cryptoleap-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=YOUR_PASSWORD \
  -e POSTGRES_DB=cryptoleap-db \
  -p 5432:5432 \
  -d postgres
```

Проверить, что контейнер работает:

```bash
docker ps
```

Если необходимо остановить контейнер:

```bash
docker stop cryptoleap-db
```

Запустить снова:

```bash
docker start cryptoleap-db
```

---

# 🗃 Настройка Prisma

Перейдите в backend:

```bash
cd apps/server
```

Сгенерируйте Prisma Client:

```bash
npx prisma generate
```

Примените схему к базе данных:

```bash
npx prisma db push
```

При необходимости открыть Prisma Studio:

```bash
npx prisma studio
```

---

# 🚀 Запуск Backend

Откройте первый терминал:

```bash
cd apps/server
```

Запустите сервер разработки:

```bash
npm run start:dev
```

Backend будет доступен по адресу:

```
http://localhost:3000
```

---

# 🌐 Запуск Frontend

Откройте второй терминал:

```bash
cd apps/web
```

Запустите Vite:

```bash
npm run dev
```

Frontend будет доступен по адресу:

```
http://localhost:5173
```

---

# 📂 Рабочий процесс разработки

После запуска проекта структура процессов будет выглядеть следующим образом:

```text
Terminal 1
└── apps/server
    └── npm run start:dev

Terminal 2
└── apps/web
    └── npm run dev

Docker
└── PostgreSQL
```

---

# 🔄 Типичный цикл разработки

После изменения моделей Prisma:

```bash
cd apps/server

npx prisma db push

npx prisma generate
```

После изменения зависимостей:

```bash
npm install
```

---

# 📌 Используемые технологии

## Frontend

- React
- Vite
- TypeScript
- CSS Modules

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Общие пакеты

- TypeScript
- NPM Workspaces

## Инфраструктура

- Docker
- PostgreSQL

---

# 🛠 Полезные команды

## Установка зависимостей

```bash
npm install
```

## Запуск Frontend

```bash
cd apps/web

npm run dev
```

## Запуск Backend

```bash
cd apps/server

npm run start:dev
```

## Генерация Prisma Client

```bash
npx prisma generate
```

## Применение схемы БД

```bash
npx prisma db push
```

## Prisma Studio

```bash
npx prisma studio
```

## Просмотр контейнеров Docker

```bash
docker ps
```

## Остановка PostgreSQL

```bash
docker stop cryptoleap-db
```

## Запуск PostgreSQL

```bash
docker start cryptoleap-db
```

---

# ✅ Готово

После выполнения всех шагов:

- PostgreSQL работает в Docker.
- Prisma синхронизирована с базой данных.
- Backend (NestJS) доступен на **http://localhost:3000**.
- Frontend (React + Vite) доступен на **http://localhost:5173**.
- Проект полностью готов к разработке.
````

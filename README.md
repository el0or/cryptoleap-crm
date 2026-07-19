# Запуск фронтенда
npm install
npm run dev

# Запуск бекенда
npm install
npx prisma db push
npm run start:dev
(если бд не запускается, то docker run --name crm-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=crm_db -p 5432:5432 -d postgres)
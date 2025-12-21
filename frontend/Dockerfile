FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем все файлы проекта
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение с polling для hot reload
CMD ["npm", "start"]
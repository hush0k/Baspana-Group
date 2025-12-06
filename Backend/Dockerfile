# Используем официальный Python образ
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем файл зависимостей
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем файлы alembic
COPY alembic.ini .
COPY alembic ./alembic

# Копируем исходный код приложения
COPY app ./app

# Копируем и настраиваем entrypoint скрипт
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Открываем порт 8081
EXPOSE 8081

# Команда запуска
ENTRYPOINT ["bash", "./entrypoint.sh"]
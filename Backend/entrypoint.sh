#!/bin/bash

# Ждем пока PostgreSQL будет готова
echo "Waiting for PostgreSQL..."
sleep 5
echo "PostgreSQL started"

# Применяем миграции
echo "Applying database migrations..."
alembic upgrade head

# Запускаем приложение
echo "Starting FastAPI application..."
uvicorn app.main:app --host 0.0.0.0 --port 8081 --reload

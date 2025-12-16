DC = docker-compose
BACKEND = backend
FRONTEND = frontend
DB = db
DB_USER = $(POSTGRES_USER)
DB_NAME = $(POSTGRES_DB)

# Запуск всех контейнеров
up:
	$(DC) up -d

# Запуск с выводом логов
up-logs:
	$(DC) up

start:
	$(DC) start

# Остановка всех контейнеров
down:
	$(DC) down

stop:
	$(DC) stop

# Пересборка контейнеров
rebuild:
	$(DC) up -d --build

# Пересборка только фронтенда
rebuild-front:
	$(DC) up -d --build $(FRONTEND)

# Пересборка только бэкенда
rebuild-back:
	$(DC) up -d --build $(BACKEND)

# Применить все миграции
migrate:
	$(DC) exec $(BACKEND) alembic upgrade head

# Миграция изображений комплексов (перенос первого изображения в main_image)
migrate-images:
	$(DC) exec $(BACKEND) python scripts/migrate_complex_images.py

# Проверить текущую версию миграций
status:
	$(DC) exec $(BACKEND) alembic current

# История всех миграций
history:
	$(DC) exec $(BACKEND) alembic history --verbose

# Проверить таблицу alembic_version напрямую в Postgres
db-version:
	$(DC) exec $(DB) psql -U $(DB_USER) -d $(DB_NAME) -c "SELECT * FROM alembic_version;"

# Создать новую миграцию
create:
	$(DC) exec $(BACKEND) alembic revision --autogenerate -m "$(MSG)"

# Логи бэкенда
logs:
	docker logs -f baspana_group_backend

# Подключение к БД
db:
	docker exec -it baspana_group_db psql -U baspana_admin -d baspana_group_db

# Логи фронтенда
logs-front:
	docker logs -f baspana_group_frontend

# Логи всех сервисов
logs-all:
	$(DC) logs -f

# Очистка
clean:
	$(DC) down -v
	docker system prune -f

# Установка зависимостей фронтенда
npm-install:
	$(DC) exec $(FRONTEND) npm install

# Статус контейнеров
ps:
	$(DC) ps
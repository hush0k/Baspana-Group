DC = docker-compose
BACKEND = backend
DB = db
DB_USER = $(POSTGRES_USER)
DB_NAME = $(POSTGRES_DB)

# Запуск всех контейнеров
up:
	$(DC) up -d

# Остановка всех контейнеров
down:
	$(DC) down

# Применить все миграции
migrate:
	$(DC) exec $(BACKEND) alembic upgrade head

# Проверить текущую версию миграций
status:
	$(DC) exec $(BACKEND) alembic current

# История всех миграций
history:
	$(DC) exec $(BACKEND) alembic history --verbose

# Проверить таблицу alembic_version напрямую в Postgres
db-version:
	$(DC) exec $(DB) psql -U $(DB_USER) -d $(DB_NAME) -c "SELECT * FROM alembic_version;"

DC = docker-compose
BACKEND = backend
DB = db
DB_USER = $(POSTGRES_USER)
DB_NAME = $(POSTGRES_DB)

# Запуск всех контейнеров
up:
	$(DC) up -d

start:
	$(DC) start

# Остановка всех контейнеров
down:
	$(DC) down

stop:
	$(DC) stop

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

# Создать новую миграцию
create:
	$(DC) exec $(BACKEND) alembic revision --autogenerate -m "$(MSG)"

logs:
	docker logs -f baspana_group_backend

db:
	docker exec -it baspana_group_db psql -U baspana_admin -d baspana_group_db

# Логи фронтенда
logs-front:
	docker logs -f baspana_group_frontend

# Все логи
logs-all:
	docker-compose logs -f
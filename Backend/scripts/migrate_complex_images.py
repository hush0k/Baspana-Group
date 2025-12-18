"""
Скрипт миграции для переноса первого изображения из таблицы Image
в поле main_image таблицы ResidentialComplex
"""

import sys
from pathlib import Path

# Добавляем корневую директорию в путь для импорта модулей
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Image, ObjectType, ResidentialComplex


def migrate_complex_images():
    """
    Переносит первое изображение каждого комплекса в поле main_image
    """
    db: Session = SessionLocal()

    try:
        # Находим все комплексы без main_image
        complexes = db.query(ResidentialComplex).filter(
            (ResidentialComplex.main_image == None) |
            (ResidentialComplex.main_image == "")
        ).all()

        print(f"Найдено {len(complexes)} комплексов без главного изображения")

        updated_count = 0
        skipped_count = 0

        for complex in complexes:
            # Находим первое изображение комплекса
            first_image = db.query(Image).filter(
                Image.object_id == complex.id,
                Image.object_type == ObjectType.residential_complex
            ).first()

            if first_image:
                # Устанавливаем первое изображение как главное
                complex.main_image = first_image.img_url
                updated_count += 1
                print(f"✓ Обновлен комплекс '{complex.name}' (ID: {complex.id})")
            else:
                skipped_count += 1
                print(f"⚠ Пропущен комплекс '{complex.name}' (ID: {complex.id}) - нет изображений")

        # Сохраняем изменения
        db.commit()

        print("\n" + "="*60)
        print(f"Миграция завершена!")
        print(f"Обновлено комплексов: {updated_count}")
        print(f"Пропущено комплексов (без изображений): {skipped_count}")
        print("="*60)

    except Exception as e:
        print(f"❌ Ошибка при миграции: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Начинаем миграцию изображений комплексов...")
    print("="*60)
    migrate_complex_images()

# Реализация многоязычности контента

## ✅ Что уже сделано:

### Backend

#### 1. Модели (models.py)
Добавлены многоязычные поля для всех основных сущностей:

**ResidentialComplex:**
- `ru_description`, `kz_description`, `en_description`
- `ru_short_description`, `kz_short_description`, `en_short_description`

**Building:**
- `ru_description`, `kz_description`, `en_description`
- `ru_short_description`, `kz_short_description`, `en_short_description`

**Apartment:**
- `ru_description`, `kz_description`, `en_description`
- `ru_short_description`, `kz_short_description`, `en_short_description`

**CommercialUnit:**
- `ru_description`, `kz_description`, `en_description`
- `ru_short_description`, `kz_short_description`, `en_short_description`

#### 2. Схемы (schemas.py)
Обновлены все Pydantic схемы:
- ✅ ResidentialComplexBase, ResidentialComplexUpdate
- ✅ BuildingBase, BuildingUpdate
- ✅ ApartmentBase, ApartmentUpdate
- ✅ CommercialUnitBase, CommercialUnitUpdate

### Frontend

#### 1. Утилиты (`/utils/i18nHelpers.js`)
Созданы helper-функции для работы с многоязычными полями:

```javascript
// Универсальная функция получения локализованного поля
getLocalizedField(obj, fieldName, fallbackLang = 'ru')

// Специализированные функции
getLocalizedDescription(obj)
getLocalizedShortDescription(obj)

// React хук
useLocalizedContent()
```

**Логика работы:**
1. Определяет текущий язык из i18n
2. Ищет поле `{lang}_description` (например, `ru_description`)
3. Если не найдено, использует fallback язык (по умолчанию 'ru')
4. Если и это не найдено, пробует все доступные языки
5. В крайнем случае возвращает старое поле `description` (обратная совместимость)

#### 2. Обновлённые компоненты отображения

**Complex (ЖК):**
- ✅ `ComplexCard` - карточка ЖК на главной странице
- ✅ `ComplexInfo` - информация о ЖК на детальной странице
- ✅ `ViewComplexModal` - модальное окно просмотра ЖК

**Building (Корпус):**
- ✅ `ViewBuildingModal` - модальное окно просмотра корпуса

**Apartment (Квартира):**
- ✅ `ApartmentDescription` - описание квартиры на странице квартиры
- ✅ ViewApartmentModal уже готов (не содержит описаний)

**CommercialUnit (Коммерческие помещения):**
- ✅ `ViewCommercialUnitModal` - модальное окно просмотра

#### 3. Как работает в компонентах

Пример использования:
```javascript
import { getLocalizedDescription, getLocalizedShortDescription } from '../../utils/i18nHelpers';

// В компоненте
<p>{getLocalizedShortDescription(complex)}</p>
<p>{getLocalizedDescription(building)}</p>
```

## 📋 Что нужно ещё сделать:

### 1. Миграция базы данных
```bash
cd Backend
alembic revision --autogenerate -m "Add multilingual description fields"
alembic upgrade head
```

### 2. Обновление форм управления

Нужно добавить поля для ввода описаний на всех 3 языках:

**Create/Edit Complex Modal:**
```javascript
<div className={styles.formGroup}>
  <label>Описание (Русский)</label>
  <textarea name="ru_description" />
</div>
<div className={styles.formGroup}>
  <label>Описание (Қазақша)</label>
  <textarea name="kz_description" />
</div>
<div className={styles.formGroup}>
  <label>Description (English)</label>
  <textarea name="en_description" />
</div>

// То же самое для short_description
```

**Файлы для обновления:**
- `/components/Modal/CreateComplexModal.jsx`
- `/components/Modal/EditComplexModal.jsx`
- `/components/Modal/CreateBuildingModal.jsx`
- `/components/Modal/EditBuildingModal.jsx`
- `/components/Modal/CreateApartmentModal.jsx`
- `/components/Modal/EditApartmentModal.jsx`
- `/components/Modal/CreateCommercialUnitModal.jsx`
- `/components/Modal/EditCommercialUnitModal.jsx`

### 3. Обновление роутеров (если нужно)

Проверить, что роутеры правильно обрабатывают многоязычные поля:
- `/Backend/app/routers/residential_complex.py`
- `/Backend/app/routers/building.py`
- `/Backend/app/routers/apartment.py`
- `/Backend/app/routers/commercial_unit.py`

### 4. Добавление языковых файлов (опционально)

Если нужны дополнительные переводы для UI:
```
/frontend/src/locales/ru/translation.json
/frontend/src/locales/kz/translation.json
/frontend/src/locales/en/translation.json
```

## 🔄 Как добавить новую сущность с многоязычностью:

### Backend:

1. **Модель:**
```python
class NewEntity(Base):
    ru_description = Column(String)
    kz_description = Column(String)
    en_description = Column(String)
    ru_short_description = Column(String(300))
    kz_short_description = Column(String(300))
    en_short_description = Column(String(300))
```

2. **Схема:**
```python
class NewEntityBase(BaseModel):
    ru_description: Optional[str] = None
    kz_description: Optional[str] = None
    en_description: Optional[str] = None
    ru_short_description: Optional[str] = None
    kz_short_description: Optional[str] = None
    en_short_description: Optional[str] = None
```

### Frontend:

```javascript
import { getLocalizedDescription } from '../../utils/i18nHelpers';

// В компоненте
<p>{getLocalizedDescription(entity)}</p>
```

## 🌐 Поддерживаемые языки:

- 🇷🇺 Русский (ru) - основной язык, используется как fallback
- 🇰🇿 Қазақ тілі (kz)
- 🇬🇧 English (en)

## 📝 Примеры использования:

### Отображение описания:
```javascript
import { getLocalizedDescription } from '../../utils/i18nHelpers';

function ComplexInfo({ complex }) {
  return (
    <div>
      <h2>О комплексе</h2>
      <p>{getLocalizedDescription(complex)}</p>
    </div>
  );
}
```

### Отображение короткого описания:
```javascript
import { getLocalizedShortDescription } from '../../utils/i18nHelpers';

function ComplexCard({ complex }) {
  return (
    <div className={styles.card}>
      <h3>{complex.name}</h3>
      <p>{getLocalizedShortDescription(complex)}</p>
    </div>
  );
}
```

### Использование хука:
```javascript
import { useLocalizedContent } from '../../utils/i18nHelpers';

function MyComponent({ data }) {
  const { getDescription, getShortDescription, currentLang } = useLocalizedContent();

  return (
    <div>
      <p>Текущий язык: {currentLang}</p>
      <p>{getDescription(data)}</p>
      <p>{getShortDescription(data)}</p>
    </div>
  );
}
```

## ⚠️ Важные замечания:

1. **Обратная совместимость**: Система поддерживает старые поля `description` и `short_description` для обратной совместимости
2. **Fallback**: Если описание на текущем языке отсутствует, система автоматически использует русский язык
3. **Приоритет языков**: ru → kz → en → старое поле description
4. **Пустые значения**: Если все поля пустые, возвращается пустая строка

## 🚀 Следующие шаги:

1. Создать и применить миграцию базы данных
2. Обновить формы создания/редактирования для поддержки всех языков
3. Заполнить базу данных многоязычным контентом
4. Протестировать переключение языков на фронтенде
5. Добавить валидацию (хотя бы одно описание должно быть заполнено)

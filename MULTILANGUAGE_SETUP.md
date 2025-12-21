# Настройка многоязычности (i18next)

## Установка зависимостей

Выполните следующую команду в папке `frontend`:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## Что было сделано

### 1. Конфигурация i18next
- ✅ Создан файл `/frontend/src/i18n.js` с настройками
- ✅ Поддержка 3 языков: Русский (RU), Казахский (KZ), Английский (EN)
- ✅ Автоматическое сохранение выбранного языка в localStorage

### 2. Файлы переводов
Созданы файлы с переводами:
- `/frontend/src/locales/ru/translation.json` - Русский
- `/frontend/src/locales/kz/translation.json` - Казахский
- `/frontend/src/locales/en/translation.json` - Английский

### 3. Компонент переключателя языка
- ✅ `/frontend/src/components/LanguageSwitcher/LanguageSwitcher.jsx`
- ✅ `/frontend/src/components/LanguageSwitcher/LanguageSwitcher.module.scss`
- Флаги стран для визуального отображения
- Dropdown меню для выбора языка

### 4. Интеграция в приложение
- ✅ Импорт i18n в `App.js`
- ✅ Переключатель языка добавлен в `HeaderBlack`
- ✅ Переведены тексты в Header

## Как использовать переводы в компонентах

### Пример использования:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('header.home')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

## Следующие шаги

Нужно перевести следующие компоненты:
1. FooterBlack/FooterWhite
2. ComplexCard
3. ApartmentSelector
4. ReviewBlock
5. PaymentPage
6. PromotionsPage
7. Management страницы

## Добавление новых переводов

Чтобы добавить новый перевод:
1. Добавьте ключ в `/frontend/src/locales/ru/translation.json`
2. Добавьте перевод на казахский в `/frontend/src/locales/kz/translation.json`
3. Добавьте перевод на английский в `/frontend/src/locales/en/translation.json`
4. Используйте в компоненте: `{t('your.translation.key')}`

## Структура переводов

```json
{
  "header": { ... },
  "footer": { ... },
  "management": { ... },
  "complex": { ... },
  "apartment": { ... },
  "promotion": { ... },
  "review": { ... },
  "payment": { ... },
  "form": { ... },
  "common": { ... },
  "blockPage": { ... }
}
```

import i18n from '../i18n';

/**
 * Получить локализованное значение поля
 * @param {Object} obj - Объект с данными
 * @param {string} fieldName - Базовое имя поля (например, 'description', 'short_description')
 * @param {string} fallbackLang - Язык по умолчанию (по умолчанию 'ru')
 * @returns {string} - Локализованное значение
 */
export const getLocalizedField = (obj, fieldName, fallbackLang = 'ru') => {
  if (!obj) return '';

  // Получаем текущий язык
  const currentLang = i18n.language.split('-')[0]; // 'ru', 'kz', 'en'

  // Пытаемся получить значение на текущем языке
  const currentLangKey = `${currentLang}_${fieldName}`;
  if (obj[currentLangKey]) {
    return obj[currentLangKey];
  }

  // Если нет, пробуем язык по умолчанию
  const fallbackKey = `${fallbackLang}_${fieldName}`;
  if (obj[fallbackKey]) {
    return obj[fallbackKey];
  }

  // Если и этого нет, пробуем любой доступный язык
  const availableKeys = ['ru', 'kz', 'en'].map(lang => `${lang}_${fieldName}`);
  for (const key of availableKeys) {
    if (obj[key]) {
      return obj[key];
    }
  }

  // В крайнем случае возвращаем старое поле без префикса (для обратной совместимости)
  return obj[fieldName] || '';
};

/**
 * Получить локализованное описание
 * @param {Object} obj - Объект с данными
 * @returns {string}
 */
export const getLocalizedDescription = (obj) => {
  return getLocalizedField(obj, 'description');
};

/**
 * Получить локализованное короткое описание
 * @param {Object} obj - Объект с данными
 * @returns {string}
 */
export const getLocalizedShortDescription = (obj) => {
  return getLocalizedField(obj, 'short_description');
};

/**
 * Хук для использования в компонентах
 */
export const useLocalizedContent = () => {
  const currentLang = i18n.language.split('-')[0];

  return {
    getField: (obj, fieldName, fallbackLang = 'ru') =>
      getLocalizedField(obj, fieldName, fallbackLang),
    getDescription: (obj) => getLocalizedDescription(obj),
    getShortDescription: (obj) => getLocalizedShortDescription(obj),
    currentLang,
  };
};

/**
 * Форматирует ошибки от backend для отображения пользователю
 * @param {Error} error - объект ошибки от axios
 * @param {string} defaultMessage - сообщение по умолчанию
 * @returns {string} - отформатированное сообщение об ошибке
 */
export const formatErrorMessage = (error, defaultMessage = 'Произошла ошибка') => {
    // Если нет response (проблема с сетью)
    if (!error.response) {
        return 'Ошибка соединения с сервером. Проверьте интернет-соединение.';
    }

    const { data, status } = error.response;

    // Обработка разных типов ошибок
    if (data?.detail) {
        // Массив ошибок валидации от Pydantic
        if (Array.isArray(data.detail)) {
            const errors = data.detail.map(err => {
                const field = err.loc ? err.loc[err.loc.length - 1] : 'поле';
                const message = err.msg || 'неверное значение';
                return `${translateField(field)}: ${translateMessage(message)}`;
            });
            return errors.join('; ');
        }

        // Строковая ошибка
        if (typeof data.detail === 'string') {
            return translateMessage(data.detail);
        }

        // Объект ошибки
        if (typeof data.detail === 'object') {
            return translateMessage(JSON.stringify(data.detail));
        }
    }

    // Стандартные HTTP ошибки
    switch (status) {
        case 400:
            return 'Неверные данные. Проверьте введенную информацию.';
        case 401:
            return 'Неверный email или пароль.';
        case 403:
            return 'Доступ запрещен.';
        case 404:
            return 'Запрашиваемый ресурс не найден.';
        case 422:
            return 'Ошибка валидации данных.';
        case 500:
            return 'Внутренняя ошибка сервера. Попробуйте позже.';
        default:
            return defaultMessage;
    }
};

/**
 * Переводит названия полей на русский
 */
const translateField = (field) => {
    const translations = {
        'first_name': 'Имя',
        'last_name': 'Фамилия',
        'email': 'Email',
        'password': 'Пароль',
        'date_of_birth': 'Дата рождения',
        'phone_number': 'Телефон',
        'city': 'Город',
        'avatar_url': 'Аватар'
    };
    return translations[field] || field;
};

/**
 * Переводит сообщения об ошибках на русский
 */
const translateMessage = (message) => {
    const translations = {
        'Email already registered': 'Email уже зарегистрирован',
        'Incorrect email or password': 'Неверный email или пароль',
        'User is not active': 'Пользователь не активен',
        'Password must be at least 8 characters': 'Пароль должен содержать минимум 8 символов',
        'Password must contain at least one uppercase letter': 'Пароль должен содержать хотя бы одну заглавную букву',
        'Password must contain at least one lowercase letter': 'Пароль должен содержать хотя бы одну строчную букву',
        'Password must contain at least one digit': 'Пароль должен содержать хотя бы одну цифру',
        'Password must contain at least one special character': 'Пароль должен содержать хотя бы один специальный символ',
        'Phone already registered': 'Телефон уже зарегистрирован',
        'field required': 'обязательное поле',
        'value is not a valid email address': 'неверный формат email'
    };

    // Ищем перевод (регистронезависимый поиск)
    for (const [eng, rus] of Object.entries(translations)) {
        if (message.toLowerCase().includes(eng.toLowerCase())) {
            return rus;
        }
    }

    return message;
};
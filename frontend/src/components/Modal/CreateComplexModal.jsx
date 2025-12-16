import React, { useState } from 'react';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreateComplexModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    block_counts: '',
    playground_area: '',
    apartment_area: '',
    commercial_area: '',
    parking_area: '',
    landing_area: '',
    material: '',
    city: '',
    address: '',
    longitude: '',
    latitude: '',
    has_security: false,
    building_class: '',
    building_status: '',
    min_area: '',
    min_price: '',
    construction_end: '',
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const materialOptions = [
    { value: 'Brick', label: 'Кирпич' },
    { value: 'Monolith', label: 'Монолит' },
    { value: 'Panel', label: 'Панель' },
    { value: 'Block', label: 'Блок' },
    { value: 'Mixed', label: 'Смешанный' }
  ];

  const cityOptions = [
    { value: 'Almaty', label: 'Алматы' },
    { value: 'Astana', label: 'Астана' },
    { value: 'Shymkent', label: 'Шымкент' },
    { value: 'Karaganda', label: 'Караганда' },
    { value: 'Aktobe', label: 'Актобе' },
    { value: 'Taraz', label: 'Тараз' },
    { value: 'Pavlodar', label: 'Павлодар' },
    { value: 'Oskemen', label: 'Усть-Каменогорск' },
    { value: 'Semey', label: 'Семей' },
    { value: 'Kostanay', label: 'Костанай' },
    { value: 'Kyzylorda', label: 'Кызылорда' },
    { value: 'Atyrau', label: 'Атырау' },
    { value: 'Oral', label: 'Уральск' },
    { value: 'Petropavl', label: 'Петропавловск' },
    { value: 'Turkistan', label: 'Туркестан' }
  ];

  const buildingClassOptions = [
    { value: 'Economic', label: 'Эконом' },
    { value: 'Comfort', label: 'Комфорт' },
    { value: 'Comfort+', label: 'Комфорт+' },
    { value: 'Business', label: 'Бизнес' },
    { value: 'Luxury', label: 'Люкс' }
  ];

  const buildingStatusOptions = [
    { value: 'Project', label: 'Проект' },
    { value: 'Under Construction', label: 'Строится' },
    { value: 'Completed', label: 'Сдан' }
  ];

  // Форматирование числа с пробелами
  const formatNumber = (value) => {
    if (!value) return '';
    // Убираем все пробелы и нечисловые символы, кроме точки
    const cleanValue = value.toString().replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    // Форматируем целую часть
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  };

  // Убираем форматирование для отправки на сервер
  const unformatNumber = (value) => {
    return value.toString().replace(/\s/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Обработчик для числовых полей с форматированием
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const unformatted = unformatNumber(value);
    const formatted = formatNumber(unformatted);
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите файл изображения');
        return;
      }

      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }

      setMainImageFile(file);

      // Создаем предпросмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setError('Все файлы должны быть изображениями');
        return;
      }

      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер каждого файла не должен превышать 5MB');
        return;
      }

      validFiles.push(file);

      // Создаем предпросмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === validFiles.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }

    setGalleryFiles(validFiles);
    setError('');
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Создаем FormData для отправки файлов
      const formDataToSend = new FormData();

      // Добавляем все поля формы
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('short_description', formData.short_description || '');
      formDataToSend.append('block_counts', parseInt(unformatNumber(formData.block_counts)));
      formDataToSend.append('playground_area', parseFloat(unformatNumber(formData.playground_area)));
      formDataToSend.append('apartment_area', parseFloat(unformatNumber(formData.apartment_area)));
      formDataToSend.append('commercial_area', parseFloat(unformatNumber(formData.commercial_area)));
      formDataToSend.append('parking_area', parseFloat(unformatNumber(formData.parking_area)));
      formDataToSend.append('landing_area', parseFloat(unformatNumber(formData.landing_area)));
      formDataToSend.append('material', formData.material);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('address', formData.address);

      // Проверяем и добавляем координаты
      const longitude = parseFloat(formData.longitude);
      const latitude = parseFloat(formData.latitude);

      if (isNaN(longitude) || isNaN(latitude)) {
        setError('Пожалуйста, укажите корректные координаты (широту и долготу)');
        setLoading(false);
        return;
      }

      formDataToSend.append('longitude', longitude);
      formDataToSend.append('latitude', latitude);
      formDataToSend.append('has_security', formData.has_security);
      formDataToSend.append('building_class', formData.building_class);
      formDataToSend.append('building_status', formData.building_status);

      if (formData.min_area) {
        formDataToSend.append('min_area', parseFloat(unformatNumber(formData.min_area)));
      }
      if (formData.min_price) {
        formDataToSend.append('min_price', parseFloat(unformatNumber(formData.min_price)));
      }
      if (formData.construction_end) {
        formDataToSend.append('construction_end', formData.construction_end);
      }

      // Добавляем главное изображение если есть
      if (mainImageFile) {
        formDataToSend.append('main_image', mainImageFile);
      }

      // Создаем комплекс
      const createdComplex = await complexService.createComplex(formDataToSend);

      // Загружаем изображения галереи если есть
      if (galleryFiles.length > 0 && createdComplex.id) {
        const imageService = (await import('../../services/ImageService')).default;
        for (const file of galleryFiles) {
          await imageService.uploadImage(file, createdComplex.id, 'Residential complex');
        }
      }

      onSuccess();
      onClose();

      // Сброс формы
      setFormData({
        name: '',
        description: '',
        short_description: '',
        block_counts: '',
        playground_area: '',
        apartment_area: '',
        commercial_area: '',
        parking_area: '',
        landing_area: '',
        material: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
        has_security: false,
        building_class: '',
        building_status: '',
        min_area: '',
        min_price: '',
        construction_end: '',
      });
      setMainImageFile(null);
      setMainImagePreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
    } catch (err) {
      console.error('Ошибка создания комплекса:', err);

      let errorMessage = 'Ошибка при создании комплекса';

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (Array.isArray(detail)) {
          errorMessage = detail.map(error => error.msg || JSON.stringify(error)).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (typeof detail === 'object') {
          errorMessage = detail.msg || JSON.stringify(detail);
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Создать новый ЖК</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Основная информация */}
            <div className={styles.formSection}>
              <h3>Основная информация</h3>

              <div className={styles.formGroup}>
                <label>Название <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Введите название комплекса"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Краткое описание (для карточки) <span className={styles.required}>*</span></label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  required
                  maxLength={300}
                  rows="2"
                  placeholder="Краткое описание комплекса (макс. 300 символов)"
                />
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {formData.short_description?.length || 0}/300 символов
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Полное описание <span className={styles.required}>*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Подробное описание комплекса"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Город <span className={styles.required}>*</span></label>
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">Выберите город</option>
                    {cityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Адрес <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Улица, дом"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Долгота (Longitude) <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    placeholder="76.928694"
                  />
                  <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                    Пример: Алматы - 76.928694, Астана - 71.430564
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Широта (Latitude) <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    placeholder="43.238949"
                  />
                  <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                    Пример: Алматы - 43.238949, Астана - 51.128422
                  </small>
                </div>
              </div>
              <div style={{
                background: '#e3f2fd',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#1565c0',
                marginTop: '8px'
              }}>
                💡 Координаты нужны для отображения карты и инфраструктуры на странице ЖК.
                Получить координаты можно на <a href="https://2gis.kz" target="_blank" rel="noopener noreferrer" style={{color: '#1565c0', fontWeight: 'bold'}}>2ГИС</a>
                или Google Maps (правый клик → "Что здесь?")
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.formSection}>
              <h3>Характеристики</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Материал <span className={styles.required}>*</span></label>
                  <select name="material" value={formData.material} onChange={handleChange} required>
                    <option value="">Выберите материал</option>
                    {materialOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Класс <span className={styles.required}>*</span></label>
                  <select name="building_class" value={formData.building_class} onChange={handleChange} required>
                    <option value="">Выберите класс</option>
                    {buildingClassOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Статус <span className={styles.required}>*</span></label>
                  <select name="building_status" value={formData.building_status} onChange={handleChange} required>
                    <option value="">Выберите статус</option>
                    {buildingStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Количество блоков <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="block_counts"
                    value={formData.block_counts}
                    onChange={handleNumberChange}
                    required
                    placeholder="1"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="has_security"
                    checked={formData.has_security}
                    onChange={handleChange}
                  />
                  <span>Есть охрана</span>
                </label>
              </div>
            </div>

            {/* Площади */}
            <div className={styles.formSection}>
              <h3>Площади (м²)</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Площадь детских площадок <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="playground_area"
                    value={formData.playground_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Жилая площадь <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="apartment_area"
                    value={formData.apartment_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Коммерческая площадь <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="commercial_area"
                    value={formData.commercial_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Площадь парковки <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="parking_area"
                    value={formData.parking_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Площадь земельного участка <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="landing_area"
                  value={formData.landing_area}
                  onChange={handleNumberChange}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className={styles.formSection}>
              <h3>Дополнительная информация</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Минимальная площадь (м²)</label>
                  <input
                    type="text"
                    name="min_area"
                    value={formData.min_area}
                    onChange={handleNumberChange}
                    placeholder="Опционально"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Минимальная цена (₸)</label>
                  <input
                    type="text"
                    name="min_price"
                    value={formData.min_price}
                    onChange={handleNumberChange}
                    placeholder="Опционально"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Дата окончания строительства</label>
                <input
                  type="date"
                  name="construction_end"
                  value={formData.construction_end}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Главное изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className={styles.fileInput}
                />
                {mainImagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={mainImagePreview} alt="Предпросмотр главного изображения" />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => {
                        setMainImageFile(null);
                        setMainImagePreview(null);
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Изображения для галереи</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className={styles.fileInput}
                />
                {galleryPreviews.length > 0 && (
                  <div className={styles.galleryPreview}>
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className={styles.imagePreview}>
                        <img src={preview} alt={`Галерея ${index + 1}`} />
                        <button
                          type="button"
                          className={styles.removeImage}
                          onClick={() => removeGalleryImage(index)}
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Создание...' : 'Создать ЖК'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplexModal;
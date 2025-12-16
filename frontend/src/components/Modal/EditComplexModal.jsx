import React, { useState, useEffect } from 'react';
import complexService from '../../services/ComplexService';
import api from '../../services/api';
import styles from '../../styles/CreateComplexModal.module.scss';

const EditComplexModal = ({ isOpen, onClose, onSuccess, complexId }) => {
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
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
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

  // Загрузка данных комплекса при открытии модального окна
  useEffect(() => {
    if (isOpen && complexId) {
      fetchComplexData();
    }
  }, [isOpen, complexId]);

  const fetchComplexData = async () => {
    setLoadingData(true);
    try {
      const response = await api.get(`/complexes/by-id/${complexId}`);
      const complex = response.data;

      setFormData({
        name: complex.name || '',
        description: complex.description || '',
        short_description: complex.short_description || '',
        block_counts: formatNumber(complex.block_counts || ''),
        playground_area: formatNumber(complex.playground_area || ''),
        apartment_area: formatNumber(complex.apartment_area || ''),
        commercial_area: formatNumber(complex.commercial_area || ''),
        parking_area: formatNumber(complex.parking_area || ''),
        landing_area: formatNumber(complex.landing_area || ''),
        material: complex.material || '',
        city: complex.city || '',
        address: complex.address || '',
        longitude: complex.longitude || '',
        latitude: complex.latitude || '',
        has_security: complex.has_security || false,
        building_class: complex.building_class || '',
        building_status: complex.building_status || '',
        min_area: formatNumber(complex.min_area || ''),
        min_price: formatNumber(complex.min_price || ''),
        construction_end: complex.construction_end || '',
      });

      if (complex.main_image) {
        setMainImagePreview(complex.main_image);
      }

      // Загружаем существующие изображения галереи
      try {
        const imageService = (await import('../../services/ImageService')).default;
        const images = await imageService.getImages(complexId, 'Residential complex');
        setExistingGalleryImages(images || []);
      } catch (err) {
        console.error('Ошибка загрузки изображений галереи:', err);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных комплекса:', err);
      setError('Не удалось загрузить данные комплекса');
    } finally {
      setLoadingData(false);
    }
  };

  // Форматирование числа с пробелами
  const formatNumber = (value) => {
    if (!value) return '';
    const cleanValue = value.toString().replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
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
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите файл изображения');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }

      setMainImageFile(file);

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
      if (!file.type.startsWith('image/')) {
        setError('Все файлы должны быть изображениями');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Размер каждого файла не должен превышать 5MB');
        return;
      }

      validFiles.push(file);

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

  const removeExistingGalleryImage = async (imageId) => {
    try {
      const imageService = (await import('../../services/ImageService')).default;
      await imageService.deleteImage(imageId);
      setExistingGalleryImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Ошибка удаления изображения:', err);
      setError('Не удалось удалить изображение');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== НАЧАЛО ОБНОВЛЕНИЯ ЖК ===');
    console.log('Complex ID:', complexId);
    console.log('Form Data:', formData);
    console.log('Main Image File:', mainImageFile);

    try {
      // Проверяем координаты сразу
      const longitude = parseFloat(formData.longitude);
      const latitude = parseFloat(formData.latitude);

      if (isNaN(longitude) || isNaN(latitude)) {
        setError('Пожалуйста, укажите корректные координаты (широту и долготу)');
        setLoading(false);
        return;
      }

      // ВСЕГДА используем FormData, потому что бэкенд ожидает Form данные
      console.log('Создание FormData для отправки...');
      const formDataToSend = new FormData();

      // Обязательные поля (всегда отправляем)
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('short_description', formData.short_description || '');
      formDataToSend.append('material', formData.material);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('longitude', longitude);
      formDataToSend.append('latitude', latitude);
      formDataToSend.append('building_class', formData.building_class);
      formDataToSend.append('building_status', formData.building_status);

      // Boolean поле - отправляем как строку для FormData
      formDataToSend.append('has_security', formData.has_security ? 'true' : 'false');

      // Числовые поля - проверяем на NaN перед отправкой
      const blockCounts = parseInt(unformatNumber(formData.block_counts));
      if (!isNaN(blockCounts)) {
        formDataToSend.append('block_counts', blockCounts);
      }

      const playgroundArea = parseFloat(unformatNumber(formData.playground_area));
      if (!isNaN(playgroundArea)) {
        formDataToSend.append('playground_area', playgroundArea);
      }

      const apartmentArea = parseFloat(unformatNumber(formData.apartment_area));
      if (!isNaN(apartmentArea)) {
        formDataToSend.append('apartment_area', apartmentArea);
      }

      const commercialArea = parseFloat(unformatNumber(formData.commercial_area));
      if (!isNaN(commercialArea)) {
        formDataToSend.append('commercial_area', commercialArea);
      }

      const parkingArea = parseFloat(unformatNumber(formData.parking_area));
      if (!isNaN(parkingArea)) {
        formDataToSend.append('parking_area', parkingArea);
      }

      const landingArea = parseFloat(unformatNumber(formData.landing_area));
      if (!isNaN(landingArea)) {
        formDataToSend.append('landing_area', landingArea);
      }

      // Опциональные поля
      if (formData.min_area) {
        const minArea = parseFloat(unformatNumber(formData.min_area));
        if (!isNaN(minArea)) {
          formDataToSend.append('min_area', minArea);
        }
      }

      if (formData.min_price) {
        const minPrice = parseFloat(unformatNumber(formData.min_price));
        if (!isNaN(minPrice)) {
          formDataToSend.append('min_price', minPrice);
        }
      }

      if (formData.construction_end) {
        formDataToSend.append('construction_end', formData.construction_end);
      }

      // Добавляем изображение только если оно есть
      if (mainImageFile) {
        console.log('Добавление нового изображения');
        formDataToSend.append('main_image', mainImageFile);
      }

      // Логируем содержимое FormData для отладки
      console.log('FormData содержимое:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      console.log('Отправка PATCH запроса с FormData...');
      const response = await api.patch(`/complexes/${complexId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Ответ от сервера:', response.data);

      // Загружаем новые изображения галереи если есть
      if (galleryFiles.length > 0) {
        console.log('Загрузка изображений галереи:', galleryFiles.length);
        const imageService = (await import('../../services/ImageService')).default;
        for (const file of galleryFiles) {
          await imageService.uploadImage(file, complexId, 'Residential complex');
        }
      }

      console.log('=== УСПЕШНОЕ ОБНОВЛЕНИЕ ЖК ===');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('=== ОШИБКА ОБНОВЛЕНИЯ КОМПЛЕКСА ===');
      console.error('Error full:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error response status:', err.response?.status);
      console.error('Error response headers:', err.response?.headers);
      console.error('Error response data:', err.response?.data);
      console.error('Error request:', err.request);
      console.error('Error config:', err.config);

      let errorMessage = 'Ошибка при обновлении комплекса';

      if (err.response) {
        // Сервер ответил с ошибкой
        console.error(`Сервер вернул статус: ${err.response.status}`);

        if (err.response.data?.detail) {
          const detail = err.response.data.detail;

          if (Array.isArray(detail)) {
            errorMessage = detail.map(error => error.msg || JSON.stringify(error)).join(', ');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof detail === 'object') {
            errorMessage = detail.msg || JSON.stringify(detail);
          }
        } else {
          errorMessage = `Ошибка ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Запрос был отправлен, но ответа не получено
        console.error('Запрос отправлен, но ответа не получено');
        errorMessage = 'Сервер не отвечает. Проверьте подключение к бэкенду.';
      } else {
        // Ошибка при настройке запроса
        console.error('Ошибка при настройке запроса:', err.message);
        errorMessage = `Ошибка: ${err.message}`;
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
          <h2>Редактировать ЖК</h2>
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

        {loadingData ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Загрузка данных...</p>
          </div>
        ) : (
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
                    <label>Долгота <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      step="0.000001"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      required
                      placeholder="76.9286"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Широта <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      step="0.000001"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      required
                      placeholder="43.2220"
                    />
                  </div>
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

                  {/* Существующие изображения галереи */}
                  {existingGalleryImages.length > 0 && (
                    <div className={styles.existingGallery}>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        Существующие изображения:
                      </p>
                      <div className={styles.galleryPreview}>
                        {existingGalleryImages.map((image) => (
                          <div key={image.id} className={styles.imagePreview}>
                            <img src={image.img_url} alt={`Галерея ${image.id}`} />
                            <button
                              type="button"
                              className={styles.removeImage}
                              onClick={() => removeExistingGalleryImage(image.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Новые изображения для загрузки */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className={styles.fileInput}
                  />
                  {galleryPreviews.length > 0 && (
                    <div className={styles.newGallery}>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px', marginBottom: '8px' }}>
                        Новые изображения для добавления:
                      </p>
                      <div className={styles.galleryPreview}>
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className={styles.imagePreview}>
                            <img src={preview} alt={`Новое ${index + 1}`} />
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
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditComplexModal;
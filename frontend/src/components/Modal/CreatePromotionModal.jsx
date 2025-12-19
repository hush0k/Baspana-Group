import React, { useState, useEffect } from 'react';
import promotionService from '../../services/PromotionService';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreatePromotionModal = ({ isOpen, onClose, onSuccess }) => {
  const [complexes, setComplexes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    image_url: '',
    residential_complex_id: '',
    apartment_type: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apartmentTypeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'Studio', label: 'Студия' },
    { value: 'One Bedroom', label: '1-комнатная' },
    { value: 'Two Bedroom', label: '2-комнатная' },
    { value: 'Three Bedroom', label: '3-комнатная' },
    { value: 'Penthouse', label: 'Пентхаус' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchComplexes();
    }
  }, [isOpen]);

  const fetchComplexes = async () => {
    try {
      const data = await complexService.getComplexes({
        sort_by: 'name',
        order: 'asc',
        limit: 100
      });
      setComplexes(data.results || []);
    } catch (err) {
      console.error('Ошибка загрузки ЖК:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      short_description: formData.short_description?.trim() || null,
      description: formData.description?.trim() || null,
      discount_percentage: parseFloat(formData.discount_percentage),
      start_date: formData.start_date,
      end_date: formData.end_date,
      image_url: formData.image_url?.trim() || null,
      residential_complex_id: formData.residential_complex_id && formData.residential_complex_id !== '' ? parseInt(formData.residential_complex_id) : null,
      apartment_type: formData.apartment_type && formData.apartment_type !== '' ? formData.apartment_type : null,
      is_active: formData.is_active
    };

    try {
      await promotionService.createPromotion(payload);
      onSuccess();
      onClose();
      setFormData({
        title: '',
        short_description: '',
        description: '',
        discount_percentage: '',
        start_date: '',
        end_date: '',
        image_url: '',
        residential_complex_id: '',
        apartment_type: '',
        is_active: true
      });
    } catch (err) {
      console.error('Ошибка создания акции:', err);
      setError(err.response?.data?.detail || 'Ошибка при создании акции');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Создать акцию</h2>
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
            <div className={styles.formSection}>
              <h3>Основная информация</h3>

              <div className={styles.formGroup}>
                <label>Название акции <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Новогодняя скидка"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Краткое описание</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={300}
                  rows="2"
                  placeholder="Краткое описание акции (макс. 300 символов)"
                />
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {formData.short_description?.length || 0}/300 символов
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Полное описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Подробное описание акции"
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL изображения</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Введите прямую ссылку на изображение
                </small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Скидка (%) <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="10"
                  />
                </div>

                <div className={styles.formGroup} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  <label style={{ margin: 0 }}>Активна</label>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Период действия</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Дата начала <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Дата окончания <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Применение акции</h3>

              <div className={styles.formGroup}>
                <label>Жилой комплекс</label>
                <select
                  name="residential_complex_id"
                  value={formData.residential_complex_id}
                  onChange={handleChange}
                >
                  <option value="">Все ЖК</option>
                  {complexes.map(complex => (
                    <option key={complex.id} value={complex.id}>{complex.name}</option>
                  ))}
                </select>
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Если не выбрано, акция применяется ко всем ЖК
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Тип квартиры</label>
                <select
                  name="apartment_type"
                  value={formData.apartment_type}
                  onChange={handleChange}
                >
                  {apartmentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Если не выбрано, акция применяется ко всем типам
                </small>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Создание...' : 'Создать акцию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromotionModal;

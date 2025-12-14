import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreateBuildingModal = ({ isOpen, onClose, onSuccess }) => {
  const [complexes, setComplexes] = useState([]);
  const [formData, setFormData] = useState({
    residential_complex_id: '',
    block: '',
    description: '',
    short_description: '',
    floor_count: '',
    apartments_count: '',
    commercials_count: '',
    parking_count: '',
    gross_area: '',
    elevators_count: '',
    status: 'Under Construction',
    construction_start: '',
    construction_end: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'Project', label: 'Проект' },
    { value: 'Under Construction', label: 'Строится' },
    { value: 'Completed', label: 'Сдан' }
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

  const formatNumber = (value) => {
    if (!value) return '';
    const cleanValue = value.toString().replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  };

  const unformatNumber = (value) => {
    return value.toString().replace(/\s/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const unformatted = unformatNumber(value);
    const formatted = formatNumber(unformatted);
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      residential_complex_id: parseInt(formData.residential_complex_id),
      block: parseInt(unformatNumber(formData.block)),
      description: formData.description,
      short_description: formData.short_description || null,
      floor_count: parseInt(unformatNumber(formData.floor_count)),
      apartments_count: parseInt(unformatNumber(formData.apartments_count)),
      commercials_count: parseInt(unformatNumber(formData.commercials_count)),
      parking_count: parseInt(unformatNumber(formData.parking_count)),
      gross_area: parseFloat(unformatNumber(formData.gross_area)),
      elevators_count: parseInt(unformatNumber(formData.elevators_count)),
      status: formData.status,
      construction_start: formData.construction_start || null,
      construction_end: formData.construction_end || null
    };

    try {
      await api.post('/buildings', payload);
      onSuccess();
      onClose();
      // Сброс формы
      setFormData({
        residential_complex_id: '',
        block: '',
        description: '',
        short_description: '',
        floor_count: '',
        apartments_count: '',
        commercials_count: '',
        parking_count: '',
        gross_area: '',
        elevators_count: '',
        status: 'Under Construction',
        construction_start: '',
        construction_end: ''
      });
    } catch (err) {
      console.error('Ошибка создания блока:', err);
      
      let errorMessage = 'Ошибка при создании блока';
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
          <h2>Создать новый блок</h2>
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
                <label>Жилой комплекс <span className={styles.required}>*</span></label>
                <select
                  name="residential_complex_id"
                  value={formData.residential_complex_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите ЖК</option>
                  {complexes.map(complex => (
                    <option key={complex.id} value={complex.id}>{complex.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Номер блока <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleNumberChange}
                    required
                    placeholder="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Статус <span className={styles.required}>*</span></label>
                  <select name="status" value={formData.status} onChange={handleChange} required>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Краткое описание (для карточки)</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={300}
                  rows="2"
                  placeholder="Краткое описание блока (макс. 300 символов)"
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
                  placeholder="Подробное описание блока"
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.formSection}>
              <h3>Характеристики</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Этажей <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="floor_count"
                    value={formData.floor_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Общая площадь (м²) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="gross_area"
                    value={formData.gross_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Квартир <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="apartments_count"
                    value={formData.apartments_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Коммерческих помещений <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="commercials_count"
                    value={formData.commercials_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Парковочных мест <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="parking_count"
                    value={formData.parking_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Лифтов <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="elevators_count"
                    value={formData.elevators_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Сроки строительства */}
            <div className={styles.formSection}>
              <h3>Сроки строительства</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Начало строительства</label>
                  <input
                    type="date"
                    name="construction_start"
                    value={formData.construction_start}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Окончание строительства</label>
                  <input
                    type="date"
                    name="construction_end"
                    value={formData.construction_end}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Создание...' : 'Создать блок'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBuildingModal;

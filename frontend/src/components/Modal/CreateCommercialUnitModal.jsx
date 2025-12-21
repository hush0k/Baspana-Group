import React, { useState, useEffect } from 'react';
import commercialUnitService from '../../services/CommercialUnitService';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreateCommercialUnitModal = ({ isOpen, onClose, onSuccess }) => {
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [formData, setFormData] = useState({
    building_id: '',
    residential_complex_id: '',
    unit_number: '',
    floor: '',
    description: '',
    short_description: '',
    unit_area: '',
    commercial_type: 'Office',
    price_per_sqr: '',
    total_price: '',
    status: 'Free'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commercialTypeOptions = [
    { value: 'Office', label: 'Офис' },
    { value: 'Shop', label: 'Магазин' },
    { value: 'Restaurant', label: 'Ресторан' },
    { value: 'Warehouse', label: 'Склад' },
    { value: 'Other', label: 'Другое' }
  ];

  const statusOptions = [
    { value: 'Free', label: 'Свободно' },
    { value: 'Booked', label: 'Забронировано' },
    { value: 'Sold', label: 'Продано' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchComplexes();
      fetchBuildings();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.residential_complex_id) {
      const filtered = buildings.filter(
        building => String(building.residential_complex_id) === String(formData.residential_complex_id)
      );
      setFilteredBuildings(filtered);
    } else {
      setFilteredBuildings(buildings);
    }
  }, [formData.residential_complex_id, buildings]);

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

  const fetchBuildings = async () => {
    try {
      const data = await buildingService.getBuildings({
        sort_by: 'block',
        order: 'asc',
        limit: 1000
      });
      setBuildings(data.results || []);
    } catch (err) {
      console.error('Ошибка загрузки блоков:', err);
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

    if (name === 'residential_complex_id') {
      setFormData(prev => ({ ...prev, building_id: '' }));
    }
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
      building_id: parseInt(formData.building_id),
      unit_number: parseInt(unformatNumber(formData.unit_number)),
      floor: parseInt(unformatNumber(formData.floor)),
      description: formData.description || null,
      short_description: formData.short_description || null,
      unit_area: parseFloat(unformatNumber(formData.unit_area)),
      commercial_type: formData.commercial_type,
      price_per_sqr: parseFloat(unformatNumber(formData.price_per_sqr)),
      total_price: parseFloat(unformatNumber(formData.total_price)),
      status: formData.status
    };

    try {
      await commercialUnitService.createCommercialUnit(payload);
      onSuccess();
      onClose();
      // Сброс формы
      setFormData({
        building_id: '',
        residential_complex_id: '',
        unit_number: '',
        floor: '',
        description: '',
        short_description: '',
        unit_area: '',
        commercial_type: 'Office',
        price_per_sqr: '',
        total_price: '',
        status: 'Free'
      });
    } catch (err) {
      console.error('Ошибка создания коммерческого помещения:', err);

      let errorMessage = 'Ошибка при создании коммерческого помещения';
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
          <h2>Создать коммерческое помещение</h2>
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

              <div className={styles.formGroup}>
                <label>Блок <span className={styles.required}>*</span></label>
                <select
                  name="building_id"
                  value={formData.building_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.residential_complex_id}
                >
                  <option value="">Выберите блок</option>
                  {filteredBuildings.map(building => (
                    <option key={building.id} value={building.id}>Блок {building.block}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Номер помещения <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="unit_number"
                    value={formData.unit_number}
                    onChange={handleNumberChange}
                    required
                    placeholder="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Этаж <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleNumberChange}
                    required
                    placeholder="1"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Тип помещения <span className={styles.required}>*</span></label>
                  <select name="commercial_type" value={formData.commercial_type} onChange={handleChange} required>
                    {commercialTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
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
                  placeholder="Краткое описание помещения (макс. 300 символов)"
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
                  placeholder="Подробное описание помещения"
                />
              </div>
            </div>

            {/* Характеристики и цены */}
            <div className={styles.formSection}>
              <h3>Характеристики и цены</h3>

              <div className={styles.formGroup}>
                <label>Площадь помещения (м²) <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="unit_area"
                  value={formData.unit_area}
                  onChange={handleNumberChange}
                  required
                  placeholder="0"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Цена за м² (₸) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="price_per_sqr"
                    value={formData.price_per_sqr}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Общая цена (₸) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="total_price"
                    value={formData.total_price}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
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
              {loading ? 'Создание...' : 'Создать помещение'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommercialUnitModal;

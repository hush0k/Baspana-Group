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
    unit_area: '',
    ceiling_height: '',
    finishing_type: 'Black Box',
    orientation: 'North',
    isCorner: false,
    price_per_sqr: '',
    total_price: '',
    status: 'Free'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastEditedPrice, setLastEditedPrice] = useState(null);

  const statusOptions = [
    { value: 'Free', label: 'Свободно' },
    { value: 'Booked', label: 'Забронировано' },
    { value: 'Sold', label: 'Продано' }
  ];

  const finishingTypeOptions = [
    { value: 'Black Box', label: 'Black Box' },
    { value: 'White Box', label: 'White Box' },
    { value: 'Finished', label: 'Finished' },
    { value: 'Turnkey', label: 'Turnkey' }
  ];

  const orientationOptions = [
    { value: 'North', label: 'Север' },
    { value: 'South', label: 'Юг' },
    { value: 'East', label: 'Восток' },
    { value: 'West', label: 'Запад' },
    { value: 'Northeast', label: 'Северо-восток' },
    { value: 'Northwest', label: 'Северо-запад' },
    { value: 'Southeast', label: 'Юго-восток' },
    { value: 'Southwest', label: 'Юго-запад' }
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

  // Автоматический расчет цен
  useEffect(() => {
    const area = parseFloat(unformatNumber(formData.unit_area));
    const pricePerSqr = parseFloat(unformatNumber(formData.price_per_sqr));
    const totalPrice = parseFloat(unformatNumber(formData.total_price));

    if (isNaN(area) || area <= 0) return;

    // Если последнее изменение - цена за м², пересчитываем общую цену
    if (lastEditedPrice === 'per_sqr' && !isNaN(pricePerSqr)) {
      const total = area * pricePerSqr;
      setFormData(prev => ({
        ...prev,
        total_price: formatNumber(total.toFixed(0))
      }));
    }
    // Если последнее изменение - общая цена, пересчитываем цену за м²
    else if (lastEditedPrice === 'total' && !isNaN(totalPrice)) {
      const perSqr = totalPrice / area;
      setFormData(prev => ({
        ...prev,
        price_per_sqr: formatNumber(perSqr.toFixed(0))
      }));
    }
    // Если площадь изменилась и есть цена за м², пересчитываем общую цену
    else if (formData.unit_area && !isNaN(pricePerSqr) && pricePerSqr > 0) {
      const total = area * pricePerSqr;
      setFormData(prev => ({
        ...prev,
        total_price: formatNumber(total.toFixed(0))
      }));
    }
  }, [formData.unit_area, formData.price_per_sqr, formData.total_price, lastEditedPrice]);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // Отслеживаем, какое поле цены было изменено
    if (name === 'price_per_sqr') {
      setLastEditedPrice('per_sqr');
    } else if (name === 'total_price') {
      setLastEditedPrice('total');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      building_id: parseInt(formData.building_id),
      number: parseInt(unformatNumber(formData.unit_number)),
      floor: parseInt(unformatNumber(formData.floor)),
      space_area: parseFloat(unformatNumber(formData.unit_area)),
      ceiling_height: parseFloat(unformatNumber(formData.ceiling_height)),
      finishing_type: formData.finishing_type,
      orientation: formData.orientation,
      isCorner: formData.isCorner,
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
        unit_area: '',
        ceiling_height: '',
        finishing_type: 'Black Box',
        orientation: 'North',
        isCorner: false,
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

              <div className={styles.formGroup}>
                <label>Статус <span className={styles.required}>*</span></label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
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
                  <label>Высота потолков (м) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="ceiling_height"
                    value={formData.ceiling_height}
                    onChange={handleNumberChange}
                    required
                    placeholder="3.0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Отделка <span className={styles.required}>*</span></label>
                  <select
                    name="finishing_type"
                    value={formData.finishing_type}
                    onChange={handleChange}
                    required
                  >
                    {finishingTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ориентация <span className={styles.required}>*</span></label>
                  <select
                    name="orientation"
                    value={formData.orientation}
                    onChange={handleChange}
                    required
                  >
                    {orientationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="isCorner"
                    checked={formData.isCorner}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  <label style={{ margin: 0 }}>Угловое помещение</label>
                </div>
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

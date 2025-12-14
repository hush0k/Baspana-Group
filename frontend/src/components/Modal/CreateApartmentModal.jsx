import React, { useState, useEffect } from 'react';
import apartmentService from '../../services/ApartmentService';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreateApartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [formData, setFormData] = useState({
    building_id: '',
    residential_complex_id: '',
    number: '',
    floor: '',
    description: '',
    short_description: '',
    apartment_area: '',
    apartment_type: 'Studio',
    has_balcony: false,
    bathroom_count: '',
    kitchen_area: '',
    ceiling_height: '',
    finishing_type: 'Black Box',
    price_per_sqr: '',
    total_price: '',
    status: 'Free',
    orientation: 'North',
    isCorner: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastEditedPrice, setLastEditedPrice] = useState(null); // 'per_sqr' или 'total'
  const [isBulkCreate, setIsBulkCreate] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);

  const apartmentTypeOptions = [
    { value: 'Studio', label: 'Студия' },
    { value: 'One Bedroom', label: '1-комнатная' },
    { value: 'Two Bedroom', label: '2-комнатная' },
    { value: 'Three Bedroom', label: '3-комнатная' },
    { value: 'Penthouse', label: 'Пентхаус' }
  ];

  const statusOptions = [
    { value: 'Free', label: 'Свободно' },
    { value: 'Booked', label: 'Забронировано' },
    { value: 'Sold', label: 'Продано' }
  ];

  const finishingTypeOptions = [
    { value: 'Black Box', label: 'Черновая' },
    { value: 'White Box', label: 'Предчистовая' },
    { value: 'Finished', label: 'Чистовая' },
    { value: 'Turnkey', label: 'Под ключ' }
  ];

  const orientationOptions = [
    { value: 'North', label: 'Север' },
    { value: 'South', label: 'Юг' },
    { value: 'East', label: 'Восток' },
    { value: 'West', label: 'Запад' },
    { value: 'North-East', label: 'Северо-Восток' },
    { value: 'North-West', label: 'Северо-Запад' },
    { value: 'South-East', label: 'Юго-Восток' },
    { value: 'South-West', label: 'Юго-Запад' }
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
    const area = parseFloat(unformatNumber(formData.apartment_area));
    const pricePerSqr = parseFloat(unformatNumber(formData.price_per_sqr));
    const totalPrice = parseFloat(unformatNumber(formData.total_price));

    if (isNaN(area) || area <= 0) return;

    // Если последнее изменение - цена за м² или площадь, пересчитываем общую цену
    if (lastEditedPrice === 'per_sqr' && !isNaN(pricePerSqr)) {
      const total = area * pricePerSqr;
      setFormData(prev => ({
        ...prev,
        total_price: formatNumber(total.toFixed(2))
      }));
    }
    // Если последнее изменение - общая цена, пересчитываем цену за м²
    else if (lastEditedPrice === 'total' && !isNaN(totalPrice)) {
      const perSqr = totalPrice / area;
      setFormData(prev => ({
        ...prev,
        price_per_sqr: formatNumber(perSqr.toFixed(2))
      }));
    }
    // Если площадь изменилась и есть цена за м², пересчитываем общую цену
    else if (formData.apartment_area && !isNaN(pricePerSqr) && pricePerSqr > 0) {
      const total = area * pricePerSqr;
      setFormData(prev => ({
        ...prev,
        total_price: formatNumber(total.toFixed(2))
      }));
    }
  }, [formData.apartment_area, lastEditedPrice]);

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
      setFilteredBuildings(data.results || []);
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

    const basePayload = {
      building_id: parseInt(formData.building_id),
      floor: parseInt(unformatNumber(formData.floor)),
      description: formData.description || null,
      short_description: formData.short_description || null,
      apartment_area: parseFloat(unformatNumber(formData.apartment_area)),
      apartment_type: formData.apartment_type,
      has_balcony: formData.has_balcony,
      bathroom_count: parseInt(unformatNumber(formData.bathroom_count)),
      kitchen_area: parseFloat(unformatNumber(formData.kitchen_area)),
      ceiling_height: parseFloat(unformatNumber(formData.ceiling_height)),
      finishing_type: formData.finishing_type,
      price_per_sqr: parseFloat(unformatNumber(formData.price_per_sqr)),
      total_price: parseFloat(unformatNumber(formData.total_price)),
      status: formData.status,
      orientation: formData.orientation,
      isCorner: formData.isCorner
    };

    try {
      if (isBulkCreate && bulkCount > 1) {
        // Массовое создание квартир
        const startNumber = parseInt(unformatNumber(formData.number));
        const promises = [];

        for (let i = 0; i < bulkCount; i++) {
          const payload = {
            ...basePayload,
            number: startNumber + i
          };
          promises.push(apartmentService.createApartment(payload));
        }

        await Promise.all(promises);
        onSuccess();
        onClose();
      } else {
        // Одиночное создание
        const payload = {
          ...basePayload,
          number: parseInt(unformatNumber(formData.number))
        };
        await apartmentService.createApartment(payload);
        onSuccess();
        onClose();
      }

      // Сброс формы
      setFormData({
        building_id: '',
        residential_complex_id: '',
        number: '',
        floor: '',
        description: '',
        short_description: '',
        apartment_area: '',
        apartment_type: 'Studio',
        has_balcony: false,
        bathroom_count: '',
        kitchen_area: '',
        ceiling_height: '',
        finishing_type: 'Black Box',
        price_per_sqr: '',
        total_price: '',
        status: 'Free',
        orientation: 'North',
        isCorner: false
      });
      setIsBulkCreate(false);
      setBulkCount(1);
    } catch (err) {
      console.error('Ошибка создания квартиры:', err);

      let errorMessage = 'Ошибка при создании квартиры';
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
          <h2>Создать новую квартиру</h2>
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
                  <label>Номер {isBulkCreate ? 'начальной ' : ''}квартиры <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleNumberChange}
                    required
                    placeholder="101"
                  />
                  {isBulkCreate && (
                    <small style={{ color: '#6b7280', marginTop: '4px' }}>
                      Будут созданы квартиры с {formData.number} по {formData.number ? parseInt(unformatNumber(formData.number)) + bulkCount - 1 : '...'}
                    </small>
                  )}
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
                <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={isBulkCreate}
                    onChange={(e) => setIsBulkCreate(e.target.checked)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <label style={{ margin: 0 }}>Массовое создание квартир</label>
                </div>

                {isBulkCreate && (
                  <div className={styles.formGroup}>
                    <label>Количество квартир <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                      required
                      placeholder="10"
                    />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Тип квартиры <span className={styles.required}>*</span></label>
                  <select name="apartment_type" value={formData.apartment_type} onChange={handleChange} required>
                    {apartmentTypeOptions.map(option => (
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
                  placeholder="Краткое описание квартиры (макс. 300 символов)"
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
                  placeholder="Подробное описание квартиры"
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.formSection}>
              <h3>Характеристики</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Площадь квартиры (м²) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="apartment_area"
                    value={formData.apartment_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Площадь кухни (м²) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="kitchen_area"
                    value={formData.kitchen_area}
                    onChange={handleNumberChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Количество санузлов <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="bathroom_count"
                    value={formData.bathroom_count}
                    onChange={handleNumberChange}
                    required
                    placeholder="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Высота потолков (м) <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="ceiling_height"
                    value={formData.ceiling_height}
                    onChange={handleNumberChange}
                    required
                    placeholder="2.7"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Тип отделки <span className={styles.required}>*</span></label>
                  <select name="finishing_type" value={formData.finishing_type} onChange={handleChange} required>
                    {finishingTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Ориентация <span className={styles.required}>*</span></label>
                  <select name="orientation" value={formData.orientation} onChange={handleChange} required>
                    {orientationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="has_balcony"
                    checked={formData.has_balcony}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  <label style={{ margin: 0 }}>Наличие балкона</label>
                </div>

                <div className={styles.formGroup} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="isCorner"
                    checked={formData.isCorner}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  <label style={{ margin: 0 }}>Угловая квартира</label>
                </div>
              </div>
            </div>

            {/* Цены */}
            <div className={styles.formSection}>
              <h3>Цены</h3>

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
              {loading
                ? (isBulkCreate && bulkCount > 1 ? `Создание ${bulkCount} квартир...` : 'Создание...')
                : (isBulkCreate && bulkCount > 1 ? `Создать ${bulkCount} квартир` : 'Создать квартиру')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApartmentModal;

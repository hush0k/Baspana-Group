import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apartmentService from '../../services/ApartmentService';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import imageService from '../../services/ImageService';
import styles from '../../styles/CreateComplexModal.module.scss';

const EditApartmentModal = ({ isOpen, onClose, onSuccess, apartmentId }) => {
  const { t } = useTranslation();
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
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

  const apartmentTypeOptions = [
    { value: 'Studio', label: t('apartment.types.Studio') },
    { value: 'One Bedroom', label: t('apartment.types.One Bedroom') },
    { value: 'Two Bedroom', label: t('apartment.types.Two Bedroom') },
    { value: 'Three Bedroom', label: t('apartment.types.Three Bedroom') },
    { value: 'Penthouse', label: t('apartment.types.Penthouse') }
  ];

  const statusOptions = [
    { value: 'Free', label: t('apartment.free') },
    { value: 'Booked', label: t('apartment.booked') },
    { value: 'Sold', label: t('apartment.sold') }
  ];

  const finishingTypeOptions = [
    { value: 'Black Box', label: t('apartment.finishingTypes.Black Box') },
    { value: 'White Box', label: t('apartment.finishingTypes.White Box') },
    { value: 'Finished', label: t('apartment.finishingTypes.Finished') },
    { value: 'Turnkey', label: t('apartment.finishingTypes.Turnkey') }
  ];

  const orientationOptions = [
    { value: 'North', label: t('apartment.orientations.North') },
    { value: 'South', label: t('apartment.orientations.South') },
    { value: 'East', label: t('apartment.orientations.East') },
    { value: 'West', label: t('apartment.orientations.West') },
    { value: 'Northeast', label: t('apartment.orientations.Northeast') },
    { value: 'Northwest', label: t('apartment.orientations.Northwest') },
    { value: 'Southeast', label: t('apartment.orientations.Southeast') },
    { value: 'Southwest', label: t('apartment.orientations.Southwest') }
  ];

  useEffect(() => {
    if (isOpen && apartmentId) {
      fetchComplexes();
      fetchBuildings();
      fetchApartmentData();
      fetchApartmentImages();
    }
  }, [isOpen, apartmentId]);

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

  const fetchApartmentData = async () => {
    try {
      const apartment = await apartmentService.getApartmentById(apartmentId);

      // Получаем здание для определения ЖК
      const building = await buildingService.getBuildingById(apartment.building_id);

      setFormData({
        building_id: apartment.building_id,
        residential_complex_id: building.residential_complex_id,
        number: formatNumber(apartment.number),
        floor: formatNumber(apartment.floor),
        description: apartment.description || '',
        short_description: apartment.short_description || '',
        apartment_area: formatNumber(apartment.apartment_area),
        apartment_type: apartment.apartment_type,
        has_balcony: apartment.has_balcony || false,
        bathroom_count: formatNumber(apartment.bathroom_count),
        kitchen_area: formatNumber(apartment.kitchen_area),
        ceiling_height: formatNumber(apartment.ceiling_height),
        finishing_type: apartment.finishing_type,
        price_per_sqr: formatNumber(apartment.price_per_sqr),
        total_price: formatNumber(apartment.total_price),
        status: apartment.status,
        orientation: apartment.orientation,
        isCorner: apartment.isCorner || false
      });
    } catch (err) {
      console.error('Ошибка загрузки данных квартиры:', err);
      setError(t('modal.loadError'));
    }
  };

  const fetchApartmentImages = async () => {
    try {
      const imagesData = await imageService.getImages(apartmentId, 'Apartment');
      setImages(imagesData || []);
    } catch (err) {
      console.error('Ошибка загрузки изображений:', err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setUploadingImages(true);
    try {
      for (const file of selectedFiles) {
        await imageService.uploadImage(file, apartmentId, 'Apartment');
      }
      setSelectedFiles([]);
      await fetchApartmentImages();
      // Очищаем input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Ошибка загрузки изображений:', err);
      setError(t('modal.imageUploadError'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(t('modal.confirmDelete', 'Вы уверены, что хотите удалить это изображение?'))) {
      return;
    }

    try {
      await imageService.deleteImage(imageId);
      await fetchApartmentImages();
    } catch (err) {
      console.error('Ошибка удаления изображения:', err);
      setError(t('modal.deleteError', 'Не удалось удалить изображение'));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      building_id: parseInt(formData.building_id),
      number: parseInt(unformatNumber(formData.number)),
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
      await apartmentService.updateApartment(apartmentId, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления квартиры:', err);

      let errorMessage = t('modal.updateError', 'Ошибка при обновлении квартиры');
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
          <h2>{t('modal.edit')} {t('apartment.title')}</h2>
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
              <h3>{t('modal.basicInfo')}</h3>

              <div className={styles.formGroup}>
                <label>{t('complex.title')} <span className={styles.required}>*</span></label>
                <select
                  name="residential_complex_id"
                  value={formData.residential_complex_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('modal.selectComplex', 'Выберите ЖК')}</option>
                  {complexes.map(complex => (
                    <option key={complex.id} value={complex.id}>{complex.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{t('blockPage.block')} <span className={styles.required}>*</span></label>
                <select
                  name="building_id"
                  value={formData.building_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.residential_complex_id}
                >
                  <option value="">{t('modal.selectBlock', 'Выберите блок')}</option>
                  {filteredBuildings.map(building => (
                    <option key={building.id} value={building.id}>{t('blockPage.block')} {building.block}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('modal.apartmentNumber', 'Номер квартиры')} <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleNumberChange}
                    required
                    placeholder="101"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t('apartment.floor')} <span className={styles.required}>*</span></label>
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
                  <label>{t('modal.apartmentType')} <span className={styles.required}>*</span></label>
                  <select name="apartment_type" value={formData.apartment_type} onChange={handleChange} required>
                    {apartmentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t('apartment.status')} <span className={styles.required}>*</span></label>
                  <select name="status" value={formData.status} onChange={handleChange} required>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.shortDescription')}</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={300}
                  rows="2"
                  placeholder={t('modal.shortDescriptionPlaceholder', 'Краткое описание квартиры (макс. 300 символов)')}
                />
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {formData.short_description?.length || 0}/300 {t('modal.characters', 'символов')}
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.fullDescription')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder={t('modal.fullDescriptionPlaceholder', 'Подробное описание квартиры')}
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.formSection}>
              <h3>{t('modal.characteristics')}</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('apartment.area')} ({t('common.sqm')}) <span className={styles.required}>*</span></label>
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
                  <label>{t('apartment.kitchen')} ({t('common.sqm')}) <span className={styles.required}>*</span></label>
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
                  <label>{t('apartment.bathroom')} <span className={styles.required}>*</span></label>
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
                  <label>{t('apartment.ceiling')} (м) <span className={styles.required}>*</span></label>
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
                  <label>{t('apartment.finishing')} <span className={styles.required}>*</span></label>
                  <select name="finishing_type" value={formData.finishing_type} onChange={handleChange} required>
                    {finishingTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t('apartment.orientation')} <span className={styles.required}>*</span></label>
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
                  <label style={{ margin: 0 }}>{t('apartment.balcony')}</label>
                </div>

                <div className={styles.formGroup} style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="isCorner"
                    checked={formData.isCorner}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  <label style={{ margin: 0 }}>{t('apartment.corner')}</label>
                </div>
              </div>
            </div>

            {/* Цены */}
            <div className={styles.formSection}>
              <h3>{t('modal.pricing')}</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('apartment.pricePerSqm')} ({t('common.tenge')}) <span className={styles.required}>*</span></label>
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
                  <label>{t('apartment.price')} ({t('common.tenge')}) <span className={styles.required}>*</span></label>
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

            {/* Фотогалерея */}
            <div className={styles.formSection}>
              <h3>{t('apartment.gallery')}</h3>

              {/* Существующие изображения */}
              {images.length > 0 && (
                <div className={styles.imagesGrid} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  {images.map(image => (
                    <div key={image.id} style={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt="Apartment"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(255, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '25px',
                          height: '25px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Загрузка новых изображений */}
              <div className={styles.formGroup}>
                <label>{t('modal.addImages')}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ marginBottom: '10px' }}
                />
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p>{t('modal.filesSelected', 'Выбрано файлов')}: {selectedFiles.length}</p>
                    <button
                      type="button"
                      onClick={handleUploadImages}
                      disabled={uploadingImages}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: uploadingImages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {uploadingImages ? t('modal.uploading', 'Загрузка...') : t('modal.uploadImages', 'Загрузить изображения')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              {t('modal.cancel')}
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? t('modal.saving', 'Сохранение...') : t('modal.saveChanges', 'Сохранить изменения')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApartmentModal;

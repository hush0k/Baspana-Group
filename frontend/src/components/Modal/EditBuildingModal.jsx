import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import complexService from '../../services/ComplexService';
import buildingService from '../../services/BuildingService';
import imageService from '../../services/ImageService';
import styles from '../../styles/CreateComplexModal.module.scss';

const EditBuildingModal = ({ isOpen, onClose, onSuccess, buildingId }) => {
  const { t } = useTranslation();
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
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'Project', label: t('complex.buildingStatus.Project') },
    { value: 'Under Construction', label: t('complex.buildingStatus.Under Construction') },
    { value: 'Completed', label: t('complex.buildingStatus.Completed') }
  ];

  useEffect(() => {
    if (isOpen && buildingId) {
      fetchComplexes();
      fetchBuildingData();
      fetchBuildingImages();
    }
  }, [isOpen, buildingId]);

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

  const fetchBuildingData = async () => {
    try {
      const building = await buildingService.getBuildingById(buildingId);
      setFormData({
        residential_complex_id: building.residential_complex_id,
        block: formatNumber(building.block),
        description: building.description || '',
        short_description: building.short_description || '',
        floor_count: formatNumber(building.floor_count),
        apartments_count: formatNumber(building.apartments_count),
        commercials_count: formatNumber(building.commercials_count),
        parking_count: formatNumber(building.parking_count),
        gross_area: formatNumber(building.gross_area),
        elevators_count: formatNumber(building.elevators_count),
        status: building.status,
        construction_start: building.construction_start ? building.construction_start.split('T')[0] : '',
        construction_end: building.construction_end ? building.construction_end.split('T')[0] : ''
      });
    } catch (err) {
      console.error('Ошибка загрузки данных блока:', err);
      setError(t('modal.loadError'));
    }
  };

  const fetchBuildingImages = async () => {
    try {
      const imagesData = await imageService.getImages(buildingId, 'Building');
      setImages(imagesData || []);
    } catch (err) {
      console.error('Ошибка загрузки изображений:', err);
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setUploadingImages(true);
    try {
      for (const file of selectedFiles) {
        await imageService.uploadImage(file, buildingId, 'Building');
      }
      await fetchBuildingImages();
      setSelectedFiles([]);
      // Reset file input
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
    if (!window.confirm(t('modal.confirmDelete', 'Вы уверены, что хотите удалить это изображение?'))) return;

    try {
      await imageService.deleteImage(imageId);
      await fetchBuildingImages();
    } catch (err) {
      console.error('Ошибка удаления изображения:', err);
      setError(t('modal.deleteError', 'Не удалось удалить изображение'));
    }
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
      // Используем PATCH вместо PUT с JSON payload
      await api.patch(`/buildings/${buildingId}`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления блока:', err);

      let errorMessage = t('modal.updateError', 'Ошибка при обновлении');
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
          <h2>{t('modal.edit')} {t('blockPage.block')}</h2>
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

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('modal.blockNumber', 'Номер блока')} <span className={styles.required}>*</span></label>
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
                  <label>{t('complex.status')} <span className={styles.required}>*</span></label>
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
                  placeholder={t('modal.blockShortDesc', 'Краткое описание блока (макс. 300 символов)')}
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
                  placeholder={t('modal.blockFullDesc', 'Подробное описание блока')}
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className={styles.formSection}>
              <h3>{t('modal.characteristics')}</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('complex.floors')} <span className={styles.required}>*</span></label>
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
                  <label>{t('modal.totalArea', 'Общая площадь')} ({t('common.sqm')}) <span className={styles.required}>*</span></label>
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
                  <label>{t('blockPage.apartments')} <span className={styles.required}>*</span></label>
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
                  <label>{t('blockPage.commercialUnits')} <span className={styles.required}>*</span></label>
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
                  <label>{t('blockPage.parking')} <span className={styles.required}>*</span></label>
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
                  <label>{t('blockPage.elevators')} <span className={styles.required}>*</span></label>
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

            {/* Изображения */}
            <div className={styles.formSection}>
              <h3>{t('modal.buildingImages', 'Изображения блока')}</h3>

              <div className={styles.imagesSection}>
                {/* Существующие изображения */}
                {images.length > 0 && (
                  <div className={styles.existingImages}>
                    <h4>{t('modal.uploadedImages', 'Загруженные изображения')} ({images.length})</h4>
                    <div className={styles.imageGrid}>
                      {images.map((image) => (
                        <div key={image.id} className={styles.imageItem}>
                          <img src={image.img_url} alt="Building" />
                          <button
                            type="button"
                            className={styles.deleteImageButton}
                            onClick={() => handleDeleteImage(image.id)}
                            title={t('modal.removeImage')}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 4L12 12M4 12L12 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Загрузка новых изображений */}
                <div className={styles.uploadSection}>
                  <h4>{t('modal.addNewImages', 'Добавить новые изображения')}</h4>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                      id="building-images"
                    />
                    <label htmlFor="building-images" className={styles.fileInputLabel}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {t('modal.selectFiles', 'Выбрать файлы')}
                    </label>
                    {selectedFiles.length > 0 && (
                      <span className={styles.selectedFilesCount}>
                        {selectedFiles.length} {t('modal.filesSelected', 'файл(ов) выбрано')}
                      </span>
                    )}
                  </div>
                  {selectedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUploadImages}
                      className={styles.uploadButton}
                      disabled={uploadingImages}
                    >
                      {uploadingImages ? t('modal.uploading', 'Загрузка...') : t('modal.uploadImages', 'Загрузить изображения')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Сроки строительства */}
            <div className={styles.formSection}>
              <h3>{t('modal.constructionDates', 'Сроки строительства')}</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('modal.constructionStart', 'Начало строительства')}</label>
                  <input
                    type="date"
                    name="construction_start"
                    value={formData.construction_start}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t('modal.constructionEnd', 'Окончание строительства')}</label>
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

export default EditBuildingModal;
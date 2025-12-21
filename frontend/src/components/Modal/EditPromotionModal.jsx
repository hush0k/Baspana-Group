import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import promotionService from '../../services/PromotionService';
import complexService from '../../services/ComplexService';
import styles from '../../styles/CreateComplexModal.module.scss';

const EditPromotionModal = ({ isOpen, onClose, onSuccess, promotionId }) => {
  const { t } = useTranslation();
  const [complexes, setComplexes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    { value: '', label: t('common.all') },
    { value: 'Studio', label: t('apartment.types.Studio') },
    { value: 'One Bedroom', label: t('apartment.types.One Bedroom') },
    { value: 'Two Bedroom', label: t('apartment.types.Two Bedroom') },
    { value: 'Three Bedroom', label: t('apartment.types.Three Bedroom') },
    { value: 'Penthouse', label: t('apartment.types.Penthouse') }
  ];

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchComplexes();
      fetchPromotionData();
    }
  }, [isOpen, promotionId]);

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

  const fetchPromotionData = async () => {
    try {
      const promotion = await promotionService.getPromotionById(promotionId);
      setFormData({
        title: promotion.title || '',
        short_description: promotion.short_description || '',
        description: promotion.description || '',
        discount_percentage: promotion.discount_percentage || '',
        start_date: promotion.start_date || '',
        end_date: promotion.end_date || '',
        image_url: promotion.image_url || '',
        residential_complex_id: promotion.residential_complex_id || '',
        apartment_type: promotion.apartment_type || '',
        is_active: promotion.is_active !== false
      });
    } catch (err) {
      console.error('Ошибка загрузки данных акции:', err);
      setError(t('modal.loadError'));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setError('');
    try {
      const result = await promotionService.uploadPromotionImage(selectedFile);
      setFormData(prev => ({ ...prev, image_url: result.image_url }));
      setSelectedFile(null);
      setImagePreview(null);
      alert(t('modal.imageUploadSuccess'));
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError(t('modal.imageUploadError'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setSelectedFile(null);
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
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
      await promotionService.updatePromotion(promotionId, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления акции:', err);
      setError(err.response?.data?.detail || 'Ошибка при обновлении акции');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{t('modal.edit')} {t('promotion.title')}</h2>
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
              <h3>{t('modal.basicInfo')}</h3>

              <div className={styles.formGroup}>
                <label>{t('promotion.title')} <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={t('promotion.title')}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.shortDescription')}</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={300}
                  rows="2"
                  placeholder={t('modal.shortDescription')}
                />
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {formData.short_description?.length || 0}/300
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.fullDescription')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder={t('modal.fullDescription')}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.mainImage')}</label>
                {formData.image_url ? (
                  <div style={{ marginBottom: '10px' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {t('modal.removeImage')}
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ marginBottom: '10px' }}
                    />
                    {imagePreview && (
                      <div style={{ marginBottom: '10px' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={uploadingImage}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: uploadingImage ? 'not-allowed' : 'pointer',
                          opacity: uploadingImage ? 0.6 : 1
                        }}
                      >
                        {uploadingImage ? t('modal.loading') : t('modal.uploadImage')}
                      </button>
                    )}
                  </>
                )}
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {t('modal.selectImage')} (JPG, PNG)
                </small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('modal.discount')} (%) <span className={styles.required}>*</span></label>
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
                  <label style={{ margin: 0 }}>{t('modal.active')}</label>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>{t('promotion.period')}</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('modal.startDate')} <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t('modal.endDate')} <span className={styles.required}>*</span></label>
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
              <h3>{t('promotion.conditions')}</h3>

              <div className={styles.formGroup}>
                <label>{t('complex.title')}</label>
                <select
                  name="residential_complex_id"
                  value={formData.residential_complex_id}
                  onChange={handleChange}
                >
                  <option value="">{t('common.all')}</option>
                  {complexes.map(complex => (
                    <option key={complex.id} value={complex.id}>{complex.name}</option>
                  ))}
                </select>
                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {t('modal.optional')}
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>{t('modal.apartmentType')}</label>
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
                  {t('modal.optional')}
                </small>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              {t('modal.cancel')}
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? t('modal.loading') : t('modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPromotionModal;

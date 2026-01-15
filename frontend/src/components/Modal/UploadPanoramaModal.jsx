import React, { useState } from 'react';
import panoramaService from '../../services/PanoramaService';
import styles from '../../styles/CreateComplexModal.module.scss';

const UploadPanoramaModal = ({ isOpen, onClose, onSuccess, complexId, apartmentId }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('360_image');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const typeOptions = [
    { value: '360_image', label: '360° Изображение' },
    { value: '360_video', label: '360° Видео' },
    { value: 'ar_model', label: 'AR Модель' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (complexId) {
        await panoramaService.createForComplex(complexId, file, title, type);
      } else if (apartmentId) {
        await panoramaService.createForApartment(apartmentId, file, title, type);
      }

      onSuccess();
      onClose();
      // Reset form
      setFile(null);
      setTitle('');
      setType('360_image');
      setPreview(null);
    } catch (err) {
      console.error('Ошибка загрузки панорамы:', err);
      setError(err.response?.data?.detail || 'Ошибка при загрузке панорамы');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Загрузить 360° панораму</h2>
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
          <div className={styles.formGroup}>
            <label>Тип панорамы <span className={styles.required}>*</span></label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Название (опционально)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Вид из гостиной"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Файл <span className={styles.required}>*</span></label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={type === '360_video' ? 'video/*' : 'image/*'}
              required
            />
            {preview && (
              <div className={styles.preview}>
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading || !file}>
              {loading ? 'Загрузка...' : 'Загрузить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPanoramaModal;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../../styles/ReviewBlock.module.scss';

const ReviewBlock = ({ complexId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        author_name: '',
        rating: 5,
        comment: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (complexId) {
            loadReviews();
        }
    }, [complexId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/', {
                params: {
                    residential_complex_id: complexId
                }
            });
            // Handle paginated response
            const reviewsData = response.data.results || [];
            setReviews(reviewsData);
        } catch (err) {
            console.error('Error loading reviews:', err);
            setReviews([]); // Ensure reviews is always an array even on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.author_name.trim()) {
            setError('Пожалуйста, укажите ваше имя');
            return;
        }

        if (!formData.comment.trim()) {
            setError('Пожалуйста, напишите отзыв');
            return;
        }

        try {
            setLoading(true);

            console.log('Sending review data:', {
                residential_complex_id: parseInt(complexId),
                author_name: formData.author_name,
                rating: formData.rating,
                comment: formData.comment
            });

            const response = await api.post('/reviews/', {
                residential_complex_id: parseInt(complexId),
                author_name: formData.author_name,
                rating: formData.rating,
                comment: formData.comment
            });

            console.log('Review created successfully:', response.data);
            setSuccess('Спасибо за ваш отзыв!');
            setFormData({
                author_name: '',
                rating: 5,
                comment: ''
            });
            setShowForm(false);

            // Перезагружаем отзывы
            await loadReviews();
        } catch (err) {
            console.error('Error submitting review:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);

            const errorMessage = err.response?.data?.detail || 'Не удалось отправить отзыв. Попробуйте еще раз.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderStars = (rating, interactive = false, onClick = null) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= rating ? styles.filled : ''} ${interactive ? styles.interactive : ''}`}
                        onClick={() => interactive && onClick && onClick(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className={styles.reviewBlock}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Отзывы</h2>
                    {reviews.length > 0 && (
                        <div className={styles.ratingInfo}>
                            {renderStars(Math.round(averageRating))}
                            <span className={styles.ratingText}>
                                {averageRating} из 5 ({reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'})
                            </span>
                        </div>
                    )}
                </div>
                <button
                    className={styles.addReviewBtn}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Отмена' : '+ Оставить отзыв'}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            {showForm && (
                <form className={styles.reviewForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Ваше имя</label>
                        <input
                            type="text"
                            name="author_name"
                            value={formData.author_name}
                            onChange={handleChange}
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Оценка</label>
                        {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Ваш отзыв</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            placeholder="Поделитесь своим мнением..."
                            rows="4"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                </form>
            )}

            <div className={styles.reviewsList}>
                {loading && reviews.length === 0 ? (
                    <div className={styles.loading}>Загрузка отзывов...</div>
                ) : reviews.length === 0 ? (
                    <div className={styles.noReviews}>
                        <p>Пока нет отзывов. Будьте первым!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <div>
                                    <div className={styles.authorName}>{review.author_name}</div>
                                    <div className={styles.reviewDate}>{formatDate(review.created_at)}</div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            <p className={styles.reviewText}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewBlock;

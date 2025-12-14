import React, { useState } from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        name: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Интеграция с backend API
        console.log('Form submitted:', formData);
        alert('Спасибо! Наш менеджер свяжется с вами в ближайшее время.');
        setFormData({ phone: '', name: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className={styles.contactSection}>
            <div className={styles.contactCard}>
                <h2 className={styles.contactTitle}>Заинтересовались?</h2>
                <p className={styles.contactSubtitle}>
                    Оставьте свои контакты, и наш менеджер свяжется с вами для консультации.
                </p>

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Номер телефона"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                    <button type="submit" className={styles.submitButton}>
                        Получить консультацию
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
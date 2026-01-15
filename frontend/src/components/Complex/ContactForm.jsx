import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/ComplexDetail.module.scss';

const ContactForm = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        phone: '',
        name: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert(t('complex.thankYouMessage'));
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
                <h2 className={styles.contactTitle}>{t('complex.interested')}</h2>
                <p className={styles.contactSubtitle}>
                    {t('complex.contactSubtitle')}
                </p>

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <input
                        type="tel"
                        name="phone"
                        placeholder={t('complex.phoneNumber')}
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                    <button type="submit" className={styles.submitButton}>
                        {t('complex.getConsultation')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
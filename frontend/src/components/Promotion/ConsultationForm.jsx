import React, { useState } from 'react';
import styles from '../../styles/PromotionPage.module.scss';

const ConsultationForm = ({ onSubmit }) => {
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(phone);
    };

    return (
        <div className={styles.consultationSection}>
            <h2>Не нашли подходящую акцию?</h2>
            <p>
                Оставьте свой номер, и наш менеджер свяжется с вами для индивидуальной консультации и
                подбора лучшего предложения.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.phoneInput}
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    Получить консультацию
                </button>
            </form>
        </div>
    );
};

export default ConsultationForm;
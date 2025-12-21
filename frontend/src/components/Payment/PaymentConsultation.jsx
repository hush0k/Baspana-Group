import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/PaymentPage.module.scss';

const PaymentConsultation = ({ onConsultation }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.consultation}>
            <div className={styles.consultationContent}>
                <h2>{t('payment.consultationTitle')}</h2>
                <p>
                    {t('payment.consultationText')}
                </p>
            </div>
            <button className={styles.consultButton} onClick={onConsultation}>
                {t('payment.getConsultation')}
            </button>
        </div>
    );
};

export default PaymentConsultation;
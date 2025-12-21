import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/PaymentPage.module.scss';

const PaymentMethodCard = ({ method }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.methodCard}>
            <div className={styles.methodHeader}>
                <div className={styles.icon}>{method.icon}</div>
                <h2>{method.title}</h2>
            </div>
            <p className={styles.description}>{method.description}</p>

            <div className={styles.methodDetails}>
                {method.steps && method.steps.length > 0 && (
                    <div className={styles.column}>
                        <h3>{t('payment.steps')}</h3>
                        <ol>
                            {method.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}

                <div className={styles.column}>
                    <h3>{t('payment.requirements')}</h3>
                    <ul>
                        {method.documents.map((doc, index) => (
                            <li key={index}>{doc}</li>
                        ))}
                    </ul>
                </div>

                {method.example && (
                    <div className={styles.column}>
                        <h3>{t('payment.example')}</h3>
                        <div className={styles.exampleContent}>
                            {method.example.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>
                )}

                {method.process && method.process.length > 0 && (
                    <div className={styles.column}>
                        <h3>{t('payment.process')}</h3>
                        <ol>
                            {method.process.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodCard;
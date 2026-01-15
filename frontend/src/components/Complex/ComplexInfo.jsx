import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedDescription } from '../../utils/i18nHelpers';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexInfo = ({ complex }) => {
    const { t, i18n } = useTranslation();

    const formatDate = (dateString) => {
        if (!dateString) return t('complex.notSpecified');
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' };
        const locale = i18n.language === 'kz' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU';
        return date.toLocaleDateString(locale, options);
    };

    return (
        <section className={styles.infoSection}>
            <div className={styles.infoHeader}>
                <div className={styles.statusBadge}>
                    {t('complex.projectStatus')}: {t('complex.completionDate')} {formatDate(complex?.construction_end)}
                </div>
            </div>

            <div className={styles.infoContent}>
                <h2 className={styles.infoTitle}>{t('complex.aboutComplex')}</h2>
                <p className={styles.infoDescription}>
                    {getLocalizedDescription(complex)}
                </p>
            </div>
        </section>
    );
};

export default ComplexInfo;
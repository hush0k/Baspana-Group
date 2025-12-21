import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
        { code: 'kz', label: 'KZ', flag: '🇰🇿' },
        { code: 'en', label: 'EN', flag: '🇬🇧' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsOpen(false);
    };

    return (
        <div className={styles.languageSwitcher}>
            <button
                className={styles.currentLanguage}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
            >
                <span className={styles.flag}>{currentLanguage.flag}</span>
                <span className={styles.label}>{currentLanguage.label}</span>
                <svg
                    className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                >
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`${styles.languageOption} ${lang.code === i18n.language ? styles.active : ''}`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <span className={styles.flag}>{lang.flag}</span>
                            <span className={styles.label}>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;

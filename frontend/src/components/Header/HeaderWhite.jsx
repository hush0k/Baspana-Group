import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/AuthService';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from '../../styles/HeaderWhite.module.scss';
import logo from '../../assets/image/Baspana_Logo_white.png';

const HeaderWhite = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getUserDisplayName = () => {
        if (!user) return '';
        const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
        const lastName = user.last_name || '';
        return `${firstNameInitial}.${lastName}`;
    };

    const handleLogout = () => {
        authService.logout();
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    const handleProfileClick = () => {
        if (isAuthenticated) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate('/login');
        }
    };

    const isAdmin = user?.role === 'Admin';
    const isManagerOrAdmin = user?.role === 'Manager' || user?.role === 'Admin';

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={logo} alt="Baspana Logo" />
                </Link>
            </div>

            <nav className={styles.nav}>
                <Link to="/">{t('header.home')}</Link>
                <Link to="/payment">{t('header.payment')}</Link>
                <Link to="/promotions">{t('header.promotions')}</Link>
                <Link to="/contacts">{t('header.contacts')}</Link>
            </nav>

            <div className={styles.rightSection}>
                <LanguageSwitcher />

            <div className={styles.profileContainer} ref={dropdownRef}>
                <button className={styles.profileBtn} onClick={handleProfileClick}>
                    {isAuthenticated ? (
                        <>
                            <span>{getUserDisplayName()}</span>
                            <svg
                                className={`${styles.arrowIcon} ${isDropdownOpen ? styles.open : ''}`}
                                width="12"
                                height="8"
                                viewBox="0 0 12 8"
                                fill="none"
                            >
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </>
                    ) : (
                        t('header.login')
                    )}
                </button>

                {isAuthenticated && isDropdownOpen && (
                    <div className={styles.dropdown}>
                        <Link
                            to="/profile"
                            className={styles.dropdownItem}
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            {t('header.profile')}
                        </Link>

                        {isManagerOrAdmin && (
                            <Link
                                to="/complex-management"
                                className={styles.dropdownItem}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                {t('management.title')}
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/user-management"
                                className={styles.dropdownItem}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                {t('management.userManagement')}
                            </Link>
                        )}

                        <button
                            className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                            onClick={handleLogout}
                        >
                            {t('header.logout')}
                        </button>
                    </div>
                )}
            </div>
            </div>
        </header>
    );
};

export default HeaderWhite;
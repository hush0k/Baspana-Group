import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/HeaderBlack.module.scss';
import logo from '../../assets/image/Baspana_Logo_black.png';

const HeaderBlack = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access_token');

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={logo} alt="Baspana Logo" />
                </Link>
            </div>

            <nav className={styles.nav}>
                <Link to="/">Главная</Link>
                <Link to="/projects">Проекты</Link>
                <Link to="/payment">Способы оплаты</Link>
                <Link to="/promotions">Акции</Link>
                <Link to="/contacts">Контакты</Link>
            </nav>

            <button className={styles.profileBtn} onClick={handleProfileClick}>
                {isAuthenticated ? 'Личный кабинет' : 'Войти'}
            </button>
        </header>
    );
};

export default HeaderBlack;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import ComplexCard from '../../components/Cards/ComplexCard';
import styles from '../../styles/MainHome.module.scss';

const MainHome = () => {
    const navigate = useNavigate();
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mockComplexes = [
        {
            id: 1,
            name: "Almaty Towers",
            city: "Almaty",
            address: "пр. Аль-Фараби, 77/1",
            building_class: "Business",
            building_status: "Under Construction",
            min_area: 45,
            min_price: 35000000,
            construction_end: "2025-12-31",
            main_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByqDfzXH17Gkie0XdsA9iLNqfYosNcfn1OT417R-1VNfcz2pZLrnie9C7L0catTPqnsIf9xXEW7zP3II4bx0SVUq8EK1S73xT70qxaPdbx_ajYXr44HwSlhtEA4hiYwxnnMLMY3fuFBxMik3zulaVJT48I-OmW8BK1IEnH-CTUEjZMJ6wrdFqBa38XsZ5anjLjDm8Tttl-CzTCooxfaNSdMgvJjVdbvyHcbpjSE_wULDZ6RM3RtlrXmOyXlmWSFUVrLUjbqimVqQDd",
            description: "Современный жилой комплекс с развитой инфраструктурой, подземным паркингом и благоустроенной территорией."
        },
        {
            id: 2,
            name: "Keremet",
            city: "Almaty",
            address: "ул. Толе би, 59",
            building_class: "Comfort",
            building_status: "Completed",
            min_area: 42,
            min_price: 28000000,
            construction_end: "2024-06-30",
            main_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzi2yoiEW22jleV3vzLtuLeld37TfH6th8MdSvu3FkH5V9SdW5t-sGtsL1PdzVuu8Si4iJ4s0L1o1pJnMeMwi25QYKkm3xZE6n7da6YNBuL9qvMyY36zyCdsNHZZRZuHQcfZUty26WbfKTXmVdKIBD_mZJD5OYMWamxlhWqjDfRlI4i0vtLv2D9Yjr5_6kq9j50ffPSHgK97zHhiXUuKaIpjspo0w6uT8bjij5o44_BFyjyzPKT9wftNupybOjJ-zRLqwgGlBK_YKo",
            description: "Жилой комплекс с панорамными видами на город. Продуманные планировки и качественные материалы."
        },
        {
            id: 3,
            name: "Orda",
            city: "Almaty",
            address: "ул. Желтоксан, 111",
            building_class: "Luxury",
            building_status: "Under Construction",
            min_area: 65,
            min_price: 55000000,
            construction_end: "2026-06-30",
            main_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjR342h6kcZK_OEkVSwYsfQ8qFY4BHX4ZumE7JEb-TXbOs7LEx3vTTx1K6jNYwPbppokrDW3w98Qfple4C2lQUE0FTm1LmOozmP609kKiY5Tut-uCrmilC6yCfgJ2v9B0IOHFYWIysP3rIscmZVdVwqEZtEOGBx0SOBAzSwEhfmSoYL9OWmMFfozS0Xp5AAbLJ2bzaUN6G6RIE1wwqKxIDVP2HgTGCYpYTgxr9buogjFdZkkAvi36r9N-n90681jkS3Z-z0n3ewI-Z",
            description: "Элитный жилой комплекс в самом сердце города. Эксклюзивная архитектура и сервис высочайшего уровня."
        },
        {
            id: 4,
            name: "Tau-Samal",
            city: "Almaty",
            address: "мкр. Самал-2",
            building_class: "Comfort",
            building_status: "Under Construction",
            min_area: 50,
            min_price: 32000000,
            construction_end: "2025-03-31",
            main_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjB47gh6Ew8C_EP5iWGHY6fnrtHFYtVsQ2_uHk08fnrZtJdAjr8t4jB8R8iSppCu47pvUdUgZ85z4b24_B5Rfn-0BQSkb4JHfK2amye99YcB96sgIuEUJ7PDquntqDUxivY34mkJtLKRlc55V1WalR0Q7Rho_Nd3Y8OF9jbNJNU6DsUfmqiwf--iWNJXjm8PuWwpyRJm6ETZulCkRBjFZM-qRrGqcK82E3W6XqxqYlKflcqhl_RyhD2_k10Mqbq5EuHYIkAY5FLh2n",
            description: "Уютный жилой комплекс у подножья гор. Идеальный выбор для тех, кто ищет гармонию с природой."
        }
    ];

    useEffect(() => {
        const loadComplexes = async () => {
            try {
                setLoading(true);
                setTimeout(() => {
                    setComplexes(mockComplexes);
                    setLoading(false);
                }, 500);
            } catch (err) {
                console.error('Error loading complexes:', err);
                setError('Не удалось загрузить проекты');
                setLoading(false);
            }
        };

        loadComplexes();
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <HeaderBlack />

            <main className={styles.mainContent}>
                {/* Hero секция */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Наши жилые комплексы
                        </h1>
                        <p className={styles.heroDescription}>
                            Откройте для себя наши проекты: от современных городских квартир
                            до уютных семейных домов. Найдите свой идеальный дом с Baspana Group.
                        </p>
                    </div>
                </section>

                <section className={styles.projectsSection}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Загрузка проектов...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.errorContainer}>
                            <p className={styles.errorText}>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className={styles.retryButton}
                            >
                                Попробовать снова
                            </button>
                        </div>
                    ) : (
                        <div className={styles.projectsList}>
                            {complexes.map((complex) => (
                                <ComplexCard
                                    key={complex.id}
                                    complex={complex}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className={styles.ctaSection}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>
                            Не нашли подходящий проект?
                        </h2>
                        <p className={styles.ctaDescription}>
                            Свяжитесь с нами, и мы поможем подобрать идеальный вариант специально для вас
                        </p>
                        <button className={styles.ctaButton}>
                            Получить консультацию
                        </button>
                    </div>
                </section>
            </main>

            <FooterBlack />
        </div>
    );
};

export default MainHome;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import ComplexCard from '../../components/Cards/ComplexCard';
import HeroSection from '../../components/Hero/HeroSection';
import MortgageCalculator from '../../components/Calculator/MortgageCalculator';
import FilterPanel from '../../components/Filters/FilterPanel';
import { complexService } from '../../services/ComplexService';
import styles from '../../styles/MainHome.module.scss';

const MainHome = () => {
    const navigate = useNavigate();
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        sort_by: 'name',
        order: 'asc'
    });

    useEffect(() => {
        const loadComplexes = async () => {
            try {
                setLoading(true);
                const data = await complexService.getComplexes(filters);
                // API возвращает объект с полем results
                setComplexes(data.results || data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading complexes:', err);
                setError('Не удалось загрузить проекты');
                setLoading(false);
            }
        };

        loadComplexes();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            sort_by: 'name',
            order: 'asc'
        });
    };

    return (
        <div className={styles.pageWrapper}>
            <HeaderBlack />

            <HeroSection />

            <main className={styles.mainContent}>
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

                <div className={styles.filterContainer}>
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

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
            <MortgageCalculator />

            <FooterBlack />
        </div>
    );
};

export default MainHome;
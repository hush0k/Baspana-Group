import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PromotionCard from '../../components/Promotion/PromotionCard';
import PromotionFilters from '../../components/Promotion/PromotionFilters';
import ConsultationForm from '../../components/Promotion/ConsultationForm';
import { getPromotions, requestConsultation } from '../../services/PromotionService';
import styles from '../../styles/PromotionPage.module.scss';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                // Map filter to API parameters
                const params = {};

                if (activeFilter === 'all') {
                    params.is_active = true;
                } else if (activeFilter === 'apartments') {
                    params.is_active = true;
                    // Filter for apartment types (not parking)
                } else if (activeFilter === 'parking') {
                    params.is_active = true;
                    // Add parking filter if needed
                } else if (activeFilter === 'mortgage') {
                    params.is_active = true;
                    // Add mortgage filter if needed
                }

                const data = await getPromotions(params);
                // Backend returns { total, results }
                setPromotions(data.results || data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
                setPromotions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [activeFilter]);

    const handleConsultation = async (phone) => {
        try {
            await requestConsultation(phone);
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        } catch (error) {
            console.error('Error submitting consultation:', error);
            alert('Произошла ошибка. Попробуйте позже.');
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className={styles.promotionsPage}>
            <Header />

            <main className={styles.content}>
                <div className={styles.hero}>
                    <h1>Акции и специальные предложения</h1>
                    <p>
                        Успейте воспользоваться выгодными условиями на покупку недвижимости от Baspana
                        Group
                    </p>
                </div>

                <PromotionFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <div className={styles.promotionsList}>
                    {promotions.map(promotion => (
                        <PromotionCard key={promotion.id} promotion={promotion} />
                    ))}
                </div>

                <ConsultationForm onSubmit={handleConsultation} />
            </main>

            <Footer />
        </div>
    );
};

export default PromotionsPage;  
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PaymentMethodCard from '../../components/Payment/PaymentMethodCard';
import PaymentConsultation from '../../components/Payment/PaymentConsultation';
import { getPaymentMethods } from '../../services/PaymentService';
import styles from '../../styles/PaymentPage.module.scss';

const PaymentPage = () => {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const data = await getPaymentMethods();
                setMethods(data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMethods();
    }, []);

    const handleConsultation = () => {
        // Открыть модальное окно или перенаправить
        console.log('Request consultation');
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className={styles.paymentPage}>
            <Header />

            <main className={styles.content}>
                <div className={styles.breadcrumbs}>
                    <span>Главная</span> / <span>Способы оплаты</span>
                </div>

                <div className={styles.hero}>
                    <h1>Способы покупки и оплаты недвижимости</h1>
                    <p>
                        Выберите наиболее удобный для вас вариант приобретения недвижимости в наших жилых
                        комплексах. Мы предлагаем гибкие условия и полную поддержку на всех этапах сделки.
                    </p>
                </div>

                <div className={styles.methodsList}>
                    {methods.map((method) => (
                        <PaymentMethodCard key={method.id} method={method} />
                    ))}
                </div>

                <PaymentConsultation onConsultation={handleConsultation} />
            </main>

            <Footer />
        </div>
    );
};

export default PaymentPage;
import React, { useState, useEffect } from 'react';
import styles from '../../styles/MortgageCalculator.module.scss';

const MortgageCalculator = () => {
    const [price, setPrice] = useState(25000000);
    const [downPayment, setDownPayment] = useState(5000000);
    const [years, setYears] = useState(20);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    // Расчет ежемесячного платежа
    useEffect(() => {
        const principal = price - downPayment;
        const monthlyRate = 0.15 / 12; // 15% годовых
        const numberOfPayments = years * 12;

        const payment = principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        setMonthlyPayment(Math.round(payment));
    }, [price, downPayment, years]);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    return (
        <section className={styles.calculatorSection}>
            <div className={styles.container}>
                <div className={styles.calculatorContent}>
                    <div className={styles.leftSide}>
                        <h2 className={styles.title}>Калькулятор ипотеки и рассрочки</h2>
                        <p className={styles.subtitle}>
                            Рассчитайте ваш ежемесячный платеж и подайте заявку на
                            консультацию, чтобы узнать о лучших условиях для вас.
                        </p>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Стоимость недвижимости, ₸
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className={styles.input}
                            />
                            <input
                                type="range"
                                min="5000000"
                                max="100000000"
                                step="1000000"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Первоначальный взнос, ₸
                            </label>
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className={styles.input}
                            />
                            <input
                                type="range"
                                min="0"
                                max={price * 0.5}
                                step="500000"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Срок кредита, лет
                            </label>
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className={styles.input}
                            />
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>
                    </div>

                    <div className={styles.rightSide}>
                        <div className={styles.resultCard}>
                            <p className={styles.resultLabel}>Ежемесячный платеж</p>
                            <h3 className={styles.resultAmount}>
                                {formatNumber(monthlyPayment)} ₸
                            </h3>
                            <p className={styles.resultNote}>
                                Расчет является предварительным. Точные условия уточняйте у
                                менеджера.
                            </p>
                            <button className={styles.consultButton}>
                                Оставить заявку на консультацию
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MortgageCalculator;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MasterPlanTemplates } from './MasterPlanTemplates';
import styles from '../../styles/ComplexDetail.module.scss';

const MasterPlan = ({ blockCount = 1, complexId, buildings = [] }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Ограничиваем количество блоков от 1 до 10
    const validBlockCount = Math.max(1, Math.min(10, blockCount));

    // Получаем соответствующий шаблон
    const Template = MasterPlanTemplates[validBlockCount];

    const handleBlockClick = (blockNumber) => {
        console.log('=== КЛИК НА БЛОК ===');
        console.log('Номер блока:', blockNumber);
        console.log('Все buildings:', buildings);

        // Находим building по номеру блока (blockNumber - это порядковый номер от 1 до N)
        // buildings должны быть отсортированы по порядку
        const building = buildings[blockNumber - 1]; // -1 потому что массив с 0

        console.log('Найденный building:', building);

        if (building && building.id) {
            console.log(`Переход на /buildings/${building.id}`);
            // Переход на страницу блока с реальным ID из базы
            navigate(`/buildings/${building.id}`);
        } else {
            console.warn(`Building not found for block number ${blockNumber}`);
            console.log(`Fallback: переход на /buildings/${blockNumber}`);
            // Fallback: используем blockNumber как ID (на случай если buildings не загружены)
            navigate(`/buildings/${blockNumber}`);
        }
    };

    return (
        <section className={styles.masterPlanSection}>
            <h2 className={styles.sectionTitle}>{t('complex.masterplan')}</h2>

            <div className={styles.masterPlanContainer}>
                <div className={styles.planWrapper}>
                    <div
                        className={styles.planSvgContainer}
                        onClick={(e) => {
                            const building = e.target.closest('.building');
                            if (building) {
                                const blockNum = parseInt(building.getAttribute('data-block'));
                                handleBlockClick(blockNum);
                            }
                        }}
                    >
                        <Template blockCount={validBlockCount} />
                    </div>

                    <div className={styles.planLegend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ background: '#d4c5b9' }}></div>
                            <span>{t('complex.residentialBlocks')} ({validBlockCount})</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ background: '#7cb342' }}></div>
                            <span>{t('complex.greenZones')}</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ background: '#9e9e9e' }}></div>
                            <span>{t('complex.roads')}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.planHint}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M8 4V8M8 10V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {t('complex.clickBlockHint')}
                </div>
            </div>
        </section>
    );
};

export default MasterPlan;
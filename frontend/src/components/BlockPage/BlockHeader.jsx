import React from 'react';
import styles from '../../styles/BlockPage.module.scss';

const BlockHeader = ({ complexName = 'ЖК', blockName = 'Блок' }) => {
    return (
        <div className={styles.blockHeader}>
            <div className={styles.breadcrumbs}>
                <span>Главная</span> / <span>Жилые Комплексы</span> / <span>{complexName}</span> / <span>{blockName}</span>
            </div>
            <div className={styles.headerContent}>
                <h1>{blockName}</h1>
                <button className={styles.requestButton}>Оставить заявку</button>
            </div>
        </div>
    );
};

export default BlockHeader;
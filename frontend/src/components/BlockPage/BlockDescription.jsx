import React from 'react';
import styles from '../../styles/BlockPage.module.scss';

const BlockDescription = ({ description = 'Описание недоступно' }) => {
    return (
        <div className={styles.description}>
            <h2>Описание</h2>
            <p>{description}</p>
        </div>
    );
};

export default BlockDescription;
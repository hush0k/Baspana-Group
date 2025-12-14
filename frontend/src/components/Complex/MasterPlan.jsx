import React, { useState } from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const MasterPlan = ({ masterPlanImage, buildings }) => {
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    return (
        <section className={styles.masterPlanSection}>
            <h2 className={styles.sectionTitle}>Генеральный план</h2>

            <div className={styles.masterPlanContainer}>
                <div className={styles.planImageWrapper}>
                    <img
                        src={masterPlanImage || '/placeholder-plan.jpg'}
                        alt="Генеральный план"
                        className={styles.planImage}
                    />

                    {/* Интерактивные точки для корпусов */}
                    {buildings && buildings.map((building) => (
                        <div
                            key={building.id}
                            className={styles.buildingMarker}
                            style={{
                                left: `${building.x || 50}%`,
                                top: `${building.y || 50}%`
                            }}
                            onClick={() => setSelectedBuilding(building)}
                        >
                            {building.block}
                        </div>
                    ))}
                </div>

                <div className={styles.planHint}>
                    Наведите на блок, чтобы увидеть название. Нажмите, чтобы посмотреть доступные квартиры.
                </div>
            </div>

            {selectedBuilding && (
                <div className={styles.buildingInfo}>
                    <h3>Корпус {selectedBuilding.block}</h3>
                    <p>{selectedBuilding.description}</p>
                </div>
            )}
        </section>
    );
};

export default MasterPlan;
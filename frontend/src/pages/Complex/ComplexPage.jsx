import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/ComplexPage.module.scss';

const ComplexPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complex, setComplex] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Загрузка ЖК
                const complexRes = await fetch(`http://localhost:8000/api/residential-complexes/${id}`);
                const complexData = await complexRes.json();
                setComplex(complexData);

                // Загрузка блоков
                const blocksRes = await fetch(`http://localhost:8000/api/blocks?residential_complex_id=${id}`);
                const blocksData = await blocksRes.json();
                setBlocks(blocksData.results || blocksData);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (!complex) return <div className={styles.error}>ЖК не найден</div>;

    const images = complex.images || [complex.main_image];

    return (
        <div className={styles.complexPage}>
            {/* Галерея */}
            <section className={styles.gallery}>
                <div className={styles.mainImage}>
                    <img
                        src={images[selectedImage] || '/placeholder.jpg'}
                        alt={complex.name}
                    />
                </div>
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt=""
                            className={selectedImage === idx ? styles.active : ''}
                            onClick={() => setSelectedImage(idx)}
                        />
                    ))}
                    <button className={styles.allPhotos}>📷 Все фото</button>
                </div>
            </section>

            {/* Основная информация */}
            <section className={styles.mainInfo}>
                <h1 className={styles.title}>ЖК '{complex.name}'</h1>
                <p className={styles.address}>📍 {complex.city}, {complex.address}</p>

                <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>от</span>
                    <span className={styles.price}>{complex.min_price?.toLocaleString()} ₸</span>
                </div>

                <div className={styles.deadline}>
                    Срок сдачи: {complex.construction_end ? new Date(complex.construction_end).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : 'Уточняйте'}
                </div>

                <p className={styles.description}>{complex.description}</p>

                {/* Особенности */}
                <div className={styles.features}>
                    {complex.features?.secured_area && (
                        <div className={styles.feature}>
                            <span className={styles.icon}>🔒</span>
                            <span>Закрытый двор</span>
                        </div>
                    )}
                    {complex.features?.underground_parking && (
                        <div className={styles.feature}>
                            <span className={styles.icon}>🅿️</span>
                            <span>Подземный паркинг</span>
                        </div>
                    )}
                    {complex.features?.recreation_area && (
                        <div className={styles.feature}>
                            <span className={styles.icon}>🌳</span>
                            <span>Зона отдыха</span>
                        </div>
                    )}
                    {complex.features?.business_class && (
                        <div className={styles.feature}>
                            <span className={styles.icon}>🏢</span>
                            <span>Бизнес-класс</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Выбор блока */}
            <section className={styles.blocksSection}>
                <h2>Выберите ваш блок</h2>
                {blocks.length > 0 ? (
                    <div className={styles.blocksList}>
                        {blocks.map(block => (
                            <div
                                key={block.id}
                                className={styles.blockCard}
                                onClick={() => navigate(`/blocks/${block.id}`)}
                            >
                                <div className={styles.blockName}>Блок №{block.block_number || block.name}</div>
                                <div className={styles.blockInfo}>
                                    <div>Этажей: {block.total_floors}</div>
                                    <div>Квартир: {block.total_apartments}</div>
                                </div>
                                <button className={styles.blockButton}>Посмотреть квартиры</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noBlocks}>
                        <div className={styles.genplan}>
                            <img src="/genplan.jpg" alt="Генплан" />
                            <p>Нажмите на блок, чтобы посмотреть доступные квартиры</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Инфраструктура */}
            <section className={styles.infrastructure}>
                <h2>Инфраструктура поблизости</h2>
                <div className={styles.infraGrid}>
                    {complex.infrastructure?.education && (
                        <div className={styles.infraItem}>
                            <span className={styles.infraIcon}>🎓</span>
                            <div>
                                <strong>Образование</strong>
                                <p>{complex.infrastructure.education.join(', ')}</p>
                            </div>
                        </div>
                    )}
                    {complex.infrastructure?.shopping && (
                        <div className={styles.infraItem}>
                            <span className={styles.infraIcon}>🛒</span>
                            <div>
                                <strong>Покупки и развлечения</strong>
                                <p>{complex.infrastructure.shopping.join(', ')}</p>
                            </div>
                        </div>
                    )}
                    {complex.infrastructure?.parks && (
                        <div className={styles.infraItem}>
                            <span className={styles.infraIcon}>🌳</span>
                            <div>
                                <strong>Парки и отдых</strong>
                                <p>{complex.infrastructure.parks.join(', ')}</p>
                            </div>
                        </div>
                    )}
                    {complex.infrastructure?.healthcare && (
                        <div className={styles.infraItem}>
                            <span className={styles.infraIcon}>🏥</span>
                            <div>
                                <strong>Здоровье</strong>
                                <p>{complex.infrastructure.healthcare.join(', ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Консультация */}
            <section className={styles.consultation}>
                <h2>Заинтересовались покупкой?</h2>
                <p>Оставьте свой номер, и наш менеджер свяжется с вами для подробной консультации</p>
                <div className={styles.consultForm}>
                    <input type="tel" placeholder="+7 (___) ___-__-__" />
                    <button>Получить консультацию</button>
                </div>
            </section>
        </div>
    );
};

export default ComplexPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import ComplexHero from '../../components/Complex/ComplexHero';
import ComplexInfo from '../../components/Complex/ComplexInfo';
import ComplexFeatures from '../../components/Complex/ComplexFeatures';
import ComplexGallery from '../../components/Complex/ComplexGallery';
import MasterPlan from '../../components/Complex/MasterPlan';
import ComplexInfrastructure from '../../components/Complex/ComplexInfrastructure';
import ContactForm from '../../components/Complex/ContactForm';
import complexService from '../../services/ComplexService';
import imageService from '../../services/ImageService';
import buildingService from '../../services/BuildingService';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complex, setComplex] = useState(null);
    const [images, setImages] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadComplexData();
    }, [id]);

    const loadComplexData = async () => {
        try {
            setLoading(true);

            // Загружаем данные комплекса
            const complexData = await complexService.getComplexById(id);
            setComplex(complexData);

            // Загружаем изображения комплекса
            const imagesData = await imageService.getImages(id, 'Residential complex');
            setImages(imagesData);

            // Загружаем корпуса комплекса
            const buildingsData = await buildingService.getBuildings({
                complex_id: id,
                limit: 100
            });
            setBuildings(buildingsData.results || []);

            setLoading(false);
        } catch (err) {
            console.error('Error loading complex:', err);
            setError('Не удалось загрузить данные комплекса');
            setLoading(false);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error || !complex) {
        return (
            <div className={styles.errorContainer}>
                <h2>Ошибка загрузки</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/projects')}>Вернуться к проектам</button>
            </div>
        );
    }

    // Используем главную картинку из модели комплекса
    const mainImage = complex.main_image || (images.length > 0 ? images[0].img_url : null);

    return (
        <div className={styles.pageWrapper}>
            <HeaderBlack />

            <main className={styles.mainContent}>
                <ComplexHero complex={complex} mainImage={mainImage} />

                <div className={styles.container}>
                    {/* Навигация по секциям */}
                    <nav className={styles.sectionNav}>
                        <button onClick={() => scrollToSection('about')}>О комплексе</button>
                        <button onClick={() => scrollToSection('gallery')}>Галерея</button>
                        <button onClick={() => scrollToSection('masterplan')}>Генплан</button>
                        <button onClick={() => scrollToSection('infrastructure')}>Инфраструктура</button>
                    </nav>

                    <div id="about">
                        <ComplexInfo complex={complex} />
                        <ComplexFeatures complex={complex} />
                    </div>

                    <div id="gallery">
                        <ComplexGallery images={images} />
                    </div>

                    <div id="masterplan">
                        <MasterPlan
                            blockCount={complex.block_counts}
                            buildings={buildings}
                            complexId={complex.id}
                        />
                    </div>

                    <div id="infrastructure">
                        <ComplexInfrastructure
                            latitude={complex.latitude}
                            longitude={complex.longitude}
                            complexName={complex.name}
                        />
                    </div>

                    <ContactForm />
                </div>
            </main>

            <FooterBlack />
        </div>
    );
};

export default ComplexDetailPage;
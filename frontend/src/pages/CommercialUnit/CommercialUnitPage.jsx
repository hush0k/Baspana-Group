import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApartmentGallery from '../../components/ApartmentPage/ApartmentGallery';
import ApartmentHeader from '../../components/ApartmentPage/ApartmentHeader';
import ApartmentDescription from '../../components/ApartmentPage/ApartmentDescription';
import ApartmentCharacteristics from '../../components/ApartmentPage/ApartmentCharacteristics';
import commercialUnitService from '../../services/CommercialUnitService';
import imageService from '../../services/ImageService';
import styles from '../../styles/ApartmentPage.module.scss';

const CommercialUnitPage = () => {
    const { unitId } = useParams();
    const [commercialUnit, setCommercialUnit] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommercialUnit = async () => {
            try {
                console.log('Fetching commercial unit with ID:', unitId);

                // Загружаем данные коммерческого помещения
                const data = await commercialUnitService.getCommercialUnitById(unitId);
                console.log('Commercial unit data received:', data);

                // Адаптируем данные для совместимости с компонентами квартиры
                const adaptedData = {
                    ...data,
                    number: data.unit_number,
                    apartment_area: data.unit_area,
                    apartment_type: data.commercial_type,
                    // Мапим тип помещения для отображения
                    typeLabel: getCommercialTypeLabel(data.commercial_type)
                };

                setCommercialUnit(adaptedData);

                // Загружаем изображения коммерческого помещения
                const imagesData = await imageService.getImages(unitId, 'Commercial');
                console.log('Images received:', imagesData);
                setImages(imagesData || []);
            } catch (error) {
                console.error('Error fetching commercial unit:', error);
                console.error('Error details:', error.response?.data);
                console.error('Error status:', error.response?.status);
            } finally {
                setLoading(false);
            }
        };

        if (unitId) {
            fetchCommercialUnit();
        }
    }, [unitId]);

    const getCommercialTypeLabel = (type) => {
        const typeMap = {
            'Office': 'Офис',
            'Shop': 'Магазин',
            'Restaurant': 'Ресторан',
            'Warehouse': 'Склад',
            'Other': 'Другое'
        };
        return typeMap[type] || type;
    };

    if (loading) return <div>Загрузка...</div>;
    if (!commercialUnit) return <div>Коммерческое помещение не найдено</div>;

    return (
        <div className={styles.apartmentPage}>
            <Header />

            <main className={styles.content}>
                <div className={styles.mainSection}>
                    <ApartmentGallery images={images} />
                    <ApartmentHeader
                        apartment={commercialUnit}
                        isCommercial={true}
                    />
                </div>

                <ApartmentDescription
                    description={commercialUnit.description}
                    apartment={commercialUnit}
                    isCommercial={true}
                />
                <ApartmentCharacteristics
                    apartment={commercialUnit}
                    isCommercial={true}
                />
            </main>

            <Footer />
        </div>
    );
};

export default CommercialUnitPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApartmentGallery from '../../components/ApartmentPage/ApartmentGallery';
import ApartmentHeader from '../../components/ApartmentPage/ApartmentHeader';
import ApartmentDescription from '../../components/ApartmentPage/ApartmentDescription';
import ApartmentCharacteristics from '../../components/ApartmentPage/ApartmentCharacteristics';
import apartmentService from '../../services/ApartmentService';
import imageService from '../../services/ImageService';
import styles from '../../styles/ApartmentPage.module.scss';

const ApartmentPage = () => {
    const { apartmentId } = useParams();
    const [apartment, setApartment] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                console.log('Fetching apartment with ID:', apartmentId);

                // Загружаем данные квартиры
                const data = await apartmentService.getApartmentById(apartmentId);
                console.log('Apartment data received:', data);
                setApartment(data);

                // Загружаем изображения квартиры
                const imagesData = await imageService.getImages(apartmentId, 'Apartment');
                console.log('Images received:', imagesData);
                setImages(imagesData || []);
            } catch (error) {
                console.error('Error fetching apartment:', error);
                console.error('Error details:', error.response?.data);
                console.error('Error status:', error.response?.status);
            } finally {
                setLoading(false);
            }
        };

        if (apartmentId) {
            fetchApartment();
        }
    }, [apartmentId]);

    if (loading) return <div>Загрузка...</div>;
    if (!apartment) return <div>Квартира не найдена</div>;

    return (
        <div className={styles.apartmentPage}>
            <Header />

            <main className={styles.content}>
                <div className={styles.mainSection}>
                    <ApartmentGallery images={images} />
                    <ApartmentHeader apartment={apartment} />
                </div>

                <ApartmentDescription description={apartment.description} apartment={apartment} />
                <ApartmentCharacteristics apartment={apartment} />
            </main>

            <Footer />
        </div>
    );
};

export default ApartmentPage;
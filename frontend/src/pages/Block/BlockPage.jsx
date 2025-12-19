import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlockHeader from '../../components/BlockPage/BlockHeader';
import BlockGallery from '../../components/BlockPage/BlockGallery';
import ApartmentSelector from '../../components/BlockPage/ApartmentSelector';
import BlockDescription from '../../components/BlockPage/BlockDescription';
import BlockCharacteristics from '../../components/BlockPage/BlockCharacteristics';
import ReviewBlock from '../../components/Review/ReviewBlock';
import { getBlockById } from '../../services/BlockService';
import imageService from '../../services/ImageService';
import apartmentService from '../../services/ApartmentService';
import complexService from '../../services/ComplexService';
import styles from '../../styles/BlockPage.module.scss';

const BlockPage = () => {
    const { blockId } = useParams();
    const [blockData, setBlockData] = useState(null);
    const [images, setImages] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [complexName, setComplexName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlockData = async () => {
            try {
                // Загружаем данные блока
                const data = await getBlockById(blockId);
                setBlockData(data);

                // Загружаем изображения блока
                const imagesData = await imageService.getImages(blockId, 'Building');
                setImages(imagesData || []);

                // Загружаем квартиры блока
                const apartmentsData = await apartmentService.getApartments({
                    building_id: blockId,
                    limit: 1000
                });
                setApartments(apartmentsData.results || []);

                // Загружаем название ЖК
                if (data.residential_complex_id) {
                    const complexData = await complexService.getComplexes({
                        id: data.residential_complex_id
                    });
                    if (complexData.results && complexData.results.length > 0) {
                        setComplexName(complexData.results[0].name);
                    }
                }
            } catch (error) {
                console.error('Error fetching block:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockData();
    }, [blockId]);

    if (loading) return <div>Загрузка...</div>;
    if (!blockData) return <div>Блок не найден</div>;

    return (
        <div className={styles.blockPage}>
            <Header />

            <main className={styles.content}>
                <BlockHeader
                    complexName={complexName}
                    blockName={`Блок ${blockData.block}`}
                />

                <div className={styles.mainSection}>
                    <BlockGallery images={images} />
                    <ApartmentSelector
                        apartments={apartments}
                        buildingData={blockData}
                    />
                </div>

                <BlockDescription description={blockData.description || blockData.short_description} />
                <BlockCharacteristics characteristics={{
                    floors: blockData.floor_count,
                    apartments: blockData.apartments_count,
                    commercials: blockData.commercials_count,
                    parking: blockData.parking_count,
                    elevators: blockData.elevators_count,
                    area: blockData.gross_area,
                    status: blockData.status
                }} />

                {blockData.residential_complex_id && (
                    <ReviewBlock complexId={blockData.residential_complex_id} />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlockPage;
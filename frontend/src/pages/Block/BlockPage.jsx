import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlockHeader from '../../components/BlockPage/BlockHeader';
import BlockGallery from '../../components/BlockPage/BlockGallery';
import ApartmentSelector from '../../components/BlockPage/ApartmentSelector';
import BlockDescription from '../../components/BlockPage/BlockDescription';
import BlockCharacteristics from '../../components/BlockPage/BlockCharacteristics';
import { getBlockById } from '../../services/BlockService';
import styles from '../../styles/BlockPage.module.scss';

const BlockPage = () => {
    const { blockId } = useParams();
    const [blockData, setBlockData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlockData = async () => {
            try {
                const data = await getBlockById(blockId);
                setBlockData(data);
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
                    complexName={blockData.complex_name}
                    blockName={blockData.name}
                />

                <div className={styles.mainSection}>
                    <BlockGallery images={blockData.images} />
                    <ApartmentSelector
                        apartments={blockData.apartments}
                        floors={blockData.floor_range}
                        rooms={blockData.room_options}
                    />
                </div>

                <BlockDescription description={blockData.description} />
                <BlockCharacteristics characteristics={blockData.characteristics} />
            </main>

            <Footer />
        </div>
    );
};

export default BlockPage;
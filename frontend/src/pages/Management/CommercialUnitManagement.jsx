import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import commercialUnitService from '../../services/CommercialUnitService';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import CreateCommercialUnitModal from '../../components/Modal/CreateCommercialUnitModal';
import EditCommercialUnitModal from '../../components/Modal/EditCommercialUnitModal';
import ViewCommercialUnitModal from '../../components/Modal/ViewCommercialUnitModal';
import styles from '../../styles/ComplexManagement.module.scss';

const CommercialUnitManagement = () => {
  const navigate = useNavigate();
  const [commercialUnits, setCommercialUnits] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [complexFilter, setComplexFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'Free', label: 'Свободно', color: '#10b981' },
    { value: 'Booked', label: 'Забронировано', color: '#f59e0b' },
    { value: 'Sold', label: 'Продано', color: '#6b7280' }
  ];

  useEffect(() => {
    fetchCurrentUser();
    fetchComplexes();
    fetchBuildings();
    fetchCommercialUnits();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  const fetchComplexes = async () => {
    try {
      const data = await complexService.getComplexes({
        sort_by: 'name',
        order_by: 'asc',
        limit: 1000
      });
      setComplexes(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки комплексов:', error);
    }
  };

  const fetchBuildings = async () => {
    try {
      const data = await buildingService.getBuildings({
        sort_by: 'block',
        order_by: 'asc',
        limit: 1000
      });
      setBuildings(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки блоков:', error);
    }
  };

  const fetchCommercialUnits = async () => {
    setLoading(true);
    try {
      const data = await commercialUnitService.getCommercialUnits({
        sort_by: 'number',
        order_by: 'asc',
        limit: 1000
      });
      setCommercialUnits(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки коммерческих помещений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это коммерческое помещение?')) {
      try {
        await commercialUnitService.deleteCommercialUnit(id);
        fetchCommercialUnits();
      } catch (error) {
        console.error('Ошибка удаления коммерческого помещения:', error);
        alert('Ошибка при удалении коммерческого помещения');
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedUnitId(id);
    setIsEditModalOpen(true);
  };

  const handleView = (id) => {
    setSelectedUnitId(id);
    setIsViewModalOpen(true);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'Free': 'Свободно',
      'Booked': 'Забронировано',
      'Sold': 'Продано'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || '#6b7280';
  };

  const getBuildingName = (buildingId) => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? `Блок ${building.block}` : `Блок #${buildingId}`;
  };

  // Фильтрованные блоки по выбранному ЖК
  const filteredBuildings = complexFilter === ''
    ? buildings
    : buildings.filter(building => String(building.residential_complex_id) === complexFilter);

  // Обработчик изменения ЖК - сбрасывать выбранный блок
  const handleComplexChange = (e) => {
    setComplexFilter(e.target.value);
    setBuildingFilter(''); // Сбросить выбранный блок при смене ЖК
  };

  // Фильтрация коммерческих помещений
  const filteredUnits = commercialUnits.filter(unit => {
    const matchesSearch = searchTerm === '' ||
      String(unit.number).includes(searchTerm);

    const matchesStatus = statusFilter === '' || unit.status === statusFilter;

    // Проверка на соответствие блоку
    const matchesBuilding = buildingFilter === '' || String(unit.building_id) === buildingFilter;

    // Проверка на соответствие ЖК (через building.residential_complex_id)
    let matchesComplex = true;
    if (complexFilter !== '') {
      const building = buildings.find(b => b.id === unit.building_id);
      matchesComplex = building && String(building.residential_complex_id) === complexFilter;
    }

    return matchesSearch && matchesStatus && matchesBuilding && matchesComplex;
  });

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoText}>Baspana Group</span>
          <span className={styles.logoSubtext}>Панель Менеджера</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem} onClick={() => navigate('/complex-management')}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Жилые Комплексы</span>
          </div>

          <div className={styles.navItem} onClick={() => navigate('/buildings-management')}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Блоки</span>
          </div>

          <div className={styles.navItem} onClick={() => navigate('/apartment-management')}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 2V6M15 2V6M4 10H20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Квартиры</span>
          </div>

          <div className={styles.navItem} onClick={() => navigate('/promotions-management')}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Акции</span>
          </div>

          <div className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 21H21M3 7L12 2L21 7V21H3V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V14H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span>Коммерческое помещение</span>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.profileSection}>
            <div className={styles.profileIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21V19C6 17.3431 7.34315 16 9 16H15C16.6569 16 18 17.3431 18 19V21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span>
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Загрузка...'}
            </span>
          </div>

          <div className={styles.logoutSection} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Выход</span>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <h1 className={styles.pageTitle}>Управление коммерческими помещениями</h1>
          <div className={styles.headerIcons}>
            <button className={styles.iconButton} onClick={() => navigate('/profile')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 18.5C7 16.567 9.23858 15 12 15C14.7614 15 17 16.567 17 18.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.contentArea}>
          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Поиск по номеру помещения..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={complexFilter}
              onChange={handleComplexChange}
              className={styles.filterSelect}
            >
              <option value="">Все ЖК</option>
              {complexes.map(complex => (
                <option key={complex.id} value={complex.id}>
                  {complex.name}
                </option>
              ))}
            </select>

            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Все блоки</option>
              {filteredBuildings.map(building => (
                <option key={building.id} value={building.id}>
                  Блок {building.block}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
              <span>+ Создать помещение</span>
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : filteredUnits.length === 0 ? (
            <div className={styles.loading}>Коммерческие помещения не найдены</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>№ ПОМЕЩЕНИЯ</th>
                    <th>БЛОК</th>
                    <th>ЭТАЖ</th>
                    <th>ПЛОЩАДЬ</th>
                    <th>ЦЕНА ЗА М²</th>
                    <th>ОБЩАЯ ЦЕНА</th>
                    <th>СТАТУС</th>
                    <th>ДЕЙСТВИЯ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" />
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {unit.number}
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {getBuildingName(unit.building_id)}
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {unit.floor}
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {unit.unit_area} м²
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {unit.price_per_sqr ? unit.price_per_sqr.toLocaleString() : '—'} ₸
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {unit.total_price ? unit.total_price.toLocaleString() : '—'} ₸
                      </td>
                      <td
                        onClick={() => handleView(unit.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span style={{
                          backgroundColor: getStatusColor(unit.status),
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {getStatusLabel(unit.status)}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} onClick={() => handleEdit(unit.id)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className={styles.actionBtn} onClick={() => handleDelete(unit.id)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M3 5H17M8 9V15M12 9V15M4 5L5 17C5 18.1046 5.89543 19 7 19H13C14.1046 19 15 18.1046 15 17L16 5M7 5V3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <p>Адрес: Город Алматы, Толе би 59</p>
            <p>Тел: +77757813549</p>
          </div>
          <div className={styles.footerRight}>
            <p>Копирайт 2025 Baspana Group</p>
          </div>
        </footer>
      </main>

      {/* Модальные окна */}
      <CreateCommercialUnitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCommercialUnits}
      />

      <EditCommercialUnitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchCommercialUnits}
        commercialUnitId={selectedUnitId}
      />

      <ViewCommercialUnitModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        commercialUnitId={selectedUnitId}
      />
    </div>
  );
};

export default CommercialUnitManagement;

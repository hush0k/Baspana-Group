import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import api from '../../services/api';
import styles from '../../styles/BuildingsManagement.module.scss';

const BuildingsManagement = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [residentialComplexes, setResidentialComplexes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    residential_complex_id: '',
    block: '',
    description: '',
    floor_count: '',
    apartments_count: '',
    commercials_count: '',
    parking_count: '',
    gross_area: '',
    elevators_count: '',
    status: 'Project',
    construction_start: '',
    construction_end: ''
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Project', label: 'Проект', color: '#f59e0b' },
    { value: 'Under Construction', label: 'Строится', color: '#3b82f6' },
    { value: 'Completed', label: 'Сдан', color: '#10b981' }
  ];

  const cityOptions = [
    'Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe', 'Taraz',
    'Pavlodar', 'Oskemen', 'Semey', 'Kostanay', 'Kyzylorda', 'Atyrau',
    'Oral', 'Petropavl', 'Turkistan'
  ];

  useEffect(() => {
    fetchCurrentUser();
    fetchResidentialComplexes();
    fetchBuildings();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  const fetchResidentialComplexes = async () => {
    try {
      const data = await complexService.getComplexes({ sort_by: 'name', order: 'asc' });
      setResidentialComplexes(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки ЖК:', error);
    }
  };

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await buildingService.getBuildings({ sort_by: 'name', order: 'asc' });
      setBuildings(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки блоков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (building = null) => {
    if (building) {
      setEditingBuilding(building);
      setFormData({
        residential_complex_id: building.residential_complex_id,
        block: building.block,
        description: building.description || '',
        floor_count: building.floor_count,
        apartments_count: building.apartments_count,
        commercials_count: building.commercials_count,
        parking_count: building.parking_count,
        gross_area: building.gross_area,
        elevators_count: building.elevators_count,
        status: building.status || 'Project',
        construction_start: building.construction_start || '',
        construction_end: building.construction_end || ''
      });
    } else {
      setEditingBuilding(null);
      setFormData({
        residential_complex_id: '',
        block: '',
        description: '',
        floor_count: '',
        apartments_count: '',
        commercials_count: '',
        parking_count: '',
        gross_area: '',
        elevators_count: '',
        status: 'Project',
        construction_start: '',
        construction_end: ''
      });
    }
    setShowModal(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBuilding(null);
    setFormData({
      residential_complex_id: '',
      block: '',
      description: '',
      floor_count: '',
      apartments_count: '',
      commercials_count: '',
      parking_count: '',
      gross_area: '',
      elevators_count: '',
      status: 'Project',
      construction_start: '',
      construction_end: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.residential_complex_id) newErrors.residential_complex_id = 'Выберите ЖК';
    if (!formData.block || formData.block < 1) newErrors.block = 'Введите номер блока';
    if (!formData.description.trim()) newErrors.description = 'Введите описание';
    if (!formData.floor_count || formData.floor_count < 1) newErrors.floor_count = 'Введите количество этажей';
    if (!formData.apartments_count || formData.apartments_count < 0) newErrors.apartments_count = 'Введите количество квартир';
    if (!formData.commercials_count || formData.commercials_count < 0) newErrors.commercials_count = 'Введите количество коммерческих помещений';
    if (!formData.parking_count || formData.parking_count < 0) newErrors.parking_count = 'Введите количество парковочных мест';
    if (!formData.gross_area || formData.gross_area < 0) newErrors.gross_area = 'Введите общую площадь';
    if (!formData.elevators_count || formData.elevators_count < 0) newErrors.elevators_count = 'Введите количество лифтов';
    if (!formData.construction_start) newErrors.construction_start = 'Выберите дату начала строительства';
    if (!formData.construction_end) newErrors.construction_end = 'Выберите дату окончания строительства';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const buildingData = {
        residential_complex_id: parseInt(formData.residential_complex_id),
        block: parseInt(formData.block),
        description: formData.description,
        floor_count: parseInt(formData.floor_count),
        apartments_count: parseInt(formData.apartments_count),
        commercials_count: parseInt(formData.commercials_count),
        parking_count: parseInt(formData.parking_count),
        gross_area: parseFloat(formData.gross_area),
        elevators_count: parseInt(formData.elevators_count),
        status: formData.status,
        construction_start: formData.construction_start,
        construction_end: formData.construction_end
      };

      if (editingBuilding) {
        await buildingService.updateBuilding(editingBuilding.id, buildingData);
      } else {
        await buildingService.createBuilding(buildingData);
      }

      fetchBuildings();
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка сохранения блока:', error);
      setErrors({ submit: 'Ошибка сохранения данных' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот блок?')) return;

    try {
      await buildingService.deleteBuilding(id);
      fetchBuildings();
    } catch (error) {
      console.error('Ошибка удаления блока:', error);
    }
  };

  const getComplexName = (complexId) => {
    const complex = residentialComplexes.find(rc => rc.id === complexId);
    return complex ? complex.name : '-';
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return {
      backgroundColor: option ? option.color : '#6b7280',
      color: '#fff',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500'
    };
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = (building.block && building.block.toString().includes(searchTerm)) ||
      (building.description && building.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || building.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalApartments = (building) => {
    return building.apartments_count || 0;
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoText}>Baspana Group</span>
          <span className={styles.logoSubtext}>Панель Менеджера</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Жилые Комплексы</span>
          </div>

          <div className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Блоки</span>
          </div>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 2V6M15 2V6M4 10H20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Квартиры</span>
          </div>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Коммерческие помещения</span>
          </div>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Настройки</span>
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

          <div className={styles.logoutSection}>
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
          <h1 className={styles.pageTitle}>Панель управления</h1>
          <div className={styles.headerIcons}>
            <button className={styles.iconButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className={styles.iconButton}>
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
                placeholder="Поиск по названию или адресу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Статус</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Город</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select className={styles.filterSelect}>
              <option value="">Дата сдачи</option>
            </select>

            <button className={styles.createButton} onClick={() => handleOpenModal()}>
              <span className={styles.createIcon}>+</span>
              Создать Блок
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>НАЗВАНИЕ</th>
                  <th>АДРЕС</th>
                  <th>СТАТУС</th>
                  <th>БЛОКИ</th>
                  <th>ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyRow}>Загрузка...</td>
                  </tr>
                ) : filteredBuildings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyRow}>Блоки не найдены</td>
                  </tr>
                ) : (
                  filteredBuildings.map((building) => (
                    <tr key={building.id}>
                      <td><input type="checkbox" /></td>
                      <td className={styles.nameCell}>{building.name}</td>
                      <td>{building.address || '-'}</td>
                      <td>
                        <span style={getStatusStyle(building.status || 'available')}>
                          {getStatusLabel(building.status || 'available')}
                        </span>
                      </td>
                      <td>{totalApartments(building)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleOpenModal(building)}
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M13 2L16 5L6 15H3V12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(building.id)}
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M3 5H15M14 5L13 15H5L4 5M7 3H11M7 8V12M11 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className={styles.tableFooter}>
            <div className={styles.footerLeft}>
              Адрес: Город Алматы, Толе би 59<br />
              Тел: +77757813549
            </div>
            <div className={styles.footerRight}>
              Копирайт 2025 Baspana Group
            </div>
          </footer>
        </div>
      </main>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingBuilding ? 'Редактировать блок' : 'Создать блок'}</h2>
              <button className={styles.closeModal} onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Жилой комплекс *</label>
                <select
                  name="residential_complex_id"
                  value={formData.residential_complex_id}
                  onChange={handleInputChange}
                  className={errors.residential_complex_id ? styles.error : ''}
                >
                  <option value="">Выберите ЖК</option>
                  {residentialComplexes.map(rc => (
                    <option key={rc.id} value={rc.id}>{rc.name}</option>
                  ))}
                </select>
                {errors.residential_complex_id && (
                  <span className={styles.errorText}>{errors.residential_complex_id}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Название блока *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Блок А"
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Адрес</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="ул. Абая, 10, Алматы"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Подъезды *</label>
                  <input
                    type="number"
                    name="number_of_entrances"
                    value={formData.number_of_entrances}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="4"
                    className={errors.number_of_entrances ? styles.error : ''}
                  />
                  {errors.number_of_entrances && (
                    <span className={styles.errorText}>{errors.number_of_entrances}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Этажей *</label>
                  <input
                    type="number"
                    name="floors_per_entrance"
                    value={formData.floors_per_entrance}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="16"
                    className={errors.floors_per_entrance ? styles.error : ''}
                  />
                  {errors.floors_per_entrance && (
                    <span className={styles.errorText}>{errors.floors_per_entrance}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Статус</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingBuilding ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingsManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CreateComplexModal from '../../components/Modal/CreateComplexModal';
import EditComplexModal from '../../components/Modal/EditComplexModal';
import ViewComplexModal from '../../components/Modal/ViewComplexModal';
import styles from '../../styles/ComplexManagement.module.scss';

// Временный сервис (потом заменим на импорт)
const complexService = {
  getComplexes: async (params = {}) => {
    try {
      const response = await api.get('/complexes/', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка получения комплексов:', error);
      throw error;
    }
  },
  deleteComplex: async (id) => {
    try {
      const response = await api.delete(`/complexes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка удаления комплекса:', error);
      throw error;
    }
  }
};

const ComplexManagement = () => {
  const navigate = useNavigate();
  const [complexes, setComplexes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComplexId, setSelectedComplexId] = useState(null);

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'Project', label: 'Проект', color: '#f59e0b' },
    { value: 'Under Construction', label: 'Строится', color: '#3b82f6' },
    { value: 'Completed', label: 'Сдан', color: '#6b7280' }
  ];

  const cityOptions = [
    { value: '', label: 'Все города' },
    { value: 'Almaty', label: 'Алматы' },
    { value: 'Astana', label: 'Астана' },
    { value: 'Shymkent', label: 'Шымкент' },
    { value: 'Karaganda', label: 'Караганда' },
    { value: 'Aktobe', label: 'Актобе' },
    { value: 'Taraz', label: 'Тараз' },
    { value: 'Pavlodar', label: 'Павлодар' },
    { value: 'Oskemen', label: 'Усть-Каменогорск' },
    { value: 'Semey', label: 'Семей' },
    { value: 'Kostanay', label: 'Костанай' },
    { value: 'Kyzylorda', label: 'Кызылорда' },
    { value: 'Atyrau', label: 'Атырау' },
    { value: 'Oral', label: 'Уральск' },
    { value: 'Petropavl', label: 'Петропавловск' },
    { value: 'Turkistan', label: 'Туркестан' }
  ];

  useEffect(() => {
    fetchCurrentUser();
    fetchComplexes();
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
    setLoading(true);
    try {
      const data = await complexService.getComplexes({
        sort_by: 'name',
        order: 'asc',
        limit: 100
      });
      setComplexes(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки комплексов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комплекс?')) {
      try {
        await complexService.deleteComplex(id);
        fetchComplexes();
      } catch (error) {
        console.error('Ошибка удаления комплекса:', error);
        alert('Ошибка при удалении комплекса');
      }
    }
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return {
      backgroundColor: option ? option.color : '#6b7280',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      display: 'inline-block'
    };
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const getCityLabel = (city) => {
    const cityMap = {
      'Almaty': 'Алматы',
      'Astana': 'Астана',
      'Shymkent': 'Шымкент',
      'Karaganda': 'Караганда',
      'Aktobe': 'Актобе',
      'Taraz': 'Тараз',
      'Pavlodar': 'Павлодар',
      'Oskemen': 'Усть-Каменогорск',
      'Semey': 'Семей',
      'Kostanay': 'Костанай',
      'Kyzylorda': 'Кызылорда',
      'Atyrau': 'Атырау',
      'Oral': 'Уральск',
      'Petropavl': 'Петропавловск',
      'Turkistan': 'Туркестан'
    };
    return cityMap[city] || city;
  };

  const filteredComplexes = complexes.filter(complex => {
    const matchesSearch = complex.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complex.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || complex.building_status === statusFilter;
    const matchesCity = !cityFilter || complex.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoText}>Baspana Group</span>
          <span className={styles.logoSubtext}>Панель Менеджера</span>
        </div>

        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>
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

          <div className={styles.navItem} onClick={() => navigate('/apartments-management')}>
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
          <h1 className={styles.pageTitle}>Панель управления</h1>
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
                placeholder="Поиск по названию или адресу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={styles.filterSelect}>
              {cityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
              <span>+ Создать ЖК</span>
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>НАЗВАНИЕ</th>
                    <th>АДРЕС</th>
                    <th>СТАТУС</th>
                    <th>КВАРТИРЫ</th>
                    <th>ДЕЙСТВИЯ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplexes.map((complex) => (
                    <tr key={complex.id}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" />
                      </td>
                      <td
                        onClick={() => {
                          setSelectedComplexId(complex.id);
                          setIsViewModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {complex.name}
                      </td>
                      <td
                        onClick={() => {
                          setSelectedComplexId(complex.id);
                          setIsViewModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {complex.address ? `${complex.address}, ${getCityLabel(complex.city)}` : '-'}
                      </td>
                      <td
                        onClick={() => {
                          setSelectedComplexId(complex.id);
                          setIsViewModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span style={getStatusStyle(complex.building_status)}>
                          {getStatusLabel(complex.building_status)}
                        </span>
                      </td>
                      <td
                        onClick={() => {
                          setSelectedComplexId(complex.id);
                          setIsViewModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {complex.total_apartments || 0}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} onClick={() => {
                            setSelectedComplexId(complex.id);
                            setIsEditModalOpen(true);
                          }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <button className={styles.actionBtn} onClick={() => handleDelete(complex.id)}>
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

      <CreateComplexModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchComplexes}
      />

      <EditComplexModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedComplexId(null);
        }}
        onSuccess={fetchComplexes}
        complexId={selectedComplexId}
      />

      <ViewComplexModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedComplexId(null);
        }}
        complexId={selectedComplexId}
      />
    </div>
  );
};

export default ComplexManagement;
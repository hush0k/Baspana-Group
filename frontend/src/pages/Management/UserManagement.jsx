import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import userService from '../../services/UserService';
import CreateUserModal from '../../components/Modal/CreateUserModal';
import EditUserModal from '../../components/Modal/EditUserModal';
import ViewUserModal from '../../components/Modal/ViewUserModal';
import styles from '../../styles/ComplexManagement.module.scss';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const roleOptions = [
        { value: '', label: 'Все роли' },
        { value: 'Admin', label: 'Администратор', color: '#ef4444' },
        { value: 'Manager', label: 'Менеджер', color: '#3b82f6' },
        { value: 'Consumer', label: 'Пользователь', color: '#10b981' }
    ];

    const statusOptions = [
        { value: '', label: 'Все статусы' },
        { value: 'Bronze', label: 'Бронзовый', color: '#cd7f32' },
        { value: 'Silver', label: 'Серебряный', color: '#c0c0c0' },
        { value: 'Gold', label: 'Золотой', color: '#ffd700' },
        { value: 'None', label: 'Нет', color: '#6b7280' }
    ];

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/users/me');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Ошибка удаления пользователя:', error);
                alert('Ошибка при удалении пользователя');
            }
        }
    };

    const getRoleLabel = (role) => {
        const option = roleOptions.find(opt => opt.value === role);
        return option ? option.label : role;
    };

    const getRoleColor = (role) => {
        const option = roleOptions.find(opt => opt.value === role);
        return option ? option.color : '#6b7280';
    };

    const getStatusLabel = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.label : status;
    };

    const getStatusColor = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.color : '#6b7280';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    // Фильтрация пользователей
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' ||
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status_of_user === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className={styles.pageContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className={styles.logoText}>Baspana Group</span>
                    <span className={styles.logoSubtext}>Панель Администратора</span>
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

                    <div className={styles.navItem} onClick={() => navigate('/apartments-management')}>
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

                    <div className={styles.navItem} onClick={() => navigate('/commercial-units-management')}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 21H21M3 7L12 2L21 7V21H3V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V14H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
                        <span>Коммерческое помещение</span>
                    </div>

                    <div className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
                        <span>Пользователи</span>
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
                    <h1 className={styles.pageTitle}>Панель управления пользователями</h1>
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
                                placeholder="Поиск по имени, фамилии или email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={styles.filterSelect}>
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
                            <span>+ Создать пользователя</span>
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
                                    <th>ИМЯ</th>
                                    <th>EMAIL</th>
                                    <th>РОЛЬ</th>
                                    <th>СТАТУС</th>
                                    <th>ДАТА РЕГИСТРАЦИИ</th>
                                    <th>ДЕЙСТВИЯ</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" />
                                        </td>
                                        <td
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setIsViewModalOpen(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setIsViewModalOpen(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user.email}
                                        </td>
                                        <td
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setIsViewModalOpen(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                        <span style={{
                            backgroundColor: getRoleColor(user.role),
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'inline-block'
                        }}>
                          {getRoleLabel(user.role)}
                        </span>
                                        </td>
                                        <td
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setIsViewModalOpen(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                        <span style={{
                            backgroundColor: getStatusColor(user.status_of_user),
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'inline-block'
                        }}>
                          {getStatusLabel(user.status_of_user)}
                        </span>
                                        </td>
                                        <td
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setIsViewModalOpen(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div className={styles.actions}>
                                                <button className={styles.actionBtn} onClick={() => {
                                                    setSelectedUserId(user.id);
                                                    setIsEditModalOpen(true);
                                                }}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </button>
                                                <button className={styles.actionBtn} onClick={() => handleDelete(user.id)}>
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

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchUsers}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUserId(null);
                }}
                onSuccess={fetchUsers}
                userId={selectedUserId}
            />

            <ViewUserModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedUserId(null);
                }}
                userId={selectedUserId}
            />
        </div>
    );
};

export default UserManagement;
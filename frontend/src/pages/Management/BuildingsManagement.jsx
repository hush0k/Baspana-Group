import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Home
} from 'lucide-react';
import axios from 'axios';
import styles from '../../styles/BuildingsManagement.module.scss';

const BuildingManagement = () => {
  const [buildings, setBuildings] = useState([]);
  const [residentialComplexes, setResidentialComplexes] = useState([]);
  const [selectedComplexId, setSelectedComplexId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    residential_complex_id: '',
    number_of_entrances: '',
    floors_per_entrance: ''
  });
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8000/api';

  // Загрузка ЖК
  useEffect(() => {
    fetchResidentialComplexes();
  }, []);

  // Загрузка блоков при выборе ЖК
  useEffect(() => {
    if (selectedComplexId) {
      fetchBuildings();
    } else {
      setBuildings([]);
    }
  }, [selectedComplexId]);

  const fetchResidentialComplexes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/residential-complexes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidentialComplexes(response.data);
    } catch (error) {
      console.error('Ошибка загрузки ЖК:', error);
    }
  };

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/buildings/?residential_complex_id=${selectedComplexId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBuildings(response.data);
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
        name: building.name,
        residential_complex_id: building.residential_complex_id,
        number_of_entrances: building.number_of_entrances,
        floors_per_entrance: building.floors_per_entrance
      });
    } else {
      setEditingBuilding(null);
      setFormData({
        name: '',
        residential_complex_id: selectedComplexId || '',
        number_of_entrances: '',
        floors_per_entrance: ''
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBuilding(null);
    setFormData({
      name: '',
      residential_complex_id: '',
      number_of_entrances: '',
      floors_per_entrance: ''
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
    if (!formData.name.trim()) newErrors.name = 'Введите название блока';
    if (!formData.residential_complex_id) newErrors.residential_complex_id = 'Выберите ЖК';
    if (!formData.number_of_entrances || formData.number_of_entrances < 1) {
      newErrors.number_of_entrances = 'Введите количество подъездов';
    }
    if (!formData.floors_per_entrance || formData.floors_per_entrance < 1) {
      newErrors.floors_per_entrance = 'Введите количество этажей';
    }
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
      const token = localStorage.getItem('token');
      const buildingData = {
        name: formData.name,
        residential_complex_id: parseInt(formData.residential_complex_id),
        number_of_entrances: parseInt(formData.number_of_entrances),
        floors_per_entrance: parseInt(formData.floors_per_entrance)
      };

      if (editingBuilding) {
        await axios.put(
          `${API_URL}/buildings/${editingBuilding.id}`,
          buildingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/buildings/`,
          buildingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/buildings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBuildings();
    } catch (error) {
      console.error('Ошибка удаления блока:', error);
    }
  };

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApartments = (building) => {
    return building.number_of_entrances * building.floors_per_entrance;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Building2 size={32} />
          <div>
            <h1>Блоки</h1>
            <p>Управление блоками жилых комплексов</p>
          </div>
        </div>
        <button
          className={styles.addButton}
          onClick={() => handleOpenModal()}
          disabled={!selectedComplexId}
        >
          <Plus size={20} />
          Добавить Блок
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.complexSelector}>
          <Home size={20} />
          <select
            value={selectedComplexId}
            onChange={(e) => setSelectedComplexId(e.target.value)}
            className={styles.select}
          >
            <option value="">Выберите жилой комплекс</option>
            {residentialComplexes.map(rc => (
              <option key={rc.id} value={rc.id}>
                {rc.name}
              </option>
            ))}
          </select>
        </div>

        {selectedComplexId && (
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Поиск блока..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {!selectedComplexId ? (
        <div className={styles.emptyState}>
          <Building2 size={64} />
          <h3>Выберите жилой комплекс</h3>
          <p>Для управления блоками выберите ЖК из списка выше</p>
        </div>
      ) : loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Название</th>
                <th>Подъезды</th>
                <th>Этажей</th>
                <th>Всего мест</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuildings.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>
                    {searchTerm ? 'Блоки не найдены' : 'Нет блоков'}
                  </td>
                </tr>
              ) : (
                filteredBuildings.map((building, index) => (
                  <tr key={building.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td className={styles.nameCell}>
                      <Building2 size={18} />
                      {building.name}
                    </td>
                    <td>{building.number_of_entrances}</td>
                    <td>{building.floors_per_entrance}</td>
                    <td>{totalApartments(building)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleOpenModal(building)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(building.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingBuilding ? 'Редактировать блок' : 'Добавить блок'}</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
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
                    <option key={rc.id} value={rc.id}>
                      {rc.name}
                    </option>
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

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Количество подъездов *</label>
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
                  <label>Этажей в подъезде *</label>
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

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Отмена
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingBuilding ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingManagement;
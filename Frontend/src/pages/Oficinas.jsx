import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from '../components/Modal/Modal';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = 'http://localhost:3000/api/oficinas';

const Oficinas = () => {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOficina, setCurrentOficina] = useState({ nome: '', descricao: '', data: '', local: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOficinas();
  }, []);

  const fetchOficinas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setOficinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error);
      toast.error('Erro ao buscar oficinas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchOficinas();
      return;
    }
    const filtered = oficinas.filter((oficina) =>
      oficina.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOficinas(filtered);
  };

  const openAddModal = () => {
    setCurrentOficina({ nome: '', descricao: '', data: '', local: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (oficina) => {
    setCurrentOficina({ ...oficina });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOficina({ ...currentOficina, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentOficina.nome.trim() || !currentOficina.descricao.trim() || !currentOficina.data.trim() || !currentOficina.local.trim()) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentOficina.id}`, currentOficina);
        toast.success('Oficina atualizada com sucesso');
      } else {
        await axios.post(API_URL, currentOficina);
        toast.success('Oficina adicionada com sucesso');
      }
      setModalOpen(false);
      fetchOficinas();
    } catch (error) {
      console.error('Erro ao salvar oficina:', error);
      toast.error('Erro ao salvar oficina');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta oficina?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Oficina excluída com sucesso');
        fetchOficinas();
      } catch (error) {
        console.error('Erro ao excluir oficina:', error);
        toast.error('Erro ao excluir oficina');
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="oficinas-container">
      <div className="page-header">
        <h1>Oficinas</h1>
        <button onClick={openAddModal} className="success">
          <FaPlus /> Nova Oficina
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          <FaSearch /> Buscar
        </button>
      </div>
      {oficinas.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Local</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {oficinas.map((oficina) => (
                <tr key={oficina.id}>
                  <td>{oficina.nome}</td>
                  <td>{oficina.descricao}</td>
                  <td>{oficina.data}</td>
                  <td>{oficina.local}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => openEditModal(oficina)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(oficina.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhuma oficina encontrada.</p>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Editar Oficina' : 'Adicionar Oficina'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome*</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={currentOficina.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descrição*</label>
            <textarea
              id="descricao"
              name="descricao"
              value={currentOficina.descricao}
              onChange={handleInputChange}
              required
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="data">Data*</label>
            <input
              type="date"
              id="data"
              name="data"
              value={currentOficina.data}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="local">Local*</label>
            <input
              type="text"
              id="local"
              name="local"
              value={currentOficina.local}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="success">
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Oficinas; 
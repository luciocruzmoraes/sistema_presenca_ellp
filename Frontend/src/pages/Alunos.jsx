import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from '../components/Modal/Modal';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';


const API_URL = 'http://localhost:3000/api/alunos'; 
const API_OFICINAS_URL = 'http://localhost:3000/api/oficinas';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ nome: '', email: '', telefone: '', observacoes: '', turma: '', oficinas: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [oficinas, setOficinas] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchOficinas();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const fetchOficinas = async () => {
    try {
      const response = await axios.get(API_OFICINAS_URL);
      setOficinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error);
      toast.error('Erro ao buscar oficinas');
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchStudents();
      return;
    }

    const filtered = students.filter((student) =>
      student.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStudents(filtered);
  };

  const openAddModal = () => {
    setCurrentStudent({ nome: '', email: '', telefone: '', observacoes: '', turma: '', oficinas: [] });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent({ ...student, oficinas: student.oficinas || [] });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    if (name === 'oficinas') {
      const selected = Array.from(options).filter(option => option.selected).map(option => option.value);
      setCurrentStudent({ ...currentStudent, oficinas: selected });
    } else {
      setCurrentStudent({ ...currentStudent, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentStudent.nome.trim()) {
      toast.error('O nome do aluno é obrigatório');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentStudent.id}`, {
          nome: currentStudent.nome,
          email: currentStudent.email,
          telefone: currentStudent.telefone,
          observacoes: currentStudent.observacoes,
          turma: currentStudent.turma,
          oficinas: currentStudent.oficinas,
        });
        toast.success('Aluno atualizado com sucesso');
      } else {
        await axios.post(API_URL, {
          nome: currentStudent.nome,
          email: currentStudent.email,
          telefone: currentStudent.telefone,
          observacoes: currentStudent.observacoes,
          turma: currentStudent.turma,
          oficinas: currentStudent.oficinas,
        });
        toast.success('Aluno adicionado com sucesso');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      toast.error('Erro ao salvar aluno');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Aluno excluído com sucesso');
        fetchStudents();
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        toast.error('Erro ao excluir aluno');
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="students-container">
      <div className="page-header">
        <h1>Alunos</h1>
        <button onClick={openAddModal} className="success">
          <FaPlus /> Novo Aluno
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

      {students.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Turma</th>
                <th>Oficinas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.nome}</td>
                  <td>{student.email}</td>
                  <td>{student.turma}</td>
                  <td>{student.oficinas.map((oficinaId) => {
                    const oficina = oficinas.find((o) => o.id === oficinaId);
                    return oficina ? oficina.nome : oficinaId;
                  }).join(', ')}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => openEditModal(student)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(student.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhum aluno encontrado.</p>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Editar Aluno' : 'Adicionar Aluno'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome*</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={currentStudent.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={currentStudent.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={currentStudent.telefone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={currentStudent.observacoes}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="turma">Turma*</label>
            <input
              type="text"
              id="turma"
              name="turma"
              value={currentStudent.turma}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="oficinas">Oficinas</label>
            <select
              id="oficinas"
              name="oficinas"
              multiple
              value={currentStudent.oficinas}
              onChange={handleInputChange}
            >
              {oficinas.map((oficina) => (
                <option key={oficina.id} value={oficina.id}>
                  {oficina.nome}
                </option>
              ))}
            </select>
            <small>Segure Ctrl (Windows) ou Command (Mac) para selecionar várias</small>
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

export default Students;

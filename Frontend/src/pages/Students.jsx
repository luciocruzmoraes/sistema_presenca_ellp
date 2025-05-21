import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../components/Modal/Modal';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

// Dados mockados
const MOCK_STUDENTS = [
  { id: '1', name: 'Ana Souza', email: 'ana@email.com', phone: '11999999999', notes: 'Aluna assídua' },
  { id: '2', name: 'Carlos Lima', email: 'carlos@email.com', phone: '21988888888', notes: '' },
  { id: '3', name: 'Fernanda Dias', email: 'fernanda@email.com', phone: '31977777777', notes: 'Precisa de reforço' },
];

const MOCK_HISTORY = [
  { id: 'a1', date: '2024-05-10', workshopName: 'Lógica de Programação' },
  { id: 'a2', date: '2024-05-17', workshopName: 'Python Básico' },
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', phone: '', notes: '' });
  const [studentHistory, setStudentHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStudents(MOCK_STUDENTS);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setStudents(MOCK_STUDENTS);
      return;
    }

    const filtered = MOCK_STUDENTS.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStudents(filtered);
  };

  const openAddModal = () => {
    setCurrentStudent({ name: '', email: '', phone: '', notes: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent({ ...student });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStudent.name.trim()) {
      toast.error('O nome do aluno é obrigatório');
      return;
    }

    if (isEditing) {
      toast.success('Mock: aluno atualizado');
    } else {
      toast.success('Mock: aluno adicionado');
    }

    setModalOpen(false);
    setStudents(MOCK_STUDENTS); // não altera de fato, só simula
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      toast.success('Mock: aluno excluído');
    }
  };

  const viewStudentHistory = (id, name) => {
    setCurrentStudent({ ...currentStudent, id, name });
    setStudentHistory(MOCK_HISTORY);
    setHistoryModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="students-container">
      <div className="page-header">
        <h1>Alunos (Mock)</h1>
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
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td className="actions-cell">
                    <button className="btn-icon view" onClick={() => viewStudentHistory(student.id, student.name)}>
                      <FaEye />
                    </button>
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
        title={isEditing ? 'Editar Aluno (Mock)' : 'Adicionar Aluno (Mock)'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentStudent.name}
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
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={currentStudent.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              name="notes"
              value={currentStudent.notes}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
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

      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Histórico de ${currentStudent.name} (Mock)`}
      >
        {studentHistory.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Oficina</th>
                </tr>
              </thead>
              <tbody>
                {studentHistory.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.workshopName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhuma presença registrada para este aluno.</p>
        )}
        <div className="modal-actions">
          <button onClick={() => setHistoryModalOpen(false)}>Fechar</button>
        </div>
      </Modal>
    </div>
  );
};

export default Students;

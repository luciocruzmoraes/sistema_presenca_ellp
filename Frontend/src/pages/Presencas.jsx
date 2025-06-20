import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_OFICINAS_URL = 'http://localhost:3000/api/oficinas';
const API_ALUNOS_URL = 'http://localhost:3000/api/alunos';
const API_PRESENCAS_URL = 'http://localhost:3000/api/presencas';

const Presencas = () => {
  const [oficinas, setOficinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState('');
  const [data, setData] = useState('');
  const [presencas, setPresencas] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOficinas();
    fetchAlunos();
  }, []);

  const fetchOficinas = async () => {
    try {
      const response = await axios.get(API_OFICINAS_URL);
      setOficinas(response.data);
    } catch (error) {
      toast.error('Erro ao buscar oficinas');
    }
  };

  const fetchAlunos = async () => {
    try {
      const response = await axios.get(API_ALUNOS_URL);
      setAlunos(response.data);
    } catch (error) {
      toast.error('Erro ao buscar alunos');
    }
  };

  const alunosDaOficina = alunos.filter(aluno => aluno.oficinas.includes(oficinaSelecionada));

  const handlePresencaChange = (alunoId) => {
    setPresencas(prev => ({ ...prev, [alunoId]: !prev[alunoId] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oficinaSelecionada || !data) {
      toast.error('Selecione a oficina e a data');
      return;
    }
    const alunosPresentes = alunosDaOficina.filter(aluno => presencas[aluno.id]);
    if (alunosPresentes.length === 0) {
      toast.error('Selecione pelo menos um aluno presente');
      return;
    }
    setLoading(true);
    try {
      await Promise.all(alunosPresentes.map(aluno =>
        axios.post(API_PRESENCAS_URL, {
          alunoId: aluno.id,
          data,
          presente: true,
          turma: aluno.turma,
          oficinaId: oficinaSelecionada,
        })
      ));
      toast.success('Presenças registradas com sucesso!');
      setPresencas({});
    } catch (error) {
      toast.error('Erro ao registrar presenças');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="presencas-container">
      <h1>Registrar Presença</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oficina">Oficina</label>
          <select
            id="oficina"
            value={oficinaSelecionada}
            onChange={e => setOficinaSelecionada(e.target.value)}
            required
          >
            <option value="">Selecione uma oficina</option>
            {oficinas.map(oficina => (
              <option key={oficina.id} value={oficina.id}>{oficina.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />
        </div>
        {oficinaSelecionada && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Presente</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Turma</th>
                </tr>
              </thead>
              <tbody>
                {alunosDaOficina.map(aluno => (
                  <tr key={aluno.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!presencas[aluno.id]}
                        onChange={() => handlePresencaChange(aluno.id)}
                      />
                    </td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.email}</td>
                    <td>{aluno.turma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="modal-actions">
          <button type="submit" className="success" disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar Presença'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Presencas; 
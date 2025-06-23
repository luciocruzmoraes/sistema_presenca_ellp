  import { useState, useEffect } from 'react';
  import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaEdit } from 'react-icons/fa';
  import axios from 'axios';
  import Modal from '../components/Modal/Modal';

  const API_ALUNOS_URL = 'http://localhost:3000/api/alunos';
  const API_OFICINAS_URL = 'http://localhost:3000/api/oficinas';
  const API_PRESENCAS_URL = 'http://localhost:3000/api/presencas';

  const Dashboard = () => {
    const [stats, setStats] = useState({
      students: 0,
      workshops: 0,
      attendanceRecords: 0,
    });
    const [loading, setLoading] = useState(true);
    const [alunos, setAlunos] = useState([]);
    const [oficinas, setOficinas] = useState([]);
    const [presencas, setPresencas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [edicao, setEdicao] = useState(null); 
    const [presencasOficina, setPresencasOficina] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [alunosRes, oficinasRes, presencasRes] = await Promise.all([
            axios.get(API_ALUNOS_URL),
            axios.get(API_OFICINAS_URL),
            axios.get(API_PRESENCAS_URL)
          ]);
          setAlunos(alunosRes.data);
          setOficinas(oficinasRes.data);
          setPresencas(presencasRes.data);
          setStats({
            students: alunosRes.data.length,
            workshops: oficinasRes.data.length,
            attendanceRecords: presencasRes.data.length,
          });
        } catch (error) {
          setStats({ students: 0, workshops: 0, attendanceRecords: 0 });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    const oficinasPorData = (() => {
      const map = {};
      presencas.forEach(p => {
        const key = `${p.oficinaId}|${p.data}`;
        if (!map[key]) {
          const oficina = oficinas.find(o => o.id === p.oficinaId);
          map[key] = {
            oficinaId: p.oficinaId,
            data: p.data,
            nome: oficina ? oficina.nome : '-',
            local: oficina ? oficina.local : '-',
            count: 0,
          };
        }
        map[key].count++;
      });
      return Object.values(map).sort((a, b) => new Date(b.data) - new Date(a.data));
    })();

    const openPresencasModal = (oficinaId, data) => {
      setEdicao({ oficinaId, data });
      const presencasDaOficina = presencas.filter(p => p.oficinaId === oficinaId && p.data === data);
      const presencasMap = {};
      presencasDaOficina.forEach(p => {
        presencasMap[p.alunoId] = p.presente;
      });
      setPresencasOficina(presencasMap);
      setModalOpen(true);
    };

    const alunosDaOficina = edicao
      ? alunos.filter(aluno => (aluno.oficinas || []).includes(edicao.oficinaId))
      : [];

    const handlePresencaChange = (alunoId) => {
      setPresencasOficina(prev => ({ ...prev, [alunoId]: !prev[alunoId] }));
    };

    const handleSalvarPresencas = async () => {
      if (!edicao) return;
      setSaving(true);
      try {
        await Promise.all(alunosDaOficina.map(async (aluno) => {
          const jaRegistrada = presencas.find(p => p.oficinaId === edicao.oficinaId && p.data === edicao.data && p.alunoId === aluno.id);
          if (presencasOficina[aluno.id]) {
            if (jaRegistrada) {
              await axios.put(`${API_PRESENCAS_URL}/${jaRegistrada.id}`, {
                ...jaRegistrada,
                presente: true,
              });
            } else {
              await axios.post(API_PRESENCAS_URL, {
                alunoId: aluno.id,
                data: edicao.data,
                presente: true,
                turma: aluno.turma,
                oficinaId: edicao.oficinaId,
              });
            }
          } else {
            if (jaRegistrada && jaRegistrada.presente) {
              await axios.put(`${API_PRESENCAS_URL}/${jaRegistrada.id}`, {
                ...jaRegistrada,
                presente: false,
              });
            }
          }
        }));
        setModalOpen(false);
        const presencasRes = await axios.get(API_PRESENCAS_URL);
        setPresencas(presencasRes.data);
      } catch (error) {
        alert('Erro ao salvar presenças');
      } finally {
        setSaving(false);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    if (loading) {
      return <div className="loading">Carregando...</div>;
    }

    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>

        <div className="dashboard-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserGraduate size={24} />
            </div>
            <h3>Alunos</h3>
            <div className="value">{stats.students}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChalkboardTeacher size={24} />
            </div>
            <h3>Oficinas</h3>
            <div className="value">{stats.workshops}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarCheck size={24} />
            </div>
            <h3>Presenças</h3>
            <div className="value">{stats.attendanceRecords}</div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Oficinas Realizadas</h2>
          {oficinasPorData.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Local</th>
                    <th>Presenças Registradas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {oficinasPorData.map((item) => (
                    <tr key={item.oficinaId + '|' + item.data}>
                      <td>{formatDate(item.data)}</td>
                      <td>{item.nome}</td>
                      <td>{item.local}</td>
                      <td>{item.count}</td>
                      <td>
                        <button className="btn-icon edit" onClick={() => openPresencasModal(item.oficinaId, item.data)} title="Editar presenças">
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhuma oficina realizada ainda.</p>
          )}
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={edicao ? `Editar Presenças - ${edicao.data}` : 'Editar Presenças'}
        >
          {edicao && (
            <form onSubmit={e => { e.preventDefault(); handleSalvarPresencas(); }}>
              <div className="form-group">
                <label>Data</label>
                <input type="text" value={formatDate(edicao.data)} disabled />
              </div>
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
                            checked={!!presencasOficina[aluno.id]}
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
              <div className="modal-actions">
                <button type="button" className="secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="success" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Presenças'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  };

  export default Dashboard;

import { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const API_ALUNOS_URL = 'http://localhost:3000/api/alunos';
const API_OFICINAS_URL = 'http://localhost:3000/api/oficinas';
const API_PRESENCAS_URL = 'http://localhost:3000/api/presencas';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    workshops: 0,
    attendanceRecords: 0,
    recentAttendance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [alunosRes, oficinasRes, presencasRes] = await Promise.all([
          axios.get(API_ALUNOS_URL),
          axios.get(API_OFICINAS_URL),
          axios.get(API_PRESENCAS_URL)
        ]);
        const alunos = alunosRes.data;
        const oficinas = oficinasRes.data;
        const presencas = presencasRes.data;

        // Ordenar presenças por data decrescente
        const sortedPresencas = [...presencas].sort((a, b) => new Date(b.data) - new Date(a.data));
        // Pegar as 5 mais recentes
        const recentAttendance = sortedPresencas.slice(0, 5).map((p) => {
          const aluno = alunos.find(a => a.id === p.alunoId);
          const oficina = oficinas.find(o => o.id === p.oficinaId);
          return {
            id: p.id,
            date: p.data,
            studentName: aluno ? aluno.nome : p.alunoId,
            workshopName: oficina ? oficina.nome : (p.oficinaId || '-'),
          };
        });

        setStats({
          students: alunos.length,
          workshops: oficinas.length,
          attendanceRecords: presencas.length,
          recentAttendance
        });
      } catch (error) {
        setStats({ students: 0, workshops: 0, attendanceRecords: 0, recentAttendance: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

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
        <h2>Presenças Recentes</h2>
        {stats.recentAttendance.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno</th>
                  <th>Oficina</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.studentName}</td>
                    <td>{record.workshopName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhuma presença registrada ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

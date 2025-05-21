import { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    workshops: 0,
    attendanceRecords: 0,
    recentAttendance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStudents = Array(10).fill({}); 
    const mockWorkshops = Array(3).fill({}); 
    const mockAttendanceRecords = [
      {
        id: '1',
        date: '2025-05-20',
        studentName: 'João Silva',
        workshopName: 'Lógica de Programação',
      },
      {
        id: '2',
        date: '2025-05-19',
        studentName: 'Maria Oliveira',
        workshopName: 'Robótica Educacional',
      },
      {
        id: '3',
        date: '2025-05-18',
        studentName: 'Carlos Souza',
        workshopName: 'Jogos Matemáticos',
      },
      {
        id: '4',
        date: '2025-05-17',
        studentName: 'Ana Costa',
        workshopName: 'Pensamento Computacional',
      },
      {
        id: '5',
        date: '2025-05-16',
        studentName: 'Pedro Lima',
        workshopName: 'Algoritmos com Scratch',
      },
    ];

    setTimeout(() => {
      setStats({
        students: mockStudents.length,
        workshops: mockWorkshops.length,
        attendanceRecords: mockAttendanceRecords.length,
        recentAttendance: mockAttendanceRecords,
      });
      setLoading(false);
    }, 1000);
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

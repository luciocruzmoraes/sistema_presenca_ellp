import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

const API_OFICINAS_URL = 'http://localhost:3000/api/oficinas';
const API_PRESENCAS_URL = 'http://localhost:3000/api/presencas';
const API_ALUNOS_URL = 'http://localhost:3000/api/alunos';

const Relatorios = () => {
  const [oficinas, setOficinas] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [oficinasRes, presencasRes, alunosRes] = await Promise.all([
        axios.get(API_OFICINAS_URL),
        axios.get(API_PRESENCAS_URL),
        axios.get(API_ALUNOS_URL),
      ]);
      setOficinas(oficinasRes.data);
      setPresencas(presencasRes.data);
      setAlunos(alunosRes.data);
    };
    fetchData();
  }, []);

  const handleExportarCSV = () => {
    if (!oficinaSelecionada) return;
    const dadosFiltrados = presencas
      .filter(p => p.oficinaId === oficinaSelecionada)
      .map(p => {
        const aluno = alunos.find(a => a.id === p.alunoId);
        const oficina = oficinas.find(o => o.id === p.oficinaId);
        return {
          Data: p.data,
          NomeAluno: aluno?.nome || '-',
          EmailAluno: aluno?.email || '-',
          Turma: aluno?.turma || '-',
          Oficina: oficina?.nome || '-',
          Local: oficina?.local || '-',
          Presente: p.presente ? 'Sim' : 'Não',
        };
      });

    const oficina = oficinas.find(o => o.id === oficinaSelecionada);
    const nomeOficina = oficina?.nome?.replace(/\s+/g, '_') || 'Oficina';
    const csv = unparse(dadosFiltrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Presenças_${nomeOficina}.csv`);
  };

  const presencasFiltradas = presencas.filter(p => p.oficinaId === oficinaSelecionada);

  return (
    <div className="relatorios-container">
      <h1>Relatórios de Presença</h1>

      <div className="form-group">
        <label htmlFor="oficina">Selecione a Oficina:</label>
        <select id="oficina" value={oficinaSelecionada} onChange={(e) => setOficinaSelecionada(e.target.value)}>
          <option value="">-- Selecione --</option>
          {oficinas.map((oficina) => (
            <option key={oficina.id} value={oficina.id}>{oficina.nome}</option>
          ))}
        </select>
      </div>

      {oficinaSelecionada && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Turma</th>
                  <th>Presente</th>
                </tr>
              </thead>
              <tbody>
                {presencasFiltradas.map((p, index) => {
                  const aluno = alunos.find(a => a.id === p.alunoId);
                  return (
                    <tr key={index}>
                      <td>{p.data}</td>
                      <td>{aluno?.nome || '-'}</td>
                      <td>{aluno?.email || '-'}</td>
                      <td>{aluno?.turma || '-'}</td>
                      <td>{p.presente ? 'Sim' : 'Não'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={handleExportarCSV} className="export-button">
            Exportar CSV
          </button>
        </>
      )}
    </div>
  );
};

export default Relatorios;
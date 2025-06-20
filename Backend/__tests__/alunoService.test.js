const alunoService = require('../src/services/AlunoService');
jest.mock('../src/config/firebase', () => {
  const data = [];
  return {
    collection: jest.fn(() => ({
      add: jest.fn(({ nome, email, turma }) => {
        const id = `${data.length + 1}`;
        const newAluno = { id, nome, email, turma };
        data.push(newAluno);
        return Promise.resolve({ id });
      }),
      get: jest.fn(() => Promise.resolve({
        docs: data.map(doc => ({
          id: doc.id,
          data: () => doc
        }))
      }))
    }))
  };
});

describe('AlunoService', () => {
  it('deve criar um aluno com sucesso', async () => {
    const aluno = await alunoService.createAluno({
      nome: 'João',
      email: 'joao@example.com',
      turma: '3A'
    });

    expect(aluno).toHaveProperty('id');
    expect(aluno.nome).toBe('João');
  });

  it('deve listar alunos', async () => {
    const alunos = await alunoService.getAlunos();
    expect(Array.isArray(alunos)).toBe(true);
    expect(alunos.length).toBeGreaterThan(0);
  });
});

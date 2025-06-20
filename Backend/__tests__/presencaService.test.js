const presencaService = require('../src/services/PresencaService');

// Mock do Firebase
jest.mock('../src/config/firebase', () => {
  const data = [];

  return {
    collection: jest.fn(() => ({
      add: jest.fn((obj) => {
        const id = `${data.length + 1}`;
        data.push({ id, ...obj });
        return Promise.resolve({ id });
      }),
      where: jest.fn((campo, operador, valor) => ({
        get: jest.fn(() => {
          const filtrado = data.filter(item => item[campo] === valor);
          return Promise.resolve({
            empty: filtrado.length === 0,
            docs: filtrado.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          });
        })
      })),
      doc: jest.fn((id) => {
        return {
          get: jest.fn(() => {
            const encontrado = data.find(d => d.id === id);
            return Promise.resolve({
              exists: !!encontrado,
              id,
              data: () => encontrado
            });
          }),
          update: jest.fn((novosDados) => {
            const i = data.findIndex(d => d.id === id);
            if (i >= 0) {
              data[i] = { ...data[i], ...novosDados };
              return Promise.resolve();
            } else {
              return Promise.reject(new Error('Presença não encontrada'));
            }
          }),
          delete: jest.fn(() => {
            const i = data.findIndex(d => d.id === id);
            if (i >= 0) {
              data.splice(i, 1);
              return Promise.resolve();
            } else {
              return Promise.reject(new Error('Presença não encontrada'));
            }
          })
        };
      })
    }))
  };
});

describe('PresencaService', () => {
  it('deve registrar uma presença com sucesso', async () => {
    const resultado = await presencaService.registrarPresenca({
      alunoId: '1',
      data: '2024-06-01',
      presente: true,
      turma: '3A'
    });

    expect(resultado).toHaveProperty('id');
    expect(resultado.presente).toBe(true);
  });

  it('deve retornar presenças por aluno', async () => {
    const resultados = await presencaService.getPresencasPorAluno('1');
    expect(Array.isArray(resultados)).toBe(true);
    expect(resultados.length).toBeGreaterThan(0);
  });

  it('deve retornar presenças por data', async () => {
    const resultados = await presencaService.getPresencasPorData('2024-06-01');
    expect(Array.isArray(resultados)).toBe(true);
  });

  it('deve atualizar uma presença existente', async () => {
    const nova = await presencaService.registrarPresenca({
      alunoId: '2',
      data: '2024-06-01',
      presente: false,
      turma: '2B'
    });

    const atualizada = await presencaService.updatePresenca(nova.id, {
      alunoId: '2',
      data: '2024-06-01',
      presente: true,
      turma: '2B'
    });

    expect(atualizada.presente).toBe(true);
  });

  it('deve deletar uma presença com sucesso', async () => {
    const nova = await presencaService.registrarPresenca({
      alunoId: '3',
      data: '2024-06-01',
      presente: true,
      turma: '1A'
    });

    await presencaService.deletePresenca(nova.id);
    const resultados = await presencaService.getPresencasPorAluno('3');
    expect(resultados.length).toBe(0);
  });
});

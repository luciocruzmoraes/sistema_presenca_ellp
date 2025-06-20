const userService = require('../src/services/UserService');

jest.mock('../src/config/firebase', () => {
  const data = {};
  return {
    collection: jest.fn(() => ({
      doc: jest.fn((uid) => ({
        set: jest.fn(({ nome, role }) => {
          data[uid] = { nome, role };
          return Promise.resolve();
        }),
        get: jest.fn(() => {
          if (data[uid]) {
            return Promise.resolve({
              exists: true,
              id: uid,
              data: () => data[uid],
            });
          } else {
            return Promise.resolve({ exists: false });
          }
        }),
      })),
    })),
  };
});

describe('UserService', () => {
  const mockUid = 'abc123';

  it('deve criar dados do usuário com sucesso', async () => {
    await expect(userService.createUserData({
      uid: mockUid,
      nome: 'Ana',
      role: 'professor',
    })).resolves.not.toThrow();
  });

  it('deve retornar dados do usuário existente', async () => {
    const userData = await userService.getUserData(mockUid);

    expect(userData).toHaveProperty('uid', mockUid);
    expect(userData).toHaveProperty('nome', 'Ana');
    expect(userData).toHaveProperty('role', 'professor');
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    await expect(userService.getUserData('uid_inexistente')).rejects.toThrow('Usuário não encontrado');
  });
});

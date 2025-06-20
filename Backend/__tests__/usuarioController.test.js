const request = require('supertest');
const express = require('express');
const router = require('../src/routes/index');

const app = express();
app.use(express.json());
app.use(router);

describe('Rotas de Usuários', () => {
  const uidTeste = 'user123';

  it('POST /users deve criar um usuário', async () => {
    const res = await request(app).post('/users').send({
      uid: uidTeste,
      nome: 'Carlos',
      role: 'aluno'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuário salvo com sucesso');
  });

  it('GET /users/:uid deve retornar os dados do usuário', async () => {
    const res = await request(app).get(`/users/${uidTeste}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('uid', uidTeste);
    expect(res.body).toHaveProperty('nome', 'Carlos');
    expect(res.body).toHaveProperty('role', 'aluno');
  });

  it('GET /users/:uid com UID inexistente deve retornar 404', async () => {
    const res = await request(app).get('/users/uid_inexistente');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Usuário não encontrado');
  });
});

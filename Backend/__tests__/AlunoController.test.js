const request = require('supertest');
const express = require('express');
const router = require('../src/routes/index');

const app = express();
app.use(express.json());
app.use(router);

describe('Rotas de Alunos', () => {
  it('POST /alunos deve retornar 201', async () => {
    const res = await request(app).post('/alunos').send({
      nome: 'Maria',
      email: 'maria@example.com',
      turma: '2B'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /alunos deve retornar lista de alunos', async () => {
    const res = await request(app).get('/alunos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/index');

const app = express();
app.use(express.json());
app.use(router);

describe('Rotas de Presenças', () => {
  let presencaIdCriada = null;

  it('POST /presencas deve registrar presença e retornar 201', async () => {
    const res = await request(app).post('/presencas').send({
      alunoId: '123',
      data: '2024-06-01',
      presente: true,
      turma: '1A'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    presencaIdCriada = res.body.id;
  });

  it('GET /presencas/aluno/:alunoId deve retornar presenças do aluno', async () => {
    const res = await request(app).get('/presencas/aluno/123');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /presencas/data/:data deve retornar presenças da data', async () => {
    const res = await request(app).get('/presencas/data/2024-06-01');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /presencas/:id deve atualizar uma presença', async () => {
    const res = await request(app).put(`/presencas/${presencaIdCriada}`).send({
      alunoId: '123',
      data: '2024-06-01',
      presente: false,
      turma: '1A'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.presente).toBe(false);
  });

  it('DELETE /presencas/:id deve deletar a presença', async () => {
    const res = await request(app).delete(`/presencas/${presencaIdCriada}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Presença deletada com sucesso');
  });
});

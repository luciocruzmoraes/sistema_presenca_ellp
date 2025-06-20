const db = require('../config/firebase');
const presencasCollection = db.collection('presencas');

const registrarPresenca = async ({ alunoId, data, presente, turma }) => {
  if (!alunoId || !data || typeof presente !== 'boolean' || !turma) {
    throw new Error('Campos alunoId, data, presente (booleano) e turma são obrigatórios');
  }

  const novaPresenca = { alunoId, data, presente, turma };
  const docRef = await presencasCollection.add(novaPresenca);
  return { id: docRef.id, ...novaPresenca };
};

const getPresencasPorAluno = async (alunoId) => {
  const snapshot = await presencasCollection.where('alunoId', '==', alunoId).get();
  return snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getPresencasPorData = async (data) => {
  const snapshot = await presencasCollection.where('data', '==', data).get();
  return snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updatePresenca = async (id, { alunoId, data, presente, turma }) => {
  const presencaRef = presencasCollection.doc(id);
  const doc = await presencaRef.get();

  if (!doc.exists) throw new Error('Presença não encontrada');

  await presencaRef.update({ alunoId, data, presente, turma });
  const atualizado = await presencaRef.get();
  return { id: atualizado.id, ...atualizado.data() };
};

const deletePresenca = async (id) => {
  const presencaRef = presencasCollection.doc(id);
  const doc = await presencaRef.get();
  if (!doc.exists) throw new Error('Presença não encontrada');

  await presencaRef.delete();
};

module.exports = {
  registrarPresenca,
  getPresencasPorAluno,
  getPresencasPorData,
  updatePresenca,
  deletePresenca,
};

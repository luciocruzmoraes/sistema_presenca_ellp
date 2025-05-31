const admin = require('../config/firebase');
const db = admin.firestore();

const presencasCollection = db.collection('presencas');

const registrarPresenca = async ({ alunoId, data, presente, turma }) => {
  if (!alunoId || !data || typeof presente !== 'boolean' || !turma) {
    throw new Error('Campos alunoId, data, presente (booleano) e turma são obrigatórios');
  }

  const novaPresenca = { alunoId, data, presente, turma };
  const docRef = await presencasCollection.add(novaPresenca);
  const presencaCriada = await docRef.get();

  return { id: docRef.id, ...presencaCriada.data() };
};

const getPresencasPorAluno = async (alunoId) => {
  const snapshot = await presencasCollection.where('alunoId', '==', alunoId).get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getPresencasPorData = async (data) => {
  const snapshot = await presencasCollection.where('data', '==', data).get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updatePresenca = async (id, { alunoId, data, presente, turma }) => {
  const presencaRef = presencasCollection.doc(id);
  const doc = await presencaRef.get();

  if (!doc.exists) {
    throw new Error('Presença não encontrada');
  }

  await presencaRef.update({ alunoId, data, presente, turma });
  const presencaAtualizada = await presencaRef.get();

  return { id: presencaAtualizada.id, ...presencaAtualizada.data() };
};

const deletePresenca = async (id) => {
  const presencaRef = presencasCollection.doc(id);
  const doc = await presencaRef.get();

  if (!doc.exists) {
    throw new Error('Presença não encontrada');
  }

  await presencaRef.delete();
};

module.exports = {
  registrarPresenca,
  getPresencasPorAluno,
  getPresencasPorData,
  updatePresenca,
  deletePresenca,
};

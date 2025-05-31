const admin = require('../config/firebase');
const db = admin.firestore();
const alunosCollection = db.collection('alunos');

const createAluno = async ({ nome, email, turma }) => {
  const novoAluno = { nome, email, turma };
  const docRef = await alunosCollection.add(novoAluno);
  const alunoCriado = await docRef.get();
  return { id: docRef.id, ...alunoCriado.data() };
};

const getAlunos = async () => {
  const snapshot = await alunosCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAlunoById = async (id) => {
  const doc = await alunosCollection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

const updateAluno = async (id, { nome, email, turma }) => {
  const alunoRef = alunosCollection.doc(id);
  const doc = await alunoRef.get();
  if (!doc.exists) {
    return null;
  }
  await alunoRef.update({ nome, email, turma });
  const alunoAtualizado = await alunoRef.get();
  return { id: alunoAtualizado.id, ...alunoAtualizado.data() };
};

const deleteAluno = async (id) => {
  const alunoRef = alunosCollection.doc(id);
  const doc = await alunoRef.get();
  if (!doc.exists) {
    return false;
  }
  await alunoRef.delete();
  return true;
};

module.exports = {
  createAluno,
  getAlunos,
  getAlunoById,
  updateAluno,
  deleteAluno,
};

const db = require('../config/firebase');
const collection = db.collection('alunos');

const createAluno = async ({ nome, email, turma }) => {
  const docRef = await collection.add({ nome, email, turma });
  return { id: docRef.id, nome, email, turma };
};

const getAlunos = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAlunoById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const updateAluno = async (id, data) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  await docRef.update(data);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

const deleteAluno = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
};

module.exports = {
  createAluno,
  getAlunos,
  getAlunoById,
  updateAluno,
  deleteAluno,
};

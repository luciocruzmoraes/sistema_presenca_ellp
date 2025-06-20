const db = require('../config/firebase');
const collection = db.collection('alunos');

// OBS: Agora o aluno pode ser associado a várias oficinas via array de IDs no campo oficinas.

const createAluno = async ({ nome, email, telefone, turma, oficinas = [] }) => {
  const docRef = await collection.add({ nome, email, telefone, turma, oficinas });
  return { id: docRef.id, nome, email, telefone, turma, oficinas };
};

const getAlunos = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => {
    const alunoData = doc.data();
    return { id: doc.id, ...alunoData, oficinas: alunoData.oficinas || [], telefone: alunoData.telefone || '' };
  });
};

const getAlunoById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const alunoData = doc.data();
  return { id: doc.id, ...alunoData, oficinas: alunoData.oficinas || [], telefone: alunoData.telefone || '' };
};

const updateAluno = async (id, data) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  // Garante que oficinas é array, se vier undefined mantém o valor anterior
  if (data.oficinas === undefined) {
    delete data.oficinas;
  }

  await docRef.update(data);
  const updated = await docRef.get();
  // Garante que oficinas e telefone sempre são retornados
  const alunoData = updated.data();
  return { id: updated.id, ...alunoData, oficinas: alunoData.oficinas || [], telefone: alunoData.telefone || '' };
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

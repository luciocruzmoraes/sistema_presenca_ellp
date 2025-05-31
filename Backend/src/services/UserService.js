const admin = require('../config/firebase');
const db = admin.firestore();

const createUserData = async ({ uid, nome, role }) => {
  if (!uid || !nome || !role) {
    throw new Error('Campos uid, nome e role são obrigatórios');
  }

  await db.collection('usuarios').doc(uid).set({ nome, role });
};

const getUserData = async (uid) => {
  const doc = await db.collection('usuarios').doc(uid).get();

  if (!doc.exists) {
    throw new Error('Usuário não encontrado');
  }

  return doc.data();
};

module.exports = {
  createUserData,
  getUserData,
};

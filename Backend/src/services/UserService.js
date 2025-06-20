const db = require('../config/firebase');
const collection = db.collection('usuarios');

const createUserData = async ({ uid, nome, role }) => {
  await collection.doc(uid).set({ nome, role });
};

const getUserData = async (uid) => {
  const doc = await collection.doc(uid).get();
  if (!doc.exists) {
    throw new Error('Usuário não encontrado');
  }
  return { uid: doc.id, ...doc.data() };
};

module.exports = {
  createUserData,
  getUserData,
};

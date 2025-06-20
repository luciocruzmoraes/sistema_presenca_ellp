const db = require('../config/firebase');
const collection = db.collection('oficinas');

const createOficina = async ({ nome, descricao, data, local }) => {
  const docRef = await collection.add({ nome, descricao, data, local });
  return { id: docRef.id, nome, descricao, data, local };
};

const getOficinas = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getOficinaById = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const updateOficina = async (id, data) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  await docRef.update(data);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

const deleteOficina = async (id) => {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
};

module.exports = {
  createOficina,
  getOficinas,
  getOficinaById,
  updateOficina,
  deleteOficina,
}; 
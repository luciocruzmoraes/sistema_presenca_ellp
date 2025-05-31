const admin = require('../firebase');
const db = admin.firestore();

const createUserData = async (req, res) => {
  const { uid, nome, role } = req.body;

  try {
    await db.collection('usuarios').doc(uid).set({ nome, role });
    res.status(201).json({ message: 'Usuário salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ error: 'Erro ao salvar dados do usuário' });
  }
};

const getUserData = async (req, res) => {
  const { uid } = req.params;

  try {
    const doc = await db.collection('usuarios').doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
};

module.exports = {
  createUserData,
  getUserData,
};

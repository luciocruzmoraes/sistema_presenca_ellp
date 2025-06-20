const usuarioService = require('../services/UserService');

const createUserData = async (req, res) => {
  const { uid, nome, role } = req.body;

  try {
    await usuarioService.createUserData({ uid, nome, role });
    res.status(201).json({ message: 'Usuário salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getUserData = async (req, res) => {
  const { uid } = req.params;

  try {
    const userData = await usuarioService.getUserData(uid);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createUserData,
  getUserData,
};

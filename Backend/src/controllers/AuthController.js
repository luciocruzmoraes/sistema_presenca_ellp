const authService = require('../services/AuthService');

const login = async (req, res) => {
  const { idToken } = req.body;

  try {
    const token = await authService.login(idToken);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error.message);
    
    if (error.message === 'Token do Firebase não enviado') {
      return res.status(400).json({ error: error.message });
    }

    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
  login,
};

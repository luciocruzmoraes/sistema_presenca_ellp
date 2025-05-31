const admin = require('../firebase'); 
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Token do Firebase não enviado' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    const jwtToken = jwt.sign(
      { uid, email },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Erro ao verificar token do Firebase:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
  login,
};

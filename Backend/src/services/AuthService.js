const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');

const login = async (idToken) => {
  if (!idToken) {
    throw new Error('Token do Firebase não enviado');
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { uid, email } = decodedToken;

  const jwtToken = jwt.sign(
    { uid, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return jwtToken;
};

module.exports = {
  login,
};

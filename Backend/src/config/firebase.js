const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json'); //verificar com lucio esse arquivo

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gerennciador-presenca.firebaseio.com' 
});

module.exports = admin;

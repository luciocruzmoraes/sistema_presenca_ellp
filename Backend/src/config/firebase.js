const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gerennciador-presenca.firebaseio.com' 
});

module.exports = admin;

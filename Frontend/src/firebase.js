// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


const firebaseConfig = {
  apiKey: 'AIzaSyCoqOG0fn34NdwpE9v06tU3ic4GAOz3X2E',
  authDomain: 'gerennciador-presenca.firebaseapp.com',
  projectId: 'gerennciador-presenca',
  storageBucket: 'gerennciador-presenca.firebasestorage.app',
  messagingSenderId: '703271732494',
  appId: '1:703271732494:web:957a26feab45c4da09035f',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

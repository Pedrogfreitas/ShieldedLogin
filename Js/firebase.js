import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFU_1WyzHofBj8euSoukYUuKrQ6a78Ek8",
  authDomain: "shieldedlogin.firebaseapp.com",
  projectId: "shieldedlogin",
  storageBucket: "shieldedlogin.firebasestorage.app",
  messagingSenderId: "695528215872",
  appId: "1:695528215872:web:edd16da2c1839533fb16a5",
  measurementId: "G-FT23JHMN69"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };

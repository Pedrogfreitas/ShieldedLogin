import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFU_1WyzHofBj8euSoukYUuKrQ6a78Ek8",
  authDomain: "shieldedlogin.firebaseapp.com",
  projectId: "shieldedlogin",
  storageBucket: "shieldedlogin.firebasestorage.app",
  messagingSenderId: "695528215872",
  appId: "1:695528215872:web:edd16da2c1839533fb16a5",
  measurementId: "G-FT23JHMN69"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { auth, signInWithEmailAndPassword };
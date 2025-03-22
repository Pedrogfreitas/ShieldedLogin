// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFU_1WyzHofBj8euSoukYUuKrQ6a78Ek8",
  authDomain: "shieldedlogin.firebaseapp.com",
  projectId: "shieldedlogin",
  storageBucket: "shieldedlogin.firebasestorage.app",
  messagingSenderId: "695528215872",
  appId: "1:695528215872:web:edd16da2c1839533fb16a5",
  measurementId: "G-FT23JHMN69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
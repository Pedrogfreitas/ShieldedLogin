import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita recarregar a página

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // 🔐 Cria o usuário no Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Cadastro realizado com sucesso! ✅");
            console.log(userCredential.user);
            window.location.href = "Login.html"; // Redireciona para login após cadastro
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao cadastrar: " + error.message);
        });
});

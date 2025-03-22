import { auth, createUserWithEmailAndPassword } from "./firebase.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Tenta criar o usuário no Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Cadastro realizado com sucesso
            alert("Cadastro realizado com sucesso! ✅");
            console.log("Usuário cadastrado:", userCredential.user);
            window.location.href = "Login.html"; // Redireciona para a página de login
        })
        .catch((error) => {
            // Exibe erro caso falhe
            console.error("Erro ao cadastrar:", error.message);
            alert("Erro ao cadastrar: " + error.message);
        });
});

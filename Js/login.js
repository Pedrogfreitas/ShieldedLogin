import { auth, signInWithEmailAndPassword } from "./firebase.js";

const maxAttempts = 3; // Número máximo de tentativas
const lockoutTime = 30 * 1000; // Tempo de bloqueio (30 segundos)
let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0; // Garantir que a variável 'attempts' seja numérica
let lockedUntil = localStorage.getItem("lockedUntil") || 0;

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("error-message");

function checkLockout() {
    const now = Date.now();
    if (lockedUntil > now) {
        loginButton.disabled = true;
        errorMessage.textContent = `Muitas tentativas! Aguarde ${Math.ceil((lockedUntil - now) / 1000)} segundos.`;
        setTimeout(checkLockout, 1000); // Atualiza a mensagem a cada segundo
    } else {
        loginButton.disabled = false;
        errorMessage.textContent = "";
        localStorage.removeItem("lockedUntil");
    }
}

checkLockout(); // Verifica se o usuário está bloqueado ao carregar a página

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Impede envio real do formulário

    if (attempts >= maxAttempts) {
        lockedUntil = Date.now() + lockoutTime;
        localStorage.setItem("lockedUntil", lockedUntil);
        checkLockout();
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // 🔐 Tenta fazer login com Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user);
            localStorage.removeItem("loginAttempts"); // Reseta as tentativas ao logar com sucesso
            window.location.href = "End.html"; // Redireciona para outra página após login
        })
        .catch((error) => {
            console.error(error);
            attempts++;
            localStorage.setItem("loginAttempts", attempts); // Atualiza as tentativas no localStorage

            if (attempts >= maxAttempts) {
                lockedUntil = Date.now() + lockoutTime;
                localStorage.setItem("lockedUntil", lockedUntil);
                checkLockout();
            } else {
                errorMessage.textContent = `Tentativa ${attempts}/${maxAttempts} falhou.`;
            }
        });
});

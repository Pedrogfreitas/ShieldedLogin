import { auth, signInWithEmailAndPassword } from "./firebase.js";

const maxAttempts = 3; // Número máximo de tentativas
const baseLockoutTime = 30 * 1000; // Tempo de bloqueio inicial (30 segundos)
let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0; // Garantir que a variável 'attempts' seja numérica
let lockedUntil = localStorage.getItem("lockedUntil") || 0;
let blockCount = parseInt(localStorage.getItem("blockCount")) || 0; // Contador de bloqueios

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
        // Aumenta o tempo de bloqueio com base no número de bloqueios anteriores
        const lockoutMultiplier = blockCount + 1; // O multiplicador aumenta a cada bloqueio
        const newLockoutTime = baseLockoutTime * lockoutMultiplier; // Tempo de bloqueio multiplicado

        lockedUntil = Date.now() + newLockoutTime;
        localStorage.setItem("lockedUntil", lockedUntil);
        blockCount++;
        localStorage.setItem("blockCount", blockCount); // Armazena o número de bloqueios
        checkLockout();
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // 🔐 Tenta fazer login com Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login bem-sucedido! ✅"); // Alerta de sucesso
            console.log(userCredential.user);
            localStorage.removeItem("loginAttempts"); // Reseta as tentativas ao logar com sucesso
            window.location.href = "End.html"; // Redireciona para outra página após login
        })
        .catch((error) => {
            console.error(error);
            attempts++;
            localStorage.setItem("loginAttempts", attempts); // Atualiza as tentativas no localStorage

            if (attempts >= maxAttempts) {
                // Aumenta o número de tentativas e configura o bloqueio
                const lockoutMultiplier = blockCount + 1; // Multiplicador baseado no número de bloqueios
                const newLockoutTime = baseLockoutTime * lockoutMultiplier; // Tempo de bloqueio multiplicado
                lockedUntil = Date.now() + newLockoutTime;
                localStorage.setItem("lockedUntil", lockedUntil);
                blockCount++;
                localStorage.setItem("blockCount", blockCount); // Armazena o número de bloqueios
                checkLockout();
            } else {
                errorMessage.textContent = `Tentativa ${attempts}/${maxAttempts} falhou.`;
            }
        });
});
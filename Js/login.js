const maxAttempts = 3; // Número máximo de tentativas
const lockoutTime = 30 * 1000; // Tempo de bloqueio (30 segundos)
let attempts = localStorage.getItem("loginAttempts") || 0;
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
    event.preventDefault(); // Impede envio real do formulário (simulação)

    if (attempts >= maxAttempts) {
        lockedUntil = Date.now() + lockoutTime;
        localStorage.setItem("lockedUntil", lockedUntil);
        checkLockout();
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Simula falha de login (substitua por autenticação real no backend)
    const loginFailed = true;

    if (loginFailed) {
        attempts++;
        localStorage.setItem("loginAttempts", attempts);

        if (attempts >= maxAttempts) {
            lockedUntil = Date.now() + lockoutTime;
            localStorage.setItem("lockedUntil", lockedUntil);
            checkLockout();
        } else {
            errorMessage.textContent = `Tentativa ${attempts}/${maxAttempts} falhou.`;
        }
    }
});

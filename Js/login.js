import { auth, signInWithEmailAndPassword } from "./firebase.js";
import { getMultiFactorResolver, PhoneAuthProvider, multiFactor } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


const maxAttempts = 3; // Número máximo de tentativas
const baseLockoutTime = 30 * 1000; // Tempo de bloqueio inicial (30 segundos)
let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
let lockedUntil = parseInt(localStorage.getItem("lockedUntil")) || 0;
let blockCount = parseInt(localStorage.getItem("blockCount")) || 0;

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("error-message");

window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
        console.log("reCAPTCHA verificado!");
    },
});

function checkLockout() {
    const now = Date.now();
    if (lockedUntil > now) {
        loginButton.disabled = true;
        errorMessage.textContent = `Muitas tentativas! Aguarde ${Math.ceil((lockedUntil - now) / 1000)} segundos.`;
        setTimeout(checkLockout, 1000);
    } else {
        loginButton.disabled = false;
        errorMessage.textContent = "";
        localStorage.removeItem("lockedUntil");
    }
}

checkLockout();

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (attempts >= maxAttempts) {
        const lockoutMultiplier = blockCount + 1;
        const newLockoutTime = baseLockoutTime * lockoutMultiplier;
        lockedUntil = Date.now() + newLockoutTime;
        localStorage.setItem("lockedUntil", lockedUntil);
        blockCount++;
        localStorage.setItem("blockCount", blockCount);
        checkLockout();
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Se o usuário precisar de autenticação multifator
        if (multiFactor(user).enrolledFactors.length > 0) {
            alert("Autenticação de dois fatores necessária! 📲");

            // Obtém o resolver para o MFA
            const resolver = getMultiFactorResolver(auth, userCredential);
            const phoneInfoOptions = {
                multiFactorHint: resolver.hints[0], // Seleciona o primeiro método disponível
                session: resolver.session
            };

            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier);

            const verificationCode = prompt("Digite o código de verificação enviado para seu telefone:");

            if (verificationCode) {
                const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                await multiFactor(user).resolveSignIn(credential);
                alert("Autenticação multifator bem-sucedida! ✅");
            } else {
                throw new Error("Código de verificação inválido.");
            }
        }

        alert("Login bem-sucedido! ✅");
        localStorage.removeItem("loginAttempts");
        window.location.href = "End.html";
    } catch (error) {
        console.error(error);
        attempts++;
        localStorage.setItem("loginAttempts", attempts);

        if (attempts >= maxAttempts) {
            const lockoutMultiplier = blockCount + 1;
            const newLockoutTime = baseLockoutTime * lockoutMultiplier;
            lockedUntil = Date.now() + newLockoutTime;
            localStorage.setItem("lockedUntil", lockedUntil);
            blockCount++;
            localStorage.setItem("blockCount", blockCount);
            checkLockout();
        } else {
            errorMessage.textContent = `Tentativa ${attempts}/${maxAttempts} falhou.`;
        }
    }
});

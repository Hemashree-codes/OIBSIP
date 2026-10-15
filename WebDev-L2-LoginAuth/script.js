
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const message = document.getElementById("message");
const dashboard = document.getElementById("dashboard");
const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardMessage = document.getElementById("dashboardMessage");
const logoutBtn = document.getElementById("logoutBtn");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.hidden = false;
}

function clearMessage() {
    message.textContent = "";
    message.hidden = true;
    message.className = "message";
}

function showLoginForm() {
    loginForm.hidden = false;
    registerForm.hidden = true;
    dashboard.hidden = true;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    pageTitle.textContent = "Welcome back";
    pageSubtitle.textContent = "Sign in to continue to your account.";

    clearMessage();
}

function showRegisterForm() {
    loginForm.hidden = true;
    registerForm.hidden = false;
    dashboard.hidden = true;

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    pageTitle.textContent = "Create your account";
    pageSubtitle.textContent = "Join SecureSpace in just a few steps.";

    clearMessage();
}

function getSavedUsers() {
    // This demo intentionally does not save passwords.
    // Registration is validated, but real authentication needs a backend.
    return [];
}

function showDashboard(name, email) {
    loginForm.hidden = true;
    registerForm.hidden = true;
    dashboard.hidden = false;

    loginTab.classList.remove("active");
    registerTab.classList.remove("active");

    pageTitle.textContent = "You're all set!";
    pageSubtitle.textContent = "Your demonstration session is active.";

    dashboardTitle.textContent = `Welcome, ${name}!`;
    dashboardMessage.textContent =
        `Demo session for ${email}. No real account was created.`;

    clearMessage();
}

loginTab.addEventListener("click", showLoginForm);
registerTab.addEventListener("click", showRegisterForm);
showRegister.addEventListener("click", showRegisterForm);
showLogin.addEventListener("click", showLoginForm);

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (name.length < 2) {
        showMessage("Please enter a name with at least 2 characters.", "error");
        return;
    }

    if (password.length < 8) {
        showMessage("Your password must contain at least 8 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("The passwords do not match. Please try again.", "error");
        return;
    }

    // Do not store passwords or pretend this is real authentication.
    showMessage(
        "Form validation successful! This is a front-end demo; no account or password has been saved.",
        "success"
    );

    registerForm.reset();
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }

    if (password.length < 8) {
        showMessage("Please enter a password with at least 8 characters.", "error");
        return;
    }

    // This is a visual demonstration, not account verification.
    showDashboard("Guest", email);
});

logoutBtn.addEventListener("click", function () {
    loginForm.reset();
    registerForm.reset();
    showLoginForm();
    showMessage("You have left the demonstration session.", "success");
});

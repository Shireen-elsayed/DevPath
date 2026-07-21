const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginTab2 = document.getElementById("loginTab2");
const registerTab2 = document.getElementById("registerTab2");
const openRegister = document.getElementById("openRegister");
const openLogin = document.getElementById("openLogin");
function showLogin() {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
}
function showRegister() {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
}
registerTab.addEventListener("click", showRegister);
openRegister.addEventListener("click", function(e){
    e.preventDefault();
    showRegister();
});
loginTab2.addEventListener("click", showLogin);
openLogin.addEventListener("click", function(e){
    e.preventDefault();
    showLogin();
});
const forgotPassword = document.querySelector(".forgot-password");
const overlay = document.getElementById("overlay");
const resetBox = document.getElementById("resetPopup");
const savePassword = document.getElementById("savePassword");
forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();
    overlay.classList.add("show");
    resetBox.classList.add("show");
});
savePassword.addEventListener("click", async function () {
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    if (email === "" || newPassword === "") {
        Swal.fire({
            icon: "warning",
            title: "Missing Data",
            text: "Please enter your email and new password."
        });
        return;
    }
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    const user = users.find(function (u) {
        return u.email === email;
    });
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Email Not Found"
        });
        return;
    }
    const updateResponse = await fetch(
        `http://localhost:3000/users/${user.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: newPassword
            })
        }
    );
    if (!updateResponse.ok) {
        Swal.fire({
            icon: "error",
            title: "Server Error"
        });
        return;
    }
    Swal.fire({
        icon: "success",
        title: "Password Updated Successfully 🎉",
        timer: 1500,
        showConfirmButton: false
    });
    document.getElementById("resetEmail").value = "";
    document.getElementById("newPassword").value = "";
    overlay.classList.remove("show");
    resetBox.classList.remove("show");
});
overlay.addEventListener("click", function () {
    overlay.classList.remove("show");
    resetBox.classList.remove("show");
});
resetBox.addEventListener("click", function (e) {
    e.stopPropagation();
});
const loginFormElement=document.querySelector(".loginForm");
const registerFormElement=document.querySelector(".registerForm");
const togglePasswordBtns = document.querySelectorAll(".toggle-password");
togglePasswordBtns.forEach(function(button){
    button.addEventListener("click", function(){
        const passwordInput =
            button.previousElementSibling;
        if(passwordInput.type === "password"){
            passwordInput.type = "text";
            button.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';
        }else{
            passwordInput.type = "password";
            button.innerHTML =
            '<i class="fa-regular fa-eye"></i>';
     }
    });
});
let Users=[];
async function loadUsers() {
    const response = await fetch("http://localhost:3000/users");
    Users = await response.json();
}
loadUsers();
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
loginFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    await loadUsers();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    const user = Users.find(function(user){
        return user.email === email;
    });
    if(user === undefined){
        Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Email not found😔"
});
        return;
    }
    if(user.password !== password){
        Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Incorrect password😔"
});
        return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("currentUserId",user.id);
    Swal.fire({
    icon: "success",
    title: "Welcome!",
    text: "Login Successful🤩",
    timer: 1500,
    showConfirmButton: false
}).then(function () {
    window.location.replace("../pages/dashboard.html");
});
});
const registerNameInput = document.getElementById("fullname");
const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
function showError(input, message) {
    input.classList.add("input-error");
    const inputGroup = input.closest(".input-group");
    let error = inputGroup.querySelector(".error-message");
    if (!error) {
        error = document.createElement("small");
        error.className = "error-message";
        inputGroup.appendChild(error);
    }
    error.textContent = message;
}
function clearError(input) {
    input.classList.remove("input-error");
    const inputGroup = input.closest(".input-group");
    const error = inputGroup.querySelector(".error-message");
    if (error) {
        error.remove();
    }
}
registerNameInput.addEventListener("input", function () {
    clearError(registerNameInput);
});
registerEmailInput.addEventListener("input", function () {
    clearError(registerEmailInput);
});
registerPasswordInput.addEventListener("input", function () {
    clearError(registerPasswordInput);
});
registerFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    await loadUsers();
    const userName = registerNameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!nameRegex.test(userName)) {
    showError(registerNameInput, "Name must contain at least 3 letters.");
    return;
}
if (!emailRegex.test(email)) {
    showError(registerEmailInput, "Please enter a valid email.");
    return;
}
if (!passwordRegex.test(password)) {
    showError(registerPasswordInput, "Password must be at least 6 characters and contain letters and numbers.");
    return;
}
    const emailExists = Users.find(function (user) {
        return user.email === email;
    });
    if (emailExists) {
        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "This email already exists."
        });
        return;
    }
    const newUser = {
        username: userName,
        email: email,
        password: password,
        track: "",
        level: "",
        avatar: "",
        overallScore: 0,
        skills: [],
        completedSkillIds: [],
        xpEarned: 0,
        xpNextReward: 3000,
        streakDays: 0,
        streakWeek: [
            { day: "Mon", done: false },
            { day: "Tue", done: false },
            { day: "Wed", done: false },
            { day: "Thu", done: false },
            { day: "Fri", done: false },
            { day: "Sat", done: false },
            { day: "Sun", done: false }
        ]
    };
    const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
});
if(!response.ok){
    Swal.fire({
        icon:"error",
        title:"Server Error"
    });
    return;
}
const savedUser = await response.json();
    localStorage.setItem(
        "currentUser",
        JSON.stringify(savedUser)
    );
    localStorage.setItem(
        "currentUserId",
        savedUser.id
    );
    registerFormElement.reset();
    Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Welcome to DevPath 🎉",
        timer: 1500,
        showConfirmButton: false
    }).then(function () {
        window.location.replace("../pages/quiz.html");
    });
});
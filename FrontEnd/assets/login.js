const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDisplay = document.getElementById("errorDisplay");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            sessionStorage.setItem("token", token);
            window.location.href = "./index.html";
        } else {
            errorDisplay.textContent = "Erreur dans l’identifiant ou le mot de passe";
            errorDisplay.style.display = "block";
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
    }
});
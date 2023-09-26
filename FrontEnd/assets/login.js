const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDisplay = document.getElementById("errorDisplay");

// Login form
loginForm.addEventListener("submit", (event) => {
    // Prevent reload when submit
    event.preventDefault(); 
    // Retrieves mail&pass entered by user
    const email = emailInput.value;
    const password = passwordInput.value;
    // POST request to API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        // Convert data user in JSON string
        body: JSON.stringify({ email, password }),
    })
    .then((response) => {
        if (response.ok) {
    // Extract & stock token in sessionStorage
    response.json().then((data) => {
        const token = data.token;
        sessionStorage.setItem("token", token);
        window.location.href = "./index.html";
      });
        } else {
            // Display error message if false
            errorDisplay.textContent = "Erreur dans l’identifiant ou le mot de passe";
            errorDisplay.style.display = "block";
        }
    })
    .catch((error) => {
        console.error("Une erreur s'est produite lors de la connexion :", error);
    });
});
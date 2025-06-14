function checkValidity() {
    const email = document.getElementById("input-email").value.trim();
    const username = document.getElementById("input-username").value.trim();
    const password = document.getElementById("input-password").value;
    const confirmPassword = document.getElementById("input-confirm-password").value;

    document.getElementById("error-email").textContent = "";
    document.getElementById("error-username").textContent = "";
    document.getElementById("error-password").textContent = "";
    document.getElementById("error-confirm-password").textContent = "";

    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("error-email").textContent = "Nieprawidłowy adres e-mail.";
        hasError = true;
    }

    if (username.length < 3 || username.length > 20) {
        document.getElementById("error-username").textContent = "Nazwa użytkownika musi mieć od 3 do 20 znaków.";
        hasError = true;
    }

    if (password.length < 8) {
        document.getElementById("error-password").textContent = "Hasło musi mieć co najmniej 8 znaków.";
        hasError = true;
    } else {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!(hasLetter && hasNumber && hasSpecial)) {
            document.getElementById("error-password").textContent =
                "Hasło musi zawierać litery, cyfry i znak specjalny.";
            hasError = true;
        }
    }

    if (password !== confirmPassword) {
        document.getElementById("error-confirm-password").textContent = "Hasła nie są takie same.";
        hasError = true;
    }

    if (!hasError) {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);

    document.getElementById("validation-box-signup").style.display = "none";
    document.getElementById("validation-box-login").style.display = "flex";
}

}

function checkLogin() {
    const storedUsername = sessionStorage.getItem("username");
    const storedPassword = sessionStorage.getItem("password");

    const loginUsername = document.getElementById("input-username-login").value.trim();
    const loginPassword = document.getElementById("input-password-login").value;

    const loginError = document.getElementById("login-error");
    loginError.textContent = "";

    if (!storedUsername || !storedPassword) {
        loginError.textContent = "Brak zarejestrowanego użytkownika.";
        return;
    }

    if (loginUsername === storedUsername && loginPassword === storedPassword) {
        document.getElementById("validation-box-login").style.display = "none";
        document.getElementById("api-content").style.display = "flex";
    } else {
        loginError.textContent = "Nieprawidłowy login lub hasło.";
    }
}


function changeVisibility() {
    const input = document.getElementById("input-password");
    input.type = input.type === "password" ? "text" : "password";
}

function changeVisibilityLogin() {
    const input = document.getElementById("input-password-login");
    input.type = input.type === "password" ? "text" : "password";
}

function getCatFact() {
    fetch('https://catfact.ninja/fact')
        .then(response => response.json())
        .then(data => {
            const catFactElements = document.querySelectorAll('#cat-fact');
            catFactElements.forEach(el => el.textContent = data.fact);
        })
        .catch(error => {
            console.error('Error fetching cat fact:', error);
            const catFactElements = document.querySelectorAll('#cat-fact');
            catFactElements.forEach(el => el.textContent = "Couldn't fetch a cat fact right now.");
        });
}

document.getElementById("gen-facts").addEventListener("click", getCatFacts);
document.getElementById("gen-breeds").addEventListener("click", getCatBreeds);

function getCatFacts() {
    const listContainer = document.getElementById("api-item-list");
    listContainer.innerHTML = "<p class='loading'>Loading! ฅ^•ﻌ•^ฅ</p>";

    Promise.all(
        Array.from({length: 8}, () => fetch('https://catfact.ninja/fact').then(res => res.json()))
    )
    .then(facts => {
        listContainer.innerHTML = "<ul></ul>";
        const ul = listContainer.querySelector("ul");
        facts.forEach((factObj, index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${factObj.fact}`;
            ul.appendChild(li);
        });
    })
    .catch(error => {
        console.error("Error fetching cat facts:", error);
        listContainer.innerHTML = "<p>Could not fetch cat facts.</p>";
    });
}

async function getCatBreeds() {
    const listContainer = document.getElementById("api-item-list");
    listContainer.innerHTML = "<p class='loading'>Loading! ฅ^•ﻌ•^ฅ</p>";

    try {
        const metaResponse = await fetch('https://catfact.ninja/breeds?limit=1');
        const metaData = await metaResponse.json();
        const totalBreeds = metaData.total;
        const pageSize = 8;
        const totalPages = Math.ceil(totalBreeds / pageSize);

        let selectedBreeds = [];

        while (selectedBreeds.length < 8) {
            const randomPage = Math.floor(Math.random() * totalPages) + 1;

            const response = await fetch(`https://catfact.ninja/breeds?limit=${pageSize}&page=${randomPage}`);
            const data = await response.json();

            const randomBreed = data.data[Math.floor(Math.random() * data.data.length)];

            if (!selectedBreeds.find(b => b.breed === randomBreed.breed)) {
                selectedBreeds.push(randomBreed);
            }
        }

        listContainer.innerHTML = "<ul></ul>";
        const ul = listContainer.querySelector("ul");

        selectedBreeds.forEach((breed, index) => {
            const li = document.createElement("li");
            li.style.fontSize = "24px";
            li.textContent = `${index + 1}. ${breed.breed} (${breed.country || "Unknown Country"})`;
            ul.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching random cat breeds:", error);
        listContainer.innerHTML = "<p>Could not fetch cat breeds.</p>";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("eye-icon").addEventListener("click", changeVisibility);
    document.getElementById("eye-icon-login").addEventListener("click", changeVisibilityLogin);
    document.querySelector("#validation-box-signup #signup-button").addEventListener("click", checkValidity);
    document.querySelector("#validation-box-login #login-button").addEventListener("click", checkLogin);
    getCatFact();

    document.getElementById("validation-box-signup").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkValidity();
        }
    });

    document.getElementById("validation-box-login").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkLogin();
        }
    });
});


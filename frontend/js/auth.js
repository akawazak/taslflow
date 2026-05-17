async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorElement = document.getElementById("login-error");

  errorElement.textContent = "";

  try {
    const response = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    showSessionView(response.data.user);
  } catch (error) {
    errorElement.style.color = "#ef5b5b";
    errorElement.textContent = error.response?.data?.message || "Erreur de connexion.";
  }
}

async function register() {
  const fullName = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const errorElement = document.getElementById("register-error");

  errorElement.textContent = "";

  try {
    const response = await axios.post("/auth/register", { fullName, email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    showSessionView(response.data.user);
  } catch (error) {
    const validationError = error.response?.data?.errors?.[0]?.msg;
    errorElement.style.color = "#ef5b5b";
    errorElement.textContent = validationError || error.response?.data?.message || "Erreur d'inscription.";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("reg-name").value = "";
  document.getElementById("reg-email").value = "";
  document.getElementById("reg-password").value = "";
  document.dispatchEvent(new Event("taskflow:auth-changed"));
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
  document.getElementById("session-view").style.display = "none";
}

function showLogin() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("session-view").style.display = "none";
}

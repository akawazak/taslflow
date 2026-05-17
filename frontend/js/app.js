function getStoredUser() {
  const raw = localStorage.getItem("user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function showAuthForms() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("session-view").style.display = "none";
}

function showSessionView(user) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("session-view").style.display = "block";
  document.getElementById("session-user").textContent = user
    ? `${user.fullName} (${user.email})`
    : "";
}

function restoreSession() {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (token && user) {
    showSessionView(user);
    return;
  }

  showAuthForms();
}

window.addEventListener("load", restoreSession);
document.addEventListener("taskflow:auth-changed", restoreSession);


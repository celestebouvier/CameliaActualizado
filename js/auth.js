document.addEventListener("DOMContentLoaded", () => {
  // Registration
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const confirm = document.getElementById("register-password-confirm").value;

      if (name.length < 2) {
        return showAuthMessage("El nombre debe tener al menos 2 caracteres.", true);
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return showAuthMessage("Por favor ingrese un correo electrónico válido.", true);
      }
      if (password.length < 6) {
        return showAuthMessage("La contraseña debe tener al menos 6 caracteres.", true);
      }
      if (password !== confirm) {
        return showAuthMessage("Las contraseñas no coinciden.", true);
      }
      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === email)) {
        return showAuthMessage("Este correo ya está registrado.", true);
      }
      users.push({ name, email, password }); // ⚠️ For demo only; don't store plain passwords in real apps
      localStorage.setItem("users", JSON.stringify(users));
      showAuthMessage("Usuario registrado con éxito. Redirigiendo...", false);
      setTimeout(() => window.location.href = "login.html", 1200);
    });
  }

  // Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        showAuthMessage("¡Bienvenido " + user.name + "!", false);
        setTimeout(() => window.location.href = "index.html", 1200);
      } else {
        showAuthMessage("Correo o contraseña incorrectos.", true);
      }
    });
  }

  // UI Session Status
  const loginBtn = document.querySelector(".auth-btn");
  const registerBtn = document.querySelector(".register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userInfo = document.getElementById("user-info");
  const profileBtn = document.querySelector(".profile-btn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (profileBtn) profileBtn.style.display = "inline";
    if (userInfo) {
      userInfo.style.display = "inline";
      userInfo.textContent = `Hola, ${currentUser.name}`;
    }
    if (logoutBtn) logoutBtn.style.display = "inline";
  } else {
    if (loginBtn) loginBtn.style.display = "inline";
    if (registerBtn) registerBtn.style.display = "inline";
    if (profileBtn) profileBtn.style.display = "none";
    if (userInfo) userInfo.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  }

  // Helper for styled message display
  function showAuthMessage(msg, isError = false) {
    let el = document.querySelector(".auth-message");
    if (!el) {
      el = document.createElement("div");
      el.className = "auth-message";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.cssText = `
      position: fixed; 
      top: 18px; 
      right: 24px;
      background: ${isError ? "#ff4757" : "#1abc9c"};
      color: #fff;
      padding: 15px 30px;
      border-radius: 24px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      font-size: 1rem;
      animation: slideInRight 0.5s ease;
    `;
    setTimeout(() => { if (el) el.remove(); }, 2200);
    return false; // for `return showAuthMessage()`
  }
});
// login-system.js
const SYSTEM_PASSWORD = "kuntilanak 7";
const STORAGE_KEY = "auth_pass_v1";

function createOverlay(changeNotice = false) {
  const overlay = document.createElement("div");
  overlay.id = "auth-overlay";

  const noticeHTML = changeNotice
    ? '<div id="notice">Mister, password sistem sudah diganti — silakan login ulang!</div>'
    : "";

  overlay.innerHTML = /*html*/ `
    <div id="login-box" role="dialog" aria-modal="true" aria-labelledby="login-title">
      ${noticeHTML}
      <h2 id="login-title" style="margin:0 0 8px">Masukkan Password</h2>
      <input type="password" id="password-input" placeholder="Password..." autocomplete="current-password" />
      <button id="login-btn" type="button">Masuk</button>
      <div id="error" aria-live="polite"></div>
    </div>
  `;
 
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent scrolling

  const input = document.getElementById("password-input");
  setTimeout(() => input.focus(), 50);

  document.getElementById("login-btn").onclick = checkPassword;
  input.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") checkPassword(); 
  });
}

function checkAuthOnLoad() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    createOverlay(false);
    return;
  }

  if (stored !== SYSTEM_PASSWORD) {
    localStorage.removeItem(STORAGE_KEY);
    createOverlay(true);
    return;
  }

  // Jika sudah login, buat tombol logout
  createLogoutButton();
}

function checkPassword() {
  const inputEl = document.getElementById("password-input");
  const errorEl = document.getElementById("error");
  const input = inputEl ? inputEl.value : "";

  if (!input) {
    if (errorEl) errorEl.textContent = "Masukkan password dulu.";
    return;
  }

  if (input === SYSTEM_PASSWORD) {
    localStorage.setItem(STORAGE_KEY, input);
    const overlay = document.getElementById("auth-overlay");
    if (overlay) {
      overlay.remove();
      document.body.style.overflow = ''; // Restore scrolling
    }
    // Buat tombol logout setelah login sukses
    createLogoutButton();
  } else {
    if (errorEl) errorEl.textContent = "Password salah!";
  }
}

// Fungsi untuk membuat tombol logout secara dinamis
function createLogoutButton() {
  // Cek apakah tombol logout sudah ada, jika sudah, maka tidak perlu dibuat lagi
  if (document.getElementById('logout-btn')) {
    return;
  }

  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logout-btn';
  logoutBtn.textContent = 'Logout';
  logoutBtn.onclick = logout;
  document.body.appendChild(logoutBtn);
}

// Fungsi untuk menghapus tombol logout (saat logout)
function removeLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.remove();
  }
}

function logout() {
  localStorage.removeItem(STORAGE_KEY);
  removeLogoutButton(); // Hapus tombol logout
  location.reload();
}

// Auto-execute
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkAuthOnLoad);
} else {
  checkAuthOnLoad();
}
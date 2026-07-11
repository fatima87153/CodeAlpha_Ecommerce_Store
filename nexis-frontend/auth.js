// =====================================================
// Talks to the real backend now (Express + MongoDB)
// instead of storing users/passwords in localStorage.
// The JWT token proves who's logged in on each request.
// =====================================================

const API_BASE = "http://localhost:5000/api";

const TOKEN_KEY = "nexis_token";
const SESSION_KEY = "nexis_current_user";

// ===================== SESSION =====================
function getCurrentUser() {
    try {
        const saved = localStorage.getItem(SESSION_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
}

// ===================== REGISTER =====================
async function registerUser(name, email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Registration failed" };
        }

        setSession(data.token, data.user);
        return { success: true };
    } catch (err) {
        return { success: false, message: "Could not reach the server. Is the backend running?" };
    }
}

// ===================== LOGIN =====================
async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Login failed" };
        }

        setSession(data.token, data.user);
        return { success: true };
    } catch (err) {
        return { success: false, message: "Could not reach the server. Is the backend running?" };
    }
}

// ===================== NAV UI UPDATE =====================
function updateNavAuthUI() {
    const loginSlot = document.querySelector(".login-link");
    if (!loginSlot) return;

    const user = getCurrentUser();

    if (user) {
        loginSlot.innerHTML = `
            <span class="nav-user-greeting">Hi, ${user.name.split(" ")[0]}</span>
            <a href="#" class="nav-logout-link" id="nav-logout-btn">Logout</a>
        `;
        const logoutBtn = document.getElementById("nav-logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logoutUser();
            });
        }
    } else {
        loginSlot.innerHTML = `<a href="login.html" class="nav-login-link">Login</a>`;
    }
}

document.addEventListener("DOMContentLoaded", updateNavAuthUI);

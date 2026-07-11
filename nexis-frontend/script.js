// =====================================================
// Products now come from the real backend (MongoDB),
// not a hardcoded array. Cart stays in localStorage
// since it's just temporary browsing state.
// =====================================================

let products = [];
let cart = loadCart();

// ===================== FETCH PRODUCTS FROM BACKEND =====================
async function fetchProducts() {
    const grid = document.querySelector(".products-grid");

    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // map backend's _id to a simple "id" field used throughout the frontend
        products = data.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image
        }));

        renderProducts();
    } catch (err) {
        console.error("Could not load products:", err);
        if (grid) {
            grid.innerHTML = `<p class="cart-empty">Couldn't load products. Make sure the backend server is running (npm run dev in nexis-backend).</p>`;
        }
    }
}

// ===================== PERSISTENCE (cart only) =====================
function loadCart() {
    try {
        const saved = localStorage.getItem("nexis_cart");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem("nexis_cart", JSON.stringify(cart));
}

// ===================== RENDER PRODUCTS =====================
function renderProducts() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return; // not on this page

    if (products.length === 0) {
        grid.innerHTML = `<p class="cart-empty">No products found.</p>`;
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <a href="product-details.html?id=${p.id}" class="product-link">
                <div class="card-image-window">
                    <img src="${p.image}" alt="${p.name}">
                </div>
            </a>
            <div class="card-footer">
                <a href="product-details.html?id=${p.id}" class="product-link">
                    <p class="product-title">${p.name}</p>
                </a>
                <div class="card-action-row">
                    <span class="price">$${p.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" aria-label="Add ${p.name} to cart" data-id="${p.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    grid.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
}

// ===================== CART LOGIC =====================
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    saveCart();
    updateCartBadge();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCartPanel();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartBadge();
        renderCartPanel();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
    const badge = document.querySelector(".cart-badge");
    if (!badge) return;
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

// ===================== CART PANEL (SIDEBAR) =====================
function renderCartPanel() {
    const panel = document.querySelector(".cart-panel-body");
    const totalEl = document.querySelector(".cart-total-amount");
    if (!panel || !totalEl) return;

    if (cart.length === 0) {
        panel.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    } else {
        panel.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="qty-controls">
                        <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            </div>
        `).join("");
    }

    totalEl.textContent = `$${getCartTotal().toFixed(2)}`;

    panel.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const delta = btn.dataset.action === "inc" ? 1 : -1;
            changeQty(id, delta);
        });
    });

    panel.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
    });
}

function toggleCartPanel() {
    document.querySelector(".cart-panel").classList.toggle("open");
    document.querySelector(".cart-overlay").classList.toggle("open");
    renderCartPanel();
}

// ===================== TOAST NOTIFICATION =====================
function showToast(message) {
    const toast = document.querySelector(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartBadge();

    document.querySelectorAll(".nav-right .add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", toggleCartPanel);
    });

    const closeBtn = document.querySelector(".cart-close-btn");
    const overlay = document.querySelector(".cart-overlay");
    const checkoutBtn = document.querySelector(".checkout-btn");

    if (closeBtn) closeBtn.addEventListener("click", toggleCartPanel);
    if (overlay) overlay.addEventListener("click", toggleCartPanel);
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Your cart is empty");
                return;
            }
            window.location.href = "checkout.html";
        });
    }
});

// =====================================================
// Checkout now sends the real order to the backend,
// which re-checks prices against the database and
// saves the order in MongoDB (not just localStorage).
// =====================================================

function loadCart() {
    try {
        const saved = localStorage.getItem("nexis_cart");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

const cart = loadCart();
const SHIPPING_FEE = cart.length > 0 ? 10 : 0;

// ===================== RENDER ORDER SUMMARY =====================
function renderSummary() {
    const container = document.getElementById("summary-items");
    const subtotalEl = document.getElementById("summary-subtotal");
    const shippingEl = document.getElementById("summary-shipping");
    const totalEl = document.getElementById("summary-total");

    if (cart.length === 0) {
        container.innerHTML = `<p class="cart-empty">Your cart is empty. <a href="index.html">Go shopping</a>.</p>`;
        subtotalEl.textContent = "$0.00";
        shippingEl.textContent = "$0.00";
        totalEl.textContent = "$0.00";
        document.querySelector(".place-order-btn").disabled = true;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="summary-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-item-info">
                <p class="summary-item-name">${item.name}</p>
                <p class="summary-item-qty">Qty: ${item.qty}</p>
            </div>
            <span class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
    `).join("");

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = subtotal + SHIPPING_FEE;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${SHIPPING_FEE.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// ===================== FORM VALIDATION =====================
function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".shipping-form input").forEach(el => el.classList.remove("input-error"));
}

function setError(fieldName, message) {
    const errorEl = document.querySelector(`.field-error[data-for="${fieldName}"]`);
    const inputEl = document.getElementById(fieldName);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add("input-error");
}

function validateForm(formData) {
    clearErrors();
    let isValid = true;

    if (!formData.fullName.trim()) {
        setError("fullName", "Full name is required");
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        setError("email", "Enter a valid email address");
        isValid = false;
    }

    const phonePattern = /^[0-9\-\+\s]{7,15}$/;
    if (!phonePattern.test(formData.phone)) {
        setError("phone", "Enter a valid phone number");
        isValid = false;
    }

    if (!formData.address.trim()) {
        setError("address", "Address is required");
        isValid = false;
    }

    if (!formData.city.trim()) {
        setError("city", "City is required");
        isValid = false;
    }

    if (!formData.postalCode.trim()) {
        setError("postalCode", "Postal code is required");
        isValid = false;
    }

    if (formData.payment === "card") {
        const cardPattern = /^[0-9\s]{13,19}$/;
        if (!cardPattern.test(formData.cardNumber)) {
            setError("cardNumber", "Enter a valid card number");
            isValid = false;
        }

        const expiryPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        if (!expiryPattern.test(formData.cardExpiry)) {
            setError("cardExpiry", "Use MM/YY format");
            isValid = false;
        }

        const cvvPattern = /^[0-9]{3}$/;
        if (!cvvPattern.test(formData.cardCvv)) {
            setError("cardCvv", "Enter a valid 3-digit CVV");
            isValid = false;
        }
    }

    return isValid;
}

// ===================== ORDER SUBMISSION =====================
async function handleFormSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) return;

    const form = e.target;
    const formData = {
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        city: form.city.value,
        postalCode: form.postalCode.value,
        payment: form.payment.value,
        cardNumber: form.cardNumber ? form.cardNumber.value : "",
        cardExpiry: form.cardExpiry ? form.cardExpiry.value : "",
        cardCvv: form.cardCvv ? form.cardCvv.value : ""
    };

    if (!validateForm(formData)) return;

    const submitBtn = document.querySelector(".place-order-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Placing order...";

    try {
        const token = getToken();

        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart.map(item => ({ productId: item.id, qty: item.qty })),
                shipping: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode
                },
                paymentMethod: formData.payment
            })
        });

        const order = await res.json();

        if (!res.ok) {
            alert(order.message || "Something went wrong placing your order.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Place Order";
            return;
        }

        // stash the real order (from the database) for the confirmation page
        const orderDetails = {
            name: formData.fullName,
            orderNumber: order.orderNumber,
            total: order.total.toFixed(2),
            payment: order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit / Debit Card",
            address: `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.postalCode}`
        };
        sessionStorage.setItem("nexis_last_order", JSON.stringify(orderDetails));

        // cart lived in the browser only — clear it now that the order is saved in the database
        localStorage.removeItem("nexis_cart");

        window.location.href = "order-confirmation.html";
    } catch (err) {
        alert("Could not reach the server. Make sure the backend is running.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Place Order";
    }
}

// ===================== PAYMENT METHOD TOGGLE =====================
function initPaymentToggle() {
    const radios = document.querySelectorAll('input[name="payment"]');
    const cardFields = document.getElementById("card-fields");

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            cardFields.hidden = document.querySelector('input[name="payment"]:checked').value !== "card";
        });
    });
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    // require login before checking out
    if (typeof getCurrentUser === "function" && !getCurrentUser()) {
        sessionStorage.setItem("nexis_redirect_after_login", "checkout.html");
        window.location.href = "login.html";
        return;
    }

    renderSummary();
    initPaymentToggle();

    // prefill known details from the logged-in user
    const user = getCurrentUser();
    if (user) {
        const nameField = document.getElementById("fullName");
        const emailField = document.getElementById("email");
        if (nameField) nameField.value = user.name;
        if (emailField) emailField.value = user.email;
    }

    const form = document.getElementById("shipping-form");
    if (form) form.addEventListener("submit", handleFormSubmit);
});

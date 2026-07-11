let currentProduct = null;
let selectedQty = 1;

// ===================== FETCH SINGLE PRODUCT =====================
async function fetchProductDetails() {
    const container = document.getElementById("product-details-view");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = `<p class="cart-empty">No product specified. <a href="products.html">Browse products</a>.</p>`;
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const p = await res.json();

        currentProduct = {
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image,
            description: p.description,
            category: p.category,
            stock: p.stock
        };

        // make sure this product is available to addToCart() in script.js,
        // even if the full product list hasn't finished loading yet
        if (typeof products !== "undefined" && !products.find(x => x.id === currentProduct.id)) {
            products.push(currentProduct);
        }

        renderProductDetails(currentProduct);
        document.getElementById("breadcrumb-current").textContent = currentProduct.name;
        document.title = `${currentProduct.name} | NEXIS TECH`;
    } catch (err) {
        container.innerHTML = `<p class="cart-empty">Couldn't load this product. <a href="products.html">Browse all products</a>.</p>`;
    }
}

// ===================== RENDER =====================
function renderProductDetails(p) {
    const container = document.getElementById("product-details-view");

    const description = p.description && p.description.trim()
        ? p.description
        : "A premium addition to your everyday tech lineup — built for reliable performance, clean design, and long-term durability.";

    container.innerHTML = `
        <div class="product-details-layout">

            <div class="product-details-image">
                <img src="${p.image}" alt="${p.name}">
            </div>

            <div class="product-details-info">
                <span class="product-category-tag">${p.category || "General"}</span>
                <h1>${p.name}</h1>
                <p class="product-details-price">$${p.price.toFixed(2)}</p>

                <p class="product-details-description">${description}</p>

                <p class="product-stock ${p.stock > 0 ? "in-stock" : "out-of-stock"}">
                    ${p.stock > 0 ? `In Stock (${p.stock} available)` : "Out of Stock"}
                </p>

                <div class="qty-selector-row">
                    <span>Quantity</span>
                    <div class="qty-selector">
                        <button id="qty-dec" aria-label="Decrease quantity">-</button>
                        <span id="qty-display">1</span>
                        <button id="qty-inc" aria-label="Increase quantity">+</button>
                    </div>
                </div>

                <button class="add-to-cart-details-btn" id="details-add-to-cart" ${p.stock <= 0 ? "disabled" : ""}>
                    ${p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                <a href="products.html" class="back-to-products-link">&larr; Back to all products</a>
            </div>

        </div>
    `;

    document.getElementById("qty-inc").addEventListener("click", () => {
        if (selectedQty < p.stock) {
            selectedQty++;
            document.getElementById("qty-display").textContent = selectedQty;
        }
    });

    document.getElementById("qty-dec").addEventListener("click", () => {
        if (selectedQty > 1) {
            selectedQty--;
            document.getElementById("qty-display").textContent = selectedQty;
        }
    });

    document.getElementById("details-add-to-cart").addEventListener("click", () => {
        addToCart(p.id, selectedQty);
    });
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", fetchProductDetails);

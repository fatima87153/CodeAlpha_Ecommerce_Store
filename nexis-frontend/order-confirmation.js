document.addEventListener("DOMContentLoaded", () => {
    const raw = sessionStorage.getItem("nexis_last_order");

    if (!raw) {
        // no order to show — send them back to shop
        window.location.href = "index.html";
        return;
    }

    const order = JSON.parse(raw);

    document.getElementById("confirm-name").textContent = order.name;
    document.getElementById("confirm-order-number").textContent = order.orderNumber;
    document.getElementById("confirm-total").textContent = `$${order.total}`;
    document.getElementById("confirm-payment").textContent = order.payment;
    document.getElementById("confirm-address").textContent = order.address;

    // clear it so refreshing/revisiting this page directly later doesn't show stale data
    sessionStorage.removeItem("nexis_last_order");
});

const Order = require("../models/Order");
const Product = require("../models/Product");

function generateOrderNumber() {
    return "NX-" + Date.now().toString().slice(-8);
}

// POST /api/orders  (requires login)
exports.createOrder = async (req, res) => {
    try {
        const { items, shipping, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        if (!shipping || !shipping.fullName || !shipping.address) {
            return res.status(400).json({ message: "Shipping details are required" });
        }

        // IMPORTANT: never trust prices sent from the frontend.
        // Look up each product in the database and use its real price.
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product not found: ${item.productId}` });
            }

            const lineTotal = product.price * item.qty;
            subtotal += lineTotal;

            verifiedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                qty: item.qty,
                image: product.image
            });
        }

        const shippingFee = subtotal > 0 ? 10 : 0;
        const total = subtotal + shippingFee;

        const order = await Order.create({
            user: req.user.id,
            items: verifiedItems,
            shipping,
            paymentMethod: paymentMethod || "cod",
            subtotal,
            shippingFee,
            total,
            orderNumber: generateOrderNumber()
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// GET /api/orders/my-orders  (requires login)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

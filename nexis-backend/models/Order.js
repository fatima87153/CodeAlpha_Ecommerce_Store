const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        qty: Number,
        image: String
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        shipping: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
            city: String,
            postalCode: String
        },
        paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
        subtotal: Number,
        shippingFee: Number,
        total: Number,
        orderNumber: { type: String, unique: true },
        status: { type: String, default: "placed" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        description: { type: String, default: "" },
        category: { type: String, default: "General" },
        stock: { type: Number, default: 100 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

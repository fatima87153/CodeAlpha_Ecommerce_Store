// Run this once with: node seed.js
// It fills your MongoDB "products" collection with the same items
// your frontend already displays, so the two stay in sync.

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    { name: "Premium Wireless Headphones", price: 299.0, image: "headphone.jpeg" },
    { name: "Smart Noise-Cancelling Buds", price: 149.0, image: "earbuds.jpeg" },
    { name: "Ultra Gaming Headset", price: 199.0, image: "gamingheadset.jpeg" },
    { name: "Smart Fitness Watch", price: 49.0, image: "watch.jpeg" },
    { name: "Wireless Bluetooth Speaker", price: 129.0, image: "speaker.jpeg" },
    { name: "Mechanical Gaming Keyboard", price: 159.0, image: "keyboard.jpeg" },
    { name: "Wireless Charging Pad", price: 59.0, image: "charger.jpeg" },
    { name: "Portable Power Bank", price: 79.0, image: "powerbank.jpeg" },
    { name: "Ergonomic Wireless Mouse", price: 39.0, image: "mouse.jpeg" }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log("Products seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();

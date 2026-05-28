require("dotenv").config();
const express = require("express"), cors = require("cors"), helmet = require("helmet"), rateLimit = require("express-rate-limit"), sqlite3 = require("sqlite3").verbose(), path = require("path");
const app = express(), PORT = 8080;

// --- EXPLICIT CORS POLICY RESOLVES THE BROWSER CROSS-ORIGIN NETWORK DROP ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: false }));
app.use(cors({
    origin: ["http://localhost:3000", "http://172.25.128.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const db = new sqlite3.Database(path.resolve(__dirname, "empire_closet.db"));
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, base_price REAL NOT NULL, category TEXT NOT NULL, image_url TEXT NOT NULL, description TEXT NOT NULL, sizes TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS orders (order_id TEXT PRIMARY KEY, phone_number TEXT NOT NULL, amount_paid REAL NOT NULL, payment_status TEXT NOT NULL, items_summary TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)");
    console.log("📁 Local file ledger database linked and mapped successfully.");
});

// --- DATA READ ROUTES ---
app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => res.json(rows ? rows.map(r => ({ ...r, sizes: r.sizes ? r.sizes.split(",") : [] })) : []));
});
app.get("/api/products/:slug", (req, res) => {
    db.get("SELECT * FROM products WHERE slug = ?", [req.params.slug], (err, row) => res.json(row ? { ...row, sizes: row.sizes ? row.sizes.split(",") : [] } : null));
});

// --- DEFENSIVE DATA INJECTION ROUTE ---
app.post("/api/products", (req, res) => {
    const { title, base_price, price, category, image_url, imageUrl, description, sizes } = req.body;
    const finalPrice = base_price || price || 0, finalImageUrl = image_url || imageUrl || "/catalog/placeholder.jpg";
    const id = "added_" + Math.random().toString(36).substr(2, 9), slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const sizesStr = Array.isArray(sizes) ? sizes.join(",") : "S,M,L,XL";
    
    db.run("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, title, slug, parseFloat(finalPrice), category, finalImageUrl, description || "", sizesStr], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        console.log(`📦 New Design Node Injected Successfully: ${title}`);
        res.json({ success: true });
    });
});

// --- AUTOMATED 12-ITEM DATA SEED MATRIX ---
app.post("/api/products/seed", (req, res) => {
    const seedCatalog = [
        { title: "Premium Heavyweight Linen Shirt", price: 4500, cat: "shirts", img: "/catalog/linen-shirt.avif" },
        { title: "Relaxed Fit Cuban Collar Shirt", price: 3900, cat: "shirts", img: "/catalog/cuban-collar-shirt.jpg" },
        { title: "Boxy Structured Overshirt", price: 4800, cat: "shirts", img: "/catalog/boxy-overshirt.jpg" },
        { title: "Raw Silk Asymmetric tunic", price: 7500, cat: "shirts", img: "/catalog/silk-tunic.jpg" },
        { title: "Relaxed Tailored Pleated Trousers", price: 8900, cat: "trousers", img: "/catalog/pleated-trousers.avif" },
        { title: "Relaxed Fit Tailored Khaki Jeans", price: 5500, cat: "trousers", img: "/catalog/khaki-jeans.avif" },
        { title: "Flowing Mulberry Silk Palazzo Pants", price: 9500, cat: "trousers", img: "/catalog/palazzo-silk.jpg" },
        { title: "Minimalist Charcoal Wool Slacks", price: 9800, cat: "trousers", img: "/catalog/wool-slacks.jpg" },
        { title: "Classic Leather Biker Jacket", price: 18500, cat: "leather jackets", img: "/catalog/leather-jacket.jpg" },
        { title: "Matte Waxed Minimalist Bomber", price: 16900, cat: "leather jackets", img: "/catalog/waxed-bomber.jpg" },
        { title: "Oversized Distressed Aviator Coat", price: 24500, cat: "leather jackets", img: "/catalog/aviator-coat.jpg" },
        { title: "Cropped Suede Trucker Jacket", price: 15500, cat: "leather jackets", img: "/catalog/suede-trucker.jpg" }
    ];

    db.run("DELETE FROM products", [], () => {
        const stmt = db.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        seedCatalog.forEach((item, i) => {
            const slug = item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
            stmt.run(["seed_" + (i + 1), item.title, slug, item.price, item.cat, item.img, "Architectural silhouette garment piece.", "S,M,L,XL"]);
        });
        stmt.finalize(() => {
            console.log("🌱 Database successfully seeded with 12 structural design nodes.");
            res.json({ success: true });
        });
    });
});

// --- M-PESA CHECKOUT ENDPOINT WITH SIMULATOR ---
app.post("/api/checkout/mpesa", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), async (req, res) => {
    const { phone, amount, base_price, items } = req.body;
    const finalAmount = amount || base_price;
    if (!finalAmount) return res.status(400).json({ success: false, error: "Price parameter missing." });
    
    let fPhone = phone ? phone.trim().replace(/[\s+-]/g, "") : "";
    if (fPhone.startsWith("07")) fPhone = "2547" + fPhone.slice(2);
    else if (fPhone.startsWith("01")) fPhone = "2541" + fPhone.slice(2);

    const orderId = "ORD_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const summary = Array.isArray(items) ? items.map(i => i.title + " (" + i.size + ") x" + i.quantity).join(", ") : "Storefront Checkout";

    db.run("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?)", [orderId, fPhone, parseFloat(finalAmount), "PENDING_PIN_ENTRY", summary, new Date().toLocaleString()]);
    console.log(`📱 STK Push simulation successfully broadcast onto line: ${fPhone}`);
    
    setTimeout(() => {
        console.log(`\n============== MPESA ASYNC RECEIPT RECEIVED ==============\n🎯 STATUS: ORDER ${orderId} CONFIRMED SECURELY.`);
        db.run("UPDATE orders SET payment_status = 'PAID' WHERE order_id = ?", [orderId]);
    }, 3000);

    return res.json({ success: true, order_id: orderId });
});

app.get("/api/orders", (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => res.json(rows || []));
});

app.listen(PORT, () => console.log(`Fashion Engine Live on Secure Production Port ${PORT}`));

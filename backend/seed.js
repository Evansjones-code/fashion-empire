require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Target your local file database asset
const dbPath = path.resolve(__dirname, 'empire_closet.db');
const db = new sqlite3.Database(dbPath);

const initialCatalog = [
    // --- DROP 01: SHIRTS VECTOR ---
    [
        "s1", 
        "Premium Heavyweight Linen Shirt", 
        "premium-heavyweight-linen-shirt", 
        4500.00, 
        "shirts", 
        "https://unsplash.com", 
        "Crafted from 100% premium flax linen sourced sustainably. Features an elegant tailored fit.", 
        "S,M,L,XL"
    ],
    [
        "s2", 
        "Relaxed Fit Cuban Collar Shirt", 
        "relaxed-fit-cuban-collar-shirt", 
        3900.00, 
        "shirts", 
        "https://unsplash.com", 
        "An editorial silhouette with a fluid drop shoulder drape. Designed with an open camp pocket.", 
        "M,L,XL"
    ],
    [
        "s3", 
        "Boxy Structured Overshirt", 
        "boxy-structured-overshirt", 
        4800.00, 
        "shirts", 
        "https://unsplash.com", 
        "Heavyweight woven cotton blend utility shirt featuring clean oversized functional patch pockets and steel hardware rivet fastenings.", 
        "S,M,L,XL,XXL"
    ],
    [
        "s4", 
        "Raw Silk Asymmetric tunic", 
        "raw-silk-asymmetric-tunic", 
        7500.00, 
        "shirts", 
        "https://unsplash.com", 
        "Deconstructed silhouette cut from raw slub mulberry silk fabric with an elongated raw-edge stepped hem lines.", 
        "XS,S,M,L"
    ],

    // --- DROP 02: TROUSERS VECTOR ---
    [
        "t1", 
        "Relaxed Tailored Pleated Trousers", 
        "relaxed-tailored-pleated-trousers", 
        8900.00, 
        "trousers", 
        "https://unsplash.com", 
        "High-waisted tailored trousers featuring dual front pleats and hidden side pocket enclosures.", 
        "30,32,34,36"
    ],
    [
        "t2", 
        "Relaxed Fit Tailored Khaki Jeans", 
        "relaxed-fit-tailored-khaki-jeans", 
        5500.00, 
        "trousers", 
        "https://unsplash.com", 
        "Premium heavy-ounce cotton drill denim washed to a classic muted khaki shade. Relaxed structural fit.", 
        "30,32,34,36"
    ],
    [
        "t3", 
        "Flowing Mulberry Silk Palazzo Pants", 
        "flowing-mulberry-silk-palazzo-pants", 
        9500.00, 
        "trousers", 
        "https://unsplash.com", 
        "Exquisitely tailored wide-leg palazzo pants cut from 100% heavy mulberry silk. Fluid elegant drape.", 
        "S,M,L,XL"
    ],
    [
        "t4", 
        "Minimalist Charcoal Wool Slacks", 
        "minimalist-charcoal-wool-slacks", 
        9800.00, 
        "trousers", 
        "https://unsplash.com", 
        "Crafted from premium tropical virgin wool fibers for an unlined, hyper-breathable structural fall profile.", 
        "30,31,32,34,36"
    ],

    // --- DROP 03: LEATHER & OUTERWEAR VECTOR ---
    [
        "lj1", 
        "Classic Leather Biker Jacket", 
        "classic-leather-biker-jacket", 
        18500.00, 
        "leather jackets", 
        "https://unsplash.com", 
        "The ultimate outerwear cornerstone. Meticulously constructed from full-grain supple lambskin leather.", 
        "S,M,L,XL"
    ],
    [
        "lj2", 
        "Matte Waxed Minimalist Bomber", 
        "matte-waxed-minimalist-bomber", 
        16900.00, 
        "leather jackets", 
        "https://unsplash.com", 
        "Sleek collarless heavy cowhide leather framework processed with structural protective oil finishes for a smooth matte look.", 
        "M,L,XL"
    ],
    [
        "lj3", 
        "Oversized Distressed Aviator Coat", 
        "oversized-distressed-aviator-coat", 
        24500.00, 
        "leather jackets", 
        "https://unsplash.com", 
        "Vintage flight panel silhouette lined completely with ultra-soft cream shearling insulation matrix layers.", 
        "S,M,L,XL,XXL"
    ],
    [
        "lj4", 
        "Cropped Suede Trucker Jacket", 
        "cropped-suede-trucker-jacket", 
        15500.00, 
        "leather jackets", 
        "https://unsplash.com", 
        "Italian calf suede tailored trucker style modified with a sharp modern crop frame and dark copper snap caps.", 
        "S,M,L"
    ]
];

console.log("⚙️  Initiating Local Ledger Synchronisation Protocol...");

db.serialize(() => {
    // Force rebuild table matrix schemas
    db.run('CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, base_price REAL NOT NULL, category TEXT NOT NULL, image_url TEXT NOT NULL, description TEXT NOT NULL, sizes TEXT NOT NULL)');

    // Wipe out the table entirely to insert a clean block array
    db.run("DELETE FROM products", [], (err) => {
        if (err) console.error("Purging error:", err.message);
        else console.log("🧹 Previous product listing records flushed cleanly.");
    });

    const stmt = db.prepare("INSERT INTO products (id, title, slug, base_price, category, image_url, description, sizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    initialCatalog.forEach((product) => {
        stmt.run(product, (err) => {
            if (err) console.error("Database row insertion breakdown:", err.message);
            else console.log(`📦 Synced Ledger Row Matrix: [${product[1]}]`);
        });
    });

    stmt.finalize(() => {
        console.log("\n🎉 EMPIRE DATABASE SUCCESSFUL HYDRATION!");
        console.log("Your website storefront is now fully populated from code arrays.");
        db.close();
    });
});

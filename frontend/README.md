# 🏛️ EMPIRE FASHION ENGINE

An ultra-minimalist, editorial-grade luxury fashion e-commerce storefront and warehouse management system. Engineered with a Next.js frontend, an asynchronous Node.js backend cluster, and real-time transaction ledger sync via SQLite and Safaricom Daraja M-Pesa tracking matrices.

**Project Builder:** Evans Kotut

---

## 🏗️ System Architecture State

- **Frontend Framework:** Next.js 16.2 (Turbopack) with static and client-side context hooks.
- **Backend Data Engine:** Express.js + SQLite3 persistent relational ledger (`empire_closet.db`).
- **Payment Gateway Matrix:** Integrated Safaricom Lipa Na M-Pesa STK Push with custom API normalizations (`2547...`) and instant webhook callback endpoints.
- **Visual Design Canvas:** Tailwind CSS v4 featuring an appealing modern oatmeal editorial aesthetic theme (`#F5F4F0`), frosted glassmorphic navigation headers, and deep charcoal anchor footers.

---

## 🚀 Getting Started

### 1. Initialize the Backend Core Engine
Navigate to your backend directory, install required middleware packages, seed the master inventory catalog, and fire up the Node loop:
```bash
cd backend
npm install express cors sqlite3 axios
node seed.js
npm start
```
*Validation Output Check:* `Fashion Engine Live on Port 8080`

### 2. Launch the Storefront Workspace
Open a separate terminal window, navigate to your frontend project repository folder, and spin up your development server:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to witness the live visual matrix grid.

---

## 📁 Primary Workspace Mappings


| Operational Workspace Panel | Browser Access URL Route | Core Under-The-Hood Functions Managed |
| :--- | :--- | :--- |
| **Luxury Consumer Storefront** | `http://localhost:3000/` | Real-time catalog query strings, keyword searches, category tab filters, and interactive shopping basket overlays. |
| **Garment Detail Sheet Matrix** | `http://localhost:3000/products/[slug]` | Asynchronous param parsing, sizing variant selection enforcement, and unique cart composite key additions (`ID-SIZE`). |
| **Real-Time M-Pesa Invoice Tracker** | `http://localhost:3000/admin` | Live sales analytics charts, revenue ledger summations, payment condition badge logs, and time-stamped invoice feeds. |
| **Master Stock Inventory Control** | `http://localhost:3000/admin/products` | Interactive sliding ingestion forms to inject new garment elements dynamically or prune active stock arrays from the SQLite core. |

---

## 🎨 Editorial Visual Framework

This project utilizes custom design configurations mapped natively over Tailwind tokens:
- **Main Canvas:** Soft Sand Oatmeal (`#F5F4F0`) for an authentic lookbook backdrop.
- **Navigation Header:** Frosted Glass White (`bg-white/90 backdrop-blur-md`) pinned cleanly to the screen top.
- **Page Anchor Footer:** Deep Charcoal Slate (`#171717`) housing clean off-white help nodes and category hooks.
- **Typography Matrix:** Optimized dynamically via `next/font` leveraging the Geist font family for clean, high-performance visual delivery.

---

## 🛠️ Credits & Deployment

- **Lead Project Builder:** Evans Kotut
- **Deployment Track:** Engineered to deploy seamlessly on the Vercel Platform. Review the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for advanced cloud compilation criteria parameters.

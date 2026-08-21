# 🏥 MedMatch AI — Frontend Application
### Intelligent Clinical Procurement Platform

MedMatch AI is a web platform built with Next.js 14, React, TypeScript, and TailwindCSS for hospital inventory tracking, clinical shortage prediction, and autonomous x402-enabled supplier intelligence on Algorand TestNet.

---

## 1. Application Pages
- **Overview (`/`):** Real-time command center tracking total inventory, predicted shortages, critical risk alerts, and latest verified settlements.
- **Inventory (`/inventory`):** Comprehensive stock monitoring with stockout horizons and quick-procurement triggers.
- **Forecasting (`/forecast`):** 7-day mathematical demand projections comparing historical burn against predicted demand.
- **Procurement (`/procurement`):** Central workflow featuring a 9-step timeline, concise x402 payment receipts, multi-factor supplier ranking, and human order approval.
- **Suppliers (`/suppliers`):** Vendor performance directory across unit cost, availability, reliability, and certifications.
- **Payments (`/payments`):** Transparent blockchain payment history with direct links to the Lora TestNet Explorer.
- **Login (`/login`):** Clean non-custodial hospital authentication.

---

## 2. Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
Open [http://localhost:3000](http://localhost:3000) to access the application.

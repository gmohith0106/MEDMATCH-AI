# 🏥 MedMatch AI — Autonomous Healthcare Procurement Agent
### Powered by the x402 Protocol, Algorand Blockchain, and GoPlausible Facilitator

[![x402 Protocol](https://img.shields.io/badge/x402-v2.23.0-0d9488.svg)](https://x402.org)
[![Blockchain](https://img.shields.io/badge/Algorand-TestNet-0284c7.svg)](https://lora.algokit.io/testnet)
[![Facilitator](https://img.shields.io/badge/Facilitator-GoPlausible-16a34a.svg)](https://facilitator.goplausible.xyz)
[![Tests](https://img.shields.io/badge/Tests-36%20Passed%20%7C%20100%25-brightgreen.svg)](tests/)
[![Security](https://img.shields.io/badge/Secret%20Scan-0%20Exposures-success.svg)](src/scripts/security-check.ts)

---

## 1. Executive Summary
> **MedMatch AI** is an intelligent hospital procurement assistant that detects upcoming medical supply shortages, obtains real-time verified supplier intelligence via **HTTP 402 / x402 micropayments settled on Algorand TestNet USDC** through the **GoPlausible Facilitator**, compares suppliers across critical clinical factors, and provides procurement recommendations for **human administrator approval**.

---

## 2. Clinical Supply Story (Surgical Gloves SKU)
- **Medical Item:** Surgical Gloves (Sterile, Latex-Free)
- **Current Available Stock:** 1,250 boxes
- **7-Day Projected Demand:** 2,900 boxes
- **Expected Deficit:** 1,650 boxes
- **Clinical Risk:** CRITICAL (&lt; 2.8 days stock remaining)

**The Workflow:**
1. **Inventory Monitoring:** Tracks daily burn rate (414 boxes/day) and identifies impending stockout.
2. **Demand Forecasting:** Forecast engine flags an urgent 1,650 unit deficit before the surgical schedule is impacted.
3. **Supplier Intelligence Query:** The procurement agent queries the protected supplier oracle (`GET /api/paid/supplier-intelligence`).
4. **HTTP 402 Challenge:** The resource server challenges the agent with HTTP 402 and `PAYMENT-REQUIRED` header ($0.02 USDC).
5. **Spend Policy Validation:** The agent validates the payment against safety caps ($0.05 max per tx, $1.00 daily budget, endpoint allowlist).
6. **Algorand TestNet Settlement:** The server-side x402 buyer signs and settles the 0.02 USDC micropayment via GoPlausible on Algorand TestNet.
7. **Intelligence Unlocked:** Real-time quotes, batch sterility certificates, and lead times are unlocked.
8. **Multi-Factor Ranking:** The agent scores suppliers across Price, Availability, Lead Time, Reliability, and Quality.
9. **Human Approval:** Top-ranked supplier (MediSupply Healthcare Solutions, Score: 94.6) is recommended. The hospital procurement officer reviews and authorizes the purchase order.

---

## 3. Technology Architecture

```
React Frontend (Next.js 14)
       │
       ▼
Express Backend (Node.js + TypeScript)
       │
       ▼
Inventory & Demand Forecast Services
       │
       ▼
Procurement Agent Engine
       │
       ▼
x402-Protected Supplier Intelligence (/api/paid/supplier-intelligence)
       │
       ▼
Spend Policy Engine ($0.05 Max Cap | Allowlisted Endpoints)
       │
       ▼
Autonomous x402 Buyer Client (@x402/fetch + @x402/avm)
       │
       ▼
GoPlausible Facilitator (https://facilitator.goplausible.xyz)
       │
       ▼
Algorand TestNet USDC Settlement (ASA: 10458941 | CAIP-2: algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe)
       │
       ▼
Supplier Intelligence Unlocked & Evaluated
       │
       ▼
Supplier Scoring & Recommendation
       │
       ▼
Human-in-the-Loop Approval (Dr. Sarah Jenkins)
```

---

## 4. Frontend Application Structure
The frontend is built with Next.js 14 and TailwindCSS following a unified **Professional Healthcare AI Platform** theme:
1. **Overview (`/`):** Top metrics, critical inventory risks, active procurement recommendation, and recent verified micropayment.
2. **Inventory (`/inventory`):** Comprehensive catalog with current stock, 7-day predicted demand, deficit, and risk badges.
3. **Forecasting (`/forecast`):** Historical consumption trends vs. 7-day forecast demand curves.
4. **Procurement (`/procurement`):** Central workflow with 9-step timeline, concise x402 payment receipt, supplier comparison matrix, and human **[Approve Order]** / **[Reject]** actions.
5. **Suppliers (`/suppliers`):** Vendor performance directory across unit economics, lead times, reliability, and certifications.
6. **Payments (`/payments`):** Transparent on-chain payment history with direct links to the Lora TestNet Explorer.
7. **Login (`/login`):** Clean non-custodial authentication portal.

---

## 5. Security & Privacy Guarantees
- **Zero Frontend Secret Exposure:** No private keys, wallet mnemonics, or API credentials exist in browser code. Verified via automated AST scanner (`npm run security:check`).
- **Server-Side Signing:** All cryptographic signing and AVM transaction execution remain strictly within the backend Node.js runtime.
- **Spend Policy Engine:** Rigid ceiling enforcement:
  - Max per-transaction: `$0.05 USDC`
  - Max daily cumulative budget: `$1.00 USDC`
  - Network validation: `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe`
  - Asset verification: TestNet USDC ASA `10458941`
  - Idempotency protection against repeated charges.

---

## 6. Getting Started

### Prerequisites
- Node.js 18+ and npm

### 1. Start Backend Server (Port 4000)
```bash
cd "MEDMATCH AI BACKEND"
npm install
npm run dev
```

### 2. Start Frontend Application (Port 3000)
```bash
cd "MEDMATCH AI FRONTEND"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Diagnostic & Testing CLI Commands

```bash
cd "MEDMATCH AI BACKEND"

# 1. Run Complete Automated Test Suite (13 suites, 36 tests, 100% pass)
npm test

# 2. System Pre-Flight Verification Check
npm run x402:check

# 3. Test Genuine HTTP 402 Payment Challenge
npm run x402:unpaid

# 4. Test Autonomous Paid Buyer Handshake
npm run x402:paid

# 5. Run Full 9-Step AI Procurement Agent from Terminal
npm run x402:agent

# 6. Run Automated Frontend & Repository Secret Scan
npm run security:check
```

---

## 8. Algorand & x402 Specifications
| Parameter | Value |
|---|---|
| **Protocol** | x402 v2 (`@x402/core`, `@x402/avm`, `@x402/express`, `@x402/fetch`) |
| **Blockchain Network** | Algorand TestNet (`algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe`) |
| **Payment Asset** | TestNet USDC (Asset ID: `10458941`, 6 decimals) |
| **Service Price** | `$0.02 USDC` (20,000 atomic units) |
| **Facilitator** | GoPlausible (`https://facilitator.goplausible.xyz`) |
| **Block Explorer** | [Lora TestNet Explorer](https://lora.algokit.io/testnet) |

<div align="center">

<img src="assets/logo.png" alt="MedMatch AI Logo" width="140" height="140" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(227, 0, 107, 0.3);" />

# 🏥 MedMatch AI
### Intelligent Healthcare Procurement & Blockchain Supply Chain Platform

[![Live Application](https://img.shields.io/badge/Live_Demo-Vercel-e3006b?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-gmohith0106s-projects.vercel.app)
[![YouTube Demo](https://img.shields.io/badge/Demo_Video-YouTube-red?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=08BiPlteNK8)
[![Backend API](https://img.shields.io/badge/Backend_API-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://medmatch-ai-production.up.railway.app/api/health)
[![GitHub Repo](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gmohith0106/MEDMATCH-AI)

<p align="center">
  <b>Eliminating critical medical supply shortages through Autonomous AI Agents and on-chain verifiable microtransactions on the Algorand blockchain.</b>
</p>

---

</div>

## 📌 Project Overview

**MedMatch AI** is an autonomous healthcare supply chain and procurement system that bridges clinical operations with decentralized autonomous infrastructure. Medical facilities frequently suffer from supply stockouts, inefficient supplier discovery, and opaque pricing during emergency shortages.

MedMatch AI solves this by introducing **Autonomous Procurement Agents** capable of:
1. Forecasting inventory burn rates and hospital deficits.
2. Querying certified supplier networks.
3. Paying for real-time **Supplier Intelligence Oracle Data** via **X402 microtransactions on the Algorand TestNet**.
4. Executing verifiable procurement recommendations with zero human friction.

---

## 🔗 Official Project Links

- 🌐 **Live Web Application (Vercel):** [https://frontend-gmohith0106s-projects.vercel.app](https://frontend-gmohith0106s-projects.vercel.app)
- 🎥 **YouTube Video Demonstration:** [https://www.youtube.com/watch?v=08BiPlteNK8](https://www.youtube.com/watch?v=08BiPlteNK8)
- 💻 **GitHub Repository:** [https://github.com/gmohith0106/MEDMATCH-AI](https://github.com/gmohith0106/MEDMATCH-AI)
- ⚙️ **Production Backend API (Railway):** [https://medmatch-ai-production.up.railway.app](https://medmatch-ai-production.up.railway.app)
- 🩺 **API Health Endpoint:** [https://medmatch-ai-production.up.railway.app/api/health](https://medmatch-ai-production.up.railway.app/api/health)

---

## ✨ Key Capabilities & Modules

### 1. 🤖 Autonomous Procurement Agent
- Continuously monitors stock anomalies and triggers automated replenishment workflows.
- Evaluates supplier quotes using a multi-criteria scoring algorithm (unit cost, reliability index, delivery SLA, certified inventory).
- Autonomous agent executes machine-to-machine micropayments to purchase premium intelligence without manual invoice approval bottlenecks.

### 2. ⚡ X402 Protocol & Algorand TestNet
- Native integration with the **X402 HTTP micropayment protocol** (`@x402/core`, `@x402/express`).
- On-chain microtransactions settled on the **Algorand TestNet** using USDC and ALGO.
- Fully CAIP-2 compliant payment verification facilitated by **GoPlausible**.
- Every procurement decision has a verifiable transaction hash linked directly to the Algorand Block Explorer.

### 3. 📦 Real-Time Hospital Inventory Management
- Live dashboard displaying clinical supplies (PPE, surgical equipment, IV sets, antibiotics, pharmaceuticals).
- Dynamic risk categorization (`HEALTHY`, `WARNING`, `CRITICAL`) with predictive days-of-stock remaining.
- Emergency manual re-order overrides for hospital administrative staff.

### 4. 📊 Certified Supplier Intelligence Matrix
- Real-time catalog of certified medical distributors with reliability scores, SLA track records, and unit pricing.
- Side-by-side comparison matrix generated dynamically by oracle intelligence.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Hosting / Platform |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Lucide Icons, Recharts | [Vercel](https://frontend-gmohith0106s-projects.vercel.app) |
| **Backend** | Node.js, Express, TypeScript, Zod, ts-node | [Railway](https://medmatch-ai-production.up.railway.app) |
| **Blockchain** | Algorand TestNet (`algosdk`), GoPlausible Facilitator (`@x402/core`) | Algorand Blockchain |
| **Database** | Firebase Realtime Database & Local In-Memory Fallback Store | Google Firebase |

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/gmohith0106/MEDMATCH-AI.git
cd MEDMATCH-AI
```

### 2. Start the Backend (Port 4000)
```bash
cd backend
npm install
npm run dev
```

### 3. Start the Frontend (Port 3000)
```bash
cd ../frontend
npm install
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

---

## 🛡️ License
Distributed under the MIT License.

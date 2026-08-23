# 🏥 MedMatch AI

MedMatch AI is an intelligent healthcare procurement platform that leverages Autonomous Agents and blockchain technology to streamline medical supply chains. 

By integrating the Algorand TestNet with modern web frameworks, MedMatch AI allows hospitals and healthcare providers to use autonomous agents to purchase premium "Supplier Intelligence" data instantly via verifiable on-chain microtransactions.

## ✨ Key Features
- **Autonomous Procurement Agents:** AI-driven agents that automatically analyze, score, and procure medical supplies based on real-time intelligence.
- **X402 Crypto Payments:** Native integration with Algorand TestNet and Pera Wallet for instant, verifiable microtransactions.
- **GoPlausible Integration:** Full CAIP-2 compliant payment facilitation to track and verify on-chain autonomous payments.
- **Real-time Inventory & Supplier Tracking:** Comprehensive dashboard for managing hospital inventory, tracking shipments, and evaluating supplier reliability.

## 🛠️ Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS, deployed on [Vercel](https://vercel.com).
- **Backend:** Node.js, Express, TypeScript, deployed on [Railway](https://railway.app).
- **Blockchain:** Algorand TestNet (`algosdk`), GoPlausible (`x402-client`).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- [Pera Wallet](https://perawallet.app/) for signing Algorand TestNet transactions.

### Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/gmohith0106/MEDMATCH-AI.git
cd MEDMATCH-AI
```

**2. Start the Backend**
```bash
cd backend
npm install
npm run dev
```

**3. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📝 Environment Variables
You will need to configure `.env` files in both the `frontend` and `backend` directories to connect to the Algorand TestNet and your database.

## 🛡️ License
MIT License

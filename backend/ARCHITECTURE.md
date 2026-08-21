# 🏛️ MedMatch AI — System Architecture & Protocol Specification

## 1. System Architecture Overview

MedMatch AI implements a decentralized, autonomous agent procurement pipeline combining **x402 Protocol v2**, **Algorand TestNet settlement**, the **GoPlausible Facilitator**, an **AI Spend Policy Engine**, and a **Next.js 14 Web Command Center**.

```mermaid
graph TD
    subgraph Frontend["Frontend Layer (Next.js 14 + TS)"]
        UI["Hospital Command Dashboard"]
        JudgeUI["Judge Evaluation Suite (/judge)"]
        Timeline["9-Step Workflow Visualizer"]
        LoraLink["Verified Lora TestNet Explorer Link"]
    end

    subgraph Backend["Backend Layer (Node.js + Express)"]
        AgentCore["Autonomous Agent Controller"]
        DemandForecast["Dynamic Demand Forecaster"]
        SpendEngine["Spend Policy & Safety Engine"]
        BuyerClient["x402 Autonomous Buyer (@x402/fetch)"]
        ResourceServer["x402 Resource Middleware (@x402/express)"]
        Ranker["Multi-Factor Supplier Ranking Engine"]
    end

    subgraph x402Infra["x402 Protocol & Blockchain Layer"]
        Facilitator["GoPlausible Facilitator Gateway"]
        Algorand["Algorand TestNet (CAIP-2: algorand:SGO1GKS...)"]
        USDC["TestNet USDC ASA (ID: 10458941)"]
    end

    UI -->|1. Trigger Autonomous Run| AgentCore
    JudgeUI -->|Test 402 / Paid Flow| ResourceServer
    AgentCore --> DemandForecast
    DemandForecast -->|Shortage Detected| SpendEngine
    SpendEngine -->|Policy Approved| BuyerClient
    BuyerClient -->|HTTP GET Request| ResourceServer
    ResourceServer -->|HTTP 402 + PAYMENT-REQUIRED| BuyerClient
    BuyerClient -->|ExactAvmScheme Micropayment Proof| Facilitator
    Facilitator -->|Broadcast & Verify Settlement| Algorand
    Algorand --> USDC
    Facilitator -->|PAYMENT-RESPONSE + Settle Hook| ResourceServer
    ResourceServer -->|Unlock Protected SLA Matrix| BuyerClient
    BuyerClient --> Ranker
    Ranker -->|Top Recommended Supplier| UI
    Ranker --> Timeline
    BuyerClient --> LoraLink
```

---

## 2. Sequence Diagram: x402 Protocol Micropayment & Algorand Settlement

```mermaid
sequenceDiagram
    autonumber
    actor Hospital as Hospital Procurement Lead
    participant Agent as MedMatch AI Agent
    participant SpendPolicy as Spend Policy Engine
    participant Buyer as Autonomous Buyer Client (@x402/fetch)
    participant Server as Protected Oracle Server (@x402/express)
    participant Facilitator as GoPlausible Facilitator
    participant Algorand as Algorand TestNet

    Hospital->>Agent: Request Inventory Optimization (inv-gloves-001)
    Agent->>Agent: Step 1 & 2: Calculate Usage & Forecast 7-day Demand
    Agent->>Agent: Step 3: Detect Shortage (-1,650 units deficit)
    
    Agent->>SpendPolicy: Evaluate Proposed Micropayment ($0.02 USDC)
    Note over SpendPolicy: Validate Single Tx Cap ($0.05 max)<br/>Validate Daily Budget ($1.00 max)<br/>Check Resource & Destination Allowlist
    SpendPolicy-->>Agent: SPEND_POLICY_APPROVED

    Agent->>Buyer: Request Protected Supplier Intelligence
    Buyer->>Server: HTTP GET /api/paid/supplier-intelligence
    Server-->>Buyer: HTTP 402 Payment Required<br/>Header: PAYMENT-REQUIRED (Base64)
    
    Note over Buyer: Decodes x402 Version 2 Requirements<br/>Asset: USDC (10458941)<br/>Price: $0.02 (20,000 units)<br/>PayTo: SLETUW...GWSACU
    
    Buyer->>Buyer: Sign ExactAvmScheme Transaction (toClientAvmSigner)
    Buyer->>Server: HTTP GET /api/paid/supplier-intelligence<br/>Header: PAYMENT-SIGNATURE (Group Tx Proof)
    
    Server->>Facilitator: Verify & Settle Transaction Proof
    Facilitator->>Algorand: Submit Transaction Group On-Chain
    Algorand-->>Facilitator: Transaction Confirmed (Round 42,109,842)
    Facilitator-->>Server: Settlement Confirmed (Tx Hash: V4Z5N2...)
    
    Server-->>Buyer: HTTP 200 OK + Header: PAYMENT-RESPONSE<br/>Data: Tier-1 Certified Supplier Matrix
    
    Buyer-->>Agent: Protected Supplier Intelligence Delivered
    Agent->>Agent: Step 7: Multi-Factor Scoring (Reliability, Price, Lead Time)
    Agent->>Agent: Step 8: Generate Optimal Procurement Recommendation
    Agent-->>Hospital: Step 9: Awaiting Human Manager Cryptographic Approval
```

---

## 3. Spend Policy Safety Specification

The Spend Policy Engine enforces 6 layers of protection before any payment proof is signed:

1. **Endpoint Allowlisting:** Payments only permitted for verified internal endpoints (`/api/paid/supplier-intelligence`).
2. **Network Whitelisting:** Payments strictly locked to `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe` (Algorand TestNet).
3. **Asset Validation:** Payments only allowed in verified `USDC` (ASA `10458941`).
4. **Single Transaction Ceiling:** Hard cap of **$0.05 USD** per transaction.
5. **Cumulative Daily Budget:** Hard cap of **$1.00 USD** per hospital per UTC day.
6. **Idempotency & Replay Protection:** Duplicate procurement runs reuse previously settled proofs without double-charging.

---

## 4. Multi-Factor Supplier Ranking Formulation

When protected supplier intelligence is unlocked, candidates are scored dynamically:

$$\text{Final Score} = (w_r \times S_r) + (w_d \times S_d) + (w_p \times S_p) + (w_a \times S_a)$$

Where:
- **$S_r$ (Reliability Score, Weight = 35%):** Historic SLA delivery fulfillment rate (0-100).
- **$S_d$ (Delivery Lead Time Score, Weight = 25%):** Normalized turnaround penalty vs hospital criticality.
- **$S_p$ (Unit Pricing Score, Weight = 25%):** Price competitiveness vs baseline catalog.
- **$S_a$ (Inventory Availability Score, Weight = 15%):** Immediate batch capacity guarantee.

---

## 5. Zero-Key Browser Architecture

```
┌────────────────────────────────────────────────────────┐
│                   BROWSER ENVIRONMENT                  │
│  - No Algorand Mnemonics                               │
│  - No Private Keys                                     │
│  - Read-Only Public Blockchain Data                    │
│  - Real-Time Live Receipts & Explorer Links            │
└───────────────────────────┬────────────────────────────┘
                            │ Safe HTTP APIs
                            ▼
┌────────────────────────────────────────────────────────┐
│                   SERVER NODE RUNTIME                  │
│  - Private Mnemonic Isolated in Server Environment     │
│  - toClientAvmSigner Executes Server-Side Only         │
│  - Automated Secret Scan in CI/CD (npm run security:check)
└────────────────────────────────────────────────────────┘
```

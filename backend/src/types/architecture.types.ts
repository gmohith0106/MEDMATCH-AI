/**
 * MedMatch AI - Final Architecture Core Types
 * Shared Database Schema:
 * users(id, email, password_hash, role, hospital_id)
 * inventory(item, current_stock, avg_daily_usage, reorder_threshold)
 * quotes(id, item, supplier, price, delivery_days, reliability, created_at)
 * orders(id, item, supplier, qty, total_price, status, created_at)
 * ledger(id, txn_id, endpoint, amount, created_at)
 * policy(spend_cap, approved_suppliers, approved_categories)
 * reliability_log(supplier, on_time, correct_qty, price_accuracy, order_id)
 */

export interface OrderRecord {
  id: string;
  item: string;
  itemName?: string;
  supplier: string;
  supplierName?: string;
  qty: number;
  unitPrice: number;
  total_price: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'SETTLED' | 'DISPATCHED' | 'DELIVERED';
  reasoning?: string;
  txn_id?: string;
  explorer_url?: string;
  created_at: string;
  hospital_id?: string;
}

export interface QuoteRecord {
  id: string;
  item: string;
  supplier: string;
  supplierName?: string;
  price: number;
  delivery_days: number;
  reliability: number;
  created_at: string;
  isNegotiated?: boolean;
}

export interface LedgerRecord {
  id: string;
  txn_id: string;
  endpoint: string;
  amount: number;
  asset: string;
  network: string;
  confirmed_round: number;
  explorer_url: string;
  created_at: string;
  purpose?: string;
  payer?: string;
  receiver?: string;
}

export interface PolicyRecord {
  spend_cap: number;
  daily_spend_cap: number;
  daily_spend_so_far: number;
  approved_suppliers: string[];
  approved_categories: string[];
  agent_operating_wallet: string;
  operating_wallet_balance_usdc: number;
  auto_order_enabled: boolean;
  updated_at: string;
}

export interface ReliabilityLogRecord {
  id: string;
  supplier: string;
  supplierName?: string;
  on_time: boolean;
  correct_qty: boolean;
  price_accuracy: boolean;
  order_id: string;
  score: number;
  created_at: string;
}

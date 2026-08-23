import { X402PaymentRequirement } from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface X402FetchResult<T = any> {
  status: number;
  success: boolean;
  data?: T;
  requirement?: X402PaymentRequirement;
  receipt?: Record<string, unknown>;
  error?: string;
}

/**
 * Validates whether a value is a legitimate 52-character Base32 Algorand Transaction ID.
 */
export function isAlgorandTxId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[A-Z2-7]{52}$/.test(value.trim())
  );
}

/**
 * Standard shared USDC amount formatter.
 * Returns clean formatted string e.g. "0.02 USDC".
 */
export function formatUsdcAmount(amount?: number | string): string {
  if (amount === undefined || amount === null) return '0.02 USDC';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.02 USDC';
  
  // If amount was passed in atomic micro-units (e.g. 20000), normalize to 0.02
  const normalized = num > 100 ? num / 1_000_000 : num;
  return `${normalized.toFixed(2)} USDC`;
}

/**
 * Shorten an Algorand address for clean UI display (e.g. ABCD...WXYZ)
 */
export function formatAlgorandAddress(address?: string, chars: number = 4): string {
  if (!address || address.length < chars * 2 + 3) return address || '—';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Shorten an Algorand Transaction ID for clean UI display (e.g. VOGEUKZN...CZABC2)
 */
export function formatAlgorandTxId(txId?: string, chars: number = 8): string {
  if (!txId) return '—';
  const trimmed = txId.trim();
  if (trimmed.length <= chars * 2) return trimmed;
  return `${trimmed.slice(0, chars)}...${trimmed.slice(-chars)}`;
}

/**
 * Build Algorand TestNet Lora explorer URL for transaction.
 */
export function getAlgorandExplorerUrl(txId?: string, network: string = 'testnet'): string {
  if (!txId) return '';
  const trimmed = txId.trim();
  return `https://lora.algokit.io/${network}/transaction/${encodeURIComponent(trimmed)}`;
}

/**
 * Fetches the newest live confirmed transaction ID directly from Algorand TestNet Indexer.
 */
export async function fetchLiveConfirmedTestnetTxId(): Promise<{ id: string; round: number; sender: string }> {
  try {
    const res = await fetch('https://testnet-idx.algonode.cloud/v2/transactions?limit=1', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.transactions?.[0]?.id) {
        return {
          id: data.transactions[0].id,
          round: data.transactions[0]['confirmed-round'] || 38472910,
          sender: data.transactions[0].sender
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch live testnet tx', err);
  }
  return {
    id: 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
    round: 38472910,
    sender: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
  };
}

/**
 * Build Algorand TestNet Lora explorer URL for account address.
 */
export function getLoraAccountUrl(address?: string, network: string = 'testnet'): string {
  if (!address) return '';
  return `https://lora.algokit.io/${network}/account/${encodeURIComponent(address.trim())}`;
}

/**
 * Build Algorand TestNet Lora explorer URL for asset / ASA ID.
 */
export function getLoraAssetUrl(assetId?: number | string, network: string = 'testnet'): string {
  if (assetId === undefined || assetId === null) return '';
  return `https://lora.algokit.io/${network}/asset/${encodeURIComponent(String(assetId).trim())}`;
}

/**
 * Build Algorand TestNet Lora explorer URL for application / smart contract ID.
 */
export function getLoraAppUrl(appId?: number | string, network: string = 'testnet'): string {
  if (appId === undefined || appId === null) return '';
  return `https://lora.algokit.io/${network}/application/${encodeURIComponent(String(appId).trim())}`;
}


/**
 * Parse base64 or JSON PAYMENT-REQUIRED header
 */
export function parseX402Header(headerValue: string): X402PaymentRequirement | null {
  try {
    const raw = typeof window !== 'undefined'
      ? atob(headerValue)
      : Buffer.from(headerValue, 'base64').toString('utf8');
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(headerValue);
    } catch {
      return null;
    }
  }
}

/**
 * Request protected resource and gracefully handle 402 challenge/response
 */
export async function fetchProtectedResource<T = any>(
  endpoint: string,
  paymentSignature?: string
): Promise<X402FetchResult<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (paymentSignature) {
    headers['PAYMENT-SIGNATURE'] = paymentSignature;
    headers['X-PAYMENT'] = paymentSignature;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('medmatch_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const paymentRequiredHeader = response.headers.get('PAYMENT-REQUIRED') || response.headers.get('payment-required');
    const paymentResponseHeader = response.headers.get('PAYMENT-RESPONSE') || response.headers.get('payment-response');

    if (response.status === 402) {
      let requirement: X402PaymentRequirement | null = null;
      if (paymentRequiredHeader) {
        requirement = parseX402Header(paymentRequiredHeader);
      }

      if (!requirement) {
        try {
          const body = await response.json();
          requirement = body.requirement || body.data || body;
        } catch {
          // ignore
        }
      }

      return {
        status: 402,
        success: false,
        requirement: requirement || undefined,
        error: 'Payment required via x402 protocol',
      };
    }

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errorMessage;
      } catch {
        // ignore
      }
      return {
        status: response.status,
        success: false,
        error: errorMessage,
      };
    }

    let receipt: Record<string, unknown> | undefined;
    if (paymentResponseHeader) {
      try {
        const raw = atob(paymentResponseHeader);
        receipt = JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    const data = await response.json();
    return {
      status: 200,
      success: true,
      data: data.data || data,
      receipt,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      error: error?.message || 'Network request failed',
    };
  }
}

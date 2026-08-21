declare module '@x402/fetch' {
  import { x402Client, x402HTTPClient, x402ClientConfig } from '@x402/core/client';

  export function wrapFetchWithPayment(
    fetchFn: typeof globalThis.fetch,
    client: x402Client | x402HTTPClient
  ): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

  export function wrapFetchWithPaymentFromConfig(
    fetchFn: typeof globalThis.fetch,
    config: x402ClientConfig
  ): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

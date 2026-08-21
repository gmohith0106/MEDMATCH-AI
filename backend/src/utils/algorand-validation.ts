/**
 * Algorand Transaction ID & Address Validation Utilities
 */

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
 * Validates whether an Algorand Public Address is a legitimate 58-character Base32 address.
 */
export function isAlgorandAddress(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[A-Z2-7]{58}$/.test(value.trim())
  );
}

/**
 * Formats an Algorand Transaction ID or Address for UI display (e.g. ABCDEF12...XYZ78912).
 */
export function formatAlgorandDisplay(value?: string, prefixLen: number = 8, suffixLen: number = 8): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.length <= prefixLen + suffixLen) return trimmed;
  return `${trimmed.slice(0, prefixLen)}...${trimmed.slice(-suffixLen)}`;
}

/**
 * Builds standard Lora TestNet explorer URL using the full, unshortened transaction ID.
 */
export function getLoraTransactionUrl(txId: string): string {
  if (!isAlgorandTxId(txId)) return '';
  return `https://lora.algokit.io/testnet/transaction/${encodeURIComponent(txId.trim())}`;
}

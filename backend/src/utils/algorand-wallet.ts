import path from 'path';
import algosdk from 'algosdk';
import { logger } from './logger';

let cachedWordlist: string[] | null = null;

function getWordlist(): string[] | null {
  if (cachedWordlist) return cachedWordlist;

  const candidatePaths = [
    path.resolve(__dirname, '../../node_modules/algosdk/dist/cjs/mnemonic/wordlists/english.js'),
    path.resolve(process.cwd(), 'node_modules/algosdk/dist/cjs/mnemonic/wordlists/english.js'),
    path.resolve(__dirname, '../../../node_modules/algosdk/dist/cjs/mnemonic/wordlists/english.js')
  ];

  for (const p of candidatePaths) {
    try {
      const mod = require(p);
      const list = mod.default || mod;
      if (Array.isArray(list) && list.length === 2048) {
        cachedWordlist = list;
        return cachedWordlist;
      }
    } catch {
      // Try next path
    }
  }

  return null;
}

/**
 * Universal Algorand Account / Signer Parser
 *
 * Safely parses either:
 * 1. Standard 25-word Algorand mnemonics (with built-in checksum).
 * 2. 24-word recovery phrases (converts 256-bit entropy to 25-word Algorand key).
 *
 * Returns null if the mnemonic is missing, placeholder, or malformed, without ever throwing or leaking secrets.
 */
export function getAlgorandAccountFromMnemonic(mnemonicString?: string): algosdk.Account | null {
  if (!mnemonicString) return null;
  const cleaned = mnemonicString.trim().replace(/^["']|["']$/g, '');
  if (
    !cleaned ||
    cleaned.includes('YOUR_') ||
    cleaned.includes('your twenty five') ||
    cleaned.includes('ACCOUNT_1_')
  ) {
    return null;
  }

  const words = cleaned.split(/\s+/);
  if (words.length < 24) {
    return null;
  }

  // 1. Try native 25-word Algorand decode
  if (words.length === 25) {
    try {
      return algosdk.mnemonicToSecretKey(words.join(' '));
    } catch {
      // Fallback
    }
  }

  // 2. Try converting 24 words entropy to 25-word Algorand mnemonic
  if (words.length >= 24) {
    try {
      const wordlist = getWordlist();
      if (wordlist) {
        const wordMap = new Map<string, number>();
        wordlist.forEach((w, i) => wordMap.set(w, i));

        let bitString = '';
        for (let i = 0; i < 24; i++) {
          const word = words[i];
          const idx = word ? wordMap.get(word) : undefined;
          if (idx === undefined) throw new Error(`Invalid mnemonic word: ${word}`);
          bitString += idx.toString(2).padStart(11, '0');
        }

        const entropyBits = bitString.slice(0, 256);
        const entropyBytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          entropyBytes[i] = parseInt(entropyBits.slice(i * 8, (i + 1) * 8), 2);
        }

        const algoMnemonic = algosdk.mnemonicFromSeed(entropyBytes);
        return algosdk.mnemonicToSecretKey(algoMnemonic);
      }

      return algosdk.mnemonicToSecretKey(words.slice(0, 25).join(' '));
    } catch (err) {
      logger.debug('[AlgorandWallet] Failed to decode mnemonic to account');
      return null;
    }
  }

  return null;
}

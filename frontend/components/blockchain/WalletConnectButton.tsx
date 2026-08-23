'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import {
  Wallet,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  LogOut,
  Copy,
  Check,
  Zap,
  Coins,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { formatAlgorandAddress, getAlgorandExplorerUrl } from '@/lib/x402';

// Create a singleton instance lazily
let peraWalletInstance: PeraWalletConnect | null = null;
export const getPeraWallet = () => {
  if (typeof window === 'undefined') return null;
  if (!peraWalletInstance) {
    peraWalletInstance = new PeraWalletConnect({
      shouldShowSignTxnToast: true
    });
  }
  return peraWalletInstance;
};

// Algorand TestNet Algod Client
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const USDC_ASSET_ID = 10458941;

export function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'Pera' | 'Defly' | 'TestNet' | null>(null);
  const [balanceUsdc, setBalanceUsdc] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch real balances
  useEffect(() => {
    if (!walletAddress) {
      setBalanceUsdc(0);
      return;
    }
    const fetchBalances = async () => {
      try {
        const accountInfo = await algodClient.accountInformation(walletAddress).do();
        const assets = accountInfo.assets || [];
        const usdcAsset = assets.find((a: any) => a['asset-id'] === USDC_ASSET_ID);
        const usdcBalance = usdcAsset ? Number(usdcAsset.amount) / 1_000_000 : 0;
        setBalanceUsdc(usdcBalance);
      } catch (e) {
        console.error('Failed to fetch real balances', e);
        setBalanceUsdc(0);
      }
    };
    fetchBalances();
    // Poll every 10 seconds
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  useEffect(() => {
    // Check for real Pera session first
    const wallet = getPeraWallet();
    if (wallet) {
      wallet
        .reconnectSession()
        .then((accounts) => {
          wallet.connector?.on('disconnect', handleDisconnect);
          if (accounts.length) {
            setWalletAddress(accounts[0]);
            setWalletType('Pera');
            localStorage.setItem('medmatch_connected_wallet', accounts[0]);
            localStorage.setItem('medmatch_wallet_type', 'Pera');
          }
        })
        .catch((e) => console.log(e));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = async (type: 'Pera' | 'Defly' | 'TestNet') => {
    setConnecting(true);
    
    if (type === 'Pera') {
      try {
        const wallet = getPeraWallet();
        if (wallet) {
          const newAccounts = await wallet.connect();
          wallet.connector?.on('disconnect', handleDisconnect);
          setWalletAddress(newAccounts[0]);
          setWalletType('Pera');
          localStorage.setItem('medmatch_connected_wallet', newAccounts[0]);
          localStorage.setItem('medmatch_wallet_type', 'Pera');
        }
      } catch (error) {
        console.error('Pera Wallet connection failed:', error);
      } finally {
        setConnecting(false);
      }
      return;
    }
  };

  const handleDisconnect = () => {
    getPeraWallet()?.disconnect();
    setWalletAddress(null);
    setWalletType(null);
    localStorage.removeItem('medmatch_connected_wallet');
    localStorage.removeItem('medmatch_wallet_type');
    setIsDropdownOpen(false);
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Top Navbar Wallet Action */}
      {!walletAddress ? (
        <button
          onClick={() => handleConnect('Pera')}
          disabled={connecting}
          className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-pink-500/30 hover:border-pink-500/60 text-pink-500 text-xs font-semibold transition disabled:opacity-50"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-pink-500/30 hover:border-pink-500/60 text-xs font-semibold transition"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0" />
            <span className="text-slate-500">My Wallet:</span>
            <span className="text-pink-600 font-bold">{formatAlgorandAddress(walletAddress, 4)}</span>
            <ChevronDown className="w-3 h-3 text-pink-600/50 ml-1" />
          </button>

          {/* Connected Wallet Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#be185d] p-3 z-50 animate-fadeIn space-y-3">
              <div className="p-3 bg-[#fce7f3] rounded-xl border border-[#be185d] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{walletType} Wallet Connected</span>
                  </span>
                  <span className="font-mono text-[10px] text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded">
                    TestNet
                  </span>
                </div>

                <div className="font-mono text-[11px] text-slate-800 break-all bg-white p-2 rounded-lg border border-[#be185d]">
                  {walletAddress}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500">Balance:</span>
                  <span className="font-black text-slate-900">${balanceUsdc.toFixed(2)} USDC</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-[#fce7f3] transition text-left"
                >
                  <span className="flex items-center gap-2">
                    {copied ? <Check className="w-3.5 h-3.5 text-slate-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Address Copied!' : 'Copy Public Address'}</span>
                  </span>
                </button>

                <a
                  href={`https://lora.algokit.io/testnet/account/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-pink-800 hover:bg-pink-50 transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                    <span>View on Lora Explorer</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left border-t border-slate-100 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </>
  );
}


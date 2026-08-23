'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';
import { formatAlgorandAddress, getAlgorandExplorerUrl, formatUsdcAmount } from '@/lib/x402';
import { requestPayment, verifyPayment, submitPayment } from '@/lib/api';
import algosdk from 'algosdk';
import { getPeraWallet } from '../blockchain/WalletConnectButton';
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';

export function X402PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    continuePaymentFlow,
    currentPayment,
  } = useDemo();

  const [paymentStatus, setPaymentStatus] = useState<string>('PAYMENT_REQUIRED');
  const [transactionId, setTransactionId] = useState<string | undefined>(undefined);
  const [receiverAddress, setReceiverAddress] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentPayment) {
      setPaymentStatus(currentPayment.status || 'PAYMENT_REQUIRED');
      setTransactionId(currentPayment.transactionId);
      setReceiverAddress(currentPayment.receiverAddress);
    }
  }, [currentPayment]);

  if (!isPaymentModalOpen) return null;

  const handleCopyReceiver = () => {
    if (!receiverAddress) return;
    navigator.clipboard.writeText(receiverAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthorizeAndVerify = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentStatus('PAYMENT_PROCESSING');

    try {
      let targetPaymentId: string = currentPayment?.id || currentPayment?.paymentId || '';

      // If no payment record exists, request one from backend
      if (!targetPaymentId) {
        const req = await requestPayment({
          amount: 0.001,
          asset: 'USDC',
          currency: 'USD',
          purpose: 'Autonomous Agent Tier-1 Supplier Intelligence Oracle Fee',
          resource: '/api/paid/supplier-intelligence'
        });
        targetPaymentId = req?.paymentId || `pay_x402_${Date.now()}`;
      }

      setPaymentStatus('SETTLEMENT_PENDING');

      // Try Pera Wallet first
      const wallet = getPeraWallet();
      const accounts = wallet?.connector?.accounts || [];
      if (!accounts.length) {
        setErrorMessage('Please connect your Pera Wallet first via the top navigation bar.');
        setIsProcessing(false);
        setPaymentStatus('PAYMENT_REQUIRED');
        return;
      }
      const sender = accounts[0];

      const rcvr = receiverAddress || 'IWOSB3QY3C3OUMV74HMWCY4HN76DBP4EN2SEMAKYK4U4LEINNT64RZFNCU';

      // Get params
      const algodToken = '';
      const algodServer = 'https://testnet-api.algonode.cloud';
      const algodPort = '';
      const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
      const suggestedParams = await algodClient.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender,
        receiver: rcvr,
        amount: 1000, // 0.001 USDC (6 decimals)
        assetIndex: 10458941,
        suggestedParams
      });

      const txGroup = [{ txn, signers: [sender] }];
      const signedTxn = await wallet!.signTransaction([txGroup]);

      // Submit to network
      const sendTxRes = await algodClient.sendRawTransaction(signedTxn[0]).do();
      const txId = sendTxRes.txid;

      // Tell backend we submitted it
      await submitPayment({
         paymentId: targetPaymentId,
         transactionId: txId,
         senderAddress: sender,
         receiverAddress: rcvr
      });

      // Then verify
      const result = await verifyPayment(targetPaymentId, txId);

      if (result && (result.status === 'PAYMENT_SETTLED' || result.status === 'PAYMENT_VERIFIED' || result.verified || result.status === 'VERIFIED')) {
        setPaymentStatus('VERIFIED');
        setTransactionId(result.transactionId || result.payment?.transactionId);
        setReceiverAddress(result.receiverAddress || result.payment?.receiverAddress);

        setTimeout(async () => {
          setIsProcessing(false);
          await continuePaymentFlow();
        }, 1000);
      } else if (result?.status === 'PAYMENT_CONFIGURATION_REQUIRED' || result?.status === 'PAYMENT_SIGNER_NOT_CONFIGURED') {
        setPaymentStatus('PAYMENT_CONFIGURATION_REQUIRED');
        setErrorMessage('USER ACTION REQUIRED: Add funded Account 1 mnemonic (AVM_MNEMONIC) in backend .env to complete on-chain TestNet settlement.');
        setIsProcessing(false);
      } else {
        setPaymentStatus('PAYMENT_REQUIRED');
        setErrorMessage('Payment verification failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.warn('[PaymentModal] Payment execution error:', err);
      setPaymentStatus('PAYMENT_REQUIRED');
      setErrorMessage(err.message || 'Payment execution failed. Did you reject the signature?');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#cbd5e1] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-pink-600 via-slate-400 to-pink-400 w-full" />

        {/* Modal Header */}
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Payment Required
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 uppercase">
                  HTTP 402
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Supplier Intelligence â€¢ Algorand TestNet
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 bg-white">
          <p className="text-xs text-slate-600 leading-relaxed">
            The autonomous procurement agent requires real-time supplier intelligence to rank certified medical vendors and unlock guaranteed batch capacity.
          </p>

          {/* Payment Requirement Specs Card */}
          <div className="p-4 rounded-xl bg-[#f1f5f9]/50 border border-[#cbd5e1] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]">
              <span className="text-xs text-slate-500 font-semibold">Service:</span>
              <span className="text-xs font-bold text-slate-900">
                Supplier Intelligence Stream
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]">
              <span className="text-xs text-slate-500 font-semibold">Authoritative Price:</span>
              <div className="text-right">
                <span className="font-extrabold text-base text-slate-900">
                  0.001 USDC
                </span>
                <span className="text-[11px] text-slate-500 font-mono ml-1">
                  ($0.001 USD)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]">
              <span className="text-xs text-slate-500 font-semibold">Receiver Public Address:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-800">
                <span>{receiverAddress ? formatAlgorandAddress(receiverAddress, 5) : 'Hospital Supplier Gateway'}</span>
                {receiverAddress && (
                  <button
                    onClick={handleCopyReceiver}
                    className="p-0.5 text-slate-400 hover:text-slate-600"
                    title="Copy Receiver Address"
                  >
                    {copied ? <Check className="w-3 h-3 text-slate-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Settlement Network:</span>
              <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                Algorand TestNet
              </span>
            </div>
          </div>

          {/* Processing / Verifying Feedback */}
          {paymentStatus === 'PAYMENT_PROCESSING' && (
            <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-pink-600 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-pink-900">Processing Payment...</p>
                <p className="text-[11px] text-pink-700">
                  Server-side AVM signer is authorizing transaction...
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'SETTLEMENT_PENDING' && (
            <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-pink-600 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-pink-900">Confirming on Algorand...</p>
                <p className="text-[11px] text-pink-700">
                  Verifying consensus round settlement via GoPlausible facilitator...
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'VERIFIED' && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Payment Verified & Settled
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Settlement verified on Algorand TestNet â€¢ Supplier intelligence unlocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-900">Configuration Notice</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleAuthorizeAndVerify}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                  <>
                    <span>Pay 0.001 USDC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

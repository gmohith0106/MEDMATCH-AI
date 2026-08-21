'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RedirectReceiptSenderPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = (params?.transactionId as string) || '';

  useEffect(() => {
    if (transactionId) {
      router.replace(`/payments/${encodeURIComponent(transactionId)}`);
    } else {
      router.replace('/payments');
    }
  }, [transactionId, router]);

  return null;
}

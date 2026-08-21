'use client';

import React from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';

export default function ActivityPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-[#24324a] tracking-tight">
          Agent Activity
        </h2>
        <p className="text-xs text-[#667085] font-medium mt-0.5">
          Real-time telemetry and audit logs of autonomous actions, payments, and human authorizations.
        </p>
      </div>

      {/* Main Activity Timeline */}
      <ActivityTimeline />
    </div>
  );
}

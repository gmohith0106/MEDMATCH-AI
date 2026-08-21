'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { name: 'N95 Masks', currentStock: 120, projectedDemand: 294, shortage: 174 },
  { name: 'Surgical Gloves', currentStock: 580, projectedDemand: 525, shortage: 0 },
  { name: 'Syringes 10ml', currentStock: 210, projectedDemand: 266, shortage: 56 },
  { name: 'IV Sets', currentStock: 85, projectedDemand: 154, shortage: 69 },
  { name: 'Saline Bags', currentStock: 190, projectedDemand: 245, shortage: 55 },
];

export function ForecastChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffc8d3" strokeOpacity={0.6} />
          <XAxis
            dataKey="name"
            stroke="#ffc8d3"
            tick={{ fill: '#24324a', fontSize: 11, fontWeight: 600 }}
            tickLine={false}
          />
          <YAxis
            stroke="#ffc8d3"
            tick={{ fill: '#24324a', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: '#667085', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #ffc8d3',
              boxShadow: '0 4px 16px rgba(36, 50, 74, 0.08)',
              fontSize: '12px',
              color: '#24324a',
              fontWeight: 600,
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600, color: '#24324a' }}
          />
          <Bar dataKey="currentStock" name="Current Stock" fill="#94d4f8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="projectedDemand" name="Forecasted Demand" fill="#e3577c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="shortage" name="Projected Shortage Deficit" fill="#e27094" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface DemandChartProps {
  data: {
    day: string;
    stock: number;
    forecast: number;
  }[];
  reorderPoint?: number;
}

export function DemandChart({ data, reorderPoint = 250 }: DemandChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffc8d3" strokeOpacity={0.6} />
          <XAxis
            dataKey="day"
            stroke="#ffc8d3"
            tick={{ fill: '#24324a', fontSize: 11, fontWeight: 500 }}
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
          {reorderPoint && (
            <ReferenceLine
              y={reorderPoint}
              label={{
                value: `Safety Reorder Threshold (${reorderPoint})`,
                fill: '#e3577c',
                fontSize: 10,
                fontWeight: 700,
                position: 'top',
              }}
              stroke="#e27094"
              strokeDasharray="4 4"
            />
          )}
          <Line
            type="monotone"
            dataKey="stock"
            name="Current Inventory Trajectory"
            stroke="#94d4f8"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: '#94d4f8', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 5, fill: '#94d4f8' }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecasted Demand"
            stroke="#e3577c"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3.5, fill: '#e3577c', strokeWidth: 2, stroke: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

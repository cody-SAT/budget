"use client"; // This is CRITICAL for Next.js to make the page interactive

import React, { useMemo } from 'react';
import {
  PieChart, Pie, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

// --- Import Data ---
// FIX: Using alias paths
import {
  MOCK_CLOUD_MARKET_SHARE_DATA,
  MOCK_CLOUD_COMPARISON_DATA
} from '@/data/mockData.js'; 

// --- Import UI Components ---
// FIX: Using alias paths
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table.jsx'; 

// FIX: Using alias paths
import {
  ChartWrapper
} from '@/components/DashboardComponents.jsx'; 

// --- MAIN PAGE COMPONENT ---
export default function CompetitiveAnalysisPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Competitive Analysis</h1>
      </div>

      {/* --- Market Share Pie Chart --- */}
      <ChartWrapper title="Cloud Infrastructure Market Share (Q3 2025)" height="h-[450px]">
        <PieChart>
          <Pie
            data={MOCK_CLOUD_MARKET_SHARE_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) => `${entry.name} ${entry.value}%`}
          >
            {MOCK_CLOUD_MARKET_SHARE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ChartWrapper>

      {/* --- Comparison Table --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Landscape</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                <TableHead>AWS (Amazon)</TableHead>
                <TableHead>Azure (Microsoft)</TableHead>
                <TableHead>Google Cloud (Alphabet)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CLOUD_COMPARISON_DATA.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.aws}</TableCell>
                  <TableCell>{row.azure}</TableCell>
                  <TableCell>{row.gcp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

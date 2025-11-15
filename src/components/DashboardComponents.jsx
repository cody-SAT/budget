"use client";

// This file contains all the shared components for our dashboard pages.
// We are moving them out of `overview/page.jsx` to fix the runtime error
// and make our code cleaner.

import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Sankey
} from 'recharts';

import {
  formatLargeNumber,
  formatPercent,
  formatNumber,
} from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// FIX: Corrected the syntax error on this import line
import { SEGMENT_COLORS, OPEX_COLORS } from '@/data/mockData';

// --- Shared Components ---

export const KpiCard = ({ title, value, change, isPositive }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {change && (
        <p className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '▲' : '▼'} {change}
        </p>
      )}
    </CardContent>
  </Card>
);

export const ChartWrapper = ({ title, children, height = "h-96" }) => (
  <Card className={`${height} flex flex-col`}>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 pb-6">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- Custom Tooltips ---

export const PercentTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg z-50">
        <p className="label font-bold text-gray-700">{label}</p>
        {payload.map(entry => (
          <p key={entry.name} style={{ color: entry.color }}>
            {/* V. important: recharts passes percentages as 0-100, not 0-1 */}
            {`${entry.name}: ${formatPercent(entry.value / 100)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg z-50">
        <p className="label font-bold text-gray-700">{label}</p>
        {payload.map(entry => (
          <p key={entry.name} style={{ color: entry.color }}>
            {`${entry.name}: ${formatLargeNumber(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SankeyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // This tooltip is tricky for Sankey, so we'll be more specific
    const sourceName = payload[0].payload.source.name;
    const targetName = payload[0].payload.target.name;
    const value = payload[0].value;
    return (
      <div className="bg-white p-3 border rounded shadow-lg z-50 font-sans">
        <p className="text-sm text-gray-700">{sourceName} → {targetName}</p>
        <p className="font-bold text-indigo-600">{formatLargeNumber(value)}</p>
      </div>
    );
  }
  return null;
};

// --- 1. Sankey Chart Component ---
export const RevenueToProfitSankey = ({ data, year, filter }) => {
  const sankeyData = useMemo(() => {
    const yearData = data.filter(d => d.year === year);
    if (yearData.length === 0) {
      return { nodes: [], links: [] };
    }

    // 1. Calculate totals
    let totalRevenue = 0;
    let totalCostOfRevenue = 0;
    let totalTac = 0;
    let totalOpexRD = 0;
    let totalOpexSM = 0;
    let totalOpexGA = 0; // Assuming 0 for now
    let corporateCosts = 0;

    const segmentRevenues = {
      'Google Services': 0,
      'Google Cloud': 0,
      'Other Bets': 0,
    };

    yearData.forEach(item => {
      // Filter segments based on filter state
      if (item.segment === 'Google Services' && filter['Google Services']) {
        segmentRevenues['Google Services'] += item.revenue;
      } else if (item.segment === 'Google Cloud' && filter['Google Cloud']) {
        segmentRevenues['Google Cloud'] += item.revenue;
      } else if (item.segment === 'Other Bets' && filter['Other Bets']) {
        segmentRevenues['Other Bets'] += item.revenue;
      }

      // We calculate costs based *only* on filtered segments
      if (filter[item.segment]) {
        totalCostOfRevenue += item.costOfRevenue || 0;
        totalTac += item.tac || 0;
        totalOpexRD += item.opex_rd || 0;
        totalOpexSM += item.opex_sm || 0;
      }

      // Handle corporate costs, which are always applied
      if (item.segment === 'Corporate Costs') {
        corporateCosts = Math.abs(item.operatingIncome) || 0;
      }
    });

    totalRevenue = segmentRevenues['Google Services'] + segmentRevenues['Google Cloud'] + segmentRevenues['Other Bets'];

    // Ensure all values are positive for Sankey
    totalCostOfRevenue = Math.max(0, totalCostOfRevenue);
    totalTac = Math.max(0, totalTac);
    totalOpexRD = Math.max(0, totalOpexRD);
    totalOpexSM = Math.max(0, totalOpexSM);
    
    const grossProfit = Math.max(0, totalRevenue - totalCostOfRevenue - totalTac);
    const totalOpEx = totalOpexRD + totalOpexSM + totalOpexGA;
    
    const operatingProfit = Math.max(0, grossProfit - totalOpEx - corporateCosts);
    
    // Assuming a simple tax rate and net profit for flow
    const taxRate = 0.15;
    const tax = Math.max(0, operatingProfit * taxRate);
    const netProfit = Math.max(0, operatingProfit - tax);

    const nodes = [
      // Level 0: Segments
      { name: 'Google Services', color: SEGMENT_COLORS['Google Services'] }, // 0
      { name: 'Google Cloud', color: SEGMENT_COLORS['Google Cloud'] },   // 1
      { name: 'Other Bets', color: SEGMENT_COLORS['Other Bets'] },     // 2
      
      // Level 1: Revenue
      { name: 'Total Revenue', color: '#4A5568' }, // 3

      // Level 2: Profit/Cost
      { name: 'Gross Profit', color: '#34A853' }, // 4
      { name: 'Cost of Revenue', color: '#EA4335' }, // 5
      { name: 'TAC', color: '#FBBC05' }, // 6

      // Level 3: OpEx / OpProfit
      { name: 'Operating Profit', color: '#34A853' }, // 7
      { name: 'R&D', color: OPEX_COLORS['Research & Development'] }, // 8
      { name: 'S&M', color: OPEX_COLORS['Sales & Marketing'] }, // 9
      { name: 'Corporate Costs', color: '#EA4335' }, // 10

      // Level 4: Net Profit
      { name: 'Tax', color: '#FBBC05' }, // 11
      { name: 'Net Profit', color: '#34A853' }, // 12
    ];

    const links = [
      // Segments to Total Revenue
      { source: 0, target: 3, value: segmentRevenues['Google Services'] },
      { source: 1, target: 3, value: segmentRevenues['Google Cloud'] },
      { source: 2, target: 3, value: segmentRevenues['Other Bets'] },

      // Total Revenue to Gross Profit / Costs
      { source: 3, target: 4, value: grossProfit },
      { source: 3, target: 5, value: totalCostOfRevenue },
      { source: 3, target: 6, value: totalTac },

      // Gross Profit to OpProfit / OpEx
      { source: 4, target: 7, value: operatingProfit },
      { source: 4, target: 8, value: totalOpexRD },
      { source: 4, target: 9, value: totalOpexSM },
      { source: 4, target: 10, value: corporateCosts },

      // OpProfit to Net Profit / Tax
      { source: 7, target: 11, value: tax },
      { source: 7, target: 12, value: netProfit },
    ];
    
    // Filter out zero-value links to prevent Sankey errors
    const validLinks = links.filter(link => link && link.value > 0.01);
    
    // Find all nodes that are still referenced by valid links
    const referencedNodeIndices = new Set();
    validLinks.forEach(link => {
      referencedNodeIndices.add(link.source);
      referencedNodeIndices.add(link.target);
    });

    const validNodes = nodes.filter((node, index) => referencedNodeIndices.has(index));
    
    // Re-map indices for the new filtered nodes array
    const nodeIndexMap = new Map();
    validNodes.forEach((node, newIndex) => {
        const oldIndex = nodes.findIndex(n => n.name === node.name);
        nodeIndexMap.set(oldIndex, newIndex);
    });
    
    const finalLinks = validLinks.map(link => ({
      source: nodeIndexMap.get(link.source),
      target: nodeIndexMap.get(link.target),
      value: link.value,
    }));

    return { nodes: validNodes, links: finalLinks };

  }, [data, year, filter]);

  if (!sankeyData || sankeyData.nodes.length === 0 || sankeyData.links.length === 0) {
    return (
      <ChartWrapper title="Revenue to Profit Flow" height="h-[600px]">
        <div className="flex items-center justify-center h-full text-gray-500">
          Select segments to display data.
        </div>
      </ChartWrapper>
    );
  }

  // Custom Node for Sankey with labels
  const SankeyNode = ({ x, y, width, height, index, payload, containerWidth }) => {
    const isSource = x < containerWidth / 2;
    const node = sankeyData.nodes[index];
    if (!node) return null;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <rect width={width} height={height} fill={node.color} />
        <text
          x={isSource ? width + 6 : -6}
          y={height / 2}
          textAnchor={isSource ? 'start' : 'end'}
          dominantBaseline="middle"
          fill="#333"
          fontSize="12"
          fontWeight="500"
        >
          {node.name}
        </text>
      </g>
    );
  };

  return (
    <ChartWrapper title={`Revenue to Operating Profit Flow (${year})`} height="h-[600px]">
      <Sankey
        data={sankeyData}
        nodePadding={50}
        margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
        link={{ stroke: '#B0B0B0', strokeOpacity: 0.3 }}
        node={<SankeyNode />}
      >
        <Tooltip content={<SankeyTooltip />} />
      </Sankey>
    </ChartWrapper>
  );
};

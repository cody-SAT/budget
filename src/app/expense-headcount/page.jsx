You got it. We've successfully built the "Overview," "Segment Deep Dive," and "Competitive Analysis" pages.

The next step is to build out the "Expense & Headcount" page.

I will now migrate all the components we built for the OpEx and Headcount charts from our old app. This new page will be a self-contained component with its own year filter and will pull in all the necessary data.

Please replace the entire contents of your placeholder file at src/app/expense-headcount/page.jsx with this new, complete code.

I'm pasting this as plain text to ensure you see it.

File path: cody-SAT/budget/src/app/expense-headcount/page.jsx

Code:

"use client"; // This is CRITICAL for Next.js to make the page interactive

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// --- Import Data ---
import {
  MOCK_FINANCIAL_DATA,
  MOCK_HEADCOUNT_DATA,
  uniqueYears,
  OPEX_COLORS,
  SEGMENT_COLORS
} from '../../data/mockData'; // Relative path

// --- Import Helpers ---
import {
  formatLargeNumber,
  formatPercent,
  formatNumber,
} from '../../lib/utils'; // Relative path

// --- Import UI Components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'; // Relative path

import {
  KpiCard,
  ChartWrapper,
  PercentTooltip,
  CurrencyTooltip
} from '../../components/DashboardComponents'; // Relative path

// --- Re-creating the FilterButton logic from our old app ---
// We'll use shadcn's button component styling for this
const FilterButton = ({ text, value, activeValue, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`
      px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${activeValue === value
        ? 'bg-indigo-600 text-white' // Active style
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300' // Inactive style
      }
    `}
  >
    {text}
  </button>
);


// --- MAIN PAGE COMPONENT ---
export default function ExpenseHeadcountPage() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [opExFilter, setOpExFilter] = useState('Research & Development');

  // --- TOP-LEVEL ANALYTICS ---
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) {
        yearlyData.set(item.year, { year: item.year, totalRevenue: 0, totalOpEx: 0 });
      }
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
      yearData.totalOpEx += (item.opex_rd || 0) + (item.opex_sm || 0);
    }
    
    return Array.from(yearlyData.values()).map(d => ({
      ...d,
      opexAsPercentOfRevenue: d.totalRevenue > 0 ? (d.totalOpEx / d.totalRevenue) : 0,
    }));
  }, []);

  const opexTimeData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === y);
      const totalRD = yearData.reduce((acc, i) => acc + (i.opex_rd || 0), 0);
      const totalSM = yearData.reduce((acc, i) => acc + (i.opex_sm || 0), 0);
      return {
        year: y,
        'Research & Development': totalRD,
        'Sales & Marketing': totalSM,
      };
    });
  }, []);

  const filteredOpexData = useMemo(() => {
    return opexTimeData.map(d => ({ year: d.year, cost: d[opExFilter] }));
  }, [opexTimeData, opExFilter]);
  
  const headcountTimeData = useMemo(() => {
    const years = [...new Set(MOCK_HEADCOUNT_DATA.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = MOCK_HEADCOUNT_DATA.filter(d => d.year === y);
      return {
        year: y,
        'Google Services': yearData.find(d => d.segment === 'Google Services')?.headcount || 0,
        'Google Cloud': yearData.find(d => d.segment === 'Google Cloud')?.headcount || 0,
        'Other Bets': yearData.find(d => d.segment === 'Other Bets')?.headcount || 0,
        'Corporate': yearData.find(d => d.segment === 'Corporate')?.headcount || 0,
      }
    });
  }, []);
  
  const currentYearHeadcount = headcountTimeData.find(d => d.year === selectedYear) || headcountTimeData[headcountTimeData.length - 1] || { year: selectedYear };
  const totalHeadcount = Object.values(currentYearHeadcount).reduce((acc, val) => (typeof val === 'number' ? acc + val : acc), 0);
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header and Year Filter */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expense & Headcount</h1>
        <Select value={selectedYear.toString()} onValueValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {uniqueYears.map(y => (
              <SelectItem key={y} value={y.toString()}>{y} Performance</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <KpiCard title={`Total Headcount (${selectedYear})`} value={formatNumber(totalHeadcount)} isCurrency={false} />
      
      {/* Operating Expenses Section */}
      <div className="flex justify-between items-center mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Operating Expenses (OpEx)</h3>
        <div className="flex space-x-2">
          <FilterButton text="Research & Development" value="Research & Development" activeValue={opExFilter} onClick={setOpExFilter} />
          <FilterButton text="Sales & Marketing" value="Sales & Marketing" activeValue={opExFilter} onClick={setOpExFilter} />
        </div>
      </div>

      <ChartWrapper title={`${opExFilter} Expense Trend`}>
        <BarChart data={filteredOpexData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Bar dataKey="cost" name={`${opExFilter} Cost`} fill={OPEX_COLORS[opExFilter]} />
        </BarChart>
      </ChartWrapper>

      <ChartWrapper title="Total OpEx as % of Revenue">
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatPercent} />
          <Tooltip content={<PercentTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="opexAsPercentOfRevenue" name="OpEx as % of Revenue" stroke="#EA4335" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>

      {/* Headcount Section */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6">Headcount by Segment</h3>
      <ChartWrapper title="Headcount Trend by Segment">
        <AreaChart data={headcountTimeData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatNumber} />
          <Tooltip formatter={formatNumber} />
          <Legend />
          <Area type="monotone" dataKey="Google Services" stackId="1" stroke={SEGMENT_COLORS['Google Services']} fill={SEGMENT_COLORS['Google Services']} />
          <Area type="monotone" dataKey="Google Cloud" stackId="1" stroke={SEGMENT_COLORS['Google Cloud']} fill={SEGMENT_COLORS['Google Cloud']} />
          <Area type="monotone" dataKey="Other Bets" stackId="1" stroke={SEGMENT_COLORS['Other Bets']} fill={SEGMENT_COLORS['Other Bets']} />
          <Area type="monotone" dataKey="Corporate" stackId="1" stroke={SEGMENT_COLORS['Corporate']} fill={SEGMENT_COLORS['Corporate']} />
        </AreaChart>
      </ChartWrapper>
    </div>
  );
}

"use client"; // This is CRITICAL for Next.js to make the page interactive

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

// --- Import Data ---
// FIX: Changed relative path from ../.. to ../
import {
  MOCK_FINANCIAL_DATA,
  MOCK_BALANCE_SHEET_DATA,
  MOCK_CASH_FLOW_DATA,
  MOCK_RATIO_DATA,
  uniqueYears,
  OPEX_COLORS 
} from '../data/mockData.js'; 

// --- Import Helpers ---
// FIX: Changed relative path from ../.. to ../
import {
  formatLargeNumber,
  formatPercent,
  formatRatio,
} from '../lib/utils.js'; 

// --- Import UI Components ---
// FIX: Changed relative path from ../.. to ../
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.jsx'; 

// FIX: Changed relative path from ../.. to ../
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs.jsx'; 

// FIX: Changed relative path from ../.. to ../
import {
  KpiCard,
  ChartWrapper,
  PercentTooltip,
  CurrencyTooltip
} from '../components/DashboardComponents.jsx'; 

// --- 1. INCOME STATEMENT TAB ---
const IncomeStatement = ({ data, year }) => {
  const currentYearData = data.find(d => d.year === year) || {};
  
  // Data for the new stacked bar chart
  const costStructureData = useMemo(() => {
    return data.map(d => ({
      year: d.year,
      'Operating Income': d.totalOpIncome,
      'Research & Development': d.totalRD,
      'Sales & Marketing': d.totalSM,
      'Cost of Revenue & TAC': d.totalCostOfRevenue + (d.totalTac || 0), // Combine CoR and TAC
    }));
  }, [data]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800">Consolidated Income Statement ({year})</h3>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 font-mono text-sm">
        <div className="flex justify-between py-2 border-b"><span>Total Revenue</span><span>{formatLargeNumber(currentYearData.totalRevenue)}</span></div>
        <div className="flex justify-between py-2 border-b"><span>Cost of Revenue</span><span>({formatLargeNumber(currentYearData.totalCostOfRevenue)})</span></div>
        <div className="flex justify-between py-2 border-b font-bold"><span>Gross Profit</span><span>{formatLargeNumber(currentYearData.grossProfit)}</span></div>
        <div className="flex justify-between py-2 pt-4"><span>Research & Development</span><span>({formatLargeNumber(currentYearData.totalRD)})</span></div>
        <div className="flex justify-between py-2"><span>Sales & Marketing</span><span>({formatLargeNumber(currentYearData.totalSM)})</span></div>
        <div className="flex justify-between py-2 border-b"><span>General & Administrative</span><span>({formatLargeNumber(currentYearData.totalGA)})</span></div>
        <div className="flex justify-between py-2 border-b font-bold"><span>Total Operating Expenses</span><span>({formatLargeNumber(currentYearData.totalOpEx)})</span></div>
        <div className="flex justify-between py-2 pt-4 border-b font-bold text-lg"><span>Operating Income</span><span>{formatLargeNumber(currentYearData.totalOpIncome)}</span></div>
      </div>
      
      {/* --- NEW "More Interesting" Chart --- */}
      <ChartWrapper title="Revenue vs. Cost Structure">
        <BarChart data={costStructureData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Bar dataKey="Operating Income" stackId="a" fill="#34A853" />
          <Bar dataKey="Research & Development" stackId="a" fill={OPEX_COLORS['Research & Development']} />
          <Bar dataKey="Sales & Marketing" stackId="a" fill={OPEX_COLORS['Sales & Marketing']} />
          <Bar dataKey="Cost of Revenue & TAC" stackId="a" fill="#EA4335" />
        </BarChart>
      </ChartWrapper>

      <ChartWrapper title="Key Margins">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatPercent} />
          <Tooltip content={<PercentTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#34A853" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 2. BALANCE SHEET TAB ---
const BalanceSheet = ({ data, year }) => {
  const timeData = useMemo(() => {
    const years = [...new Set(data.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = data.filter(d => d.year === y);
      const assets = yearData.filter(d => d.type === 'Asset').reduce((acc, i) => acc + i.value, 0);
      const liabilities = yearData.filter(d => d.type === 'Liability').reduce((acc, i) => acc + i.value, 0);
      const equity = yearData.filter(d => d.type === 'Equity').reduce((acc, i) => acc + i.value, 0);
      const cash = yearData.find(d => d.item === 'Cash & Equivalents')?.value || 0;
      const debt = yearData.find(d => d.item === 'Long-Term Debt')?.value || 0;
      return { year: y, Assets: assets, Liabilities: liabilities, Equity: equity, debtToEquity: debt > 0 ? debt / equity : 0, cashRatio: liabilities > 0 ? cash / liabilities : 0 };
    });
  }, [data]);
  const currentYearData = timeData.find(d => d.year === year) || {};
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800">Consolidated Balance Sheet ({year})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard title="Total Assets" value={formatLargeNumber(currentYearData.Assets)} />
        <KpiCard title="Total Liabilities" value={formatLargeNumber(currentYearData.Liabilities)} isPositive={false} />
      </div>
      <ChartWrapper title="Assets vs. Liabilities & Equity">
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Bar dataKey="Assets" stackId="a" fill="#34A853" />
          <Bar dataKey="Liabilities" stackId="b" fill="#EA4335" />
          <Bar dataKey="Equity" stackId="b" fill="#4285F4" />
        </BarChart>
      </ChartWrapper>
      <ChartWrapper title="Key Financial Ratios">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatRatio} />
          <Tooltip formatter={formatRatio} />
          <Legend />
          <Line type="monotone" dataKey="debtToEquity" name="Debt/Equity Ratio" stroke="#EA4335" strokeWidth={3} />
          <Line type="monotone" dataKey="cashRatio" name="Cash Ratio (vs. Liabilities)" stroke="#4285F4" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 3. CASH FLOW STATEMENT TAB ---
const CashFlowStatement = ({ data, timeSeries, year }) => {
  const timeData = useMemo(() => {
    return data.map(d => {
      const ts = timeSeries.find(ts => ts.year === d.year) || { totalRevenue: 0 };
      const freeCashFlow = d.operatingCashFlow + d.capex; // Capex is negative
      return {
        ...d,
        freeCashFlow: freeCashFlow,
        fcfMargin: ts.totalRevenue > 0 ? freeCashFlow / ts.totalRevenue : 0,
        capexAsPercentOfRevenue: ts.totalRevenue > 0 ? (d.capex * -1) / ts.totalRevenue : 0,
      };
    });
  }, [data, timeSeries]);
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {};
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800">Consolidated Cash Flow ({year})</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Operating Cash Flow" value={formatLargeNumber(currentYearData.operatingCashFlow)} />
        <KpiCard title="Capital Expenditures (Capex)" value={formatLargeNumber(currentYearData.capex)} isPositive={false} />
        <KpiCard title="Free Cash Flow (FCF)" value={formatLargeNumber(currentYearData.freeCashFlow)} />
      </div>
      <ChartWrapper title="Sources & Uses of Cash">
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Bar dataKey="operatingCashFlow" name="Cash from Operations" fill="#34A853" />
          <Bar dataKey="capex" name="Cash for Investing (Capex)" fill="#FBBC05" />
          <Bar dataKey="shareRepurchases" name="Cash for Financing (Buybacks)" fill="#EA4335" />
        </BarChart>
      </ChartWrapper>
      <ChartWrapper title="Free Cash Flow Margin & Capex % of Revenue">
        <LineChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatPercent} />
          <Tooltip content={<PercentTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="fcfMargin" name="FCF Margin %" stroke="#34A853" strokeWidth={3} />
          <Line type="monotone" dataKey="capexAsPercentOfRevenue" name="Capex as % of Revenue" stroke="#FBBC05" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 4. FINANCIAL RATIOS TAB ---
const FinancialRatios = ({ data, year }) => {
  const currentYearData = data.find(d => d.year === year) || {};
  const ratioData = [
    { name: 'Return on Equity (ROE)', value: formatPercent(currentYearData.roe) },
    { name: 'Return on Assets (ROA)', value: formatPercent(currentYearData.roa) },
    { name: 'Debt to Equity', value: formatRatio(currentYearData.debtToEquity) },
    { name: 'Debt to Total Asset', value: formatRatio(currentYearData.debtToAsset) },
    { name: 'Enterprise Value to Revenue', value: formatRatio(currentYearData.evToRevenue) },
    { name: 'Enterprise Value to EBITDA', value: formatRatio(currentYearData.evToEbitda) },
    { name: 'Cash to Debt', value: formatPercent(currentYearData.cashToDebt) },
    { name: 'Tax Rate (%)', value: formatPercent(currentYearData.taxRate) },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800">Key Financial Ratios ({year})</h3>
      
      {/* Ratio Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 font-mono text-sm">
        {ratioData.map(item => (
          <div key={item.name} className="flex justify-between py-2 border-b">
            <span>{item.name}</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      <ChartWrapper title="Profitability Ratios">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatPercent} />
          <Tooltip content={<PercentTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="roe" name="Return on Equity" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="roa" name="Return on Assets" stroke="#34A853" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>

      <ChartWrapper title="Leverage & Valuation Ratios">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis yAxisId="left" stroke="#EA4335" tickFormatter={formatRatio} />
          <YAxis yAxisId="right" orientation="right" stroke="#FBBC05" tickFormatter={formatRatio} />
          <Tooltip formatter={(value, name) => name === 'Debt/Equity' ? formatRatio(value) : formatRatio(value)} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="debtToEquity" name="Debt/Equity" stroke="#EA4335" strokeWidth={3} />
          <Line yAxisId="right" type="monotone" dataKey="evToEbitda" name="EV/EBITDA" stroke="#FBBC05" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function FinancialStatementsPage() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);

  // FIX: Re-ordered tabs and set new default
  const subTabs = ['Cash Flow Statement', 'Balance Sheet', 'Income Statement', 'Financial Ratios'];

  // Memoized data for all sub-components
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) yearlyData.set(item.year, { year: item.year, totalRevenue: 0 });
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
    }
    return Array.from(yearlyData.values());
  }, [MOCK_FINANCIAL_DATA]);

  const incomeStatementData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === y);
      const totalRevenue = yearData.reduce((acc, i) => acc + i.revenue, 0);
      const totalCostOfRevenue = yearData.reduce((acc, i) => acc + i.costOfRevenue, 0);
      const totalTac = yearData.reduce((acc, i) => acc + (i.tac || 0), 0);
      const grossProfit = totalRevenue - totalCostOfRevenue - totalTac;
      const totalRD = yearData.reduce((acc, i) => acc + (i.opex_rd || 0), 0);
      const totalSM = yearData.reduce((acc, i) => acc + (i.opex_sm || 0), 0);
      const totalGA = 0; // Not in mock data
      const totalOpEx = totalRD + totalSM + totalGA;
      const totalOpIncome = yearData.reduce((acc, i) => acc + i.operatingIncome, 0);
      return {
        year: y, totalRevenue, totalCostOfRevenue, totalTac, grossProfit, totalRD, totalSM, totalGA,
        totalOpEx, totalOpIncome,
        grossMargin: totalRevenue > 0 ? grossProfit / totalRevenue : 0,
        opMargin: totalRevenue > 0 ? totalOpIncome / totalRevenue : 0,
      };
    });
  }, [MOCK_FINANCIAL_DATA]);

  return (
    <div className="space-y-6">
      {/* Page Header and Year Filter */}
      <div className="flex justify-between items-center">
        {/* FIX: Renamed title */}
        <h1 className="text-3xl font-bold text-gray-900">Financial Statements</h1>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
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

      {/* --- Main Tabs --- */}
      {/* FIX: Set new default and re-ordered list */}
      <Tabs defaultValue="Cash Flow Statement" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Cash Flow Statement">Cash Flow</TabsTrigger>
          <TabsTrigger value="Balance Sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="Income Statement">Income Statement</TabsTrigger>
          <TabsTrigger value="Financial Ratios">Ratios</TabsTrigger>
        </TabsList>
        
        {/* --- Tab Content (Re-ordered) --- */}
        <TabsContent value="Cash Flow Statement" className="mt-6">
          <CashFlowStatement data={MOCK_CASH_FLOW_DATA} timeSeries={timeSeriesData} year={selectedYear} />
        </TabsContent>
        <TabsContent value="Balance Sheet" className="mt-6">
          <BalanceSheet data={MOCK_BALANCE_SHEET_DATA} year={selectedYear} />
        </TabsContent>
        <TabsContent value="Income Statement" className="mt-6">
          <IncomeStatement data={incomeStatementData} year={selectedYear} />
        </TabsContent>
        <TabsContent value="Financial Ratios" className="mt-6">
          <FinancialRatios data={MOCK_RATIO_DATA} year={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

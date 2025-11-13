import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell,
} from 'recharts';

// --- MOCK DATA (ALPHABET INC. 5-YEAR DEEP DIVE) ---
// All figures are in *Millions of USD*.
const MOCK_FINANCIAL_DATA = [
  // --- 2021 ---
  { id: 1, year: 2021, segment: 'Google Services', item: 'Google Search', revenue: 149000, tac: 24000, operatingIncome: 55000 },
  { id: 2, year: 2021, segment: 'Google Services', item: 'YouTube Ads', revenue: 28800, operatingIncome: 6000 },
  { id: 3, year: 2021, segment: 'Google Services', item: 'Google Network', revenue: 31000, operatingIncome: 7500 },
  { id: 4, year: 2021, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 7000, operatingIncome: 500 },
  { id: 5, year: 2021, segment: 'Google Services', item: 'Hardware & Other', revenue: 20000, operatingIncome: 2000 },
  { id: 6, year: 2021, segment: 'Google Cloud', item: 'Google Cloud', revenue: 19200, operatingIncome: -3100 },
  { id: 7, year: 2021, segment: 'Other Bets', item: 'Waymo', revenue: 200, operatingIncome: -4000 },
  { id: 8, year: 2021, segment: 'Other Bets', item: 'Verily', revenue: 700, operatingIncome: -2500 },
  { id: 9, year: 2021, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -9000 },

  // --- 2022 ---
  { id: 10, year: 2022, segment: 'Google Services', item: 'Google Search', revenue: 162000, tac: 26000, operatingIncome: 60000 },
  { id: 11, year: 2022, segment: 'Google Services', item: 'YouTube Ads', revenue: 29200, operatingIncome: 6500 },
  { id: 12, year: 2022, segment: 'Google Services', item: 'Google Network', revenue: 32500, operatingIncome: 7800 },
  { id: 13, year: 2022, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 8000, operatingIncome: 700 },
  { id: 14, year: 2022, segment: 'Google Services', item: 'Hardware & Other', revenue: 22000, operatingIncome: 2500 },
  { id: 15, year: 2022, segment: 'Google Cloud', item: 'Google Cloud', revenue: 26300, operatingIncome: -1900 },
  { id: 16, year: 2022, segment: 'Other Bets', item: 'Waymo', revenue: 250, operatingIncome: -3500 },
  { id: 17, year: 2022, segment: 'Other Bets', item: 'Verily', revenue: 800, operatingIncome: -2200 },
  { id: 18, year: 2022, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -10000 },
  
  // --- 2023 ---
  { id: 19, year: 2023, segment: 'Google Services', item: 'Google Search', revenue: 175000, tac: 28000, operatingIncome: 65000 },
  { id: 20, year: 2023, segment: 'Google Services', item: 'YouTube Ads', revenue: 31500, operatingIncome: 7000 },
  { id: 21, year: 2023, segment: 'Google Services', item: 'Google Network', revenue: 32000, operatingIncome: 8000 },
  { id: 22, year: 2023, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 10000, operatingIncome: 1000 },
  { id: 23, year: 2023, segment: 'Google Services', item: 'Hardware & Other', revenue: 23000, operatingIncome: 3000 },
  { id: 24, year: 2023, segment: 'Google Cloud', item: 'Google Cloud', revenue: 33000, operatingIncome: -500 },
  { id: 25, year: 2023, segment: 'Other Bets', item: 'Waymo', revenue: 300, operatingIncome: -3000 },
  { id: 26, year: 2023, segment: 'Other Bets', item: 'Verily', revenue: 900, operatingIncome: -2000 },
  { id: 27, year: 2023, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -11000 },

  // --- 2024 ---
  { id: 28, year: 2024, segment: 'Google Services', item: 'Google Search', revenue: 192000, tac: 31000, operatingIncome: 72000 },
  { id: 29, year: 2024, segment: 'Google Services', item: 'YouTube Ads', revenue: 35000, operatingIncome: 8500 },
  { id: 30, year: 2024, segment: 'Google Services', item: 'Google Network', revenue: 33000, operatingIncome: 8200 },
  { id: 31, year: 2024, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 13000, operatingIncome: 1500 },
  { id: 32, year: 2024, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, operatingIncome: 3500 },
  { id: 33, year: 2024, segment: 'Google Cloud', item: 'Google Cloud', revenue: 42000, operatingIncome: 1200 }, // Profitable
  { id: 34, year: 2024, segment: 'Other Bets', item: 'Waymo', revenue: 400, operatingIncome: -2800 },
  { id: 35, year: 2024, segment: 'Other Bets', item: 'Verily', revenue: 1100, operatingIncome: -1700 },
  { id: 36, year: 2024, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -12000 },

  // --- 2025 (Projected) ---
  { id: 37, year: 2025, segment: 'Google Services', item: 'Google Search', revenue: 210000, tac: 34000, operatingIncome: 80000 },
  { id: 38, year: 2025, segment: 'Google Services', item: 'YouTube Ads', revenue: 40000, operatingIncome: 10000 },
  { id: 39, year: 2025, segment: 'Google Services', item: 'Google Network', revenue: 34000, operatingIncome: 8500 },
  { id: 40, year: 2025, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 17000, operatingIncome: 2000 },
  { id: 41, year: 2025, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, operatingIncome: 4000 },
  { id: 42, year: 2025, segment: 'Google Cloud', item: 'Google Cloud', revenue: 53000, operatingIncome: 3000 },
  { id: 43, year: 2025, segment: 'Other Bets', item: 'Waymo', revenue: 600, operatingIncome: -2500 },
  { id: 44, year: 2025, segment: 'Other Bets', item: 'Verily', revenue: 1400, operatingIncome: -1500 },
  { id: 45, year: 2025, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -12500 },
];

// --- NEW MOCK CASH FLOW DATA ---
const MOCK_CASH_FLOW_DATA = [
  { year: 2021, operatingCashFlow: 91000, capex: 24600 },
  { year: 2022, operatingCashFlow: 92000, capex: 31500 },
  { year: 2023, operatingCashFlow: 101000, capex: 32300 },
  { year: 2024, operatingCashFlow: 110000, capex: 38000 },
  { year: 2025, operatingCashFlow: 120000, capex: 40000 },
];

// --- NEW MOCK EXPENSE DATA (OpEx) ---
const MOCK_EXPENSE_DATA = [
  // 2021
  { year: 2021, type: 'R&D', cost: 31500 },
  { year: 2021, type: 'S&M', cost: 22000 },
  { year: 2021, type: 'G&A', cost: 16000 },
  // 2022
  { year: 2022, type: 'R&D', cost: 39500 },
  { year: 2022, type: 'S&M', cost: 26000 },
  { year: 2022, type: 'G&A', cost: 18000 },
  // 2023
  { year: 2023, type: 'R&D', cost: 42000 },
  { year: 2023, type: 'S&M', cost: 28000 },
  { year: 2023, type: 'G&A', cost: 19000 },
  // 2024
  { year: 2024, type: 'R&D', cost: 45000 },
  { year: 2024, type: 'S&M', cost: 30000 },
  { year: 2024, type: 'G&A', cost: 20000 },
  // 2025
  { year: 2025, type: 'R&D', cost: 48000 },
  { year: 2025, type: 'S&M', cost: 32000 },
  { year: 2025, type: 'G&A', cost: 21000 },
];

// --- NEW MOCK HEADCOUNT DATA ---
const MOCK_HEADCOUNT_DATA = [
  // 2021
  { year: 2021, segment: 'Google Services', headcount: 120000 },
  { year: 2021, segment: 'Google Cloud', headcount: 25000 },
  { year: 2021, segment: 'Other Bets', headcount: 8000 },
  { year: 2021, segment: 'Corporate', headcount: 5000 },
  // 2022
  { year: 2022, segment: 'Google Services', headcount: 140000 },
  { year: 2022, segment: 'Google Cloud', headcount: 35000 },
  { year: 2022, segment: 'Other Bets', headcount: 9000 },
  { year: 2022, segment: 'Corporate', headcount: 6000 },
  // 2023
  { year: 2023, segment: 'Google Services', headcount: 138000 }, // Layoffs
  { year: 2023, segment: 'Google Cloud', headcount: 37000 },
  { year: 2023, segment: 'Other Bets', headcount: 8500 },
  { year: 2023, segment: 'Corporate', headcount: 5500 },
  // 2024
  { year: 2024, segment: 'Google Services', headcount: 135000 },
  { year: 2024, segment: 'Google Cloud', headcount: 40000 },
  { year: 2024, segment: 'Other Bets', headcount: 8000 },
  { year: 2024, segment: 'Corporate', headcount: 5000 },
  // 2025
  { year: 2025, segment: 'Google Services', headcount: 137000 },
  { year: 2025, segment: 'Google Cloud', headcount: 43000 },
  { year: 2025, segment: 'Other Bets', headcount: 8200 },
  { year: 2025, segment: 'Corporate', headcount: 5100 },
];


const uniqueYears = [...new Set(MOCK_FINANCIAL_DATA.map(item => item.year))].sort((a, b) => b - a);
const SEGMENT_COLORS = {
  'Google Services': '#4285F4', // Google Blue
  'Google Cloud': '#34A853',    // Google Green
  'Other Bets': '#FBBC05',       // Google Yellow
  'Corporate Costs': '#EA4335', // Google Red
  'Corporate': '#EA4335',
};
const OPEX_COLORS = {
  'R&D': '#4285F4',
  'S&M': '#34A853',
  'G&A': '#FBBC05',
};
const SERVICES_COLORS = {
  'Google Search': '#4285F4',
  'YouTube Ads': '#FF0000',
  'Google Network': '#FBBC05',
  'YouTube Subscriptions': '#DA00FF',
  'Hardware & Other': '#34A853',
}
const WAYMO_MILESTONES = {
  2021: "Raised $2.5B in funding; 100K+ rides.",
  2022: "Began charging for rides in San Francisco.",
  2023: "Launched fully driverless rides in SF & Phoenix.",
  2024: "Expanded operations to Austin; 2M driverless miles.",
  2025: "Projected 10M driverless miles; 50,000 active riders.",
};

// --- HELPER FUNCTIONS & COMPONENTS ---

// Formats large numbers (in millions) to simplified B / M
const formatLargeNumber = (value) => {
  const valInMillions = value;
  if (Math.abs(valInMillions) >= 1000) {
    return `$${(valInMillions / 1000).toFixed(1)}B`;
  }
  return `$${valInMillions.toFixed(0)}M`;
};

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

const KpiCard = ({ title, value, change, isPositive, isCurrency = true }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    {change && (
      <p className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </p>
    )}
  </div>
);

const ChartWrapper = ({ title, children, height = "h-96" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${height}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height="90%">
      {children}
    </ResponsiveContainer>
  </div>
);

// Reusable filter button
const FilterButton = ({ text, value, activeValue, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`
      px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${activeValue === value
        ? 'bg-indigo-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
      }
    `}
  >
    {text}
  </button>
);

// --- 1. OVERVIEW DASHBOARD COMPONENT ---

const OverviewDashboard = ({ financialData, timeSeries, year, onYearChange, years }) => {
  
  // A. KPI Calculations for Selected Year
  const kpiData = useMemo(() => {
    const currentYearData = timeSeries.find(d => d.year === year);
    if (!currentYearData) return {};
    return {
      totalRevenue: currentYearData.totalRevenue,
      operatingIncome: currentYearData.totalOpIncome,
      opMargin: currentYearData.opMargin,
      revenueGrowth: currentYearData.revenueGrowth,
      opIncomeGrowth: currentYearData.opIncomeGrowth,
      freeCashFlow: currentYearData.freeCashFlow,
    };
  }, [timeSeries, year]);

  // B. Data for Segment Charts (Pie & Bar)
  const segmentData = useMemo(() => {
    const yearData = financialData.filter(d => d.year === year);
    const segmentMap = new Map();
    
    for (const item of yearData) {
      if (item.segment === 'Corporate Costs') continue; // Exclude from revenue pie
      if (!segmentMap.has(item.segment)) {
        segmentMap.set(item.segment, { name: item.segment, revenue: 0, operatingIncome: 0 });
      }
      const seg = segmentMap.get(item.segment);
      seg.revenue += item.revenue;
      seg.operatingIncome += item.operatingIncome;
    }
    return Array.from(segmentMap.values());
  }, [financialData, year]);

  // C. Data for OpIncome chart (includes Corporate Costs)
  const opIncomeSegmentData = useMemo(() => {
    const yearData = financialData.filter(d => d.year === year);
    const segmentMap = new Map();
    
    for (const item of yearData) {
      const segmentName = item.segment;
      if (!segmentMap.has(segmentName)) {
        segmentMap.set(segmentName, { name: segmentName, operatingIncome: 0 });
      }
      segmentMap.get(segmentName).operatingIncome += item.operatingIncome;
    }
    return Array.from(segmentMap.values());
  }, [financialData, year]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* --- FILTERS --- */}
      <div className="flex justify-end">
        <select
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {years.map(y => <option key={y} value={y}>{y} Performance</option>)}
        </select>
      </div>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value={formatLargeNumber(kpiData.totalRevenue)}
          change={`${formatPercent(kpiData.revenueGrowth)} YoY`}
          isPositive={kpiData.revenueGrowth >= 0}
        />
        <KpiCard 
          title="Operating Income" 
          value={formatLargeNumber(kpiData.operatingIncome)} 
          change={`${formatPercent(kpiData.opIncomeGrowth)} YoY`}
          isPositive={kpiData.opIncomeGrowth >= 0}
        />
        <KpiCard 
          title="Operating Margin" 
          value={formatPercent(kpiData.opMargin)}
        />
        <KpiCard 
          title="Free Cash Flow (FCF)" 
          value={formatLargeNumber(kpiData.freeCashFlow)}
          change="vs. Prior Year"
          isPositive={true} // Simplified for demo
        />
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TIME SERIES CHART (Lines Only) */}
        <div className="lg:col-span-3">
          <ChartWrapper title="Key Performance Metrics (YoY)">
            <LineChart data={timeSeries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#4285F4" tickFormatter={val => `${val.toFixed(0)}%`} label={{ value: 'YoY Growth %', angle: -90, position: 'insideLeft', fill: '#4285F4' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#34A853" tickFormatter={val => `${val.toFixed(0)}%`} label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#34A853' }} />
              <Tooltip formatter={(value, name) => `${value.toFixed(1)}%`} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Revenue Growth" stroke="#4285F4" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="Operating Margin" stroke="#34A853" strokeWidth={3} />
            </LineChart>
          </ChartWrapper>
        </div>
      </div>
      
      {/* --- "BY SEGMENT" SECTION --- */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">By Segment ({year})</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE BY SEGMENT */}
        <div className="lg:col-span-1">
          <ChartWrapper title={`Revenue by Segment (${year})`}>
            <PieChart>
              <Pie data={segmentData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={formatLargeNumber} />
              <Legend />
            </PieChart>
          </ChartWrapper>
        </div>

        {/* OP. INCOME BY SEGMENT (THE MONEY STORY) */}
        <div className="lg:col-span-2">
          <ChartWrapper title={`Operating Income by Segment (${year})`}>
            <BarChart data={opIncomeSegmentData} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" tickFormatter={formatLargeNumber} />
              <YAxis dataKey="name" type="category" stroke="#666" width={100} />
              <Tooltip formatter={formatLargeNumber} />
              <Bar dataKey="operatingIncome">
                {opIncomeSegmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.operatingIncome >= 0 ? SEGMENT_COLORS[entry.name] : '#EA4335'} />
                ))}
              </Bar>
            </BarChart>
          </ChartWrapper>
        </div>
      </div>

    </div>
  );
};

// --- 2. GOOGLE SEARCH TAB ---

const GoogleSearchTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === 'Google Search')
      .map(d => ({
        ...d,
        tacPercent: (d.tac / d.revenue) * 100,
        opMargin: (d.operatingIncome / d.revenue) * 100,
      }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">Google Search ({year})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Search Revenue" value={formatLargeNumber(currentYearData.revenue)} />
        <KpiCard title="Traffic Acquisition Cost (TAC)" value={formatLargeNumber(currentYearData.tac)} change="Key Antitrust Metric" isPositive={false} />
        <KpiCard title="TAC as % of Revenue" value={formatPercent(currentYearData.tac / currentYearData.revenue)} isCurrency={false} />
      </div>
      <ChartWrapper title="Search Revenue vs. TAC (Time Series)">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="tac" name="TAC" stroke="#EA4335" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Search Operating Margin (Time Series)">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={val => `${val.toFixed(0)}%`} />
          <Tooltip formatter={val => `${val.toFixed(1)}%`} />
          <Legend />
          <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#4285F4" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 3. YOUTUBE TAB ---

const YouTubeTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    const years = [...new Set(data.map(d => d.year))].sort();
    return years.map(y => {
      const adData = data.find(d => d.year === y && d.item === 'YouTube Ads');
      const subData = data.find(d => d.year === y && d.item === 'YouTube Subscriptions');
      return {
        year: y,
        adRevenue: adData ? adData.revenue : 0,
        subRevenue: subData ? subData.revenue : 0,
        totalRevenue: (adData ? adData.revenue : 0) + (subData ? subData.revenue : 0),
      };
    });
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">YouTube ({year})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total YouTube Revenue" value={formatLargeNumber(currentYearData.totalRevenue)} />
        <KpiCard title="Ad Revenue" value={formatLargeNumber(currentYearData.adRevenue)} />
        <KpiCard title="Subscriptions Revenue" value={formatLargeNumber(currentYearData.subRevenue)} change="High-Growth" isPositive={true} />
      </div>
      <ChartWrapper title="YouTube Revenue Sources (Time Series)">
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Legend />
          <Bar dataKey="adRevenue" name="Ad Revenue" stackId="a" fill="#FF0000" />
          <Bar dataKey="subRevenue" name="Subscriptions Revenue" stackId="a" fill="#DA00FF" />
        </BarChart>
      </ChartWrapper>
    </div>
  );
};

// --- 4. GOOGLE CLOUD TAB ---

const GoogleCloudTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === 'Google Cloud')
      .map(d => ({
        ...d,
        opMargin: (d.operatingIncome / d.revenue) * 100,
      }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1];
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">Google Cloud ({year})</h2>
      <KpiCard title="Cloud Revenue" value={formatLargeNumber(currentYearData.revenue)} />
      <ChartWrapper title="Cloud Revenue & Profitability (Time Series)">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis yAxisId="left" stroke={SEGMENT_COLORS['Google Cloud']} tickFormatter={formatLargeNumber} />
          <YAxis yAxisId="right" orientation="right" stroke="#EA4335" tickFormatter={val => `${val.toFixed(0)}%`} />
          <Tooltip formatter={(value, name) => name === 'Op. Margin' ? `${value.toFixed(1)}%` : formatLargeNumber(value)} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke={SEGMENT_COLORS['Google Cloud']} strokeWidth={3} />
          <Line yAxisId="right" type="monotone" dataKey="opMargin" name="Op. Margin" stroke="#EA4335" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 5. OTHER BETS TAB ---

const OtherBetsTab = ({ data, year }) => {
  const [filter, setFilter] = useState('Waymo'); // Filter for Waymo/Verily

  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === filter)
      .map(d => ({...d, opLoss: d.operatingIncome * -1 }));
  }, [data, filter]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1];
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-0">Other Bets ({year})</h2>
        {/* NEW FILTER */}
        <div className="flex space-x-2">
          <FilterButton text="Waymo" value="Waymo" activeValue={filter} onClick={setFilter} />
          <FilterButton text="Verily" value="Verily" activeValue={filter} onClick={setFilter} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard title={`${filter} Operating Loss`} value={formatLargeNumber(currentYearData.operatingIncome)} isPositive={false} />
        {filter === 'Waymo' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{year} Waymo Milestone</h3>
            <p className="text-xl font-bold text-gray-900 mt-2">{WAYMO_MILESTONES[year]}</p>
          </div>
        )}
      </div>
      <ChartWrapper title={`${filter} Operating Loss (Cash Burn)`}>
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Legend />
          <Bar dataKey="opLoss" name="Operating Loss" fill={SEGMENT_COLORS['Other Bets']} />
        </BarChart>
      </ChartWrapper>
    </div>
  );
};

// --- 6. NEW EXPENSE & HEADCOUNT TAB ---

const HeadcountExpenseDashboard = ({ expenseData, headcountData, year }) => {
  const [opExFilter, setOpExFilter] = useState('R&D');

  const opexTimeData = useMemo(() => {
    return expenseData.filter(d => d.type === opExFilter);
  }, [expenseData, opExFilter]);
  
  const headcountTimeData = useMemo(() => {
    const years = [...new Set(headcountData.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = headcountData.filter(d => d.year === y);
      return {
        year: y,
        'Google Services': yearData.find(d => d.segment === 'Google Services')?.headcount || 0,
        'Google Cloud': yearData.find(d => d.segment === 'Google Cloud')?.headcount || 0,
        'Other Bets': yearData.find(d => d.segment === 'Other Bets')?.headcount || 0,
        'Corporate': yearData.find(d => d.segment === 'Corporate')?.headcount || 0,
      }
    });
  }, [headcountData]);
  
  const currentYearHeadcount = headcountTimeData.find(d => d.year === year) || headcountTimeData[headcountTimeData.length - 1];
  const totalHeadcount = Object.values(currentYearHeadcount).reduce((acc, val) => (typeof val === 'number' ? acc + val : acc), 0);
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expense & Headcount ({year})</h2>
      <KpiCard title="Total Headcount" value={formatNumber(totalHeadcount)} isCurrency={false} />
      
      {/* Operating Expenses Section */}
      <div className="flex justify-between items-center mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Operating Expenses (OpEx)</h3>
        <div className="flex space-x-2">
          <FilterButton text="R&D" value="R&D" activeValue={opExFilter} onClick={setOpExFilter} />
          <FilterButton text="S&M" value="S&M" activeValue={opExFilter} onClick={setOpExFilter} />
          <FilterButton text="G&A" value="G&A" activeValue={opExFilter} onClick={setOpExFilter} />
        </div>
      </div>
      <ChartWrapper title={`${opExFilter} Expense Trend`}>
        <BarChart data={opexTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Bar dataKey="cost" name={`${opExFilter} Cost`} fill={OPEX_COLORS[opExFilter]} />
        </BarChart>
      </ChartWrapper>

      {/* Headcount Section */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6">Headcount by Segment</h3>
      <ChartWrapper title="Headcount Trend by Segment">
        <BarChart data={headcountTimeData} stackOffset="none">
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatNumber} />
          <Tooltip formatter={formatNumber} />
          <Legend />
          <Bar dataKey="Google Services" stackId="a" fill={SEGMENT_COLORS['Google Services']} />
          <Bar dataKey="Google Cloud" stackId="a" fill={SEGMENT_COLORS['Google Cloud']} />
          <Bar dataKey="Other Bets" stackId="a" fill={SEGMENT_COLORS['Other Bets']} />
          <Bar dataKey="Corporate" stackId="a" fill={SEGMENT_COLORS['Corporate']} />
        </BarChart>
      </ChartWrapper>
    </div>
  );
};

// --- 7. NEW CASH FLOW TAB ---

const CashFlowDashboard = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data.map(d => ({
      ...d,
      freeCashFlow: d.operatingCashFlow - d.capex,
      fcfMargin: (d.operatingCashFlow - d.capex) / (MOCK_FINANCIAL_DATA.filter(f => f.year === d.year).reduce((acc, f) => acc + f.revenue, 0)) * 100,
    }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cash Flow ({year})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Operating Cash Flow" value={formatLargeNumber(currentYearData.operatingCashFlow)} />
        <KpiCard title="Capital Expenditures (Capex)" value={formatLargeNumber(currentYearData.capex)} isPositive={false} />
        <KpiCard title="Free Cash Flow (FCF)" value={formatLargeNumber(currentYearData.freeCashFlow)} />
      </div>
      
      <ChartWrapper title="Cash Flow Trends (Time Series)">
        <LineChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Legend />
          <Line type="monotone" dataKey="operatingCashFlow" name="Operating Cash Flow" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="freeCashFlow" name="Free Cash Flow" stroke="#34A853" strokeWidth={3} />
          <Line type="monotone" dataKey="capex" name="Capex" stroke="#EA4335" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ChartWrapper>
      
      <ChartWrapper title="Free Cash Flow Margin % (Time Series)">
        <LineChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={val => `${val.toFixed(0)}%`} />
          <Tooltip formatter={val => `${val.toFixed(1)}%`} />
          <Legend />
          <Line type="monotone" dataKey="fcfMargin" name="FCF Margin %" stroke="#34A853" strokeWidth={3} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};

// --- 8. PLACEHOLDER TAB ---

const SystemAccessTab = () => (
  <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-inner animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content for System Access</h2>
    <p className="text-gray-600">This is the placeholder content for System Access.</p>
  </div>
);


// --- MAIN APP COMPONENT ---

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState('Overview');
  // NEW Flatter Tab Structure
  const tabs = ['Overview', 'Google Search', 'YouTube', 'Google Cloud', 'Other Bets', 'Expense & Headcount', 'Cash Flow', 'System Access'];
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]); // Default to newest year

  // --- TOP-LEVEL ANALYTICS ---
  // Calculates aggregated financial data for all years
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();

    // Aggregate by year
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) {
        yearlyData.set(item.year, { year: item.year, totalRevenue: 0, totalOpIncome: 0 });
      }
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
      yearData.totalOpIncome += item.operatingIncome;
    }
    
    const cashFlowMap = new Map(MOCK_CASH_FLOW_DATA.map(d => [d.year, d]));

    const sortedData = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year);

    // Calculate YoY Growth and Margins
    let lastYearRevenue = 0;
    let lastYearOpIncome = 0;

    return sortedData.map(d => {
      const revenueGrowth = lastYearRevenue === 0 ? 0 : (d.totalRevenue - lastYearRevenue) / lastYearRevenue;
      const opIncomeGrowth = lastYearOpIncome === 0 ? 0 : (d.totalOpIncome - lastYearOpIncome) / lastYearOpIncome;
      const opMargin = d.totalRevenue === 0 ? 0 : d.totalOpIncome / d.totalRevenue;
      
      const cfData = cashFlowMap.get(d.year) || { operatingCashFlow: 0, capex: 0 };
      const freeCashFlow = cfData.operatingCashFlow - cfData.capex;

      lastYearRevenue = d.totalRevenue;
      lastYearOpIncome = d.totalOpIncome;
      
      return {
        year: d.year,
        totalRevenue: d.totalRevenue,
        totalOpIncome: d.totalOpIncome,
        freeCashFlow: freeCashFlow,
        'Revenue Growth': revenueGrowth * 100,
        'Operating Margin': opMargin * 100,
        revenueGrowth, // raw value for KPIs
        opIncomeGrowth, // raw value for KPIs
        opMargin, // raw value for KPIs
      };
    });
  }, []); // Runs once on mount

  // Render logic for the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewDashboard 
                  financialData={MOCK_FINANCIAL_DATA}
                  timeSeries={timeSeriesData}
                  year={selectedYear}
                  onYearChange={setSelectedYear}
                  years={uniqueYears}
                />;
      case 'Google Search':
        return <GoogleSearchTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />;
      case 'YouTube':
        return <YouTubeTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />;
      case 'Google Cloud':
        return <GoogleCloudTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />;
      case 'Other Bets':
        return <OtherBetsTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />;
      case 'Expense & Headcount':
        return <HeadcountExpenseDashboard 
                  expenseData={MOCK_EXPENSE_DATA}
                  headcountData={MOCK_HEADCOUNT_DATA}
                  year={selectedYear} 
                />;
      case 'Cash Flow':
        return <CashFlowDashboard data={MOCK_CASH_FLOW_DATA} year={selectedYear} />;
      case 'System Access':
        return <SystemAccessTab />;
      default:
        return <OverviewDashboard 
                  financialData={MOCK_FINANCIAL_DATA}
                  timeSeries={timeSeriesData}
                  year={selectedYear}
                  onYearChange={setSelectedYear}
                  years={uniqueYears}
                />;
    }
  };

  return (
    // Main container
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Main Card Container (Wider) */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl border-t-4 border-indigo-500 overflow-hidden">
        
        {/* Header Section */}
        <header className="text-center p-8 pb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            Alphabet Inc.
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Financial Performance Dashboard
          </p>
        </header>

        {/* Layout Wrapper */}
        <div className="flex flex-col sm:flex-row">

          {/* Tab Navigation */}
          <nav className="flex-shrink-0 sm:w-60 sm:p-8 sm:pt-0 sm:pr-4 p-4 pb-0 sm:pb-4">
            <div className="flex flex-row sm:flex-col border-b sm:border-b-0 sm:border-r border-gray-200 overflow-x-auto sm:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-shrink-0 sm:w-full sm:text-left py-3 px-4 font-medium text-sm sm:text-base transition-all duration-150 whitespace-nowrap
                    focus:outline-none sm:rounded-l-md sm:rounded-r-none
                    ${activeTab === tab
                      ? 'border-b-2 sm:border-b-0 sm:border-l-4 border-indigo-600 text-indigo-700 bg-white sm:bg-indigo-50'
                      : 'border-b-2 sm:border-b-0 sm:border-l-4 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
          
          {/* Conditional Content Area */}
          <main className="flex-1 p-4 pt-6 sm:p-8 sm:pt-0 bg-gray-50/50 min-h-[800px]">
            {renderActiveTab()}
          </main>
        </div>
      </div>
      
      {/* Keyframe for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

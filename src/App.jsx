import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ComposedChart, AreaChart, Area,
} from 'recharts';

// --- MOCK DATA (ALPHABET INC. DEEP DIVE) ---
// Based on real public reporting trends. All figures are in *Millions of USD*.
// Added TAC for Search, split Google Other (Subs, Hardware), and Other Bets (Waymo, Verily).
const MOCK_FINANCIAL_DATA = [
  // --- 2023 ---
  { id: 1, year: 2023, segment: 'Google Services', item: 'Google Search', revenue: 175000, tac: 28000, operatingIncome: 65000 },
  { id: 2, year: 2023, segment: 'Google Services', item: 'YouTube Ads', revenue: 31500, operatingIncome: 7000 },
  { id: 3, year: 2023, segment: 'Google Services', item: 'Google Network', revenue: 32000, operatingIncome: 8000 },
  { id: 4, year: 2023, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 10000, operatingIncome: 1000 },
  { id: 5, year: 2023, segment: 'Google Services', item: 'Hardware & Other', revenue: 23000, operatingIncome: 3000 },
  { id: 6, year: 2023, segment: 'Google Cloud', item: 'Google Cloud', revenue: 33000, operatingIncome: -500 },
  { id: 7, year: 2023, segment: 'Other Bets', item: 'Waymo', revenue: 300, operatingIncome: -3000 },
  { id: 8, year: 2023, segment: 'Other Bets', item: 'Verily', revenue: 900, operatingIncome: -2000 },
  { id: 9, year: 2023, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -11000 },

  // --- 2024 ---
  { id: 10, year: 2024, segment: 'Google Services', item: 'Google Search', revenue: 192000, tac: 31000, operatingIncome: 72000 },
  { id: 11, year: 2024, segment: 'Google Services', item: 'YouTube Ads', revenue: 35000, operatingIncome: 8500 },
  { id: 12, year: 2024, segment: 'Google Services', item: 'Google Network', revenue: 33000, operatingIncome: 8200 },
  { id: 13, year: 2024, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 13000, operatingIncome: 1500 },
  { id: 14, year: 2024, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, operatingIncome: 3500 },
  { id: 15, year: 2024, segment: 'Google Cloud', item: 'Google Cloud', revenue: 42000, operatingIncome: 1200 }, // Profitable
  { id: 16, year: 2024, segment: 'Other Bets', item: 'Waymo', revenue: 400, operatingIncome: -2800 },
  { id: 17, year: 2024, segment: 'Other Bets', item: 'Verily', revenue: 1100, operatingIncome: -1700 },
  { id: 18, year: 2024, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -12000 },

  // --- 2025 (Projected) ---
  { id: 19, year: 2025, segment: 'Google Services', item: 'Google Search', revenue: 210000, tac: 34000, operatingIncome: 80000 },
  { id: 20, year: 2025, segment: 'Google Services', item: 'YouTube Ads', revenue: 40000, operatingIncome: 10000 },
  { id: 21, year: 2025, segment: 'Google Services', item: 'Google Network', revenue: 34000, operatingIncome: 8500 },
  { id: 22, year: 2025, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 17000, operatingIncome: 2000 },
  { id: 23, year: 2025, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, operatingIncome: 4000 },
  { id: 24, year: 2025, segment: 'Google Cloud', item: 'Google Cloud', revenue: 53000, operatingIncome: 3000 },
  { id: 25, year: 2025, segment: 'Other Bets', item: 'Waymo', revenue: 600, operatingIncome: -2500 },
  { id: 26, year: 2025, segment: 'Other Bets', item: 'Verily', revenue: 1400, operatingIncome: -1500 },
  { id: 27, year: 2025, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, operatingIncome: -12500 },
];


const uniqueYears = [...new Set(MOCK_FINANCIAL_DATA.map(item => item.year))].sort((a, b) => b - a);
const SEGMENT_COLORS = {
  'Google Services': '#4285F4', // Google Blue
  'Google Cloud': '#34A853',    // Google Green
  'Other Bets': '#FBBC05',       // Google Yellow
  'Corporate Costs': '#EA4335', // Google Red
};
const SERVICES_COLORS = {
  'Google Search': '#4285F4',
  'YouTube Ads': '#FF0000',
  'Google Network': '#FBBC05',
  'YouTube Subscriptions': '#DA00FF',
  'Hardware & Other': '#34A853',
}
const WAYMO_MILESTONES = {
  2023: "Launched fully driverless rides in San Francisco.",
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

// Formats as currency (in millions)
const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(value * 1000000); // Convert millions back to full number for formatter

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

// --- 1. OVERVIEW DASHBOARD COMPONENT ---

const OverviewDashboard = ({ data, timeSeries, year, onYearChange, years }) => {
  
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
    };
  }, [timeSeries, year]);

  // B. Data for Segment Charts (Pie & Bar)
  const segmentData = useMemo(() => {
    const yearData = data.filter(d => d.year === year);
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
  }, [data, year]);

  // C. Data for OpIncome chart (includes Corporate Costs)
  const opIncomeSegmentData = useMemo(() => {
    const yearData = data.filter(d => d.year === year);
    const segmentMap = new Map();
    
    for (const item of yearData) {
      const segmentName = item.segment;
      if (!segmentMap.has(segmentName)) {
        segmentMap.set(segmentName, { name: segmentName, operatingIncome: 0 });
      }
      segmentMap.get(segmentName).operatingIncome += item.operatingIncome;
    }
    return Array.from(segmentMap.values());
  }, [data, year]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TIME SERIES CHART (CFO'S VIEW) */}
        <div className="lg:col-span-3">
          <ChartWrapper title="Key Performance Metrics (YoY)">
            <ComposedChart data={timeSeries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" tickFormatter={val => `${val.toFixed(0)}%`} label={{ value: 'YoY Growth %', angle: -90, position: 'insideLeft', fill: '#666' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" tickFormatter={val => `${val.toFixed(0)}%`} label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#666' }} />
              <Tooltip formatter={(value, name) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar yAxisId="left" dataKey="Revenue Growth" fill="#a0aec0" />
              <Line yAxisId="right" type="monotone" dataKey="Operating Margin" stroke="#4285F4" strokeWidth={3} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ChartWrapper>
        </div>
      </div>
      
      {/* --- MOVED "BY SEGMENT" SECTION --- */}
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

// --- 2. NEW SEGMENT DEEP DIVE COMPONENT ---

const SubTabButton = ({ subTab, activeSubTab, onClick }) => (
  <button
    onClick={() => onClick(subTab)}
    className={`
      py-3 px-5 text-sm font-medium transition-all
      ${activeSubTab === subTab
        ? 'border-b-2 border-indigo-600 text-indigo-700'
        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
      }
    `}
  >
    {subTab}
  </button>
);

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
  
  const currentYearData = timeData.find(d => d.year === year);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Search Revenue" value={formatLargeNumber(currentYearData.revenue)} />
        <KpiCard title="Traffic Acquisition Cost (TAC)" value={formatLargeNumber(currentYearData.tac)} change="Key Antitrust Metric" isPositive={false} />
        <KpiCard title="TAC as % of Revenue" value={formatPercent(currentYearData.tac / currentYearData.revenue)} isCurrency={false} />
      </div>
      <ChartWrapper title="Search Revenue vs. TAC (Time Series)">
        <AreaChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip formatter={formatLargeNumber} />
          <Legend />
          <Area type="monotone" dataKey="revenue" name="Total Revenue" stackId="1" stroke="#4285F4" fill="#4285F4" fillOpacity={0.8} />
          <Area type="monotone" dataKey="tac" name="TAC" stackId="2" stroke="#EA4335" fill="#EA4335" fillOpacity={0.8} />
        </AreaChart>
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
  
  const currentYearData = timeData.find(d => d.year === year);

  return (
    <div className="space-y-6">
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

const GoogleCloudTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === 'Google Cloud')
      .map(d => ({
        ...d,
        opMargin: (d.operatingIncome / d.revenue) * 100,
      }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year);
  
  return (
    <div className="space-y-6">
      <KpiCard title="Cloud Revenue" value={formatLargeNumber(currentYearData.revenue)} />
      <ChartWrapper title="Cloud Revenue & Profitability (Time Series)">
        <ComposedChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis yAxisId="left" stroke="#666" tickFormatter={formatLargeNumber} />
          <YAxis yAxisId="right" orientation="right" stroke="#666" tickFormatter={val => `${val.toFixed(0)}%`} />
          <Tooltip formatter={(value, name) => name === 'Op. Margin' ? `${value.toFixed(1)}%` : formatLargeNumber(value)} />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill={SEGMENT_COLORS['Google Cloud']} />
          <Line yAxisId="right" type="monotone" dataKey="opMargin" name="Op. Margin" stroke="#EA4335" strokeWidth={3} />
        </ComposedChart>
      </ChartWrapper>
    </div>
  );
};

const WaymoTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === 'Waymo')
      .map(d => ({...d, opLoss: d.operatingIncome * -1 }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard title="Waymo Operating Loss" value={formatLargeNumber(currentYearData.operatingIncome)} isPositive={false} />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{year} Key Milestone</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">{WAYMO_MILESTONES[year]}</p>
        </div>
      </div>
      <ChartWrapper title="Waymo Operating Loss (Cash Burn)">
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

// Main Deep Dive Component
const SegmentDeepDive = ({ data, year }) => {
  const [activeSubTab, setActiveSubTab] = useState('Google Search');
  const subTabs = ['Google Search', 'YouTube', 'Google Cloud', 'Waymo'];

  return (
    <div className="animate-fadeIn space-y-4">
      {/* Sub-navigation bar */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {subTabs.map(tab => (
            <SubTabButton 
              key={tab} 
              subTab={tab} 
              activeSubTab={activeSubTab} 
              onClick={setActiveSubTab} 
            />
          ))}
        </nav>
      </div>

      {/* Content for sub-tabs */}
      <div className="pt-4">
        {activeSubTab === 'Google Search' && <GoogleSearchTab data={data} year={year} />}
        {activeSubTab === 'YouTube' && <YouTubeTab data={data} year={year} />}
        {activeSubTab === 'Google Cloud' && <GoogleCloudTab data={data} year={year} />}
        {activeSubTab === 'Waymo' && <WaymoTab data={data} year={year} />}
      </div>
    </div>
  );
};


// --- 3. EXPENSE & HEADCOUNT (PLACEHOLDER) ---

const HeadcountDashboard = ({ year }) => (
  <div className="space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expense & Headcount for {year}</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <KpiCard title="Total Headcount" value="182,502" change="-1.5%" isPositive={false} isCurrency={false} />
      <KpiCard title="Stock-Based Comp (SBC)" value={formatLargeNumber(22500)} change="+8.2%" isPositive={false} />
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Headcount by Segment (Illustrative)</h3>
      {/* Placeholder for chart */}
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
        <p className="text-gray-500">Headcount by Segment Chart</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Expenses Breakdown</h3>
      {/* Placeholder for table */}
      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
        <p className="text-gray-500">R&D, S&M, G&A Expense Table</p>
      </div>
    </div>
  </div>
);

// Placeholder Content Component
const TabContent = ({ tabName }) => (
  <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-inner animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content for {tabName}</h2>
    <p className="text-gray-600">This is the placeholder content for {tabName}.</p>
  </div>
);


// --- MAIN APP COMPONENT ---

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Segment Deep Dive', 'Expense & Headcount', 'System Access'];
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

    const sortedData = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year);

    // Calculate YoY Growth and Margins
    let lastYearRevenue = 0;
    let lastYearOpIncome = 0;

    return sortedData.map(d => {
      const revenueGrowth = lastYearRevenue === 0 ? 0 : (d.totalRevenue - lastYearRevenue) / lastYearRevenue;
      const opIncomeGrowth = lastYearOpIncome === 0 ? 0 : (d.totalOpIncome - lastYearOpIncome) / lastYearOpIncome;
      const opMargin = d.totalRevenue === 0 ? 0 : d.totalOpIncome / d.totalRevenue;

      lastYearRevenue = d.totalRevenue;
      lastYearOpIncome = d.totalOpIncome;
      
      return {
        year: d.year,
        totalRevenue: d.totalRevenue,
        totalOpIncome: d.totalOpIncome,
        'Revenue Growth': revenueGrowth * 100,
        'Operating Margin': opMargin * 100,
        revenueGrowth, // raw value for KPIs
        opIncomeGrowth, // raw value for KPIs
        opMargin, // raw value for KPIs
      };
    });
  }, []); // Runs once on mount

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
            {activeTab === 'Overview' && (
              <OverviewDashboard 
                data={MOCK_FINANCIAL_DATA}
                timeSeries={timeSeriesData}
                year={selectedYear}
                onYearChange={setSelectedYear}
                years={uniqueYears}
              />
            )}
            {activeTab === 'Segment Deep Dive' && (
              <SegmentDeepDive 
                data={MOCK_FINANCIAL_DATA} 
                year={selectedYear} 
              />
            )}
            {activeTab === 'Expense & Headcount' && (
              <HeadcountDashboard 
                year={selectedYear} 
              />
            )}
            {activeTab === 'System Access' && <TabContent tabName="System Access" />}
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

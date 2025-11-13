import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell,
} from 'recharts';

// --- MOCK DATA ---
// In a real app, this would come from an API
const MOCK_BUDGET_DATA = [
  // 2023 Data
  { id: 1, year: 2023, organization: 'R&D', spendType: 'Salaries', budgeted: 1200000, actual: 1150000 },
  { id: 2, year: 2023, organization: 'R&D', spendType: 'Software', budgeted: 300000, actual: 280000 },
  { id: 3, year: 2023, organization: 'Marketing', spendType: 'Advertising', budgeted: 800000, actual: 810000 },
  { id: 4, year: 2023, organization: 'Marketing', spendType: 'Salaries', budgeted: 400000, actual: 400000 },
  { id: 5, year: 2023, organization: 'Sales', spendType: 'Salaries', budgeted: 700000, actual: 720000 },
  { id: 6, year: 2023, organization: 'Sales', spendType: 'T&E', budgeted: 150000, actual: 130000 },
  { id: 7, year: 2023, organization: 'HR', spendType: 'Salaries', budgeted: 250000, actual: 250000 },
  
  // 2024 Data
  { id: 8, year: 2024, organization: 'R&D', spendType: 'Salaries', budgeted: 1300000, actual: 1280000 },
  { id: 9, year: 2024, organization: 'R&D', spendType: 'Software', budgeted: 350000, actual: 360000 },
  { id: 10, year: 2024, organization: 'R&D', spendType: 'Hardware', budgeted: 100000, actual: 90000 },
  { id: 11, year: 2024, organization: 'Marketing', spendType: 'Advertising', budgeted: 900000, actual: 950000 },
  { id: 12, year: 2024, organization: 'Marketing', spendType: 'Salaries', budgeted: 420000, actual: 420000 },
  { id: 13, year: 2024, organization: 'Sales', spendType: 'Salaries', budgeted: 750000, actual: 750000 },
  { id: 14, year: 2024, organization: 'Sales', spendType: 'T&E', budgeted: 160000, actual: 170000 },
  { id: 15, year: 2024, organization: 'HR', spendType: 'Salaries', budgeted: 260000, actual: 260000 },
  { id: 16, year: 2024, organization: 'HR', spendType: 'Recruiting', budgeted: 100000, actual: 120000 },

  // 2025 Data
  { id: 17, year: 2025, organization: 'R&D', spendType: 'Salaries', budgeted: 1400000, actual: 1390000 },
  { id: 18, year: 2025, organization: 'R&D', spendType: 'Software', budgeted: 400000, actual: 390000 },
  { id: 19, year: 2025, organization: 'R&D', spendType: 'Hardware', budgeted: 150000, actual: 120000 },
  { id: 20, year: 2025, organization: 'Marketing', spendType: 'Advertising', budgeted: 1000000, actual: 980000 },
  { id: 21, year: 2025, organization: 'Marketing', spendType: 'Salaries', budgeted: 450000, actual: 450000 },
  { id: 22, year: 2025, organization: 'Sales', spendType: 'Salaries', budgeted: 800000, actual: 810000 },
  { id: 23, year: 2025, organization: 'Sales', spendType: 'T&E', budgeted: 180000, actual: 170000 },
  { id: 24, year: 2025, organization: 'HR', spendType: 'Salaries', budgeted: 270000, actual: 270000 },
  { id: 25, year: 2025, organization: 'HR', spendType: 'Recruiting', budgeted: 120000, actual: 100000 },
];

const uniqueYears = [...new Set(MOCK_BUDGET_DATA.map(item => item.year))].sort((a, b) => b - a);

// --- HELPER FUNCTIONS & COMPONENTS ---

// Helper to format currency
const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(value);

// Helper to format percentages
const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

// Reusable KPI Card Component
const KpiCard = ({ title, value, change, isPositive, isCurrency = true }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">
      {isCurrency ? formatCurrency(value) : value}
    </p>
    {change !== undefined && (
      <p className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </p>
    )}
  </div>
);

// Reusable Chart Container
const ChartWrapper = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height="90%">
      {children}
    </ResponsiveContainer>
  </div>
);

// Placeholder Content Component
const TabContent = ({ tabName }) => (
  <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-inner animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content for {tabName}</h2>
    <p className="text-gray-600">This is the placeholder content for {tabName}.</p>
  </div>
);

// --- DASHBOARD-SPECIFIC COMPONENTS ---

/**
 * 1. OVERVIEW DASHBOARD COMPONENT
 */
const OverviewDashboard = ({ data, timeSeries, year, onYearChange, years }) => {
  // Memoized analytics based on the selected year
  const yearData = useMemo(() => data.filter(d => d.year === year), [data, year]);

  // A. KPI Calculations
  const kpiData = useMemo(() => {
    const totalBudgeted = yearData.reduce((acc, d) => acc + d.budgeted, 0);
    const totalActual = yearData.reduce((acc, d) => acc + d.actual, 0);
    const variance = totalBudgeted - totalActual;
    const variancePercent = variance / totalBudgeted;
    
    // Find current and previous year time series data
    const currentYearStats = timeSeries.find(t => t.year === year);
    
    return {
      totalBudgeted,
      totalActual,
      variance,
      variancePercent,
      yoyNominal: currentYearStats ? currentYearStats.nominalIncrease : 0,
      yoyPercent: currentYearStats ? currentYearStats.percentIncrease : 0,
    };
  }, [yearData, timeSeries, year]);

  // B. Budget vs. Actual by Organization (Bar Chart)
  const orgData = useMemo(() => {
    const orgMap = new Map();
    yearData.forEach(d => {
      if (!orgMap.has(d.organization)) {
        orgMap.set(d.organization, { name: d.organization, budgeted: 0, actual: 0 });
      }
      const org = orgMap.get(d.organization);
      org.budgeted += d.budgeted;
      org.actual += d.actual;
    });
    return Array.from(orgMap.values());
  }, [yearData]);

  // C. Spend Type Breakdown (Donut Chart)
  const spendTypeData = useMemo(() => {
    const spendMap = new Map();
    yearData.forEach(d => {
      if (!spendMap.has(d.spendType)) {
        spendMap.set(d.spendType, { name: d.spendType, value: 0 });
      }
      spendMap.get(d.spendType).value += d.actual;
    });
    return Array.from(spendMap.values());
  }, [yearData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* --- FILTERS --- */}
      <div className="flex justify-end">
        <select
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {years.map(y => <option key={y} value={y}>{y} Dashboard</option>)}
        </select>
      </div>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard 
          title="Total Budgeted" 
          value={kpiData.totalBudgeted}
          change={`${formatCurrency(kpiData.yoyNominal)} YoY`}
          isPositive={kpiData.yoyNominal >= 0}
        />
        <KpiCard 
          title="Total Actual Spend" 
          value={kpiData.totalActual} 
          change={`${formatPercent(kpiData.yoyPercent)} YoY`}
          isPositive={kpiData.yoyPercent >= 0}
        />
        <KpiCard 
          title="Budget Variance" 
          value={kpiData.variance} 
          change={`${formatPercent(kpiData.variancePercent)} of Budget`}
          isPositive={kpiData.variance >= 0}
        />
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TIME SERIES CHART (Your specific request) */}
        <div className="lg:col-span-3">
          <ChartWrapper title="Budget Over Time (YoY)">
            <LineChart data={timeSeries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" tickFormatter={val => `$${val/1000000}M`} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" tickFormatter={val => `${val}%`} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Total Budget') return formatCurrency(value);
                  if (name === '% Increase') return `${value.toFixed(1)}%`;
                  if (name === 'Nominal Increase') return formatCurrency(value);
                  return value;
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Total Budget" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line yAxisId="left" type="monotone" dataKey="Nominal Increase" stroke="#82ca9d" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="% Increase" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ChartWrapper>
        </div>

        {/* ORG BREAKDOWN */}
        <div className="lg:col-span-2">
          <ChartWrapper title={`Budget vs. Actual by Organization (${year})`}>
            <BarChart data={orgData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" tickFormatter={val => `$${val/1000}K`} />
              <YAxis dataKey="name" type="category" stroke="#666" width={80} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="budgeted" fill="#8884d8" />
              <Bar dataKey="actual" fill="#82ca9d" />
            </BarChart>
          </ChartWrapper>
        </div>

        {/* SPEND TYPE BREAKDOWN */}
        <div className="lg:col-span-1">
          <ChartWrapper title={`Actual Spend by Type (${year})`}>
            <PieChart>
              <Pie
                data={spendTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
              >
                {spendTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. REPORTING TABLE COMPONENT
 */
const ReportingTable = ({ data, year }) => {
  const yearData = useMemo(() => data.filter(d => d.year === year), [data, year]);

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Detailed Report for {year}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
        <table className="w-full min-w-max text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Organization</th>
              <th scope="col" className="px-6 py-3">Spend Type</th>
              <th scope="col" className="px-6 py-3 text-right">Budgeted</th>
              <th scope="col" className="px-6 py-3 text-right">Actual</th>
              <th scope="col" className="px-6 py-3 text-right">Variance</th>
            </tr>
          </thead>
          <tbody>
            {yearData.map((d) => {
              const variance = d.budgeted - d.actual;
              return (
                <tr key={d.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{d.organization}</td>
                  <td className="px-6 py-4">{d.spendType}</td>
                  <td className="px-6 py-4 text-right font-mono">{formatCurrency(d.budgeted)}</td>
                  <td className="px-6 py-4 text-right font-mono">{formatCurrency(d.actual)}</td>
                  <td className={`px-6 py-4 text-right font-mono ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(variance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'System Access', 'Budget Planning', 'Reporting'];
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]); // Default to newest year

  // --- TOP-LEVEL ANALYTICS ---
  // This calculates the data for your Time Series chart.
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_BUDGET_DATA.map(d => d.year))].sort();
    let lastYearBudget = 0;
    
    return years.map(year => {
      const totalBudget = MOCK_BUDGET_DATA
        .filter(d => d.year === year)
        .reduce((acc, d) => acc + d.budgeted, 0);
      
      const nominalIncrease = lastYearBudget === 0 ? 0 : totalBudget - lastYearBudget;
      const percentIncrease = lastYearBudget === 0 ? 0 : (nominalIncrease / lastYearBudget) * 100;
      
      lastYearBudget = totalBudget; // Set for next iteration
      
      return {
        year,
        'Total Budget': totalBudget,
        'Nominal Increase': nominalIncrease,
        '% Increase': percentIncrease,
      };
    });
  }, [MOCK_BUDGET_DATA]); // This only runs once

  return (
    // Main container
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Budget Card Container */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl border-t-4 border-indigo-500 overflow-hidden">
        
        {/* Header Section */}
        <header className="text-center p-8 pb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Organizational Budget Tracker
          </p>
        </header>

        {/* Layout Wrapper */}
        <div className="flex flex-col sm:flex-row">

          {/* Tab Navigation */}
          <nav className="flex-shrink-0 sm:w-56 sm:p-8 sm:pt-0 sm:pr-4 p-4 pb-0 sm:pb-4">
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
          
          {/* Conditional Content Area: Now much wider */}
          <main className="flex-1 p-4 pt-6 sm:p-8 sm:pt-0 bg-gray-50/50 min-h-[600px]">
            {activeTab === 'Overview' && (
              <OverviewDashboard 
                data={MOCK_BUDGET_DATA}
                timeSeries={timeSeriesData}
                year={selectedYear}
                onYearChange={setSelectedYear}
                years={uniqueYears}
              />
            )}
            {activeTab === 'Reporting' && (
              <ReportingTable 
                data={MOCK_BUDGET_DATA} 
                year={selectedYear} 
              />
            )}
            {activeTab === 'System Access' && <TabContent tabName="System Access" />}
            {activeTab === 'Budget Planning' && <TabContent tabName="Budget Planning" />}
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

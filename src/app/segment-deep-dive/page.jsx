"use client"; // This is CRITICAL for Next.js to make the page interactive

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

// --- Import Data ---
import {
  MOCK_FINANCIAL_DATA,
  MOCK_CLOUD_KPI_DATA,
  uniqueYears,
  WAYMO_MILESTONES,
  YOUTUBE_COLORS,
  CLOUD_COLORS,
  OPEX_COLORS,
  SEGMENT_COLORS
} from '../../data/mockData'; // FIX: Relative path

// --- Import Helpers ---
import {
  formatLargeNumber,
  formatPercent,
  formatNumber,
} from '../../lib/utils'; // FIX: Relative path

// --- Import UI Components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'; // FIX: Relative path

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'; // FIX: Relative path

import {
  KpiCard,
  ChartWrapper,
  PercentTooltip,
  CurrencyTooltip,
  FilterButton // FilterButton is defined in DashboardComponents, let's import it
} from '../../components/DashboardComponents'; // FIX: Relative path

// --- 2. GOOGLE SEARCH TAB ---
const GoogleSearchTab = ({ data, year }) => {
  const timeData = useMemo(() => {
    return data
      .filter(d => d.item === 'Google Search')
      .map(d => ({
        ...d,
        tacPercent: (d.tac / d.revenue),
        grossProfit: d.revenue - d.tac - d.costOfRevenue,
        grossMargin: (d.revenue - d.tac - d.costOfRevenue) / d.revenue,
        opMargin: (d.operatingIncome / d.revenue),
      }));
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Search Revenue" value={formatLargeNumber(currentYearData.revenue)} />
        <KpiCard title="Gross Profit" value={formatLargeNumber(currentYearData.grossProfit)} />
        <KpiCard title="Gross Margin" value={formatPercent(currentYearData.grossMargin)} />
        <KpiCard title="TAC as % of Revenue" value={formatPercent(currentYearData.tacPercent)} change="Key Antitrust Metric" isPositive={false} />
      </div>
      <ChartWrapper title="Search Revenue vs. Costs">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="costOfRevenue" name="Cost of Revenue" stroke="#FBBC05" strokeWidth={2} />
          <Line type="monotone" dataKey="tac" name="Traffic Acquisition Cost (TAC)" stroke="#EA4335" strokeWidth={2} />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Search Gross & Operating Margin">
        <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatPercent} />
          <Tooltip content={<PercentTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#4285F4" strokeWidth={3} />
          <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#34A853" strokeWidth={2} strokeDasharray="5 5" />
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
      const adRev = adData ? adData.revenue : 0;
      const subRev = subData ? subData.revenue : 0;
      const totalRev = adRev + subRev;
      const totalOpIncome = (adData ? adData.operatingIncome : 0) + (subData ? subData.operatingIncome : 0);
      return { year: y, adRevenue: adRev, subRevenue: subRev, totalRevenue: totalRev, opMargin: totalRev > 0 ? totalOpIncome / totalRev : 0, };
    });
  }, [data]);
  
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total YouTube Revenue" value={formatLargeNumber(currentYearData.totalRevenue)} />
        <KpiCard title="Ad Revenue" value={formatLargeNumber(currentYearData.adRevenue)} />
        <KpiCard title="Subscriptions Revenue" value={formatLargeNumber(currentYearData.subRevenue)} change="High-Growth" isPositive={true} />
      </div>
      <ChartWrapper title="YouTube Revenue Sources">
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Bar dataKey="adRevenue" name="Ad Revenue" stackId="a" fill={YOUTUBE_COLORS['Ad Revenue']} />
          <Bar dataKey="subRevenue" name="Subscriptions Revenue" stackId="a" fill={YOUTUBE_COLORS['Subscriptions Revenue']} />
        </BarChart>
      </ChartWrapper>
    </div>
  );
};

// --- 4. "BEEFED UP" GOOGLE CLOUD TAB ---
const CloudSummary = ({ timeData, year }) => { const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {}; return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> <KpiCard title="Total Cloud Revenue" value={formatLargeNumber(currentYearData.totalRevenue)} /> <KpiCard title="Cloud Op. Income" value={formatLargeNumber(currentYearData.totalOpIncome)} isPositive={currentYearData.totalOpIncome >= 0} /> <KpiCard title="Cloud Op. Margin" value={formatPercent(currentYearData.opMargin)} isPositive={currentYearData.opMargin >= 0} /> <KpiCard title="Revenue Growth (YoY)" value={formatPercent(currentYearData.revenueGrowth)} isPositive={true} /> </div> <ChartWrapper title="Cloud Revenue & Profitability"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis yAxisId="left" stroke="#4285F4" tickFormatter={formatLargeNumber} /> <YAxis yAxisId="right" orientation="right" stroke={currentYearData.totalOpIncome >= 0 ? '#34A853' : '#EA4335'} tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line yAxisId="left" type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#4285F4" strokeWidth={3} /> <Line yAxisId="right" type="monotone" dataKey="totalOpIncome" name="Operating Income" stroke={currentYearData.totalOpIncome >= 0 ? '#34A853' : '#EA4335'} strokeWidth={3} /> </LineChart> </ChartWrapper> </div> ); };
const CloudGcpVsWorkspace = ({ timeData, year }) => { return ( <div className="space-y-6"> <ChartWrapper title="Cloud Revenue: GCP vs. Workspace"> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="gcpRevenue" name="GCP Revenue" stackId="a" fill={CLOUD_COLORS['GCP']} /> <Bar dataKey="workspaceRevenue" name="Workspace Revenue" stackId="a" fill={CLOUD_COLORS['Workspace']} /> </BarChart> </ChartWrapper> <ChartWrapper title="Growth Rates: GCP vs. Workspace"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="gcpGrowth" name="GCP Growth (YoY)" stroke={CLOUD_COLORS['GCP']} strokeWidth={3} /> <Line type="monotone" dataKey="workspaceGrowth" name="Workspace Growth (YoY)" stroke={CLOUD_COLORS['Workspace']} strokeWidth={3} /> </LineChart> </ChartWrapper> </div> ); };
const CloudProfitability = ({ timeData, year }) => { return ( <div className="space-y-6"> <ChartWrapper title="Cloud Revenue vs. Cost of Revenue (CoR)"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#34A853" strokeWidth={3} /> <Line type="monotone" dataKey="totalCostOfRevenue" name="Cost of Revenue" stroke="#EA4335" strokeWidth={3} /> </LineChart> </ChartWrapper> <ChartWrapper title="Cloud Gross Margin & Operating Margin"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#34A853" strokeWidth={3} /> <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#4285F4" strokeWidth={3} /> </LineChart> </ChartWrapper> </div> ); };
const CloudSpendAnalysis = ({ timeData, year }) => { return ( <div className="space-y-6"> <ChartWrapper title="Cloud Operating Expenses (Spending)"> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="totalOpexRD" name="Research & Development" stackId="a" fill={OPEX_COLORS['Research & Development']} /> <Bar dataKey="totalOpexSM" name="Sales & Marketing" stackId="a" fill={OPEX_COLORS['Sales & Marketing']} /> </BarChart> </ChartWrapper> <ChartWrapper title="Cloud Spend as % of Cloud Revenue"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="corAsPercentOfRevenue" name="Cost of Revenue %" stroke="#EA4335" strokeWidth={3} /> <Line type="monotone" dataKey="rdAsPercentOfRevenue" name="R&D %" stroke="#4285F4" strokeWidth={2} /> <Line type="monotone" dataKey="smAsPercentOfRevenue" name="S&M %" stroke="#34A853" strokeWidth={2} /> </LineChart> </ChartWrapper> </div> ); };
const CloudKpis = ({ kpiData, year }) => { const currentYearData = kpiData.find(d => d.year === year) || kpiData[kpiData.length - 1] || {}; return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <KpiCard title="Cloud Backlog" value={formatLargeNumber(currentYearData.backlog)} /> <KpiCard title="Total Customers" value={formatNumber(currentYearData.totalCustomers)} isCurrency={false} /> <KpiCard title="Revenue per Customer" value={formatLargeNumber(currentYearData.revPerCustomer)} /> </div> <ChartWrapper title="Cloud Backlog vs. Revenue"> <LineChart data={kpiData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis yAxisId="left" stroke="#34A853" tickFormatter={formatLargeNumber} /> <YAxis yAxisId="right" orientation="right" stroke="#4285F4" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line yAxisId="left" type="monotone" dataKey="backlog" name="Backlog" stroke="#34A853" strokeWidth={3} /> <Line yAxisId="right" type="monotone" dataKey="revenue" name="Recognized Revenue" stroke="#4285F4" strokeWidth={2} strokeDasharray="5 5" /> </LineChart> </ChartWrapper> </div> ); };

// Main Cloud Tab Component
const GoogleCloudTab = ({ data, kpiData, year }) => {
  const [activeSubTab, setActiveSubTab] = useState('Summary');
  const subTabs = ['Summary', 'GCP vs. Workspace', 'Profitability', 'Cloud Spend Analysis', 'Cloud KPIs']; // NEW TABS
  const timeData = useMemo(() => { const years = [...new Set(data.map(d => d.year))].sort(); let prevYearData = { gcpRevenue: 0, workspaceRevenue: 0, totalRevenue: 0 }; return years.map(y => { const gcpData = data.find(d => d.year === y && d.item === 'GCP'); const workspaceData = data.find(d => d.year === y && d.item === 'Workspace'); const gcpRevenue = gcpData?.revenue || 0; const workspaceRevenue = workspaceData?.revenue || 0; const totalRevenue = gcpRevenue + workspaceRevenue; const totalCostOfRevenue = (gcpData?.costOfRevenue || 0) + (workspaceData?.costOfRevenue || 0); const totalOpIncome = (gcpData?.operatingIncome || 0) + (workspaceData?.operatingIncome || 0); const totalOpexRD = (gcpData?.opex_rd || 0) + (workspaceData?.opex_rd || 0); const totalOpexSM = (gcpData?.opex_sm || 0) + (workspaceData?.opex_sm || 0); const gcpGrowth = prevYearData.gcpRevenue === 0 ? 0 : (gcpRevenue - prevYearData.gcpRevenue) / prevYearData.gcpRevenue; const workspaceGrowth = prevYearData.workspaceRevenue === 0 ? 0 : (workspaceRevenue - prevYearData.workspaceRevenue) / prevYearData.workspaceRevenue; const revenueGrowth = prevYearData.totalRevenue === 0 ? 0 : (totalRevenue - prevYearData.totalRevenue) / prevYearData.totalRevenue; const d = { year: y, gcpRevenue, workspaceRevenue, totalRevenue, totalCostOfRevenue, totalOpIncome, totalOpexRD, totalOpexSM, opMargin: totalRevenue > 0 ? totalOpIncome / totalRevenue : 0, grossMargin: totalRevenue > 0 ? (totalRevenue - totalCostOfRevenue) / totalRevenue : 0, revenueGrowth, gcpGrowth, workspaceGrowth, corAsPercentOfRevenue: totalRevenue > 0 ? totalCostOfRevenue / totalRevenue : 0, rdAsPercentOfRevenue: totalRevenue > 0 ? totalOpexRD / totalRevenue : 0, smAsPercentOfRevenue: totalRevenue > 0 ? totalOpexSM / totalRevenue : 0, }; prevYearData = d; return d; }); }, [data]);
  const kpiTimeData = useMemo(() => { const cloudTimeData = timeData.map(d => ({ year: d.year, revenue: d.totalRevenue })); return kpiData.map(kpi => { const matchingRevenue = cloudTimeData.find(c => c.year === kpi.year); return { ...kpi, ...matchingRevenue }; }); }, [kpiData, timeData]);
  
  return (
    <Tabs defaultValue="Summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {subTabs.map(tab => (
          <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="Summary" className="mt-4">
        <CloudSummary timeData={timeData} year={year} />
      </TabsContent>
      <TabsContent value="GCP vs. Workspace" className="mt-4">
        <CloudGcpVsWorkspace timeData={timeData} year={year} />
      </TabsContent>
      <TabsContent value="Profitability" className="mt-4">
        <CloudProfitability timeData={timeData} year={year} />
      </TabsContent>
      <TabsContent value="Cloud Spend Analysis" className="mt-4">
        <CloudSpendAnalysis timeData={timeData} year={year} />
      </TabsContent>
      <TabsContent value="Cloud KPIs" className="mt-4">
        <CloudKpis kpiData={kpiTimeData} year={year} />
      </TabsContent>
    </Tabs>
  );
};

// --- 5. OTHER BETS TAB ---
const OtherBetsTab = ({ data, year }) => { 
  const [filter, setFilter] = useState('Waymo'); 
  const timeData = useMemo(() => { return data .filter(d => d.item === filter) .map(d => ({...d, opLoss: d.operatingIncome * -1 })); }, [data, filter]); 
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {}; 
  
  return ( 
    <div className="space-y-6 animate-fadeIn"> 
      <div className="flex justify-between items-center"> 
        <h2 className="text-xl font-semibold text-gray-800">Other Bets ({filter})</h2> 
        <div className="flex space-x-2"> 
          {/* We need to import FilterButton or define it. Let's use shadcn's Button for now */}
          <button onClick={() => setFilter('Waymo')} className={`px-3 py-1 text-sm rounded-md ${filter === 'Waymo' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Waymo</button>
          <button onClick={() => setFilter('Verily')} className={`px-3 py-1 text-sm rounded-md ${filter === 'Verily' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Verily</button>
        </div> 
      </div> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        <KpiCard title={`${filter} Operating Loss (Cash Burn)`} value={formatLargeNumber(currentYearData.operatingIncome)} isPositive={false} /> 
        {filter === 'Waymo' && ( 
          <KpiCard title={`${year} Waymo Milestone`} value={WAYMO_MILESTONES[year]} isCurrency={false} />
        )} 
      </div> 
      <ChartWrapper title={`${filter} Operating Loss (Cash Burn)`}> 
        <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> 
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> 
          <XAxis dataKey="year" stroke="#666" /> 
          <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> 
          <Tooltip content={<CurrencyTooltip />} /> 
          <Legend /> 
          <Bar dataKey="opLoss" name="Operating Loss" fill={SEGMENT_COLORS['Other Bets']} /> 
        </BarChart> 
      </ChartWrapper> 
    </div> 
  ); 
};


// --- MAIN PAGE COMPONENT ---
export default function SegmentDeepDivePage() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);

  return (
    <div className="space-y-6">
      {/* Page Header and Year Filter */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Segment Deep Dive</h1>
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
      <Tabs defaultValue="Google Cloud" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Google Cloud">Google Cloud</TabsTrigger>
          <TabsTrigger value="Google Search">Google Search</TabsTrigger>
          <TabsTrigger value="YouTube">YouTube</TabsTrigger>
          <TabsTrigger value="Other Bets">Other Bets</TabsTrigger>
        </TabsList>
        
        {/* --- Tab Content --- */}
        <TabsContent value="Google Cloud" className="mt-6">
          <GoogleCloudTab data={MOCK_FINANCIAL_DATA} kpiData={MOCK_CLOUD_KPI_DATA} year={selectedYear} />
        </TabsContent>
        <TabsContent value="Google Search" className="mt-6">
          <GoogleSearchTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />
        </TabsContent>
        <TabsContent value="YouTube" className="mt-6">
          <YouTubeTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />
        </TabsContent>
        <TabsContent value="Other Bets" className="mt-6">
          <OtherBetsTab data={MOCK_FINANCIAL_DATA} year={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

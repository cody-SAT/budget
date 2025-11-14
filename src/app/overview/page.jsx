"use client" 
// This is the NEW Overview page, refactored from the old App.jsx
// It will render as the 'children' in layout.jsx

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Sankey,
} from 'recharts';
import {
  MOCK_FINANCIAL_DATA,
  MOCK_CASH_FLOW_DATA, // Need for timeSeries
  uniqueYears,
  SEGMENT_COLORS
} from '../../data/mockData'; // FIX: Changed to relative path
import {
  formatLargeNumber,
  formatPercent,
  formatCurrency,
} from '../../lib/utils'; // FIX: Changed to relative path
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card"; // FIX: Changed to relative path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"; // FIX: Changed to relative path


// --- Re-usable KpiCard using shadcn/ui ---
const KpiCard = ({ title, value, change, isPositive }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-3xl">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      {change && (
        <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '▲' : '▼'} {change}
        </p>
      )}
    </CardContent>
  </Card>
);

// --- Re-usable ChartWrapper using shadcn/ui ---
const ChartWrapper = ({ title, children, height = "h-96" }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className={height}>
      <ResponsiveContainer width="100%" height="90%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Custom Tooltips (unchanged)
const PercentTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-white p-3 border rounded shadow-lg"> <p className="label font-bold text-gray-700">{label}</p> {payload.map(entry => ( <p key={entry.name} style={{ color: entry.color }}> {`${entry.name}: ${formatPercent(entry.value)}`} </p> ))} </div> ); } return null; };
const CurrencyTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-white p-3 border rounded shadow-lg"> <p className="label font-bold text-gray-700">{label}</p> {payload.map(entry => ( <p key={entry.name} style={{ color: entry.color }}> {`${entry.name}: ${formatLargeNumber(entry.value)}`} </p> ))} </div> ); } return null; };


// --- SANKEY CHART COMPONENT (Copied from old App.jsx) ---
const RevenueToProfitSankey = ({ financialData, year, segmentFilter }) => {
  const sankeyData = useMemo(() => {
    const yearData = financialData.filter(d => d.year === year);
    const filteredData = yearData.filter(d => segmentFilter[d.segment] || (d.segment === 'Corporate Costs' && segmentFilter['Corporate Costs']));
    if (filteredData.length === 0) return { nodes: [], links: [] };
    
    const totals = { revenue: 0, costOfRevenue: 0, tac: 0, opex_rd: 0, opex_sm: 0, opIncome_corporate: 0 };
    const segmentRevenues = {};
    const segmentNodes = new Set();
    
    filteredData.forEach(item => {
      if (item.segment !== 'Corporate Costs') {
        if (!segmentRevenues[item.segment]) segmentRevenues[item.segment] = 0;
        segmentRevenues[item.segment] += item.revenue;
        segmentNodes.add(item.segment);
      }
      totals.revenue += item.revenue;
      totals.costOfRevenue += item.costOfRevenue;
      totals.tac += item.tac;
      totals.opex_rd += item.opex_rd;
      totals.opex_sm += item.opex_sm;
      if (item.segment === 'Corporate Costs') totals.opIncome_corporate += item.operatingIncome;
    });

    const totalOpEx = totals.opex_rd + totals.opex_sm;
    const grossProfit = totals.revenue - totals.costOfRevenue - totals.tac;
    const operatingProfit = grossProfit - totalOpEx + totals.opIncome_corporate; 

    const nodeNames = [ ...Array.from(segmentNodes), 'Total Revenue', 'Cost of Revenue', 'TAC', 'Gross Profit', 'R&D', 'S&M', 'Corporate Costs', 'Operating Profit' ];
    const nodeColors = { ...SEGMENT_COLORS, 'Total Revenue': '#4285F4', 'Cost of Revenue': '#EA4335', 'TAC': '#FBBC05', 'Gross Profit': '#34A853', 'R&D': '#EA4335', 'S&M': '#EA4335', 'Corporate Costs': '#FBBC05', 'Operating Profit': '#34A853' };
    const nodes = nodeNames.map(name => ({ name, color: nodeColors[name] || '#B0B0B0' }));
    const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));

    let links = [
      ...Object.entries(segmentRevenues).map(([seg, rev]) => ({ source: nodeMap.get(seg), target: nodeMap.get('Total Revenue'), value: rev })),
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('Gross Profit'), value: grossProfit },
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('Cost of Revenue'), value: totals.costOfRevenue },
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('TAC'), value: totals.tac },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('Operating Profit'), value: operatingProfit },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('R&D'), value: totals.opex_rd },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('S&M'), value: totals.opex_sm },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('Corporate Costs'), value: totals.opIncome_corporate * -1 },
    ];
    
    links = links.filter(link => link.value > 0 && link.source !== undefined && link.target !== undefined && !isNaN(link.value));
    return { nodes, links };
  }, [year, segmentFilter, financialData]);

  if (sankeyData.links.length === 0) return ( <Card className="h-96 flex items-center justify-center"><CardContent><p className="text-gray-500">Please select at least one segment to display data.</p></CardContent></Card> );

  return (
    <ChartWrapper title={`Revenue to Operating Profit Flow (${year})`} height="h-[500px]">
      <Sankey
        width={900} height={450} data={sankeyData} nodePadding={50}
        margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
        link={{ stroke: '#B0B0B0', strokeOpacity: 0.3 }}
        node={({ x, y, width, height, index, payload, containerWidth }) => {
          if (!sankeyData.nodes[index]) return null;
          const node = sankeyData.nodes[index];
          const isSource = x < containerWidth / 2;
          return (
            <g>
              <rect x={x} y={y} width={width} height={height} fill={node.color} stroke="#fff" />
              <text x={isSource ? x - 6 : x + width + 6} y={y + height / 2} textAnchor={isSource ? "end" : "start"} dominantBaseline="middle" fill="#333" fontSize={12} fontWeight="bold">
                {node.name}
              </text>
            </g>
          );
        }}
      >
        <Tooltip formatter={(value) => formatLargeNumber(value)} />
      </Sankey>
    </ChartWrapper>
  );
};


// --- OVERVIEW PAGE COMPONENT ---
export default function OverviewPage() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [segmentFilter, setSegmentFilter] = useState({ 'Google Services': true, 'Google Cloud': true, 'Other Bets': true, 'Corporate Costs': true });
  const toggleSegmentFilter = (segment) => setSegmentFilter(prev => ({ ...prev, [segment]: !prev[segment] }));

  // --- Top-Level Analytics (copied from old App.jsx) ---
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) yearlyData.set(item.year, { year: item.year, totalRevenue: 0, totalOpIncome: 0, totalOpEx: 0 });
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
      yearData.totalOpIncome += item.operatingIncome;
      yearData.totalOpEx += (item.opex_rd || 0) + (item.opex_sm || 0);
    }
    const cashFlowMap = new Map(MOCK_CASH_FLOW_DATA.map(d => [d.year, d]));
    const sortedData = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year);
    let lastYearRevenue = 0; let lastYearOpIncome = 0;
    return sortedData.map(d => {
      const revenueGrowth = lastYearRevenue === 0 ? 0 : (d.totalRevenue - lastYearRevenue) / lastYearRevenue;
      const opIncomeGrowth = lastYearOpIncome === 0 ? 0 : (d.totalOpIncome - lastYearOpIncome) / lastYearOpIncome;
      const opMargin = d.totalRevenue > 0 ? d.totalOpIncome / d.totalRevenue : 0;
      const cfData = cashFlowMap.get(d.year) || { operatingCashFlow: 0, capex: 0 };
      const freeCashFlow = cfData.operatingCashFlow + cfData.capex;
      lastYearRevenue = d.totalRevenue; lastYearOpIncome = d.totalOpIncome;
      return { ...d, freeCashFlow, 'Revenue Growth': revenueGrowth, 'Operating Margin': opMargin, opexAsPercentOfRevenue: d.totalRevenue > 0 ? d.totalOpEx / d.totalRevenue : 0, revenueGrowth, opIncomeGrowth, opMargin, };
    });
  }, []);

  // --- Page-Specific Analytics (copied from old OverviewDashboard) ---
  const kpiData = useMemo(() => { const currentYearData = timeSeriesData.find(d => d.year === selectedYear); if (!currentYearData) return { totalRevenue: 0, totalOpIncome: 0, opMargin: 0, revenueGrowth: 0, opIncomeGrowth: 0, freeCashFlow: 0, totalOpEx: 0 }; return { ...currentYearData }; }, [timeSeriesData, selectedYear]);
  const segmentData = useMemo(() => { const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === selectedYear); const segmentMap = new Map(); for (const item of yearData) { if (item.segment === 'Corporate Costs') continue; if (!segmentMap.has(item.segment)) segmentMap.set(item.segment, { name: item.segment, revenue: 0, operatingIncome: 0 }); const seg = segmentMap.get(item.segment); seg.revenue += item.revenue; seg.operatingIncome += item.operatingIncome; } return Array.from(segmentMap.values()); }, [selectedYear]);
  const opIncomeSegmentData = useMemo(() => { const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === selectedYear); const segmentMap = new Map(); for (const item of yearData) { const segmentName = item.segment; if (!segmentMap.has(segmentName)) segmentMap.set(segmentName, { name: segmentName, operatingIncome: 0 }); segmentMap.get(segmentName).operatingIncome += item.operatingIncome; } return Array.from(segmentMap.values()); }, [selectedYear]);
  const segmentTimeSeries = useMemo(() => { const yearMap = new Map(); MOCK_FINANCIAL_DATA.forEach(item => { if (item.segment === 'Corporate Costs') return; if (!yearMap.has(item.year)) yearMap.set(item.year, { year: item.year, 'Google Services': 0, 'Google Cloud': 0, 'Other Bets': 0, }); const yearData = yearMap.get(item.year); if (yearData[item.segment] !== undefined) yearData[item.segment] += item.revenue; }); return Array.from(yearMap.values()).sort((a,b) => a.year - b.year); }, []);
  
  return ( 
    <div className="space-y-6"> 
      <div className="flex justify-end"> 
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {uniqueYears.map(y => <SelectItem key={y} value={y.toString()}>{y} Performance</SelectItem>)}
          </SelectContent>
        </Select>
      </div> 

      <div className="lg:col-span-3">
        <RevenueToProfitSankey financialData={MOCK_FINANCIAL_DATA} year={selectedYear} segmentFilter={segmentFilter} />
        <div className="flex justify-center space-x-4 mt-4">
          {Object.keys(segmentFilter).filter(s => s !== 'Corporate Costs').map(segment => (
            <label key={segment} className="flex items-center cursor-pointer text-sm">
              <input type="checkbox" checked={segmentFilter[segment]} onChange={() => toggleSegmentFilter(segment)} className="form-checkbox h-4 w-4 rounded" style={{ accentColor: SEGMENT_COLORS[segment] }} />
              <span className="ml-2" style={{ color: SEGMENT_COLORS[segment] }}>{segment}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6"> 
        <KpiCard title="Total Revenue" value={formatLargeNumber(kpiData.totalRevenue)} change={`${formatPercent(kpiData.revenueGrowth)} YoY`} isPositive={kpiData.revenueGrowth >= 0} /> 
        <KpiCard title="Operating Income" value={formatLargeNumber(kpiData.totalOpIncome)} change={`${formatPercent(kpiData.opIncomeGrowth)} YoY`} isPositive={kpiData.opIncomeGrowth >= 0} /> 
        <KpiCard title="Operating Margin" value={formatPercent(kpiData.opMargin)} isPositive={kpiData.opMargin >= 0} /> 
        <KpiCard title="Total Operating Expense" value={formatLargeNumber(kpiData.totalOpEx)} change={`${formatPercent(kpiData.totalOpEx / kpiData.totalRevenue)} of Revenue`} isPositive={false} /> 
      </div> 
      
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-3">
          <ChartWrapper title="Key Performance Metrics (YoY)">
            <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#4285F4" tickFormatter={formatPercent} label={{ value: 'YoY Growth %', angle: -90, position: 'insideLeft', fill: '#4285F4' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#34A853" tickFormatter={formatPercent} label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#34A853' }} />
              <Tooltip content={<PercentTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Revenue Growth" stroke="#4285F4" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="Operating Margin" stroke="#34A853" strokeWidth={3} />
            </LineChart>
          </ChartWrapper>
        </div>
        
        <div className="lg:col-span-3">
          <ChartWrapper title="Revenue by Segment">
            <>
              <div className="flex justify-center space-x-4 mb-4">
                {Object.keys(segmentFilter).filter(s => s !== 'Corporate Costs').map(segment => (
                  <label key={segment} className="flex items-center cursor-pointer text-sm">
                    <input type="checkbox" checked={segmentFilter[segment]} onChange={() => toggleSegmentFilter(segment)} className="form-checkbox h-4 w-4 rounded" style={{ accentColor: SEGMENT_COLORS[segment] }} />
                    <span className="ml-2" style={{ color: SEGMENT_COLORS[segment] }}>{segment}</span>
                  </label>
                ))}
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={segmentTimeSeries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  {Object.keys(segmentFilter).filter(s => s !== 'Corporate Costs').map(segment => (
                    segmentFilter[segment] && <Line key={segment} type="monotone" dataKey={segment} stroke={SEGMENT_COLORS[segment]} strokeWidth={3} activeDot={{ r: 8 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </>
          </ChartWrapper>
        </div>
      </div> 

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">By Segment ({selectedYear})</h2> 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
        <div className="lg:col-span-1">
          <ChartWrapper title={`Revenue by Segment (${selectedYear})`}>
            <PieChart>
              <Pie data={segmentData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${formatLargeNumber(value)} (${formatPercent(props.percent)})`} />
              <Legend />
            </PieChart>
          </ChartWrapper>
        </div>
        <div className="lg:col-span-2">
          <ChartWrapper title={`Operating Income by Segment (${selectedYear})`}>
            <BarChart data={opIncomeSegmentData} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#666" tickFormatter={formatLargeNumber} />
              <YAxis dataKey="name" type="category" stroke="#666" width={100} />
              <Tooltip content={<CurrencyTooltip />} />
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
}

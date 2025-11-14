"use client"; // This is critical for Next.js to run this as an interactive page

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Sankey
} from 'recharts';

// --- Data Imports ---
import {
  MOCK_FINANCIAL_DATA,
  MOCK_RATIO_DATA, // This was missing from the old imports, but needed
  MOCK_CASH_FLOW_DATA, // This was missing, needed for timeSeriesData
  uniqueYears,
  SEGMENT_COLORS,
  OPEX_COLORS,
} from '@/data/mockData'; // Use Next.js path aliases

// --- Util Imports ---
import {
  formatLargeNumber,
  formatPercent,
  formatRatio,
  formatNumber,
} from '@/lib/utils'; // Use Next.js path aliases

// --- ShadCN Component Imports ---
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Import Label for Checkbox

// =================================================================================
// === Re-usable Dashboard Components (defined here for simplicity) ===
// =================================================================================

const KpiCard = ({ title, value, change, isPositive }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
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

const ChartWrapper = ({ title, children, height = "h-96" }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
    </CardHeader>
    <CardContent className={height}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const PercentTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="label font-bold text-gray-700">{label}</p>
        {payload.map(entry => (
          <p key={entry.name} style={{ color: entry.color }}>
            {`${entry.name}: ${formatPercent(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
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

// =================================================================================
// === SANKEY CHART COMPONENT ===
// =================================================================================

const RevenueToProfitSankey = ({ financialData, year, segmentFilter }) => {
  const sankeyData = useMemo(() => {
    const yearData = financialData.filter(d => d.year === year);

    // 1. Calculate totals based on filters
    // Include Corporate Costs in the filter
    const filteredData = yearData.filter(d => segmentFilter[d.segment]);
    if (filteredData.length === 0) return { nodes: [], links: [] };

    const totals = {
      revenue: 0,
      costOfRevenue: 0,
      tac: 0,
      opex_rd: 0,
      opex_sm: 0,
      corporateCosts: 0,
    };

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
      if (item.segment === 'Corporate Costs') {
        totals.corporateCosts += item.operatingIncome; // This is a negative number
      }
    });

    const totalOpEx = totals.opex_rd + totals.opex_sm;
    const grossProfit = totals.revenue - totals.costOfRevenue - totals.tac;
    const operatingProfit = grossProfit - totalOpEx + totals.corporateCosts;

    // --- Define Nodes ---
    const nodeNames = [
      ...Array.from(segmentNodes),
      'Total Revenue', 'Cost of Revenue', 'TAC', 'Gross Profit',
      'R&D', 'S&M', 'Corporate Costs', 'Operating Profit'
    ];

    const nodeColors = {
      ...SEGMENT_COLORS,
      'Total Revenue': '#4A5568',
      'Cost of Revenue': '#E53E3E',
      'TAC': '#DD6B20',
      'Gross Profit': '#34A853',
      'R&D': '#f59e0b', // Amber
      'S&M': '#f97316', // Orange
      'Corporate Costs': '#ef4444', // Red
      'Operating Profit': '#22c55e' // Green
    };

    const nodes = nodeNames.map(name => ({ name, color: nodeColors[name] || '#B0B0B0' }));
    const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));

    // --- Define Links ---
    let links = [
      // Revenues -> Total Revenue
      ...Object.entries(segmentRevenues).map(([seg, rev]) => ({
        source: nodeMap.get(seg),
        target: nodeMap.get('Total Revenue'),
        value: rev
      })),
      
      // Total Revenue -> Gross Profit / CoR / TAC
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('Gross Profit'), value: grossProfit },
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('Cost of Revenue'), value: totals.costOfRevenue },
      { source: nodeMap.get('Total Revenue'), target: nodeMap.get('TAC'), value: totals.tac },
      
      // Gross Profit -> Operating Profit / OpEx
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('Operating Profit'), value: operatingProfit },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('R&D'), value: totals.opex_rd },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('S&M'), value: totals.opex_sm },
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('Corporate Costs'), value: totals.corporateCosts * -1 },
    ];

    // CRITICAL: Filter out invalid links (negative or zero values)
    links = links.filter(link =>
      link.value > 0 &&
      link.source !== undefined &&
      link.target !== undefined &&
      !isNaN(link.value)
    );

    // CRITICAL: Filter out nodes that are no longer part of any links
    const referencedNodeIndices = new Set();
    links.forEach(link => {
      referencedNodeIndices.add(link.source);
      referencedNodeIndices.add(link.target);
    });

    const validNodes = nodes.filter((_, index) => referencedNodeIndices.has(index));
    
    // Re-map indices for the new filtered nodes array
    const nodeIndexMap = new Map(validNodes.map((node, newIndex) => {
      const oldIndex = nodes.findIndex(n => n.name === node.name);
      return [oldIndex, newIndex];
    }));
    
    const finalLinks = links.map(link => ({
      source: nodeIndexMap.get(link.source),
      target: nodeIndexMap.get(link.target),
      value: link.value,
    }));

    // This is the check that fixes the (reading 'x') error
    // Ensure all links map to a valid node index
    const validFinalLinks = finalLinks.filter(link => 
      link.source !== undefined && link.target !== undefined &&
      link.source < validNodes.length && link.target < validNodes.length
    );

    return { nodes: validNodes, links: validFinalLinks };

  }, [year, segmentFilter, financialData]);

  if (sankeyData.links.length === 0) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <CardContent>
          <p className="text-gray-500">Please select at least one segment to display data.</p>
        </CardContent>
      </Card>
    );
  }

  // Custom Node for Sankey to add labels
  const SankeyNode = ({ x, y, width, height, index, payload, containerWidth }) => {
    if (!sankeyData.nodes[index]) return null;
    const node = sankeyData.nodes[index];
    const isSource = x < containerWidth / 2;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={node.color}
          stroke="#fff"
        />
        <text
          x={isSource ? x - 6 : x + width + 6}
          y={y + height / 2}
          textAnchor={isSource ? "end" : "start"}
          dominantBaseline="middle"
          fill="#333"
          fontSize={12}
          fontWeight="bold"
        >
          {node.name}
        </text>
      </g>
    );
  };

  return (
    <ChartWrapper title={`Revenue to Operating Profit Flow (${year})`} height="h-[500px]">
      <Sankey
        data={sankeyData}
        nodePadding={50}
        margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
        link={{ stroke: '#B0B0B0', strokeOpacity: 0.3 }}
        node={<SankeyNode />}
      >
        <Tooltip formatter={(value) => formatLargeNumber(value)} />
      </Sankey>
    </ChartWrapper>
  );
};


// =================================================================================
// === MAIN OVERVIEW PAGE COMPONENT ===
// =================================================================================

function OverviewDashboard() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [segmentFilter, setSegmentFilter] = useState({ 'Google Services': true, 'Google Cloud': true, 'Other Bets': true, 'Corporate Costs': true });
  
  const toggleSegmentFilter = (segment) => {
    setSegmentFilter(prev => ({ ...prev, [segment]: !prev[segment] }));
  };

  // --- TOP-LEVEL ANALYTICS (from old App.jsx) ---
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
      const freeCashFlow = cfData.operatingCashFlow + (cfData.capex || 0); // Capex is negative
      lastYearRevenue = d.totalRevenue; lastYearOpIncome = d.totalOpIncome;
      return { ...d, freeCashFlow, "Revenue Growth": revenueGrowth, "Operating Margin": opMargin, opexAsPercentOfRevenue: d.totalRevenue > 0 ? d.totalOpEx / d.totalRevenue : 0, revenueGrowth, opIncomeGrowth, opMargin, };
    });
  }, []);

  const kpiData = useMemo(() => {
    const currentYearData = timeSeriesData.find(d => d.year === selectedYear);
    if (!currentYearData) return { totalRevenue: 0, totalOpIncome: 0, opMargin: 0, revenueGrowth: 0, opIncomeGrowth: 0, freeCashFlow: 0, totalOpEx: 0 };
    return {
      totalRevenue: currentYearData.totalRevenue,
      totalOpIncome: currentYearData.totalOpIncome,
      opMargin: currentYearData.opMargin,
      revenueGrowth: currentYearData.revenueGrowth,
      opIncomeGrowth: currentYearData.opIncomeGrowth,
      freeCashFlow: currentYearData.freeCashFlow,
      totalOpEx: currentYearData.totalOpEx,
    };
  }, [timeSeriesData, selectedYear]);

  const segmentPieData = useMemo(() => {
    const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === selectedYear);
    const segmentMap = new Map();
    for (const item of yearData) {
      if (item.segment === 'Corporate Costs') continue;
      if (!segmentMap.has(item.segment)) segmentMap.set(item.segment, { name: item.segment, revenue: 0, operatingIncome: 0 });
      const seg = segmentMap.get(item.segment);
      seg.revenue += item.revenue;
      seg.operatingIncome += item.operatingIncome;
    }
    return Array.from(segmentMap.values());
  }, [selectedYear]);

  const opIncomeSegmentData = useMemo(() => {
    const yearData = MOCK_FINANCIAL_DATA.filter(d => d.year === selectedYear);
    const segmentMap = new Map();
    for (const item of yearData) {
      const segmentName = item.segment;
      if (!segmentMap.has(segmentName)) segmentMap.set(segmentName, { name: segmentName, operatingIncome: 0 });
      segmentMap.get(segmentName).operatingIncome += item.operatingIncome;
    }
    return Array.from(segmentMap.values());
  }, [selectedYear]);

  const segmentTimeSeries = useMemo(() => {
    const yearMap = new Map();
    MOCK_FINANCIAL_DATA.forEach(item => {
      if (item.segment === 'Corporate Costs') return;
      if (!yearMap.has(item.year)) yearMap.set(item.year, { year: item.year, 'Google Services': 0, 'Google Cloud': 0, 'Other Bets': 0, });
      const yearData = yearMap.get(item.year);
      if (yearData[item.segment] !== undefined) yearData[item.segment] += item.revenue;
    });
    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, []);

  return (
    <div className="space-y-6">
      {/* --- FILTERS --- */}
      <div className="flex justify-end">
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {uniqueYears.map(y => (
              <SelectItem key={y} value={String(y)}>{y} Performance</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* --- SANKEY CHART --- */}
      <div className="w-full">
        <RevenueToProfitSankey
          financialData={MOCK_FINANCIAL_DATA}
          year={selectedYear}
          segmentFilter={segmentFilter}
        />
        <div className="flex justify-center space-x-4 mt-4">
          {Object.keys(segmentFilter).filter(s => s !== 'Corporate Costs').map(segment => (
            <div key={segment} className="flex items-center space-x-2">
              <Checkbox
                id={segment}
                checked={segmentFilter[segment]}
                onCheckedChange={() => toggleSegmentFilter(segment)}
                style={{ accentColor: SEGMENT_COLORS[segment] }}
              />
              <Label htmlFor={segment} className="text-sm" style={{ color: SEGMENT_COLORS[segment] }}>
                {segment}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <KpiCard title="Total Revenue" value={formatLargeNumber(kpiData.totalRevenue)} change={`${formatPercent(kpiData.revenueGrowth)} YoY`} isPositive={kpiData.revenueGrowth >= 0} />
        <KpiCard title="Operating Income" value={formatLargeNumber(kpiData.totalOpIncome)} change={`${formatPercent(kpiData.opIncomeGrowth)} YoY`} isPositive={kpiData.opIncomeGrowth >= 0} />
        <KpiCard title="Operating Margin" value={formatPercent(kpiData.opMargin)} isPositive={kpiData.opMargin >= 0} />
        <KpiCard title="Total Operating Expense" value={formatLargeNumber(kpiData.totalOpEx)} change={`${formatPercent(kpiData.totalOpEx / kpiData.totalRevenue)} of Revenue`} isPositive={false} />
      </div>

      {/* --- MAIN CHARTS --- */}
      <div className="grid grid-cols-1 gap-6">
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

        <ChartWrapper title="Revenue by Segment">
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
        </ChartWrapper>
      </div>

      {/* --- SEGMENT BREAKDOWN (for selected year) --- */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">By Segment ({selectedYear})</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartWrapper title={`Revenue by Segment (${selectedYear})`} height="h-80">
          <PieChart>
            <Pie data={segmentPieData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
              {segmentPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => `${formatLargeNumber(value)} (${formatPercent(props.percent)})`} />
            <Legend />
          </PieChart>
        </ChartWrapper>
        <div className="lg:col-span-2">
          <ChartWrapper title={`Operating Income by Segment (${selectedYear})`} height="h-80">
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
};

export default OverviewDashboard;

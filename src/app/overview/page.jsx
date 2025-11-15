"use client";

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';

import {
  MOCK_FINANCIAL_DATA,
  uniqueYears,
  SEGMENT_COLORS,
} from '../../data/mockData'; // FIX: Relative path

import {
  formatLargeNumber,
  formatPercent,
} from '../../lib/utils'; // FIX: Relative path

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'; // FIX: Relative path

import { Checkbox } from "../../components/ui/checkbox"; // FIX: Relative path
import { Label } from "../../components/ui/label"; // FIX: Relative path

import {
  KpiCard,
  ChartWrapper,
  PercentTooltip,
  CurrencyTooltip,
  RevenueToProfitSankey
} from '../../components/DashboardComponents'; // FIX: Relative path

export default function OverviewDashboard() {
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [segmentFilter, setSegmentFilter] = useState({
    'Google Services': true,
    'Google Cloud': true,
    'Other Bets': true,
  });

  const toggleSegmentFilter = (segment) => {
    setSegmentFilter(prev => ({ ...prev, [segment]: !prev[segment] }));
  };

  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) {
        yearlyData.set(item.year, { year: item.year, totalRevenue: 0, totalOpIncome: 0, totalOpEx: 0 });
      }
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
      yearData.totalOpIncome += item.operatingIncome;
      yearData.totalOpEx += (item.opex_rd || 0) + (item.opex_sm || 0);
    }
    const sortedData = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year);
    let lastYearRevenue = 0, lastYearOpIncome = 0;
    return sortedData.map(d => {
      const revenueGrowth = lastYearRevenue === 0 ? 0 : (d.totalRevenue - lastYearRevenue) / lastYearRevenue;
      const opIncomeGrowth = lastYearOpIncome === 0 ? 0 : (d.totalOpIncome - lastYearOpIncome) / lastYearOpIncome;
      const opMargin = d.totalRevenue > 0 ? d.totalOpIncome / d.totalRevenue : 0;
      lastYearRevenue = d.totalRevenue;
      lastYearOpIncome = d.totalOpIncome;
      return { ...d, 'Revenue Growth': revenueGrowth * 100, 'Operating Margin': opMargin * 100, opexAsPercentOfRevenue: d.totalRevenue > 0 ? d.totalOpEx / d.totalRevenue : 0, revenueGrowth, opIncomeGrowth, opMargin };
    });
  }, []);

  const kpiData = useMemo(() => {
    const currentYearData = timeSeriesData.find(d => d.year === selectedYear);
    if (!currentYearData) return { totalRevenue: 0, totalOpIncome: 0, opMargin: 0, revenueGrowth: 0, opIncomeGrowth: 0, totalOpEx: 0 };
    return { ...currentYearData };
  }, [timeSeriesData, selectedYear]);

  const segmentData = useMemo(() => {
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
      if (!yearMap.has(item.year)) yearMap.set(item.year, { year: item.year, 'Google Services': 0, 'Google Cloud': 0, 'Other Bets': 0 });
      const yearData = yearMap.get(item.year);
      if (yearData[item.segment] !== undefined) yearData[item.segment] += item.revenue;
    });
    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-end">
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Select year" /></SelectTrigger>
          <SelectContent>
            {uniqueYears.map(y => <SelectItem key={y} value={y.toString()}>{y} Performance</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={formatLargeNumber(kpiData.totalRevenue)} change={`${formatPercent(kpiData.revenueGrowth)} YoY`} isPositive={kpiData.revenueGrowth >= 0} />
        <KpiCard title="Operating Income" value={formatLargeNumber(kpiData.totalOpIncome)} change={`${formatPercent(kpiData.opIncomeGrowth)} YoY`} isPositive={kpiData.opIncomeGrowth >= 0} />
        <KpiCard title="Operating Margin" value={formatPercent(kpiData.opMargin)} isPositive={kpiData.opMargin >= 0} />
        <KpiCard title="Total Operating Expense" value={formatLargeNumber(kpiData.totalOpEx)} change={`${formatPercent(kpiData.opexAsPercentOfRevenue)} of Revenue`} isPositive={false} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-center items-center space-x-6">
          {Object.keys(segmentFilter).map(segment => (
            <div key={segment} className="flex items-center space-x-2">
              <Checkbox id={segment} checked={segmentFilter[segment]} onCheckedChange={() => toggleSegmentFilter(segment)} style={{ accentColor: SEGMENT_COLORS[segment] }} className="form-checkbox" />
              <Label htmlFor={segment} className="text-sm font-medium" style={{ color: SEGMENT_COLORS[segment] }}>{segment}</Label>
            </div>
          ))}
        </div>
        <RevenueToProfitSankey data={MOCK_FINANCIAL_DATA} year={selectedYear} filter={segmentFilter} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-3">
          <ChartWrapper title="Key Performance Metrics">
            <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#4285F4" tickFormatter={val => formatPercent(val/100)} label={{ value: 'YoY Growth %', angle: -90, position: 'insideLeft', fill: '#4285F4' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#34A853" tickFormatter={val => formatPercent(val/100)} label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#34A853' }} />
              <Tooltip content={<PercentTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Revenue Growth" stroke="#4285F4" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="Operating Margin" stroke="#34A853" strokeWidth={3} />
            </LineChart>
          </ChartWrapper>
        </div>
        <div className="lg:col-span-3">
          <ChartWrapper title="Revenue by Segment">
            <LineChart data={segmentTimeSeries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={formatLargeNumber} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              {Object.keys(segmentFilter).map(segment => (
                segmentFilter[segment] && <Line key={segment} type="monotone" dataKey={segment} stroke={SEGMENT_COLORS[segment]} strokeWidth={3} activeDot={{ r: 8 }} />
              ))}
            </LineChart>
          </ChartWrapper>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">By Segment ({selectedYear})</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartWrapper title={`Revenue by Segment (${selectedYear})`}>
            <PieChart>
              <Pie data={segmentData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {segmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name]} />)}
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
                {opIncomeSegmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.operatingIncome >= 0 ? SEGMENT_COLORS[entry.name] : '#EA4335'} />)}
              </Bar>
            </BarChart>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
}

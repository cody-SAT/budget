import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, AreaChart, Area,
  Sankey, // NEW: Import Sankey
} from 'recharts';

// --- MOCK DATA (ALPHABET INC. 5-YEAR DEEP DIVE - "INVESTMENT BANKER" DETAIL) ---
// All figures are in *Millions of USD*.
const MOCK_FINANCIAL_DATA = [
  // --- 2021 ---
  { id: 1, year: 2021, segment: 'Google Services', item: 'Google Search', revenue: 149000, tac: 24000, costOfRevenue: 30000, opex_rd: 20000, opex_sm: 10000, operatingIncome: 65000 },
  { id: 2, year: 2021, segment: 'Google Services', item: 'YouTube Ads', revenue: 28800, tac: 0, costOfRevenue: 12000, opex_rd: 5000, opex_sm: 5800, operatingIncome: 6000 },
  { id: 3, year: 2021, segment: 'Google Services', item: 'Google Network', revenue: 31000, tac: 0, costOfRevenue: 15000, opex_rd: 3000, opex_sm: 5500, operatingIncome: 7500 },
  { id: 4, year: 2021, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 7000, tac: 0, costOfRevenue: 4000, opex_rd: 1500, opex_sm: 1000, operatingIncome: 500 },
  { id: 5, year: 2021, segment: 'Google Services', item: 'Hardware & Other', revenue: 20000, tac: 0, costOfRevenue: 12000, opex_rd: 3000, opex_sm: 3000, operatingIncome: 2000 },
  { id: 6, year: 2021, segment: 'Google Cloud', item: 'GCP', revenue: 13000, tac: 0, costOfRevenue: 8000, opex_rd: 4000, opex_sm: 3500, operatingIncome: -2500 },
  { id: 7, year: 2021, segment: 'Google Cloud', item: 'Workspace', revenue: 6200, tac: 0, costOfRevenue: 2000, opex_rd: 1000, opex_sm: 800, operatingIncome: 2400 },
  { id: 8, year: 2021, segment: 'Other Bets', item: 'Waymo', revenue: 200, tac: 0, costOfRevenue: 500, opex_rd: 2000, opex_sm: 1700, operatingIncome: -4000 },
  { id: 9, year: 2021, segment: 'Other Bets', item: 'Verily', revenue: 700, tac: 0, costOfRevenue: 300, opex_rd: 1500, opex_sm: 1400, operatingIncome: -2500 },
  { id: 10, year: 2021, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, tac: 0, costOfRevenue: 0, opex_rd: 0, opex_sm: 0, operatingIncome: -9000 },

  // --- 2022 ---
  { id: 11, year: 2022, segment: 'Google Services', item: 'Google Search', revenue: 162000, tac: 26000, costOfRevenue: 32000, opex_rd: 22000, opex_sm: 12000, operatingIncome: 60000 },
  { id: 12, year: 2022, segment: 'Google Services', item: 'YouTube Ads', revenue: 29200, tac: 0, costOfRevenue: 12500, opex_rd: 5000, opex_sm: 5200, operatingIncome: 6500 },
  { id: 13, year: 2022, segment: 'Google Services', item: 'Google Network', revenue: 32500, tac: 0, costOfRevenue: 16000, opex_rd: 3200, opex_sm: 5500, operatingIncome: 7800 },
  { id: 14, year: 2022, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 8000, tac: 0, costOfRevenue: 4300, opex_rd: 1500, opex_sm: 1500, operatingIncome: 700 },
  { id: 15, year: 2022, segment: 'Google Services', item: 'Hardware & Other', revenue: 22000, tac: 0, costOfRevenue: 13000, opex_rd: 3500, opex_sm: 3000, operatingIncome: 2500 },
  { id: 16, year: 2022, segment: 'Google Cloud', item: 'GCP', revenue: 18000, tac: 0, costOfRevenue: 11000, opex_rd: 4500, opex_sm: 4000, operatingIncome: -1500 },
  { id: 17, year: 2022, segment: 'Google Cloud', item: 'Workspace', revenue: 8300, tac: 0, costOfRevenue: 2500, opex_rd: 1200, opex_sm: 1000, operatingIncome: 3600 },
  { id: 18, year: 2022, segment: 'Other Bets', item: 'Waymo', revenue: 250, tac: 0, costOfRevenue: 500, opex_rd: 1800, opex_sm: 1450, operatingIncome: -3500 },
  { id: 19, year: 2022, segment: 'Other Bets', item: 'Verily', revenue: 800, tac: 0, costOfRevenue: 300, opex_rd: 1400, opex_sm: 1300, operatingIncome: -2200 },
  { id: 20, year: 2022, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, tac: 0, costOfRevenue: 0, opex_rd: 0, opex_sm: 0, operatingIncome: -10000 },
  
  // --- 2023 ---
  { id: 21, year: 2023, segment: 'Google Services', item: 'Google Search', revenue: 175000, tac: 28000, costOfRevenue: 35000, opex_rd: 24000, opex_sm: 13000, operatingIncome: 65000 },
  { id: 22, year: 2023, segment: 'Google Services', item: 'YouTube Ads', revenue: 31500, tac: 0, costOfRevenue: 13000, opex_rd: 5500, opex_sm: 6000, operatingIncome: 7000 },
  { id: 23, year: 2023, segment: 'Google Services', item: 'Google Network', revenue: 32000, tac: 0, costOfRevenue: 15000, opex_rd: 3000, opex_sm: 6000, operatingIncome: 8000 },
  { id: 24, year: 2023, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 10000, tac: 0, costOfRevenue: 5000, opex_rd: 2000, opex_sm: 2000, operatingIncome: 1000 },
  { id: 25, year: 2023, segment: 'Google Services', item: 'Hardware & Other', revenue: 23000, tac: 0, costOfRevenue: 14000, opex_rd: 3000, opex_sm: 3000, operatingIncome: 3000 },
  { id: 26, year: 2023, segment: 'Google Cloud', item: 'GCP', revenue: 23000, tac: 0, costOfRevenue: 14000, opex_rd: 5000, opex_sm: 4500, operatingIncome: -500 },
  { id: 27, year: 2023, segment: 'Google Cloud', item: 'Workspace', revenue: 10000, tac: 0, costOfRevenue: 3000, opex_rd: 1500, opex_sm: 1500, operatingIncome: 4000 },
  { id: 28, year: 2023, segment: 'Other Bets', item: 'Waymo', revenue: 300, tac: 0, costOfRevenue: 500, opex_rd: 1500, opex_sm: 1300, operatingIncome: -3000 },
  { id: 29, year: 2023, segment: 'Other Bets', item: 'Verily', revenue: 900, tac: 0, costOfRevenue: 300, opex_rd: 1300, opex_sm: 1300, operatingIncome: -2000 },
  { id: 30, year: 2023, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, tac: 0, costOfRevenue: 0, opex_rd: 0, opex_sm: 0, operatingIncome: -11000 },

  // --- 2024 ---
  { id: 31, year: 2024, segment: 'Google Services', item: 'Google Search', revenue: 192000, tac: 31000, costOfRevenue: 38000, opex_rd: 26000, opex_sm: 15000, operatingIncome: 72000 },
  { id: 32, year: 2024, segment: 'Google Services', item: 'YouTube Ads', revenue: 35000, tac: 0, costOfRevenue: 14000, opex_rd: 6000, opex_sm: 6500, operatingIncome: 8500 },
  { id: 33, year: 2024, segment: 'Google Services', item: 'Google Network', revenue: 33000, tac: 0, costOfRevenue: 15000, opex_rd: 3800, opex_sm: 6000, operatingIncome: 8200 },
  { id: 34, year: 2024, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 13000, tac: 0, costOfRevenue: 6000, opex_rd: 2500, opex_sm: 3000, operatingIncome: 1500 },
  { id: 35, year: 2024, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, tac: 0, costOfRevenue: 15000, opex_rd: 3000, opex_sm: 3500, operatingIncome: 3500 },
  { id: 36, year: 2024, segment: 'Google Cloud', item: 'GCP', revenue: 29000, tac: 0, costOfRevenue: 17000, opex_rd: 5500, opex_sm: 5000, operatingIncome: 1500 }, // Profitable
  { id: 37, year: 2024, segment: 'Google Cloud', item: 'Workspace', revenue: 13000, tac: 0, costOfRevenue: 4000, opex_rd: 1800, opex_sm: 1700, operatingIncome: 5500 },
  { id: 38, year: 2024, segment: 'Other Bets', item: 'Waymo', revenue: 400, tac: 0, costOfRevenue: 500, opex_rd: 1400, opex_sm: 1300, operatingIncome: -2800 },
  { id: 39, year: 2024, segment: 'Other Bets', item: 'Verily', revenue: 1100, tac: 0, costOfRevenue: 300, opex_rd: 1200, opex_sm: 1300, operatingIncome: -1700 },
  { id: 40, year: 2024, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, tac: 0, costOfRevenue: 0, opex_rd: 0, opex_sm: 0, operatingIncome: -12000 },

  // --- 2025 (Projected) ---
  { id: 41, year: 2025, segment: 'Google Services', item: 'Google Search', revenue: 210000, tac: 34000, costOfRevenue: 40000, opex_rd: 28000, opex_sm: 18000, operatingIncome: 80000 },
  { id: 42, year: 2025, segment: 'Google Services', item: 'YouTube Ads', revenue: 40000, tac: 0, costOfRevenue: 15000, opex_rd: 7000, opex_sm: 8000, operatingIncome: 10000 },
  { id: 43, year: 2025, segment: 'Google Services', item: 'Google Network', revenue: 34000, tac: 0, costOfRevenue: 15000, opex_rd: 4000, opex_sm: 6500, operatingIncome: 8500 },
  { id: 44, year: 2025, segment: 'Google Services', item: 'YouTube Subscriptions', revenue: 17000, tac: 0, costOfRevenue: 7000, opex_rd: 3000, opex_sm: 5000, operatingIncome: 2000 },
  { id: 45, year: 2025, segment: 'Google Services', item: 'Hardware & Other', revenue: 25000, tac: 0, costOfRevenue: 15000, opex_rd: 3000, opex_sm: 3000, operatingIncome: 4000 },
  { id: 46, year: 2025, segment: 'Google Cloud', item: 'GCP', revenue: 37000, tac: 0, costOfRevenue: 20000, opex_rd: 6000, opex_sm: 5000, operatingIncome: 6000 },
  { id: 47, year: 2025, segment: 'Google Cloud', item: 'Workspace', revenue: 16000, tac: 0, costOfRevenue: 5000, opex_rd: 2000, opex_sm: 2000, operatingIncome: 7000 },
  { id: 48, year: 2025, segment: 'Other Bets', item: 'Waymo', revenue: 600, tac: 0, costOfRevenue: 600, opex_rd: 1300, opex_sm: 1200, operatingIncome: -2500 },
  { id: 49, year: 2025, segment: 'Other Bets', item: 'Verily', revenue: 1400, tac: 0, costOfRevenue: 400, opex_rd: 1100, opex_sm: 1400, operatingIncome: -1500 },
  { id: 50, year: 2025, segment: 'Corporate Costs', item: 'Corporate', revenue: 0, tac: 0, costOfRevenue: 0, opex_rd: 0, opex_sm: 0, operatingIncome: -12500 },
];

// NEW MOCK BALANCE SHEET DATA
const MOCK_BALANCE_SHEET_DATA = [
  { year: 2021, item: 'Cash & Equivalents', value: 139600, type: 'Asset' },
  { year: 2021, item: 'Accounts Receivable', value: 42000, type: 'Asset' },
  { year: 2021, item: 'PP&E', value: 104000, type: 'Asset' },
  { year: 2021, item: 'Goodwill & Intangibles', value: 50000, type: 'Asset' },
  { year: 2021, item: 'Accounts Payable', value: 15000, type: 'Liability' },
  { year: 2021, item: 'Long-Term Debt', value: 25000, type: 'Liability' },
  { year: 2021, item: "Shareholders' Equity", value: 295600, type: 'Equity' },
  { year: 2022, item: 'Cash & Equivalents', value: 113800, type: 'Asset' },
  { year: 2022, item: 'Accounts Receivable', value: 45000, type: 'Asset' },
  { year: 2022, item: 'PP&E', value: 122000, type: 'Asset' },
  { year: 2022, item: 'Goodwill & Intangibles', value: 52000, type: 'Asset' },
  { year: 2022, item: 'Accounts Payable', value: 16000, type: 'Liability' },
  { year: 2022, item: 'Long-Term Debt', value: 26000, type: 'Liability' },
  { year: 2022, item: "Shareholders' Equity", value: 290800, type: 'Equity' },
  { year: 2023, item: 'Cash & Equivalents', value: 115100, type: 'Asset' },
  { year: 2023, item: 'Accounts Receivable', value: 48000, type: 'Asset' },
  { year: 2023, item: 'PP&E', value: 135000, type: 'Asset' },
  { year: 2023, item: 'Goodwill & Intangibles', value: 55000, type: 'Asset' },
  { year: 2023, item: 'Accounts Payable', value: 18000, type: 'Liability' },
  { year: 2023, item: 'Long-Term Debt', value: 28000, type: 'Liability' },
  { year: 2023, item: "Shareholders' Equity", value: 307100, type: 'Equity' },
  { year: 2024, item: 'Cash & Equivalents', value: 118300, type: 'Asset' },
  { year: 2024, item: 'Accounts Receivable', value: 52000, type: 'Asset' },
  { year: 2024, item: 'PP&E', value: 150000, type: 'Asset' },
  { year: 2024, item: 'Goodwill & Intangibles', value: 58000, type: 'Asset' },
  { year: 2024, item: 'Accounts Payable', value: 20000, type: 'Liability' },
  { year: 2024, item: 'Long-Term Debt', value: 29000, type: 'Liability' },
  { year: 2024, item: "Shareholders' Equity", value: 339300, type: 'Equity' },
  { year: 2025, item: 'Cash & Equivalents', value: 122000, type: 'Asset' },
  { year: 2025, item: 'Accounts Receivable', value: 55000, type: 'Asset' },
  { year: 2025, item: 'PP&E', value: 160000, type: 'Asset' },
  { year: 2025, item: 'Goodwill & Intangibles', value: 60000, type: 'Asset' },
  { year: 2025, item: 'Accounts Payable', value: 22000, type: 'Liability' },
  { year: 2025, item: 'Long-Term Debt', value: 30000, type: 'Liability' },
  { year: 2025, item: "Shareholders' Equity", value: 365000, type: 'Equity' },
];

// EXPANDED MOCK CASH FLOW DATA
const MOCK_CASH_FLOW_DATA = [
  { year: 2021, operatingCashFlow: 91000, capex: -24600, shareRepurchases: -50000 },
  { year: 2022, operatingCashFlow: 92000, capex: -31500, shareRepurchases: -55000 },
  { year: 2023, operatingCashFlow: 101000, capex: -32300, shareRepurchases: -60000 },
  { year: 2024, operatingCashFlow: 110000, capex: -38000, shareRepurchases: -62000 },
  { year: 2025, operatingCashFlow: 120000, capex: -40000, shareRepurchases: -65000 },
];

// NEW MOCK CLOUD KPI DATA
const MOCK_CLOUD_KPI_DATA = [
  { year: 2021, backlog: 45000, totalCustomers: 50000, revPerCustomer: 384000 },
  { year: 2022, backlog: 51000, totalCustomers: 65000, revPerCustomer: 404615 },
  { year: 2023, backlog: 60000, totalCustomers: 80000, revPerCustomer: 412500 },
  { year: 2024, backlog: 72000, totalCustomers: 100000, revPerCustomer: 420000 },
  { year: 2025, backlog: 85000, totalCustomers: 125000, revPerCustomer: 424000 },
];

const MOCK_HEADCOUNT_DATA = [
  { year: 2021, segment: 'Google Services', headcount: 120000 }, { year: 2021, segment: 'Google Cloud', headcount: 25000 }, { year: 2021, segment: 'Other Bets', headcount: 8000 }, { year: 2021, segment: 'Corporate', headcount: 5000 },
  { year: 2022, segment: 'Google Services', headcount: 140000 }, { year: 2022, segment: 'Google Cloud', headcount: 35000 }, { year: 2022, segment: 'Other Bets', headcount: 9000 }, { year: 2022, segment: 'Corporate', headcount: 6000 },
  { year: 2023, segment: 'Google Services', headcount: 138000 }, { year: 2023, segment: 'Google Cloud', headcount: 37000 }, { year: 2023, segment: 'Other Bets', headcount: 8500 }, { year: 2023, segment: 'Corporate', headcount: 5500 },
  { year: 2024, segment: 'Google Services', headcount: 135000 }, { year: 2024, segment: 'Google Cloud', headcount: 40000 }, { year: 2024, segment: 'Other Bets', headcount: 8000 }, { year: 2024, segment: 'Corporate', headcount: 5000 },
  { year: 2025, segment: 'Google Services', headcount: 137000 }, { year: 2025, segment: 'Google Cloud', headcount: 43000 }, { year: 2025, segment: 'Other Bets', headcount: 8200 }, { year: 2025, segment: 'Corporate', headcount: 5100 },
];

// NEW MOCK SYSTEM ACCESS DATA
const MOCK_SYSTEM_ACCESS_DATA = [
  { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com', department: 'Finance', role: 'Admin', status: 'Active', licenseType: 'Premium', cost: 50 },
  { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Engineering', role: 'User', status: 'Active', licenseType: 'Standard', cost: 25 },
  { id: 3, name: 'Carol Williams', email: 'carol.williams@example.com', department: 'Engineering', role: 'User', status: 'Active', licenseType: 'Standard', cost: 25 },
  { id: 4, name: 'David Brown', email: 'david.brown@example.com', department: 'Sales', role: 'User', status: 'Active', licenseType: 'Premium', cost: 50 },
  { id: 5, name: 'Eve Davis', email: 'eve.davis@example.com', department: 'Marketing', role: 'User', status: 'Pending', licenseType: 'Standard', cost: 25 },
  { id: 6, name: 'Frank Miller', email: 'frank.miller@example.com', department: 'Finance', role: 'User', status: 'Active', licenseType: 'Premium', cost: 50 },
  { id: 7, name: 'Grace Wilson', email: 'grace.wilson@example.com', department: 'Engineering', role: 'Admin', status: 'Active', licenseType: 'Premium', cost: 50 },
  { id: 8, name: 'HenryMoore', email: 'henry.moore@example.com', department: 'Sales', role: 'User', status: 'Deactivated', licenseType: 'Standard', cost: 0 },
  { id: 9, name: 'Ivy Taylor', email: 'ivy.taylor@example.com', department: 'Marketing', role: 'User', status: 'Active', licenseType: 'Standard', cost: 25 },
  { id: 10, name: 'Jack Anderson', email: 'jack.anderson@example.com', department: 'Finance', role: 'Read-only', status: 'Active', licenseType: 'Read-only', cost: 5 },
  { id: 11, name: 'Kate Thomas', email: 'kate.thomas@example.com', department: 'Engineering', role: 'User', status: 'Active', licenseType: 'Standard', cost: 25 },
  { id: 12, name: 'Leo White', email: 'leo.white@example.com', department: 'Sales', role: 'User', status: 'Pending', licenseType: 'Premium', cost: 50 },
  { id: 13, name: 'Mia Harris', email: 'mia.harris@example.com', department: 'Marketing', role: 'Admin', status: 'Active', licenseType: 'Premium', cost: 50 },
  { id: 14, name: 'Noah Martin', email: 'noah.martin@example.com', department: 'Finance', role: 'Read-only', status: 'Active', licenseType: 'Read-only', cost: 5 },
  { id: 15, name: 'Olivia Jackson', email: 'olivia.jackson@example.com', department: 'Engineering', role: 'User', status: 'Deactivated', licenseType: 'Standard', cost: 0 },
];

// NEW MOCK FINANCIAL RATIO DATA (from user)
const MOCK_RATIO_DATA = [
  { year: 2020, roe: 0.1809, roa: 0.1260, debtToEquity: 0.1203, debtToAsset: 0.0838, evToRevenue: 6.54, evToEbitda: 19.28, ev: 1190000, cashToDebt: 2.4325, taxRate: 0.1625 },
  { year: 2021, roe: 0.3022, roa: 0.2116, debtToEquity: 0.1128, debtToAsset: 0.0790, evToRevenue: 7.54, evToEbitda: 18.76, ev: 1940000, cashToDebt: 3.2278, taxRate: 0.1620 },
  { year: 2022, roe: 0.2341, roa: 0.1642, debtToEquity: 0.1159, debtToAsset: 0.0813, evToRevenue: 4.10, evToEbitda: 13.63, ev: 1160000, cashToDebt: 3.0828, taxRate: 0.1592 },
  { year: 2023, roe: 0.2604, roa: 0.1834, debtToEquity: 0.0957, debtToAsset: 0.0674, evToRevenue: 5.75, evToEbitda: 18.04, ev: 1770000, cashToDebt: 3.7516, taxRate: 0.1391 },
  { year: 2024, roe: 0.3080, roa: 0.2224, debtToEquity: 0.0866, debtToAsset: 0.0625, evToRevenue: 6.68, evToEbitda: 17.26, ev: 2340000, cashToDebt: 4.4532, taxRate: 0.1644 },
  { year: 2025, roe: 0.3150, roa: 0.2300, debtToEquity: 0.0820, debtToAsset: 0.0600, evToRevenue: 6.80, evToEbitda: 17.00, ev: 2500000, cashToDebt: 4.8000, taxRate: 0.1650 }, // Projected 2025
];

// NEW/UPDATED MOCK CLOUD COMPETITIVE DATA
const MOCK_CLOUD_MARKET_SHARE_DATA = [
  { name: 'AWS', value: 31, fill: '#FF9900' },
  { name: 'Azure', value: 26, fill: '#0078D4' }, // Updated
  { name: 'Google Cloud', value: 11, fill: '#34A853' },
  { name: 'Other', value: 32, fill: '#B0B0B0' }, // Updated
];
const MOCK_CLOUD_COMPARISON_DATA = [
  { metric: 'Key Strength', aws: 'Market Leader, Mature Ecosystem, Broadest Service Catalog', azure: 'Enterprise Integration (Microsoft 365, Teams), Strong momentum with GenAI workloads', gcp: 'Best-in-class in AI/ML and GenAI (Vertex AI, TPUs), Kubernetes (GKE), Open Source' },
  { metric: 'Common Take', aws: 'The "default" choice, but can be complex and expensive.', azure: 'The "fast-follower" winning large enterprise deals, leveraging existing MS relationships.', gcp: 'The "tech-first" cloud, strong with developers and data scientists.' },
  { metric: 'Strategic Weakness', aws: 'Perceived high cost, complex billing.', azure: 'Less feature-rich in some niche areas vs. AWS.', gcp: 'Smaller market share, less-developed enterprise sales channel.' },
];


const uniqueYears = [...new Set(MOCK_FINANCIAL_DATA.map(item => item.year))].sort((a, b) => b - a);
const SEGMENT_COLORS = { 'Google Services': '#4285F4', 'Google Cloud': '#34A853', 'Other Bets': '#FBBC05', 'Corporate Costs': '#EA4335', 'Corporate': '#EA4335' };
const OPEX_COLORS = { 'Research & Development': '#4285F4', 'Sales & Marketing': '#34A853', 'General & Administrative': '#FBBC05' };
const CLOUD_COLORS = { 'GCP': '#34A853', 'Workspace': '#4285F4' };
const YOUTUBE_COLORS = { 'Ad Revenue': '#4285F4', 'Subscriptions Revenue': '#34A853' }; // NEW: Google Colors
const WAYMO_MILESTONES = { 2021: "Raised $2.5B in funding; 100K+ rides.", 2022: "Began charging for rides in San Francisco.", 2023: "Launched fully driverless rides in SF & Phoenix.", 2024: "Expanded operations to Austin; 2M driverless miles.", 2025: "Projected 10M driverless miles; 50,000 active riders." };

// --- HELPER FUNCTIONS & COMPONENTS ---
const formatLargeNumber = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '$0M'; const valInMillions = value; if (Math.abs(valInMillions) >= 1000) return `$${(valInMillions / 1000).toFixed(1)}B`; return `$${valInMillions.toFixed(0)}M`; };
const formatNumber = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0'; return new Intl.NumberFormat('en-US').format(value); };
const formatPercent = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0.0%'; return `${(value * 100).toFixed(1)}%`; };
const formatRatio = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0.00x'; return `${value.toFixed(2)}x`; };
// NEW: Helper for simple currency formatting
const formatCurrency = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '$0'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); };

const KpiCard = ({ title, value, change, isPositive, isCurrency = true }) => ( <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"> <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3> <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p> {change && ( <p className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}> {isPositive ? '▲' : '▼'} {change} </p> )} </div> );
const ChartWrapper = ({ title, children, height = "h-96" }) => ( <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${height}`}> <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3> <ResponsiveContainer width="100%" height="90%"> {children} </ResponsiveContainer> </div> );
const FilterButton = ({ text, value, activeValue, onClick }) => ( <button onClick={() => onClick(value)} className={` px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeValue === value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'} `} > {text} </button> );
// Custom Tooltip for enhanced charts
const PercentTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-white p-3 border rounded shadow-lg"> <p className="label font-bold text-gray-700">{label}</p> {payload.map(entry => ( <p key={entry.name} style={{ color: entry.color }}> {`${entry.name}: ${formatPercent(entry.value)}`} </p> ))} </div> ); } return null; };
const CurrencyTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-white p-3 border rounded shadow-lg"> <p className="label font-bold text-gray-700">{label}</p> {payload.map(entry => ( <p key={entry.name} style={{ color: entry.color }}> {`${entry.name}: ${formatLargeNumber(entry.value)}`} </p> ))} </div> ); } return null; };

// --- 1. OVERVIEW DASHBOARD COMPONENT ---

// NEW SANKEY CHART COMPONENT
const RevenueToProfitSankey = ({ financialData, year, segmentFilter }) => {
  const sankeyData = useMemo(() => {
    const yearData = financialData.filter(d => d.year === year);
    
    // 1. Calculate totals based on filters
    const filteredData = yearData.filter(d => segmentFilter[d.segment] || (d.segment === 'Corporate Costs' && segmentFilter['Corporate Costs']));
    if (filteredData.length === 0) return { nodes: [], links: [] };
    
    const totals = {
      revenue: 0,
      costOfRevenue: 0,
      tac: 0,
      opex_rd: 0,
      opex_sm: 0,
      opIncome_corporate: 0,
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
        totals.opIncome_corporate += item.operatingIncome;
      }
    });

    const totalOpEx = totals.opex_rd + totals.opex_sm;
    const grossProfit = totals.revenue - totals.costOfRevenue - totals.tac;
    const operatingProfit = grossProfit - totalOpEx + totals.opIncome_corporate; // opIncome_corporate is negative

    // --- FIX: Use numerical indices for Sankey links ---
    const nodeNames = [
      ...Array.from(segmentNodes),
      'Total Revenue', 'Cost of Revenue', 'TAC', 'Gross Profit',
      'R&D', 'S&M', 'Corporate Costs', 'Operating Profit'
    ];
    
    const nodeColors = {
      ...SEGMENT_COLORS,
      'Total Revenue': '#4285F4',
      'Cost of Revenue': '#EA4335',
      'TAC': '#FBBC05',
      'Gross Profit': '#34A853',
      'R&D': '#EA4335',
      'S&M': '#EA4335',
      'Corporate Costs': '#FBBC05',
      'Operating Profit': '#34A853'
    };
    
    const nodes = nodeNames.map(name => ({ name, color: nodeColors[name] || '#B0B0B0' }));
    const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));

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
      { source: nodeMap.get('Gross Profit'), target: nodeMap.get('Corporate Costs'), value: totals.opIncome_corporate * -1 },
    ];
    
    // CRITICAL: Filter out invalid links
    links = links.filter(link => 
      link.value > 0 && 
      link.source !== undefined && 
      link.target !== undefined &&
      !isNaN(link.value)
    );

    return { nodes, links };
    // --- END SANKEY FIX ---

  }, [year, segmentFilter, financialData]);

  if (sankeyData.links.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96 flex items-center justify-center">
        <p className="text-gray-500">Please select at least one segment to display data.</p>
      </div>
    );
  }

  return (
    <ChartWrapper title={`Revenue to Operating Profit Flow (${year})`} height="h-[500px]">
      <Sankey
        width={900}
        height={450}
        data={sankeyData} // Pass the object {nodes, links}
        nodePadding={50}
        margin={{ top: 20, right: 150, bottom: 20, left: 150 }} // Add margin for labels
        link={{ stroke: '#B0B0B0', strokeOpacity: 0.3 }}
        
        // --- FIX: Use a custom node prop that includes text ---
        node={({ x, y, width, height, index, payload, containerWidth }) => {
          if (!sankeyData.nodes[index]) return null; // Add guard for safety
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
        }}
        // --- END NODE FIX ---
      >
        <Tooltip formatter={(value) => formatLargeNumber(value)} />
      </Sankey>
    </ChartWrapper>
  );
};


const OverviewDashboard = ({ financialData, timeSeries, year, onYearChange, years }) => {
  const [segmentFilter, setSegmentFilter] = useState({ 'Google Services': true, 'Google Cloud': true, 'Other Bets': true, 'Corporate Costs': true });
  const toggleSegmentFilter = (segment) => setSegmentFilter(prev => ({ ...prev, [segment]: !prev[segment] }));
  const kpiData = useMemo(() => { const currentYearData = timeSeries.find(d => d.year === year); if (!currentYearData) return { totalRevenue: 0, totalOpIncome: 0, opMargin: 0, revenueGrowth: 0, opIncomeGrowth: 0, freeCashFlow: 0, totalOpEx: 0 }; return { totalRevenue: currentYearData.totalRevenue, totalOpIncome: currentYearData.totalOpIncome, opMargin: currentYearData.opMargin, revenueGrowth: currentYearData.revenueGrowth, opIncomeGrowth: currentYearData.opIncomeGrowth, freeCashFlow: currentYearData.freeCashFlow, totalOpEx: currentYearData.totalOpEx, }; }, [timeSeries, year]);
  const segmentData = useMemo(() => { const yearData = financialData.filter(d => d.year === year); const segmentMap = new Map(); for (const item of yearData) { if (item.segment === 'Corporate Costs') continue; if (!segmentMap.has(item.segment)) segmentMap.set(item.segment, { name: item.segment, revenue: 0, operatingIncome: 0 }); const seg = segmentMap.get(item.segment); seg.revenue += item.revenue; seg.operatingIncome += item.operatingIncome; } return Array.from(segmentMap.values()); }, [financialData, year]);
  const opIncomeSegmentData = useMemo(() => { const yearData = financialData.filter(d => d.year === year); const segmentMap = new Map(); for (const item of yearData) { const segmentName = item.segment; if (!segmentMap.has(segmentName)) segmentMap.set(segmentName, { name: segmentName, operatingIncome: 0 }); segmentMap.get(segmentName).operatingIncome += item.operatingIncome; } return Array.from(segmentMap.values()); }, [financialData, year]);
  const segmentTimeSeries = useMemo(() => { const yearMap = new Map(); financialData.forEach(item => { if (item.segment === 'Corporate Costs') return; if (!yearMap.has(item.year)) yearMap.set(item.year, { year: item.year, 'Google Services': 0, 'Google Cloud': 0, 'Other Bets': 0, }); const yearData = yearMap.get(item.year); if (yearData[item.segment] !== undefined) yearData[item.segment] += item.revenue; }); return Array.from(yearMap.values()).sort((a,b) => a.year - b.year); }, [financialData]);
  
  return ( 
    <div className="space-y-6 animate-fadeIn"> 
      <div className="flex justify-end"> 
        <select value={year} onChange={(e) => onYearChange(parseInt(e.target.value))} className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" > 
          {years.map(y => <option key={y} value={y}>{y} Performance</option>)} 
        </select> 
      </div> 

      {/* --- NEW SANKEY CHART (Star of the Show) --- */}
      <div className="lg:col-span-3">
        <RevenueToProfitSankey financialData={financialData} year={year} segmentFilter={segmentFilter} />
        <div className="flex justify-center space-x-4 mt-4">
          {Object.keys(segmentFilter).filter(s => s !== 'Corporate Costs').map(segment => (
            <label key={segment} className="flex items-center cursor-pointer text-sm">
              <input type="checkbox" checked={segmentFilter[segment]} onChange={() => toggleSegmentFilter(segment)} className="form-checkbox h-4 w-4 rounded" style={{ accentColor: SEGMENT_COLORS[segment] }} />
              <span className="ml-2" style={{ color: SEGMENT_COLORS[segment] }}>{segment}</span>
            </label>
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
      
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-3">
          {/* FIX: Removed "(Time Series)" */}
          <ChartWrapper title="Key Performance Metrics (YoY)">
            <LineChart data={timeSeries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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
          {/* FIX: Removed "(Time Series)" */}
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

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">By Segment ({year})</h2> 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
        <div className="lg:col-span-1">
          <ChartWrapper title={`Revenue by Segment (${year})`}>
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
          <ChartWrapper title={`Operating Income by Segment (${year})`}>
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

// --- 2. GOOGLE SEARCH TAB ---
const GoogleSearchTab = ({ data, year }) => {
  const timeData = useMemo(() => { return data .filter(d => d.item === 'Google Search') .map(d => ({ ...d, tacPercent: (d.tac / d.revenue), grossProfit: d.revenue - d.tac - d.costOfRevenue, grossMargin: (d.revenue - d.tac - d.costOfRevenue) / d.revenue, opMargin: (d.operatingIncome / d.revenue), })); }, [data]);
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {};
  return ( <div className="space-y-6 animate-fadeIn"> <h2 className="text-2xl font-semibold text-gray-900 mb-0">Google Search ({year})</h2> <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> <KpiCard title="Search Revenue" value={formatLargeNumber(currentYearData.revenue)} /> <KpiCard title="Gross Profit" value={formatLargeNumber(currentYearData.grossProfit)} /> <KpiCard title="Gross Margin" value={formatPercent(currentYearData.grossMargin)} isCurrency={false} /> <KpiCard title="TAC as % of Revenue" value={formatPercent(currentYearData.tacPercent)} change="Key Antitrust Metric" isPositive={false} isCurrency={false} /> </div> 
  {/* FIX: Removed "(Time Series)" */}
  <ChartWrapper title="Search Revenue vs. Costs"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#4285F4" strokeWidth={3} /> <Line type="monotone" dataKey="costOfRevenue" name="Cost of Revenue" stroke="#FBBC05" strokeWidth={2} /> <Line type="monotone" dataKey="tac" name="Traffic Acquisition Cost (TAC)" stroke="#EA4335" strokeWidth={2} /> </LineChart> </ChartWrapper> 
  {/* FIX: Removed "(Time Series)" */}
  <ChartWrapper title="Search Gross & Operating Margin"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#4285F4" strokeWidth={3} /> <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#34A853" strokeWidth={2} strokeDasharray="5 5" /> </LineChart> </ChartWrapper> </div> );
};

// --- 3. YOUTUBE TAB ---
const YouTubeTab = ({ data, year }) => {
  const timeData = useMemo(() => { const years = [...new Set(data.map(d => d.year))].sort(); return years.map(y => { const adData = data.find(d => d.year === y && d.item === 'YouTube Ads'); const subData = data.find(d => d.year === y && d.item === 'YouTube Subscriptions'); const adRev = adData ? adData.revenue : 0; const subRev = subData ? subData.revenue : 0; const totalRev = adRev + subRev; const totalOpIncome = (adData ? adData.operatingIncome : 0) + (subData ? subData.operatingIncome : 0); return { year: y, adRevenue: adRev, subRevenue: subRev, totalRevenue: totalRev, opMargin: totalRev > 0 ? totalOpIncome / totalRev : 0, }; }); }, [data]);
  const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {};
  return ( <div className="space-y-6 animate-fadeIn"> <h2 className="text-2xl font-semibold text-gray-900 mb-0">YouTube ({year})</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <KpiCard title="Total YouTube Revenue" value={formatLargeNumber(currentYearData.totalRevenue)} /> <KpiCard title="Ad Revenue" value={formatLargeNumber(currentYearData.adRevenue)} /> <KpiCard title="Subscriptions Revenue" value={formatLargeNumber(currentYearData.subRevenue)} change="High-Growth" isPositive={true} /> </div> 
  {/* FIX: Removed "(Time Series)" */}
  <ChartWrapper title="YouTube Revenue Sources"> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="adRevenue" name="Ad Revenue" stackId="a" fill={YOUTUBE_COLORS['Ad Revenue']} /> <Bar dataKey="subRevenue" name="Subscriptions Revenue" stackId="a" fill={YOUTUBE_COLORS['Subscriptions Revenue']} /> </BarChart> </ChartWrapper> </div> );
};

// --- 4. "BEEFED UP" GOOGLE CLOUD TAB ---
const CloudSummary = ({ timeData, year }) => { const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {}; return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> <KpiCard title="Total Cloud Revenue" value={formatLargeNumber(currentYearData.totalRevenue)} /> <KpiCard title="Cloud Op. Income" value={formatLargeNumber(currentYearData.totalOpIncome)} isPositive={currentYearData.totalOpIncome >= 0} /> <KpiCard title="Cloud Op. Margin" value={formatPercent(currentYearData.opMargin)} isPositive={currentYearData.opMargin >= 0} /> <KpiCard title="Revenue Growth (YoY)" value={formatPercent(currentYearData.revenueGrowth)} isPositive={true} /> </div> 
{/* FIX: Removed "(Time Series)" and adjusted colors */}
<ChartWrapper title="Cloud Revenue & Profitability"> 
  <LineChart data={timeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}> 
    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> 
    <XAxis dataKey="year" stroke="#666" /> 
    <YAxis yAxisId="left" stroke="#4285F4" tickFormatter={formatLargeNumber} /> 
    <YAxis yAxisId="right" orientation="right" stroke={currentYearData.totalOpIncome >= 0 ? '#34A853' : '#EA4335'} tickFormatter={formatLargeNumber} /> 
    <Tooltip content={<CurrencyTooltip />} /> <Legend /> 
    <Line yAxisId="left" type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#4285F4" strokeWidth={3} /> 
    <Line yAxisId="right" type="monotone" dataKey="totalOpIncome" name="Operating Income" stroke={currentYearData.totalOpIncome >= 0 ? '#34A853' : '#EA4335'} strokeWidth={3} /> 
  </LineChart> 
</ChartWrapper> </div> ); };
const CloudGcpVsWorkspace = ({ timeData, year }) => { return ( <div className="space-y-6"> <ChartWrapper title="Cloud Revenue: GCP vs. Workspace"> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="gcpRevenue" name="GCP Revenue" stackId="a" fill={CLOUD_COLORS['GCP']} /> <Bar dataKey="workspaceRevenue" name="Workspace Revenue" stackId="a" fill={CLOUD_COLORS['Workspace']} /> </BarChart> </ChartWrapper> 
{/* FIX: Removed "(Time Series)" */}
<ChartWrapper title="Growth Rates: GCP vs. Workspace"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="gcpGrowth" name="GCP Growth (YoY)" stroke={CLOUD_COLORS['GCP']} strokeWidth={3} /> <Line type="monotone" dataKey="workspaceGrowth" name="Workspace Growth (YoY)" stroke={CLOUD_COLORS['Workspace']} strokeWidth={3} /> </LineChart> </ChartWrapper> </div> ); };
const CloudProfitability = ({ timeData, year }) => { return ( <div className="space-y-6"> 
{/* FIX: Removed "(Time Series)" */}
<ChartWrapper title="Cloud Revenue vs. Cost of Revenue (CoR)"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#34A853" strokeWidth={3} /> <Line type="monotone" dataKey="totalCostOfRevenue" name="Cost of Revenue" stroke="#EA4335" strokeWidth={3} /> </LineChart> </ChartWrapper> 
{/* FIX: Removed "(Time Series)" */}
<ChartWrapper title="Cloud Gross Margin & Operating Margin"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#34A853" strokeWidth={3} /> <Line type="monotone" dataKey="opMargin" name="Operating Margin %" stroke="#4285F4" strokeWidth={3} /> </LineChart> </ChartWrapper> </div> ); };
// NEW Cloud Spend Analysis
const CloudSpendAnalysis = ({ timeData, year }) => { return ( <div className="space-y-6"> <ChartWrapper title="Cloud Operating Expenses (Spending)"> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="totalOpexRD" name="Research & Development" stackId="a" fill={OPEX_COLORS['Research & Development']} /> <Bar dataKey="totalOpexSM" name="Sales & Marketing" stackId="a" fill={OPEX_COLORS['Sales & Marketing']} /> </BarChart> </ChartWrapper> <ChartWrapper title="Cloud Spend as % of Cloud Revenue"> <LineChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="corAsPercentOfRevenue" name="Cost of Revenue %" stroke="#EA4335" strokeWidth={3} /> <Line type="monotone" dataKey="rdAsPercentOfRevenue" name="R&D %" stroke="#4285F4" strokeWidth={2} /> <Line type="monotone" dataKey="smAsPercentOfRevenue" name="S&M %" stroke="#34A853" strokeWidth={2} /> </LineChart> </ChartWrapper> </div> ); };
// NEW Cloud KPIs
const CloudKpis = ({ kpiData, year }) => { const currentYearData = kpiData.find(d => d.year === year) || kpiData[kpiData.length - 1] || {}; return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <KpiCard title="Cloud Backlog" value={formatLargeNumber(currentYearData.backlog)} /> <KpiCard title="Total Customers" value={formatNumber(currentYearData.totalCustomers)} isCurrency={false} /> <KpiCard title="Revenue per Customer" value={formatLargeNumber(currentYearData.revPerCustomer)} /> </div> 
{/* FIX: Removed "(Time Series)" */}
<ChartWrapper title="Cloud Backlog vs. Revenue"> <LineChart data={kpiData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis yAxisId="left" stroke="#34A853" tickFormatter={formatLargeNumber} /> <YAxis yAxisId="right" orientation="right" stroke="#4285F4" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Line yAxisId="left" type="monotone" dataKey="backlog" name="Backlog" stroke="#34A853" strokeWidth={3} /> <Line yAxisId="right" type="monotone" dataKey="revenue" name="Recognized Revenue" stroke="#4285F4" strokeWidth={2} strokeDasharray="5 5" /> </LineChart> </ChartWrapper> </div> ); };

// Main Cloud Tab Component
const GoogleCloudTab = ({ data, kpiData, year }) => {
  const [activeSubTab, setActiveSubTab] = useState('Summary');
  const subTabs = ['Summary', 'GCP vs. Workspace', 'Profitability', 'Cloud Spend Analysis', 'Cloud KPIs']; // NEW TABS
  const timeData = useMemo(() => { const years = [...new Set(data.map(d => d.year))].sort(); let prevYearData = { gcpRevenue: 0, workspaceRevenue: 0, totalRevenue: 0 }; return years.map(y => { const gcpData = data.find(d => d.year === y && d.item === 'GCP'); const workspaceData = data.find(d => d.year === y && d.item === 'Workspace'); const gcpRevenue = gcpData?.revenue || 0; const workspaceRevenue = workspaceData?.revenue || 0; const totalRevenue = gcpRevenue + workspaceRevenue; const totalCostOfRevenue = (gcpData?.costOfRevenue || 0) + (workspaceData?.costOfRevenue || 0); const totalOpIncome = (gcpData?.operatingIncome || 0) + (workspaceData?.operatingIncome || 0); const totalOpexRD = (gcpData?.opex_rd || 0) + (workspaceData?.opex_rd || 0); const totalOpexSM = (gcpData?.opex_sm || 0) + (workspaceData?.opex_sm || 0); const gcpGrowth = prevYearData.gcpRevenue === 0 ? 0 : (gcpRevenue - prevYearData.gcpRevenue) / prevYearData.gcpRevenue; const workspaceGrowth = prevYearData.workspaceRevenue === 0 ? 0 : (workspaceRevenue - prevYearData.workspaceRevenue) / prevYearData.workspaceRevenue; const revenueGrowth = prevYearData.totalRevenue === 0 ? 0 : (totalRevenue - prevYearData.totalRevenue) / prevYearData.totalRevenue; const d = { year: y, gcpRevenue, workspaceRevenue, totalRevenue, totalCostOfRevenue, totalOpIncome, totalOpexRD, totalOpexSM, opMargin: totalRevenue > 0 ? totalOpIncome / totalRevenue : 0, grossMargin: totalRevenue > 0 ? (totalRevenue - totalCostOfRevenue) / totalRevenue : 0, revenueGrowth, gcpGrowth, workspaceGrowth, corAsPercentOfRevenue: totalRevenue > 0 ? totalCostOfRevenue / totalRevenue : 0, rdAsPercentOfRevenue: totalRevenue > 0 ? totalOpexRD / totalRevenue : 0, smAsPercentOfRevenue: totalRevenue > 0 ? totalOpexSM / totalRevenue : 0, }; prevYearData = d; return d; }); }, [data]);
  const kpiTimeData = useMemo(() => { const cloudTimeData = timeData.map(d => ({ year: d.year, revenue: d.totalRevenue })); return kpiData.map(kpi => { const matchingRevenue = cloudTimeData.find(c => c.year === kpi.year); return { ...kpi, ...matchingRevenue }; }); }, [kpiData, timeData]);
  return ( <div className="animate-fadeIn space-y-4"> <h2 className="text-2xl font-semibold text-gray-900 mb-0">Google Cloud</h2> <div className="border-b border-gray-200"> <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs"> {subTabs.map(tab => ( <button key={tab} onClick={() => setActiveSubTab(tab)} className={` flex-shrink-0 py-3 px-5 text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === tab ? 'border-b-2 border-indigo-600 text-indigo-700' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'} `} > {tab} </button> ))} </nav> </div> <div className="pt-4"> {activeSubTab === 'Summary' && <CloudSummary timeData={timeData} year={year} />} {activeSubTab === 'GCP vs. Workspace' && <CloudGcpVsWorkspace timeData={timeData} year={year} />} {activeSubTab === 'Profitability' && <CloudProfitability timeData={timeData} year={year} />} {activeSubTab === 'Cloud Spend Analysis' && <CloudSpendAnalysis timeData={timeData} year={year} />} {activeSubTab === 'Cloud KPIs' && <CloudKpis kpiData={kpiTimeData} year={year} />} </div> </div> );
};

// --- 5. OTHER BETS TAB ---
const OtherBetsTab = ({ data, year }) => { const [filter, setFilter] = useState('Waymo'); const timeData = useMemo(() => { return data .filter(d => d.item === filter) .map(d => ({...d, opLoss: d.operatingIncome * -1 })); }, [data, filter]); const currentYearData = timeData.find(d => d.year === year) || timeData[timeData.length - 1] || {}; return ( <div className="space-y-6 animate-fadeIn"> <div className="flex justify-between items-center"> <h2 className="text-2xl font-semibold text-gray-900 mb-0">Other Bets ({year})</h2> <div className="flex space-x-2"> <FilterButton text="Waymo" value="Waymo" activeValue={filter} onClick={setFilter} /> <FilterButton text="Verily" value="Verily" activeValue={filter} onClick={setFilter} /> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <KpiCard title={`${filter} Operating Loss (Cash Burn)`} value={formatLargeNumber(currentYearData.operatingIncome)} isPositive={false} /> {filter === 'Waymo' && ( <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"> <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{year} Waymo Milestone</h3> <p className="text-xl font-bold text-gray-900 mt-2">{WAYMO_MILESTONES[year]}</p> </div> )} </div> <ChartWrapper title={`${filter} Operating Loss (Cash Burn)`}> <BarChart data={timeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Legend /> <Bar dataKey="opLoss" name="Operating Loss" fill={SEGMENT_COLORS['Other Bets']} /> </BarChart> </ChartWrapper> </div> ); };

// --- 6. EXPENSE & HEADCOUNT TAB ---
const HeadcountExpenseDashboard = ({ financialData, headcountData, timeSeries, year }) => {
  const [opExFilter, setOpExFilter] = useState('Research & Development');
  const opexTimeData = useMemo(() => { const years = [...new Set(financialData.map(d => d.year))].sort(); return years.map(y => { const yearData = financialData.filter(d => d.year === y); const totalRD = yearData.reduce((acc, i) => acc + (i.opex_rd || 0), 0); const totalSM = yearData.reduce((acc, i) => acc + (i.opex_sm || 0), 0); return { year: y, 'Research & Development': totalRD, 'Sales & Marketing': totalSM, }; }); }, [financialData]);
  const filteredOpexData = useMemo(() => { return opexTimeData.map(d => ({ year: d.year, cost: d[opExFilter] })); }, [opexTimeData, opExFilter]);
  const headcountTimeData = useMemo(() => { const years = [...new Set(headcountData.map(d => d.year))].sort(); return years.map(y => { const yearData = headcountData.filter(d => d.year === y); return { year: y, 'Google Services': yearData.find(d => d.segment === 'Google Services')?.headcount || 0, 'Google Cloud': yearData.find(d => d.segment === 'Google Cloud')?.headcount || 0, 'Other Bets': yearData.find(d => d.segment === 'Other Bets')?.headcount || 0, 'Corporate': yearData.find(d => d.segment === 'Corporate')?.headcount || 0, } }); }, [headcountData]);
  const currentYearHeadcount = headcountTimeData.find(d => d.year === year) || headcountTimeData[headcountTimeData.length - 1] || { year: year };
  const totalHeadcount = Object.values(currentYearHeadcount).reduce((acc, val) => (typeof val === 'number' ? acc + val : acc), 0);
  return ( <div className="space-y-6 animate-fadeIn"> <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expense & Headcount ({year})</h2> <KpiCard title="Total Headcount" value={formatNumber(totalHeadcount)} isCurrency={false} /> <div className="flex justify-between items-center mt-6"> <h3 className="text-xl font-semibold text-gray-800">Operating Expenses (OpEx)</h3> <div className="flex space-x-2"> <FilterButton text="Research & Development" value="Research & Development" activeValue={opExFilter} onClick={setOpExFilter} /> <FilterButton text="Sales & Marketing" value="Sales & Marketing" activeValue={opExFilter} onClick={setOpExFilter} /> </div> </div> <ChartWrapper title={`${opExFilter} Expense Trend`}> <BarChart data={filteredOpexData}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatLargeNumber} /> <Tooltip content={<CurrencyTooltip />} /> <Bar dataKey="cost" name={`${opExFilter} Cost`} fill={OPEX_COLORS[opExFilter]} /> </BarChart> </ChartWrapper> <ChartWrapper title="Total OpEx as % of Revenue"> <LineChart data={timeSeries}> <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatPercent} /> <Tooltip content={<PercentTooltip />} /> <Legend /> <Line type="monotone" dataKey="opexAsPercentOfRevenue" name="OpEx as % of Revenue" stroke="#EA4335" strokeWidth={3} /> </LineChart> </ChartWrapper> <h3 className="text-xl font-semibold text-gray-800 mt-6">Headcount by Segment</h3> <ChartWrapper title="Headcount Trend by Segment"> <AreaChart data={headcountTimeData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="year" stroke="#666" /> <YAxis stroke="#666" tickFormatter={formatNumber} /> <Tooltip formatter={formatNumber} /> <Legend /> <Area type="monotone" dataKey="Google Services" stackId="1" stroke={SEGMENT_COLORS['Google Services']} fill={SEGMENT_COLORS['Google Services']} /> <Area type="monotone" dataKey="Google Cloud" stackId="1" stroke={SEGMENT_COLORS['Google Cloud']} fill={SEGMENT_COLORS['Google Cloud']} /> <Area type="monotone" dataKey="Other Bets" stackId="1" stroke={SEGMENT_COLORS['Other Bets']} fill={SEGMENT_COLORS['Other Bets']} /> <Area type="monotone" dataKey="Corporate" stackId="1" stroke={SEGMENT_COLORS['Corporate']} fill={SEGMENT_COLORS['Corporate']} /> </AreaChart> </ChartWrapper> </div> );
};

// --- 7. NEW 3 FINANCIAL STATEMENTS TAB ---
const IncomeStatement = ({ data, year }) => {
  const currentYearData = data.find(d => d.year === year) || {};
  return (
    <div className="space-y-6">
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
      {/* FIX: Removed "(Time Series)" */}
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
    <div className="space-y-6">
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
      {/* FIX: Removed "(Time Series)" */}
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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Consolidated Cash Flow ({year})</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Operating Cash Flow" value={formatLargeNumber(currentYearData.operatingCashFlow)} />
        <KpiCard title="Capital Expenditures (Capex)" value={formatLargeNumber(currentYearData.capex)} isPositive={false} />
        <KpiCard title="Free Cash Flow (FCF)" value={formatLargeNumber(currentYearData.freeCashFlow)} />
      </div>
      {/* FIX: Removed "(Time Series)" */}
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
      {/* FIX: Removed "(Time Series)" */}
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

// NEW: Financial Ratios Sub-Component
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
    <div className="space-y-6">
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

      {/* FIX: Removed "(Time Series)" */}
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

      {/* FIX: Removed "(Time Series)" */}
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


// Main 3 Statements Tab
const ThreeFinancialStatements = ({ financialData, balanceSheetData, cashFlowData, timeSeries, year, ratioData }) => {
  const [activeSubTab, setActiveSubTab] = useState('Income Statement');
  const subTabs = ['Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'Financial Ratios']; // NEW: Added Ratios
  
  const incomeStatementData = useMemo(() => {
    const years = [...new Set(financialData.map(d => d.year))].sort();
    return years.map(y => {
      const yearData = financialData.filter(d => d.year === y);
      const totalRevenue = yearData.reduce((acc, i) => acc + i.revenue, 0);
      const totalCostOfRevenue = yearData.reduce((acc, i) => acc + i.costOfRevenue, 0);
      const totalTac = yearData.reduce((acc, i) => acc + (i.tac || 0), 0);
      const grossProfit = totalRevenue - totalCostOfRevenue - totalTac;
      const totalRD = yearData.reduce((acc, i) => acc + (i.opex_rd || 0), 0);
      const totalSM = yearData.reduce((acc, i) => acc + (i.opex_sm || 0), 0);
      const totalGA = 0; // Not in mock data, assuming 0
      const totalOpEx = totalRD + totalSM + totalGA;
      const totalOpIncome = yearData.reduce((acc, i) => acc + i.operatingIncome, 0);
      return {
        year: y,
        totalRevenue,
        totalCostOfRevenue,
        grossProfit,
        totalRD,
        totalSM,
        totalGA,
        totalOpEx,
        totalOpIncome,
        grossMargin: totalRevenue > 0 ? grossProfit / totalRevenue : 0,
        opMargin: totalRevenue > 0 ? totalOpIncome / totalRevenue : 0,
      };
    });
  }, [financialData]);

  return (
    <div className="animate-fadeIn space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">3 Financial Statements</h2>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {subTabs.map(tab => (
            <button key={tab} onClick={() => setActiveSubTab(tab)} className={` flex-shrink-0 py-3 px-5 text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === tab ? 'border-b-2 border-indigo-600 text-indigo-700' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'} `} > {tab} </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        {activeSubTab === 'Income Statement' && <IncomeStatement data={incomeStatementData} year={year} />}
        {activeSubTab === 'Balance Sheet' && <BalanceSheet data={balanceSheetData} year={year} />}
        {activeSubTab === 'Cash Flow Statement' && <CashFlowStatement data={cashFlowData} timeSeries={timeSeries} year={year} />}
        {activeSubTab === 'Financial Ratios' && <FinancialRatios data={ratioData} year={year} />}
      </div>
    </div>
  );
};

// --- 8. SEGMENT DEEP DIVE (CONTAINER) ---
const SegmentDeepDive = ({ data, kpiData, year }) => {
  const [activeSubTab, setActiveSubTab] = useState('Google Cloud'); // Default to Cloud
  const subTabs = ['Google Cloud', 'Google Search', 'YouTube', 'Other Bets'];
  return (
    <div className="animate-fadeIn space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">Segment Deep Dive</h2>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {subTabs.map(tab => (
            <button key={tab} onClick={() => setActiveSubTab(tab)} className={` flex-shrink-0 py-3 px-5 text-sm font-medium transition-all whitespace-nowrap ${activeSubTab === tab ? 'border-b-2 border-indigo-600 text-indigo-700' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'} `} > {tab} </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        {activeSubTab === 'Google Search' && <GoogleSearchTab data={data} year={year} />}
        {activeSubTab === 'YouTube' && <YouTubeTab data={data} year={year} />}
        {activeSubTab === 'Google Cloud' && <GoogleCloudTab data={data} kpiData={kpiData} year={year} />}
        {activeSubTab === 'Other Bets' && <OtherBetsTab data={data} year={year} />}
      </div>
    </div>
  );
};


// --- 9. SYSTEM ACCESS TAB (REBUILT) ---
const SystemAccessTab = () => {
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const departments = ['All', ...new Set(MOCK_SYSTEM_ACCESS_DATA.map(u => u.department))];
  const statuses = ['All', ...new Set(MOCK_SYSTEM_ACCESS_DATA.map(u => u.status))];

  const filteredUsers = useMemo(() => {
    return MOCK_SYSTEM_ACCESS_DATA.filter(user => {
      const matchesDept = filterDepartment === 'All' || user.department === filterDepartment;
      const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
      return matchesDept && matchesStatus;
    });
  }, [filterDepartment, filterStatus]);

  const kpiData = useMemo(() => {
    const totalUsers = MOCK_SYSTEM_ACCESS_DATA.length;
    const activeUsers = MOCK_SYSTEM_ACCESS_DATA.filter(u => u.status === 'Active').length;
    const totalAnnualCost = MOCK_SYSTEM_ACCESS_DATA
      .filter(u => u.status === 'Active') // Only count active licenses
      .reduce((acc, user) => acc + (user.cost || 0), 0) * 12;
      
    return {
      totalUsers,
      activeUsers,
      activePercent: totalUsers > 0 ? activeUsers / totalUsers : 0,
      totalAnnualCost,
    };
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-0">System Access & License Management</h2>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Users" value={formatNumber(kpiData.totalUsers)} isCurrency={false} />
        <KpiCard title="Active Users" value={`${formatNumber(kpiData.activeUsers)} (${formatPercent(kpiData.activePercent)})`} isCurrency={false} />
        <KpiCard title="Total Annual License Cost" value={formatLargeNumber(kpiData.totalAnnualCost / 1000000)} />
        {/* FIX: Use formatCurrency and handle divide by zero */}
        <KpiCard 
          title="Avg. Cost per Active User" 
          value={formatCurrency(kpiData.totalAnnualCost / (kpiData.activeUsers || 1))} 
          change="/ year"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="dept-filter" className="block text-sm font-medium text-gray-700">Department</label>
          <select
            id="dept-filter"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User List ({filteredUsers.length} matching)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Cost (p/m)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- 10. NEW: COMPETITIVE ANALYSIS TAB ---
const CloudCompetitiveAnalysis = () => {
  return (
    <div className="animate-fadeIn space-y-6">
      {/* FIX: Updated title and date */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cloud Competitive Analysis (Q3 2025)</h2>
      
      <ChartWrapper title="Cloud Infrastructure Market Share" height="h-[450px]">
        <PieChart>
          <Pie
            data={MOCK_CLOUD_MARKET_SHARE_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) => `${entry.name} ${entry.value}%`}
          >
            {MOCK_CLOUD_MARKET_SHARE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ChartWrapper>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {/* FIX: Updated title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Landscape</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWS (Amazon)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azure (Microsoft)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Google Cloud (Alphabet)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_CLOUD_COMPARISON_DATA.map((row) => (
                <tr key={row.metric}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.metric}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.aws}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.azure}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.gcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Segment Deep Dive', '3 Financial Statements', 'Competitive Analysis', 'Expense & Headcount', 'System Access']; // NEW TAB ORDER
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]); // Default to newest year

  // --- TOP-LEVEL ANALYTICS (GLOBAL) ---
  const timeSeriesData = useMemo(() => {
    const years = [...new Set(MOCK_FINANCIAL_DATA.map(d => d.year))].sort();
    const yearlyData = new Map();
    for (const item of MOCK_FINANCIAL_DATA) {
      if (!yearlyData.has(item.year)) yearlyData.set(item.year, { year: item.year, totalRevenue: 0, totalOpIncome: 0, totalOpEx: 0 });
      const yearData = yearlyData.get(item.year);
      yearData.totalRevenue += item.revenue;
      yearData.totalOpIncome += item.operatingIncome;
      yearData.totalOpEx += (item.opex_rd || 0) + (item.opex_sm || 0); // Simplified, G&A is in corporate
    }
    const cashFlowMap = new Map(MOCK_CASH_FLOW_DATA.map(d => [d.year, d]));
    const sortedData = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year);
    let lastYearRevenue = 0; let lastYearOpIncome = 0;
    return sortedData.map(d => {
      const revenueGrowth = lastYearRevenue === 0 ? 0 : (d.totalRevenue - lastYearRevenue) / lastYearRevenue;
      const opIncomeGrowth = lastYearOpIncome === 0 ? 0 : (d.totalOpIncome - lastYearOpIncome) / lastYearOpIncome;
      const opMargin = d.totalRevenue > 0 ? d.totalOpIncome / d.totalRevenue : 0;
      const cfData = cashFlowMap.get(d.year) || { operatingCashFlow: 0, capex: 0 };
      const freeCashFlow = cfData.operatingCashFlow + cfData.capex; // Capex is negative
      lastYearRevenue = d.totalRevenue; lastYearOpIncome = d.totalOpIncome;
      return { ...d, freeCashFlow, 'Revenue Growth': revenueGrowth, 'Operating Margin': opMargin, opexAsPercentOfRevenue: d.totalRevenue > 0 ? d.totalOpEx / d.totalRevenue : 0, revenueGrowth, opIncomeGrowth, opMargin, };
    });
  }, []);

  // Render logic for the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewDashboard financialData={MOCK_FINANCIAL_DATA} timeSeries={timeSeriesData} year={selectedYear} onYearChange={setSelectedYear} years={uniqueYears} />;
      case 'Segment Deep Dive':
        return <SegmentDeepDive data={MOCK_FINANCIAL_DATA} kpiData={MOCK_CLOUD_KPI_DATA} year={selectedYear} />;
      case '3 Financial Statements':
        return <ThreeFinancialStatements 
                  financialData={MOCK_FINANCIAL_DATA} 
                  balanceSheetData={MOCK_BALANCE_SHEET_DATA} 
                  cashFlowData={MOCK_CASH_FLOW_DATA} 
                  timeSeries={timeSeriesData} 
                  year={selectedYear} 
                  ratioData={MOCK_RATIO_DATA} 
                />;
      case 'Competitive Analysis':
        return <CloudCompetitiveAnalysis />;
      case 'Expense & Headcount':
        return <HeadcountExpenseDashboard financialData={MOCK_FINANCIAL_DATA} headcountData={MOCK_HEADCOUNT_DATA} timeSeries={timeSeriesData} year={selectedYear} />;
      case 'System Access':
        return <SystemAccessTab />;
      default:
        return <div>Error: Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl border-t-4 border-indigo-500 overflow-hidden">
        <header className="text-center p-8 pb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Alphabet Inc.</h1>
          <p className="text-lg text-indigo-600 font-medium">Financial Performance Dashboard</p>
        </header>
        <div className="flex flex-col sm:flex-row">
          <nav className="flex-shrink-0 sm:w-60 sm:p-8 sm:pt-0 sm:pr-4 p-4 pb-0 sm:pb-4">
            <div className="flex flex-row sm:flex-col border-b sm:border-b-0 sm:border-r border-gray-200 overflow-x-auto sm:overflow-visible">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={` flex-shrink-0 sm:w-full sm:text-left py-3 px-4 font-medium text-sm sm:text-base transition-all duration-150 whitespace-nowrap focus:outline-none sm:rounded-l-md sm:rounded-r-none ${activeTab === tab ? 'border-b-2 sm:border-b-0 sm:border-l-4 border-indigo-600 text-indigo-700 bg-white sm:bg-indigo-50' : 'border-b-2 sm:border-b-0 sm:border-l-4 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'} `} > {tab} </button>
              ))}
            </div>
          </nav>
          <main className="flex-1 p-4 pt-6 sm:p-8 sm:pt-0 bg-gray-50/50 min-h-[800px]">
            {renderActiveTab()}
          </main>
        </div>
      </div>
      <style>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; } `}</style>
    </div>
  );
};

export default App;

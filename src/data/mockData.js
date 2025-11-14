// All mock data moved from App.jsx to its own file.
// All figures are in *Millions of USD*.
export const MOCK_FINANCIAL_DATA = [
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

export const MOCK_BALANCE_SHEET_DATA = [
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

export const MOCK_CASH_FLOW_DATA = [
  { year: 2021, operatingCashFlow: 91000, capex: -24600, shareRepurchases: -50000 },
  { year: 2022, operatingCashFlow: 92000, capex: -31500, shareRepurchases: -55000 },
  { year: 2023, operatingCashFlow: 101000, capex: -32300, shareRepurchases: -60000 },
  { year: 2024, operatingCashFlow: 110000, capex: -38000, shareRepurchases: -62000 },
  { year: 2025, operatingCashFlow: 120000, capex: -40000, shareRepurchases: -65000 },
];

export const MOCK_CLOUD_KPI_DATA = [
  { year: 2021, backlog: 45000, totalCustomers: 50000, revPerCustomer: 384000 },
  { year: 2022, backlog: 51000, totalCustomers: 65000, revPerCustomer: 404615 },
  { year: 2023, backlog: 60000, totalCustomers: 80000, revPerCustomer: 412500 },
  { year: 2024, backlog: 72000, totalCustomers: 100000, revPerCustomer: 420000 },
  { year: 2025, backlog: 85000, totalCustomers: 125000, revPerCustomer: 424000 },
];

export const MOCK_HEADCOUNT_DATA = [
  { year: 2021, segment: 'Google Services', headcount: 120000 }, { year: 2021, segment: 'Google Cloud', headcount: 25000 }, { year: 2021, segment: 'Other Bets', headcount: 8000 }, { year: 2021, segment: 'Corporate', headcount: 5000 },
  { year: 2022, segment: 'Google Services', headcount: 140000 }, { year: 2022, segment: 'Google Cloud', headcount: 35000 }, { year: 2022, segment: 'Other Bets', headcount: 9000 }, { year: 2022, segment: 'Corporate', headcount: 6000 },
  { year: 2023, segment: 'Google Services', headcount: 138000 }, { year: 2023, segment: 'Google Cloud', headcount: 37000 }, { year: 2023, segment: 'Other Bets', headcount: 8500 }, { year: 2023, segment: 'Corporate', headcount: 5500 },
  { year: 2024, segment: 'Google Services', headcount: 135000 }, { year: 2024, segment: 'Google Cloud', headcount: 40000 }, { year: 2024, segment: 'Other Bets', headcount: 8000 }, { year: 2024, segment: 'Corporate', headcount: 5000 },
  { year: 2025, segment: 'Google Services', headcount: 137000 }, { year: 2025, segment: 'Google Cloud', headcount: 43000 }, { year: 2025, segment: 'Other Bets', headcount: 8200 }, { year: 2025, segment: 'Corporate', headcount: 5100 },
];

export const MOCK_SYSTEM_ACCESS_DATA = [
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

export const MOCK_RATIO_DATA = [
  { year: 2020, roe: 0.1809, roa: 0.1260, debtToEquity: 0.1203, debtToAsset: 0.0838, evToRevenue: 6.54, evToEbitda: 19.28, ev: 1190000, cashToDebt: 2.4325, taxRate: 0.1625 },
  { year: 2021, roe: 0.3022, roa: 0.2116, debtToEquity: 0.1128, debtToAsset: 0.0790, evToRevenue: 7.54, evToEbitda: 18.76, ev: 1940000, cashToDebt: 3.2278, taxRate: 0.1620 },
  { year: 2022, roe: 0.2341, roa: 0.1642, debtToEquity: 0.1159, debtToAsset: 0.0813, evToRevenue: 4.10, evToEbitda: 13.63, ev: 1160000, cashToDebt: 3.0828, taxRate: 0.1592 },
  { year: 2023, roe: 0.2604, roa: 0.1834, debtToEquity: 0.0957, debtToAsset: 0.0674, evToRevenue: 5.75, evToEbitda: 18.04, ev: 1770000, cashToDebt: 3.7516, taxRate: 0.1391 },
  { year: 2024, roe: 0.3080, roa: 0.2224, debtToEquity: 0.0866, debtToAsset: 0.0625, evToRevenue: 6.68, evToEbitda: 17.26, ev: 2340000, cashToDebt: 4.4532, taxRate: 0.1644 },
  { year: 2025, roe: 0.3150, roa: 0.2300, debtToEquity: 0.0820, debtToAsset: 0.0600, evToRevenue: 6.80, evToEbitda: 17.00, ev: 2500000, cashToDebt: 4.8000, taxRate: 0.1650 }, // Projected 2025
];

export const MOCK_CLOUD_MARKET_SHARE_DATA = [
  { name: 'AWS', value: 31, fill: '#FF9900' },
  { name: 'Azure', value: 26, fill: '#0078D4' }, // Updated
  { name: 'Google Cloud', value: 11, fill: '#34A853' },
  { name:S: 'Other', value: 32, fill: '#B0B0B0' }, // Updated
];
export const MOCK_CLOUD_COMPARISON_DATA = [
  { metric: 'Key Strength', aws: 'Market Leader, Mature Ecosystem, Broadest Service Catalog', azure: 'Enterprise Integration (Microsoft 365, Teams), Strong momentum with GenAI workloads', gcp: 'Best-in-class in AI/ML and GenAI (Vertex AI, TPUs), Kubernetes (GKE), Open Source' },
  { metric: 'Common Take', aws: 'The "default" choice, but can be complex and expensive.', azure: 'The "fast-follower" winning large enterprise deals, leveraging existing MS relationships.', gcp: 'The "tech-first" cloud, strong with developers and data scientists.' },
  { metric: 'Strategic Weakness', aws: 'Perceived high cost, complex billing.', azure: 'Less feature-rich in some niche areas vs. AWS.', gcp: 'Smaller market share, less-developed enterprise sales channel.' },
];

// Constants
export const uniqueYears = [...new Set(MOCK_FINANCIAL_DATA.map(item => item.year))].sort((a, b) => b - a);
export const SEGMENT_COLORS = { 'Google Services': '#4285F4', 'Google Cloud': '#34A83', 'Other Bets': '#FBBC05', 'Corporate Costs': '#EA4335', 'Corporate': '#EA4335' };
export const OPEX_COLORS = { 'Research & Development': '#4285F4', 'Sales & Marketing': '#34A853', 'General & Administrative': '#FBBC05' };
export const CLOUD_COLORS = { 'GCP': '#34A853', 'Workspace': '#4285F4' };
export const YOUTUBE_COLORS = { 'Ad Revenue': '#4285F4', 'Subscriptions Revenue': '#34A853' };
export const WAYMO_MILESTONES = { 2021: "Raised $2.5B in funding; 100K+ rides.", 2022: "Began charging for rides in San Francisco.", 2023: "Launched fully driverless rides in SF & Phoenix.", 2024: "Expanded operations to Austin; 2M driverless miles.", 2025: "Projected 10M driverless miles; 50,000 active riders." };

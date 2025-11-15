"use client"; // This is CRITICAL for Next.js to make the page interactive

import React, { useState, useMemo } from 'react';

// --- Import Data ---
// FIX: Using alias paths
import {
  MOCK_SYSTEM_ACCESS_DATA,
} from '@/data/mockData'; 

// --- Import Helpers ---
// FIX: Using alias paths
import {
  formatLargeNumber,
  formatPercent,
  formatNumber,
  formatCurrency,
} from '@/lib/utils'; 

// --- Import UI Components ---
// FIX: Using alias paths
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; 

// FIX: Using alias paths
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'; 

// FIX: Using alias paths
import {
  KpiCard,
} from '@/components/DashboardComponents'; 


// --- MAIN PAGE COMPONENT ---
export default function SystemAccessPage() {
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
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Access & License Management</h1>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Users" value={formatNumber(kpiData.totalUsers)} isCurrency={false} />
        <KpiCard title="Active Users" value={`${formatNumber(kpiData.activeUsers)} (${formatPercent(kpiData.activePercent)})`} isCurrency={false} />
        {/* FIX: Use formatCurrency for the exact dollar amount */}
        <KpiCard title="Total Annual License Cost" value={formatCurrency(kpiData.totalAnnualCost)} />
        {/* FIX: Removed the 'change' prop */}
        <KpiCard 
          title="Avg. Cost per Active User" 
          value={formatCurrency(kpiData.totalAnnualCost / (kpiData.activeUsers || 1))} 
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label htmlFor="dept-filter" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <Select id="dept-filter" value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select id="status-filter" value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User List ({filteredUsers.length} matching)</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>License Cost (p/m)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>${user.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

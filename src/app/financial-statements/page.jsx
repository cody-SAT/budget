"use client"
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FinancialStatementsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>3 Financial Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This page is coming soon. It will contain the deep-dive sub-tabs for:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-700">
            <li>Income Statement</li>
            <li>Balance Sheet</li>
            <li>Cash Flow Statement</li>
            <li>Financial Ratios</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ExpenseHeadcountPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense & Headcount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This page is coming soon. It will contain the deep-dive charts for:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-700">
            <li>Operating Expenses (R&D, S&M, G&A)</li>
            <li>Headcount by Segment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

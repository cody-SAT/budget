"use client"
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SystemAccessPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>System Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This page is coming soon. It will contain:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-700">
            <li>User access and license management table</li>
            <li>License cost KPIs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

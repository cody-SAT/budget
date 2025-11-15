"use client"
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CompetitiveAnalysisPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>Competitive Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This page is coming soon. It will contain:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-700">
            <li>Cloud Market Share (GCP vs. AWS vs. Azure)</li>
            <li>Competitive Landscape Comparison Table</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

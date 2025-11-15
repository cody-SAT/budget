"use client" // All pages with components need this
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SegmentDeepDivePage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>Segment Deep Dive</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This page is coming soon. It will contain the deep-dive sub-tabs for:
          </p>
          <ul className="list-disc pl-6 mt-4 text-gray-700">
            <li>Google Search</li>
            <li>YouTube</li>
            <li>Google Cloud</li>
            <li>Other Bets</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

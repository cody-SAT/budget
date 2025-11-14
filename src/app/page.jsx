"use client"
// This is the new "home page" at the "/" route.
// We'll just redirect to our main Overview dashboard.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/overview');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Redirecting to dashboard...</p>
    </div>
  );
}

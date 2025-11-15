"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils.js' // Using relative path
import {
  LayoutDashboard,
  DatabaseZap,
  Library,
  Cloudy,
  Users,
  Building2,
  Lock,
} from "lucide-react"

// Our old tabs are now navigation links
const navLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/segment-deep-dive", label: "Segment \nDeep Dive", icon: DatabaseZap },
  { href: "/financial-statements", label: "Financial Statements", icon: Library },
  { href: "/competitive-analysis", label: "Competitive Analysis", icon: Cloudy },
  { href: "/expense-headcount", label: "Expense & Headcount", icon: Building2 },
  { href: "/system-access", label: "System Access", icon: Lock },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex-shrink-0 sm:w-60 p-4 sm:p-8 sm:pt-6">
      <div className="flex flex-row sm:flex-col -mx-2 sm:mx-0 space-x-2 sm:space-x-0 sm:space-y-1 overflow-x-auto sm:overflow-visible">
        {navLinks.map((link) => {
          // Check if the current pathname starts with the link's href
          const isActive = pathname ? pathname.startsWith(link.href) : false
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                // FIX: Removed "whitespace-nowrap" to allow text to wrap
                "flex items-center gap-3 flex-shrink-0 sm:w-full sm:text-left py-3 px-4 font-medium text-sm sm:text-base transition-all duration-150 focus:outline-none rounded-md",
                isActive
                  ? 'text-indigo-700 bg-indigo-50' // Active link style
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50' // Inactive link style
              )}
            >
              <link.icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

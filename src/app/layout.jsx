import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

// Load the Inter font with the 'sans' variable
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Alphabet Inc. Financial Dashboard",
  description: "CFO-level strategic analysis dashboard.",
};

/**
 * This is the new Root Layout, which replaces the main "App" component
 * from our old CRA project. It provides the persistent <html>, <body>,
 * and shared layout (Header, Sidebar) for all pages.
 * The "{children}" prop is where Next.js injects the specific page.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
          {/* We're increasing max-width to allow our dashboard to be wider */}
          <div className="w-full max-w-[90rem] bg-white shadow-2xl rounded-xl border-t-4 border-indigo-500 overflow-hidden">
            
            {/* Header Component */}
            <Header />

            {/* Layout Wrapper */}
            <div className="flex flex-col sm:flex-row">
              
              {/* Sidebar Navigation */}
              <Sidebar />
              
              {/* Main Content Area */}
              {/* Next.js will inject the active page (e.g., /overview/page.jsx) here */}
              <main className="flex-1 p-4 pt-6 sm:p-8 sm:pt-6 bg-gray-50/50 min-h-[800px] overflow-x-hidden">
                {children}
              </main>

            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

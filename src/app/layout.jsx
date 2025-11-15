import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils"; // FIX: Relative path
import { Header } from "../components/Header"; // FIX: Relative path
import { Sidebar } from "../components/Sidebar"; // FIX: Relative path

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Alphabet Inc. Financial Dashboard",
  description: "CFO-level strategic analysis dashboard.",
};

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
          <div className="w-full max-w-[90rem] bg-white shadow-2xl rounded-xl border-t-4 border-indigo-500 overflow-hidden">
            <Header />
            <div className="flex flex-col sm:flex-row">
              <Sidebar />
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

import React, { useState } from 'react';

// A helper component for placeholder tab content
const TabContent = ({ tabName }) => (
  <div className="bg-white border border-gray-200 p-8 rounded-lg text-center shadow-inner animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content for {tabName}</h2>
    <p className="text-gray-600">
      This is the placeholder content for {tabName}.
    </p>
  </div>
);

// Helper component for the Summary content
const SummaryContent = () => (
  <section className="space-y-4 animate-fadeIn">
    {/* Core Content Area */}
    <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center shadow-inner">
      <span className="text-indigo-800 font-semibold text-xl">Monthly Overview</span>
      <span className="text-2xl font-bold text-indigo-700">$5,250.00</span>
    </div>

    <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
      <p className="text-gray-600">
        This is your starting point. You can add components here for income, expenses, and savings goals!
      </p>
    </div>
    
    {/* Action Button */}
    <div className="mt-8">
      <button
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.005] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        onClick={() => console.log('Add Transaction clicked')}
      >
        + Add New Transaction
      </button>
    </div>
  </section>
);

// The main component for the Budget application
const App = () => {
  // Add state to track the active tab, default to 'Summary'
  const [activeTab, setActiveTab] = useState('Summary');
  const tabs = ['Summary', 'tab1', 'tab2', 'tab3', 'tab4'];

  return (
    // Main container
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Budget Card Container */}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-8 transition-all duration-300 border-t-4 border-indigo-500">
        
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            Budget
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Personal Finance Tracker
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="mb-8 -mx-8 px-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-shrink-0 py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-all duration-150 whitespace-nowrap
                  focus:outline-none
                  ${activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600' // Active style
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-md' // Inactive style
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
        
        {/* Conditional Content Area */}
        <main>
          {/* Content for Summary Tab */}
          {activeTab === 'Summary' && <SummaryContent />}

          {/* Placeholder Content for other tabs */}
          {activeTab === 'tab1' && <TabContent tabName="Tab 1" />}
          {activeTab === 'tab2' && <TabContent tabName="Tab 2" />}
          {activeTab === 'tab3' && <TabContent tabName="Tab 3" />}
          {activeTab === 'tab4' && <TabContent tabName="Tab 4" />}
        </main>
      </div>
      {/* Basic keyframe for a subtle fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

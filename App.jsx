import React from 'react';

// The main component for the Budget application
const App = () => {
  return (
    // Main container: full screen height, centered content, light background
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Budget Card Container */}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-8 transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-indigo-500">
        
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            Budget
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Personal Finance Tracker
          </p>
        </header>
        
        {/* Core Content Area - Placeholder */}
        <section className="mt-8 space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center shadow-inner">
            <span className="text-indigo-800 font-semibold text-xl">Monthly Overview</span>
            <span className="text-2xl font-bold text-indigo-700">$5,250.00</span>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
            <p className="text-gray-600">
              This is your starting point. You can add components here for income, expenses, and savings goals!
            </p>
          </div>
        </section>
        
        {/* Action Button Placeholder */}
        <div className="mt-8">
          <button
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.005] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={() => console.log('Add Transaction clicked')}
          >
            + Add New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

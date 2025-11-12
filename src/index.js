import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import the component you created

// Find the root element in index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  // Create a React root and render the App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Failed to find the root element in the document.");
}

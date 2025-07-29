import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Header = () => {
  const { darkMode, toggleDarkMode, exportTransactions, exportData, setExportData } = useContext(GlobalContext);

  // Download export data
  const handleDownload = () => {
    if (!exportData) return;
    const blob = new Blob([exportData.data], { type: exportData.type === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.type === 'csv' ? 'transactions.csv' : 'transactions.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportData(null);
  };

  return (
    <div className="header-bar">
      <h2>Expense Tracker</h2>
      <div className="header-actions">
        <button className="toggle-dark" onClick={toggleDarkMode}>
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button className="export-btn" onClick={() => exportTransactions('csv')}>Export CSV</button>
        <button className="export-btn" onClick={() => exportTransactions('json')}>Export JSON</button>
        {exportData && <button className="download-btn" onClick={handleDownload}>Download</button>}
      </div>
    </div>
  );
}

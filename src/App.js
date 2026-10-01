import React, { useContext, useEffect } from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { BudgetAlerts } from './components/BudgetAlerts';
import { BudgetSettings } from './components/BudgetSettings';
import { GlobalProvider, GlobalContext } from './context/GlobalState';

import './App.css';

function AppContent() {
  const { darkMode } = useContext(GlobalContext);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <>
      <Header />
      <div className="container">
        <BudgetAlerts />
        <Balance />
        <IncomeExpenses />
        <TransactionList />
        <AddTransaction />
        <BudgetSettings />
      </div>
    </>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;

import React, { createContext, useReducer, useEffect, useState } from 'react';
import AppReducer from './AppReducer';

// Initial state
const getInitialTransactions = () => {
  const localData = localStorage.getItem('transactions');
  return localData ? JSON.parse(localData) : [];
};

const initialState = {
  transactions: getInitialTransactions(),
  darkMode: false,
  filter: 'all', // all, income, expense
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [exportData, setExportData] = useState(null);

  // Persist transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  // Actions
  function deleteTransaction(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  function addTransaction(transaction) {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }

  function toggleDarkMode() {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }

  function setFilter(filter) {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }

  function exportTransactions(type) {
    if (type === 'csv') {
      const csv = [
        ['Description', 'Amount', 'Date'],
        ...state.transactions.map(t => [t.text, t.amount, t.date])
      ].map(e => e.join(",")).join("\n");
      setExportData({ type: 'csv', data: csv });
    } else {
      setExportData({ type: 'json', data: JSON.stringify(state.transactions, null, 2) });
    }
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      darkMode: state.darkMode,
      filter: state.filter,
      deleteTransaction,
      addTransaction,
      toggleDarkMode,
      setFilter,
      exportTransactions,
      exportData,
      setExportData
    }}>
      {children}
    </GlobalContext.Provider>
  );
}
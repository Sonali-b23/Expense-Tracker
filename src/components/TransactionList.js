import React, { useContext } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, filter, setFilter } = useContext(GlobalContext);

  const filtered =
    filter === 'income'
      ? transactions.filter(t => t.amount > 0)
      : filter === 'expense'
      ? transactions.filter(t => t.amount < 0)
      : transactions;

  return (
    <>
      <h3>History</h3>
      <div className="filter-bar">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'income' ? 'active' : ''} onClick={() => setFilter('income')}>Income</button>
        <button className={filter === 'expense' ? 'active' : ''} onClick={() => setFilter('expense')}>Expense</button>
      </div>
      <ul className="list">
        {filtered.length === 0 ? (
          <li className="empty">No transactions</li>
        ) : (
          filtered.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))
        )}
      </ul>
    </>
  );
}

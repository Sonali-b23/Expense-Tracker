import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { CATEGORIES, getMonthKey, getSpentByCategory, getBudgetStatus } from '../utils/budget';

export const BudgetAlerts = () => {
  const { transactions, categoryBudgets } = useContext(GlobalContext);

  const spent = getSpentByCategory(transactions, getMonthKey());

  const alerts = CATEGORIES.map(category => ({
    category,
    limit: categoryBudgets[category],
    status: getBudgetStatus(spent[category] || 0, categoryBudgets[category])
  })).filter(a => a.status.level === 'warning' || a.status.level === 'exceeded');

  if (alerts.length === 0) return null;

  return (
    <div className="budget-alerts">
      {alerts.map(({ category, limit, status }) => (
        <div key={category} className={`budget-alert ${status.level}`} role="alert">
          {status.level === 'exceeded'
            ? `${category}: over budget (${status.displayPercent}% of $ ${limit.toFixed(2)})`
            : `${category}: ${status.displayPercent}% of $ ${limit.toFixed(2)} budget used`}
        </div>
      ))}
    </div>
  );
};

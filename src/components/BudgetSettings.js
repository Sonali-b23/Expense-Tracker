import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { CATEGORIES, getMonthKey, getSpentByCategory, getBudgetStatus } from '../utils/budget';

export const BudgetSettings = () => {
  const { transactions, categoryBudgets, setCategoryBudget } = useContext(GlobalContext);
  // Raw text while a field is being edited, so partial input like "0." is not discarded
  const [drafts, setDrafts] = useState({});

  const spent = getSpentByCategory(transactions, getMonthKey());

  const handleChange = (category, value) => {
    setDrafts({ ...drafts, [category]: value });
    setCategoryBudget(category, value);
  };

  const handleBlur = category => {
    const { [category]: _removed, ...rest } = drafts;
    setDrafts(rest);
  };

  return (
    <>
      <h3>Monthly budgets</h3>
      <div className="budget-settings">
        {CATEGORIES.map(category => {
          const limit = categoryBudgets[category];
          const spentAmount = spent[category] || 0;
          const status = getBudgetStatus(spentAmount, limit);
          const value = category in drafts ? drafts[category] : limit === undefined ? '' : limit;
          return (
            <div key={category} className="budget-row">
              <label htmlFor={`budget-${category}`}>{category}</label>
              <input
                id={`budget-${category}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="No limit"
                value={value}
                onChange={e => handleChange(category, e.target.value)}
                onBlur={() => handleBlur(category)}
              />
              <span className={`budget-summary ${status.level}`}>
                {limit === undefined
                  ? `$ ${spentAmount.toFixed(2)} spent`
                  : `$ ${spentAmount.toFixed(2)} / $ ${limit.toFixed(2)} (${status.displayPercent}%)`}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

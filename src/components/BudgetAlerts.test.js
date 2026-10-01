import React from 'react';
import { render } from '@testing-library/react';
import { GlobalContext } from '../context/GlobalState';
import { BudgetAlerts } from './BudgetAlerts';
import { getMonthKey } from '../utils/budget';

const month = getMonthKey();
const expense = (amount, category = 'Food', date = `${month}-01`) => ({
  id: Math.random(),
  text: 't',
  amount: -amount,
  category,
  date
});

const renderAlerts = (transactions, categoryBudgets) =>
  render(
    <GlobalContext.Provider value={{ transactions, categoryBudgets }}>
      <BudgetAlerts />
    </GlobalContext.Provider>
  );

test('no banner below 80%', () => {
  const { queryAllByRole } = renderAlerts([expense(79)], { Food: 100 });
  expect(queryAllByRole('alert')).toHaveLength(0);
});

test('warning banner at exactly 80%', () => {
  const { getByRole } = renderAlerts([expense(80)], { Food: 100 });
  const alert = getByRole('alert');
  expect(alert.className).toContain('warning');
  expect(alert.textContent).toContain('Food: 80% of $ 100.00');
});

test('warning banner at 99.6% never shows 100%', () => {
  const { getByRole } = renderAlerts([expense(99.6)], { Food: 100 });
  expect(getByRole('alert').textContent).toContain('99%');
});

test('exceeded banner at exactly 100%', () => {
  const { getByRole } = renderAlerts([expense(100)], { Food: 100 });
  expect(getByRole('alert').className).toContain('exceeded');
});

test('exceeded banner beyond 100%', () => {
  const { getByRole } = renderAlerts([expense(125)], { Bills: 100, Food: 100 });
  expect(getByRole('alert').textContent).toContain('125%');
});

test('no banner when budget is zero', () => {
  const { queryAllByRole } = renderAlerts([expense(500)], { Food: 0 });
  expect(queryAllByRole('alert')).toHaveLength(0);
});

test('no banner when budget is unset', () => {
  const { queryAllByRole } = renderAlerts([expense(500)], {});
  expect(queryAllByRole('alert')).toHaveLength(0);
});

test('income and other-month expenses are ignored', () => {
  const income = { ...expense(500), amount: 500 };
  const { queryAllByRole } = renderAlerts(
    [income, expense(500, 'Food', '2000-01-15')],
    { Food: 100 }
  );
  expect(queryAllByRole('alert')).toHaveLength(0);
});

test('legacy transactions without category count toward Other', () => {
  const legacy = { id: 1, text: 'x', amount: -90, date: `${month}-02` };
  const { getByRole } = renderAlerts([legacy], { Other: 100 });
  expect(getByRole('alert').textContent).toContain('Other');
});

import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const addExpense = (utils, amount) => {
  fireEvent.change(utils.getByPlaceholderText('Enter description...'), { target: { value: 'x' } });
  fireEvent.change(utils.getByPlaceholderText('Enter amount...'), { target: { value: String(-amount) } });
  fireEvent.change(utils.getByLabelText('Category'), { target: { value: 'Food' } });
  fireEvent.click(utils.getByText('Add transaction'));
};

test('budget flow: thresholds alert, persist across reload, clear removes alert', () => {
  const first = render(<App />);
  fireEvent.change(first.getByLabelText('Food'), { target: { value: '100' } });

  addExpense(first, 79);
  expect(first.queryAllByRole('alert')).toHaveLength(0);

  addExpense(first, 1);
  expect(first.getByRole('alert').className).toContain('warning');

  addExpense(first, 20);
  expect(first.getByRole('alert').className).toContain('exceeded');

  first.unmount();
  expect(JSON.parse(localStorage.getItem('categoryBudgets'))).toEqual({ Food: 100 });

  const second = render(<App />);
  expect(second.getByLabelText('Food').value).toBe('100');
  addExpense(second, 150);
  expect(second.getByRole('alert').className).toContain('exceeded');

  fireEvent.change(second.getByLabelText('Food'), { target: { value: '' } });
  expect(second.queryAllByRole('alert')).toHaveLength(0);
  expect(JSON.parse(localStorage.getItem('categoryBudgets'))).toEqual({});
});

test('corrupt stored budgets do not crash the app', () => {
  localStorage.setItem('categoryBudgets', '{broken');
  const { getByText } = render(<App />);
  expect(getByText('Monthly budgets')).toBeTruthy();
});

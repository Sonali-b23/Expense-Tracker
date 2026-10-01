import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { GlobalContext } from '../context/GlobalState';
import { AddTransaction } from './AddTransaction';

const setup = () => {
  const addTransaction = jest.fn();
  const utils = render(
    <GlobalContext.Provider value={{ addTransaction }}>
      <AddTransaction />
    </GlobalContext.Provider>
  );
  return { addTransaction, ...utils };
};

test('submits the selected category', () => {
  const { addTransaction, getByPlaceholderText, getByLabelText, getByText } = setup();
  fireEvent.change(getByPlaceholderText('Enter description...'), { target: { value: 'Lunch' } });
  fireEvent.change(getByPlaceholderText('Enter amount...'), { target: { value: '-12' } });
  fireEvent.change(getByLabelText('Category'), { target: { value: 'Food' } });
  fireEvent.click(getByText('Add transaction'));
  expect(addTransaction).toHaveBeenCalledWith(
    expect.objectContaining({ text: 'Lunch', amount: -12, category: 'Food' })
  );
});

test('defaults to Other and resets after submit', () => {
  const { addTransaction, getByPlaceholderText, getByLabelText, getByText } = setup();
  const select = getByLabelText('Category');
  expect(select.value).toBe('Other');
  fireEvent.change(getByPlaceholderText('Enter description...'), { target: { value: 'x' } });
  fireEvent.change(getByPlaceholderText('Enter amount...'), { target: { value: '-1' } });
  fireEvent.change(select, { target: { value: 'Bills' } });
  fireEvent.click(getByText('Add transaction'));
  expect(select.value).toBe('Other');
  expect(addTransaction).toHaveBeenCalledTimes(1);
});

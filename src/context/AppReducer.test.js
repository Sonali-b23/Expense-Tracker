import AppReducer from './AppReducer';

const base = {
  transactions: [],
  darkMode: false,
  filter: 'all',
  categoryBudgets: { Food: 100 }
};

const set = (state, category, limit) =>
  AppReducer(state, { type: 'SET_CATEGORY_BUDGET', payload: { category, limit } });

describe('SET_CATEGORY_BUDGET', () => {
  test('sets a new budget', () => {
    expect(set(base, 'Bills', '250.5').categoryBudgets).toEqual({ Food: 100, Bills: 250.5 });
  });

  test('overwrites an existing budget', () => {
    expect(set(base, 'Food', 300).categoryBudgets).toEqual({ Food: 300 });
  });

  test.each(['', '0', 0, -5, 'abc', undefined])('limit %p clears the budget', limit => {
    expect(set(base, 'Food', limit).categoryBudgets).toEqual({});
  });

  test('does not mutate state or touch other fields', () => {
    const next = set(base, 'Bills', 10);
    expect(base.categoryBudgets).toEqual({ Food: 100 });
    expect(next.transactions).toBe(base.transactions);
    expect(next.darkMode).toBe(false);
    expect(next.filter).toBe('all');
  });
});

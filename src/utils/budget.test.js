import {
  CATEGORIES,
  getMonthKey,
  getSpentByCategory,
  getBudgetStatus,
  parseStoredBudgets
} from './budget';

describe('getBudgetStatus', () => {
  test.each([0, undefined, null, NaN, -50, '100'])('limit %p means no budget', limit => {
    expect(getBudgetStatus(50, limit)).toEqual({ percent: 0, displayPercent: 0, level: 'none' });
  });

  test('zero spent against a valid budget is ok at 0%', () => {
    expect(getBudgetStatus(0, 100)).toEqual({ percent: 0, displayPercent: 0, level: 'ok' });
  });

  test('invalid or negative spent is treated as 0', () => {
    expect(getBudgetStatus(NaN, 100).level).toBe('ok');
    expect(getBudgetStatus(-20, 100).percent).toBe(0);
  });

  test('just under 80% is ok', () => {
    expect(getBudgetStatus(79.99, 100).level).toBe('ok');
  });

  test('exactly 80% is a warning', () => {
    expect(getBudgetStatus(80, 100)).toMatchObject({ level: 'warning', displayPercent: 80 });
    expect(getBudgetStatus(240, 300).level).toBe('warning');
  });

  test('99.6% is a warning and displays 99, not 100', () => {
    const status = getBudgetStatus(99.6, 100);
    expect(status.level).toBe('warning');
    expect(status.displayPercent).toBe(99);
  });

  test('exactly 100% is exceeded', () => {
    expect(getBudgetStatus(100, 100)).toMatchObject({ level: 'exceeded', displayPercent: 100 });
  });

  test('floating point sums do not flip the level', () => {
    expect(getBudgetStatus(0.1 + 0.2, 0.3).level).toBe('exceeded');
    expect(getBudgetStatus(0.1 + 0.7, 1).level).toBe('warning');
  });

  test('rounding of over-budget percentages', () => {
    expect(getBudgetStatus(100.4, 100).displayPercent).toBe(100);
    expect(getBudgetStatus(112.5, 100).displayPercent).toBe(113);
    expect(getBudgetStatus(150, 100)).toMatchObject({ level: 'exceeded', displayPercent: 150 });
  });

  test('tiny budgets do not produce NaN or Infinity', () => {
    const status = getBudgetStatus(5, 0.001);
    expect(Number.isFinite(status.percent)).toBe(true);
    expect(status.level).toBe('exceeded');
  });
});

describe('getMonthKey', () => {
  test('uses local date parts and zero pads', () => {
    expect(getMonthKey(new Date(2026, 0, 31))).toBe('2026-01');
    expect(getMonthKey(new Date(2026, 9, 1))).toBe('2026-10');
  });
});

describe('getSpentByCategory', () => {
  const txs = [
    { amount: -30, date: '2026-10-01', category: 'Food' },
    { amount: -20.5, date: '2026-10-15', category: 'Food' },
    { amount: -10, date: '2026-09-30', category: 'Food' },
    { amount: 500, date: '2026-10-02', category: 'Food' },
    { amount: -15, date: '2026-10-03' },
    { amount: -5, date: '2026-10-03', category: 'Mystery' },
    { amount: -7, date: '2026-10-04', category: 'Bills' }
  ];

  test('sums only current-month expenses per category', () => {
    expect(getSpentByCategory(txs, '2026-10')).toEqual({
      Food: 50.5,
      Other: 20,
      Bills: 7
    });
  });

  test('month boundary strings are matched exactly', () => {
    expect(getSpentByCategory(txs, '2026-09')).toEqual({ Food: 10 });
  });

  test('ignores invalid amounts and dates', () => {
    expect(
      getSpentByCategory([{ amount: NaN, date: '2026-10-01' }, { amount: -1 }], '2026-10')
    ).toEqual({});
  });
});

describe('parseStoredBudgets', () => {
  test('returns empty for missing, invalid or non-object data', () => {
    expect(parseStoredBudgets(null)).toEqual({});
    expect(parseStoredBudgets('{oops')).toEqual({});
    expect(parseStoredBudgets('[1,2]')).toEqual({});
    expect(parseStoredBudgets('42')).toEqual({});
  });

  test('keeps valid positive values and drops the rest', () => {
    const raw = JSON.stringify({
      Food: 200,
      Bills: '150.5',
      Health: -5,
      Transport: 0,
      Shopping: 'abc',
      Unknown: 99
    });
    expect(parseStoredBudgets(raw)).toEqual({ Food: 200, Bills: 150.5 });
  });

  test('only known categories are ever returned', () => {
    Object.keys(parseStoredBudgets(JSON.stringify({ Food: 1, X: 2 }))).forEach(key => {
      expect(CATEGORIES).toContain(key);
    });
  });
});

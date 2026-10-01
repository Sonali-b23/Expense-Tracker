export const CATEGORIES = [
  'Food',
  'Entertainment',
  'Bills',
  'Transport',
  'Shopping',
  'Health',
  'Other'
];

export const DEFAULT_CATEGORY = 'Other';

const toCents = n => Math.round(n * 100);

// 'YYYY-MM' in local time
export function getMonthKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

// Sum of expenses (absolute value) per category for the given 'YYYY-MM'.
// Income is ignored; missing/unknown categories count as 'Other'.
export function getSpentByCategory(transactions, monthKey) {
  const spent = {};
  transactions.forEach(t => {
    if (!Number.isFinite(t.amount) || t.amount >= 0) return;
    if (typeof t.date !== 'string' || t.date.slice(0, 7) !== monthKey) return;
    const category = CATEGORIES.includes(t.category) ? t.category : DEFAULT_CATEGORY;
    spent[category] = (spent[category] || 0) + Math.abs(t.amount);
  });
  return spent;
}

// level: 'none' | 'ok' | 'warning' (>= 80%) | 'exceeded' (>= 100%).
// Levels are decided in integer cents on the unrounded ratio; displayPercent
// never reads 100 while the budget is not yet exceeded.
export function getBudgetStatus(spent, limit) {
  if (!Number.isFinite(limit) || limit <= 0) {
    return { percent: 0, displayPercent: 0, level: 'none' };
  }
  const safeSpent = Number.isFinite(spent) && spent > 0 ? spent : 0;
  const spentCents = toCents(safeSpent);
  const limitCents = Math.max(toCents(limit), 1);

  const percent = (spentCents / limitCents) * 100;
  let level = 'ok';
  if (spentCents >= limitCents) level = 'exceeded';
  else if (spentCents * 100 >= limitCents * 80) level = 'warning';

  const rounded = Math.round(percent);
  const displayPercent = level === 'exceeded' ? Math.max(rounded, 100) : Math.min(rounded, 99);
  return { percent, displayPercent, level };
}

// Parse the raw localStorage value into a safe { category: positiveNumber } map.
export function parseStoredBudgets(raw) {
  if (!raw) return {};
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return {};
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const budgets = {};
  CATEGORIES.forEach(category => {
    const value = Number(parsed[category]);
    if (Number.isFinite(value) && value > 0) budgets[category] = value;
  });
  return budgets;
}

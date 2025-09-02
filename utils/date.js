// date.js
// Date helpers for adding days, week start, and formatting

// Adds a number of days to a date
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Gets Monday as the start of the week
export const startOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
};

// Format date as "YYYY-MM-DD"
export const toDateStr = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Formats a YYYY-MM-DD string to friendly text
export function formatFriendlyDate(dateStr) {
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  const input = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = todayOnly - input;
  const daysAgo = diff / (1000 * 60 * 60 * 24);
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return input.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDateEU(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (y && m && d) return `${d}-${m}-${y}`;
  return dateStr;
}
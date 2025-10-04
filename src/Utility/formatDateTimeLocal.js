// ✅ Helper function to format Date -> 'YYYY-MM-DDTHH:mm'
export const formatDateTimeLocal = (date) => {
  const d = new Date(date);
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

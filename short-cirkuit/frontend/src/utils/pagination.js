export const parsePage = (value, fallback = 1) => {
  const page = Number(value);
  if (!Number.isFinite(page)) return fallback;
  return Math.max(1, Math.trunc(page));
};

export const clampPage = (value, maxPage = Number.POSITIVE_INFINITY) =>
  Math.min(Math.max(1, parsePage(value, 1)), Math.max(1, Number(maxPage) || 1));

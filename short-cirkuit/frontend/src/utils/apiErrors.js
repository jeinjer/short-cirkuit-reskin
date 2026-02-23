export const getApiErrorList = (error, fallback = 'Error en el servidor') => {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors)) {
    const filtered = data.errors.filter(Boolean);
    if (filtered.length) return filtered;
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return [data.error.trim()];
  }

  return [fallback];
};

export const getApiErrorMessage = (error, fallback = 'Ocurrio un error') =>
  getApiErrorList(error, fallback)[0];

const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export const formatArs = (value) => arsFormatter.format(Number(value) || 0);

export const formatUsd = (value) => usdFormatter.format(Number(value) || 0);

export const formatDateTimeAr = (value) =>
  new Date(value).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires'
  });

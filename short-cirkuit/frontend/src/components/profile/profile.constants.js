export const PROFILE_TABS = {
  ACCOUNT: 'ACCOUNT',
  ORDERS: 'ORDERS',
  INQUIRIES: 'INQUIRIES'
};

export const PROFILE_TAB_QUERY = {
  ACCOUNT: 'cuenta',
  ORDERS: 'pedidos',
  INQUIRIES: 'consultas'
};

export const PROFILE_QUERY_TAB = {
  cuenta: PROFILE_TABS.ACCOUNT,
  pedidos: PROFILE_TABS.ORDERS,
  consultas: PROFILE_TABS.INQUIRIES
};

export const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/thumbs/svg?seed=HappySun',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=SleepyMoon',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=WinkWave',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=CoolStar',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=CherryPop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=MintDrop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=BlueBloop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=PixelBean'
];

export const orderStatusLabel = {
  PENDING_PAYMENT: 'Pendiente',
  PENDING_PICKUP: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

export const inquiryStatusLabel = {
  PENDING: 'Pendiente',
  REPLIED: 'Respondida'
};

export const orderStatusStyles = {
  PENDING_PAYMENT: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  PENDING_PICKUP: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  CONFIRMED: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  CANCELLED: 'border-red-500/40 text-red-300 bg-red-500/10'
};

export const inquiryStatusStyles = {
  PENDING: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  REPLIED: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
};

export const isPendingOrder = (status) =>
  status === 'PENDING_PAYMENT' || status === 'PENDING_PICKUP';

export const getOrderExchangeRate = (order) => {
  const explicitRate = Number(order?.exchangeRate);
  if (explicitRate > 0) return explicitRate;

  const totalUsd = Number(order?.subtotalUsd);
  const totalArs = Number(order?.subtotalArs);
  if (totalUsd > 0 && totalArs > 0) return totalArs / totalUsd;

  return 0;
};

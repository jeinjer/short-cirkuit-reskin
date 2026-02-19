export const isAdminRole = (user) => user?.role === 'ADMIN';

export const getVisiblePriceUsd = (product, isAdmin) => {
  if (!isAdmin) return Number(product?.priceUsd) || 0;

  const costUsd = Number(product?.costPrice);
  if (Number.isFinite(costUsd) && costUsd > 0) return costUsd;

  return Number(product?.priceUsd) || 0;
};

export const getVisiblePriceArs = (product, isAdmin, explicitRate) => {
  if (!isAdmin) return Number(product?.price) || 0;

  const costUsd = Number(product?.costPrice);
  if (!Number.isFinite(costUsd) || costUsd <= 0) {
    return Number(product?.price) || 0;
  }

  if (Number.isFinite(explicitRate) && explicitRate > 0) {
    return Math.ceil(costUsd * explicitRate);
  }

  const saleArs = Number(product?.price);
  const saleUsd = Number(product?.priceUsd);
  if (Number.isFinite(saleArs) && saleArs > 0 && Number.isFinite(saleUsd) && saleUsd > 0) {
    return Math.ceil(costUsd * (saleArs / saleUsd));
  }

  return saleArs || 0;
};

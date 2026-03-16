import { Category } from '@prisma/client';

const CATEGORY_ALIASES: Record<string, Category> = {
  PC_ARMADAS: 'COMPUTADORAS',
  PCARMADAS: 'COMPUTADORAS',
};

export function normalizeCategoryParam(rawCategory?: string | null): Category | null {
  if (!rawCategory) return null;

  const normalized = rawCategory.trim().toUpperCase().replace(/\s+/g, '_');
  const mapped = CATEGORY_ALIASES[normalized] ?? normalized;

  return Object.values(Category).includes(mapped as Category) ? (mapped as Category) : null;
}

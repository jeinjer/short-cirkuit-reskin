import { Router } from 'express';
import { Category, PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;

  try {
    const whereBase: any = {};
  
    if (category) {
       const catUpper = (category as string).toUpperCase();
       if (Object.keys(Category).includes(catUpper)) {
         whereBase.category = catUpper as Category; 
       }
    } else {
       whereBase.category = { in: ['NOTEBOOKS', 'COMPUTADORAS', 'MONITORES', 'IMPRESORAS'] };
    }

    if (search) {
       const searchStr = (search as string).trim();
       whereBase.OR = [
         { name: { contains: searchStr, mode: 'insensitive' } },
         { brand: { contains: searchStr, mode: 'insensitive' } },
       ];
    }

    const whereBrands = { ...whereBase };
    
    if (minPrice || maxPrice) {
        whereBrands.priceUsd = {};
        
        if (minPrice) {
            const parsedMin = parseFloat(minPrice as string);
            if (!isNaN(parsedMin)) whereBrands.priceUsd.gte = parsedMin;
        }
        
        if (maxPrice) {
            const parsedMax = parseFloat(maxPrice as string);
            if (!isNaN(parsedMax)) whereBrands.priceUsd.lte = parsedMax;
        }

        if (Object.keys(whereBrands.priceUsd).length === 0) {
            delete whereBrands.priceUsd;
        }
    }

    const productsBrands = await prisma.product.findMany({
        where: whereBrands,
        select: { brand: true }
    });

    const brandCounts: Record<string, number> = {};
    
    productsBrands.forEach(p => {
        if (p.brand) {
            const b = p.brand.trim().toUpperCase(); 
            brandCounts[b] = (brandCounts[b] || 0) + 1;
        }
    });

    const brands = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    res.json({
        brands,
        specs: { cpu: [], ram: [], printType: [] }
    });

  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({ error: 'Error calculating filters' });
  }
});

export default router;
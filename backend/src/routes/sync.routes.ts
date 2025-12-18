import { Router } from 'express';
import { syncCatalogFromVendor } from '../jobs/syncCatalog'; 

export const router = Router();

router.post('/sync-catalog', async (req, res) => {
  const token = req.headers['x-sync-token'];
  if (token !== process.env.SYNC_TOKEN) {
     return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await syncCatalogFromVendor();
    
    if (!result.success) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result); 

  } catch (error) {
    console.error('Error crítico en endpoint sync:', error);
    return res.status(500).json({ 
        success: false, 
        error: 'Error interno no controlado en el servidor' 
    });
  }
});

export default router;
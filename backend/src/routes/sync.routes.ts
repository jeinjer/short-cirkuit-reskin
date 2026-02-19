import { Router } from 'express';
import { syncCatalogFromVendor } from '../jobs/syncCatalog';

export const router = Router();

const runSyncCatalog = async (req: any, res: any) => {
  const expectedToken = process.env.SYNC_TOKEN || process.env.CRON_SECRET;
  if (!expectedToken) {
    return res.status(500).json({ error: 'SYNC_TOKEN/CRON_SECRET no configurado' });
  }

  const headerToken = String(req.headers['x-sync-token'] || '').trim();
  const queryToken = String(req.query.token || '').trim();
  const authorizationHeader = String(req.headers.authorization || '').trim();
  const bearerToken = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length).trim()
    : '';
  const cronHeader = String(req.headers['x-vercel-cron'] || '').trim();
  const isVercelCronCall = cronHeader.length > 0;

  const tokenIsValid =
    headerToken === expectedToken ||
    queryToken === expectedToken ||
    bearerToken === expectedToken;

  if (!tokenIsValid) {
    return res.status(401).json({
      error: isVercelCronCall ? 'Unauthorized cron request' : 'Unauthorized'
    });
  }

  try {
    const result = await syncCatalogFromVendor();

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error critico en endpoint sync:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno no controlado en el servidor'
    });
  }
};

router.get('/sync-catalog', runSyncCatalog);
router.post('/sync-catalog', runSyncCatalog);

export default router;

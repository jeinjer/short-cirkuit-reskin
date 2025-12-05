import { Router } from 'express';
import { syncCatalogFromVendor } from '../jobs/syncCatalog';

const router = Router();
const SYNC_TOKEN = process.env.SYNC_TOKEN;

router.post('/sync-catalog', async (req, res) => {
  const token = req.headers['x-sync-token'];

  if (!SYNC_TOKEN || token !== SYNC_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await syncCatalogFromVendor();
    return res.json({ ok: true });
  } catch (e) {
    console.error('[SYNC] Error ejecutando sync:', e);
    return res.status(500).json({ ok: false, error: 'Sync failed' });
  }
});

export default router;

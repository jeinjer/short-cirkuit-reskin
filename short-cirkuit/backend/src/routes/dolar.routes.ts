import { Router } from 'express';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
    const data = await response.json();

    res.json({ rate: data.venta });
  } catch (error) {
    console.error('Error fetching dolar:', error);
    res
      .status(500)
      .json({ error: 'No se pudo obtener la cotización', rate: 1200 });
  }
});

export default router;

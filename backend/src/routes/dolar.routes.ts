import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/dolar:
 *   get:
 *     summary: Obtener cotización del dólar oficial
 *     tags:
 *       - Utilidades
 *     responses:
 *       200:
 *         description: Cotización actual del dólar oficial
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DolarResponse'
 *       500:
 *         description: No se pudo obtener la cotización
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - $ref: '#/components/schemas/DolarResponse'
 */
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

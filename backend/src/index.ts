import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './swagger/swagger';
import productsRouter from './routes/products.routes';
import filtersRouter from './routes/filters.routes';
import categoriesRouter from './routes/categories.routes';
import dolarRouter from './routes/dolar.routes';
import internalRouter from './routes/internal.routes';

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const PORT = process.env.PORT || 3000;

const rawOrigins = FRONTEND_ORIGIN || '';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  }),
);

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/products', productsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/dolar', dolarRouter);
app.use('/internal', internalRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo`);
});

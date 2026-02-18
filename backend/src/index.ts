import express from 'express';
import cors from 'cors';
import path from 'path';

import productsRouter from './routes/products.routes';
import filtersRouter from './routes/filters.routes';
import categoriesRouter from './routes/categories.routes';
import dolarRouter from './routes/dolar.routes';
import internalRouter from './routes/sync.routes';
import authRouter from './routes/auth.routes';
import statsRouter from './routes/stats.routes';
import inquiriesRouter from './routes/inquiries.routes'
import cartRouter from './routes/cart.routes';
import checkoutRouter from './routes/checkout.routes';
import ordersRouter from './routes/orders.routes';

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '';
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS || '';
const PORT = process.env.PORT || 3000;

const normalizeOrigin = (value: string) => value.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');

const parseOrigins = (raw: string) =>
  raw
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...parseOrigins(FRONTEND_ORIGIN),
  ...parseOrigins(FRONTEND_ORIGINS)
];

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedRequestOrigin = origin ? normalizeOrigin(origin) : '';

      if (!origin || ACCEPTED_ORIGINS.includes(normalizedRequestOrigin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));


app.use('/api/auth', authRouter);
app.use('/api/internal', internalRouter);
app.use('/api/dolar', dolarRouter);
app.use('/api/stats', statsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);

app.use('/api/products', productsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo`);
});

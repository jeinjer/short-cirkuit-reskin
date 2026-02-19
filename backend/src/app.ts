import cors from 'cors';
import express from 'express';
import path from 'path';

import authRouter from './routes/auth.routes';
import cartRouter from './routes/cart.routes';
import categoriesRouter from './routes/categories.routes';
import checkoutRouter from './routes/checkout.routes';
import dolarRouter from './routes/dolar.routes';
import filtersRouter from './routes/filters.routes';
import inquiriesRouter from './routes/inquiries.routes';
import ordersRouter from './routes/orders.routes';
import productsRouter from './routes/products.routes';
import statsRouter from './routes/stats.routes';
import internalRouter from './routes/sync.routes';

export const app = express();

const normalizeOrigin = (value: string) => value.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');

const parseOrigins = (raw: string) =>
  raw
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '';
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS || '';
const BACKEND_URL = process.env.BACKEND_URL || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const VERCEL_PREVIEW_ORIGIN_REGEX = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...parseOrigins(FRONTEND_ORIGIN),
  ...parseOrigins(FRONTEND_ORIGINS),
  ...parseOrigins(BACKEND_URL)
];

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedRequestOrigin = origin ? normalizeOrigin(origin) : '';
      const isAllowedPreview = normalizedRequestOrigin ? VERCEL_PREVIEW_ORIGIN_REGEX.test(normalizedRequestOrigin) : false;

      if (!origin) return callback(null, true);
      if (ACCEPTED_ORIGINS.includes(normalizedRequestOrigin)) return callback(null, true);
      if (IS_PRODUCTION && isAllowedPreview) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-sync-token']
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (!IS_PRODUCTION) {
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
}

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

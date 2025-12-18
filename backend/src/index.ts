import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.routes';
import filtersRouter from './routes/filters.routes';
import categoriesRouter from './routes/categories.routes';
import dolarRouter from './routes/dolar.routes';
import internalRouter from './routes/sync.routes';
import authRouter from './routes/auth.routes';

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        FRONTEND_ORIGIN
      ];

      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/internal', internalRouter);
app.use('/api/dolar', dolarRouter);

app.use('/api/products', productsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo`);
});

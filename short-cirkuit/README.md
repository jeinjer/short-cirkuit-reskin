# Short Cirkuit Reskin

## Estructura

- `backend/`: Express + Prisma + MongoDB.
- `frontend/`: React + Vite.
- `api/[...all].ts`: entrypoint serverless para Vercel.

## Desarrollo local

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deploy unificado en Vercel (Frontend + Backend)

Este repo esta preparado para desplegarse como un solo proyecto:

- SPA desde `frontend/dist`.
- API Express en `/api/*` mediante `api/[...all].ts`.

Configuracion recomendada en Vercel Project Settings:

- `Root Directory`: raiz del repo.
- `Install Command`: `npm install`.
- `Build Command`: `npm run build`.
- `Output Directory`: `frontend/dist`.

`vercel.json` en raiz ya incluye:

- rewrite para SPA fallback.
- cron de catalogo (`/api/internal/sync-catalog`).
- para cron seguro, configurar `CRON_SECRET` en Vercel con el mismo valor que `SYNC_TOKEN` (el endpoint acepta Bearer token).

## Variables de entorno (Vercel)

Backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `RESEND_API_KEY`
- `SYNC_TOKEN`
- `CSV_URL`
- `WHATSAPP_ADMIN_PHONE`
- `BACKEND_URL=https://shortcirkuit.com`
- `FRONTEND_ORIGIN=https://shortcirkuit.com`
- `FRONTEND_ORIGINS` (opcional para previews/local)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

Frontend (solo publicas):

- `VITE_GOOGLE_CLIENT_ID`
- otras `VITE_*` publicas necesarias de UI

Nota: en produccion el frontend usa `'/api'` como base URL (same-origin), no requiere `VITE_API_URL`.

# Short Cirkuit Reskin

## Estructura

- `backend/` → API Node + Prisma + Mongo
- `frontend/` → Vite + React (catálogo)

## Backend

```bash
cd backend
cp .env.example .env   # completar valores reales
npm install
npm run db:setup       # prisma generate + prisma db push
npm run seed           # sincroniza Mongo con catálogo
npm run dev            # entorno local
# build + producción:
npm run build
npm run start

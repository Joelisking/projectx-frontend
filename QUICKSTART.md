# Quick Start Guide - ProjectX Frontend

Get the frontend up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([check with `node --version`](https://nodejs.org))
- npm 9+ installed (comes with Node.js)
- **Backend must be running** on `http://localhost:8000`

## Setup Steps

### 1. Clone & Install

```bash
# Navigate to the frontend directory
cd projectx-frontend

# Install all dependencies
npm install
```

### 2. Configure Backend Connection

The API URL is configured in `lib/constants.ts`:
- **Browser**: Uses `/api/v1` (proxied by Next.js - see `next.config.ts`)
- **Server**: Uses `http://localhost:8000/api/v1`

**No environment file needed!** The app is pre-configured for local development.

### 3. Generate API Types

**Important:** Backend must be running first!

```bash
# This connects to http://localhost:8000/api/docs/?format=openapi
# and generates TypeScript types
npm run codegen
```

If you get errors, make sure:
- Backend is running: http://localhost:8000/api/docs/
- Database migrations are applied
- No firewall blocking port 8000

### 4. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** - you're done! 🎉

## Daily Development

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: If backend API changes
npm run codegen
```

## Common Commands

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Check for TypeScript errors |
| `npm run codegen` | Generate API types from backend |
| `npm run lint` | Check code style |

## Troubleshooting

### "Cannot connect to backend"

```bash
# Check backend is running
curl http://localhost:8000/api/docs/

# Restart backend if needed
cd ../ProjectX_Backend/campus_marketplace_backend
python manage.py runserver
```

### "Module not found" errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors after backend changes

```bash
# Regenerate types
npm run codegen

# Check what broke
npm run build
```

### Port 3000 already in use

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Project Structure

```
projectx-frontend/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Homepage
│   ├── listings/          # Marketplace
│   ├── messages/          # Chat
│   ├── study-materials/   # Study materials
│   └── ...
│
├── components/            # Reusable components
│   ├── ui/               # Buttons, cards, etc.
│   ├── navigation/       # Header, sidebar
│   └── listings/         # Listing components
│
├── lib/                   # Utilities
│   ├── constants.ts      # App constants (API URL here!)
│   └── redux/            # State management
│       └── api/          # Auto-generated API code
│
└── public/               # Static files
```

## Key Files

| File | Purpose |
|------|---------|
| `lib/constants.ts` | **API URL configured here** |
| `lib/redux/api/openapi.generated.ts` | Auto-generated API types & hooks |
| `lib/redux/api/openapi-config.ts` | Codegen configuration |
| `next.config.ts` | Next.js config (API proxy) |

## How It Works

1. **API Proxy**: Next.js proxies `/api/v1/*` → `http://localhost:8000/api/v1/*`
2. **Type Generation**: `npm run codegen` reads backend OpenAPI schema
3. **Auto Types**: TypeScript types and React hooks are auto-generated
4. **Type Safety**: Components use generated hooks with full type safety

Example:
```typescript
import { useGetListingsQuery } from '@/lib/redux/api/openapi.generated';

function Page() {
  // Fully typed! TypeScript knows all fields
  const { data, isLoading } = useGetListingsQuery({});

  return <div>{data?.results.map(listing => ...)}</div>;
}
```

## Important Notes

- ⚠️ **Backend must run first** before `npm run codegen`
- ⚠️ **API URL** is in `lib/constants.ts`, not `.env` file
- ⚠️ Run `npm run codegen` after any backend API changes
- ✅ Hot reload works - changes reflect automatically
- ✅ No manual type definitions needed - all auto-generated

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/api/docs/ |

## Next Steps

1. ✅ Start the dev server
2. 📱 Open http://localhost:3000
3. 🔐 Register a new account or login
4. 🛍️ Browse listings
5. 💻 Start coding!

## Need Help?

- **Build errors**: Run `npm run build` to see TypeScript errors
- **API errors**: Check backend is running at http://localhost:8000
- **Type errors**: Run `npm run codegen` to regenerate types
- **Other issues**: Ask the team!

---

**Ready to code? Run `npm run dev` and visit http://localhost:3000 🚀**

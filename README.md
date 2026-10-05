# Arsalan Fabrics Frontend

Static **storefront** + **Atelier Portal admin** in one deployable site.

| Area | URL (local) | URL (production) |
|------|-------------|------------------|
| Store | `http://localhost:3000/` | `https://your-project.vercel.app/` |
| Admin | `http://localhost:3000/admin/login.html` | `https://your-project.vercel.app/admin/login.html` |

Backend API is a **separate** repo (`../backend`). The UI needs a running API for products, cart, checkout, and admin data.

## Local development

1. **API** (backend repo):

```bash
cd ../backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

2. **Frontend** (this repo):

```bash
npm install
npm run dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)

On port 3000, API calls go to `http://localhost:5000` automatically.

Override in the browser:

```js
localStorage.setItem('af_api_base', 'https://your-api.example.com');
location.reload();
```

## Deploy to Vercel (store + admin together)

Yes — **one Vercel project serves both**. Admin lives under `/admin/`; the store is everything else.

1. Push this repo to GitHub (or connect the `frontend` folder only).
2. In Vercel: **New Project** → import repo.
3. Set **Root Directory** to `frontend` (if the repo is the monorepo parent, otherwise leave blank if this repo is only `frontend`).
4. **Framework preset:** Other (static).
5. **Build command:** `npm run build` (generates `js/env.js` from env).
6. **Environment variable** (required for production unless you use a proxy):

   | Name | Example |
   |------|---------|
   | `BACKEND_URL` | `https://your-backend.onrender.com` |

   No trailing slash. Enable **CORS** on the backend for your `*.vercel.app` domain.

7. Deploy.

### Optional: same-origin API proxy (no CORS)

In `vercel.json`, add a rewrite (replace the host with your deployed backend):

```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://your-backend.onrender.com/api/:path*"
  }
]
```

Then leave `BACKEND_URL` empty; the app uses relative `/api/...` on the Vercel domain.

### After deploy — URLs to share

- **Customer website:** `https://<your-vercel-domain>/`
- **Admin login:** `https://<your-vercel-domain>/admin/login.html`  
  Use `/admin/` (with trailing slash) or `/admin/index.html` after login.

## Demo logins (after backend seed)

| Role | Email | Password (default seed) |
|------|-------|-------------------------|
| Admin | admin@arsalanfabrics.com | Admin@12345 |
| Customer | ayesha.k@email.com | Customer@12345 |

## Completion & responsive status

**Ready to deploy (MVP):**

- Store: home, PLPs, PDP, cart, checkout, track order, account pages, header/footer chrome, mobile nav, search bar, wishlist drawer.
- Admin: dashboard, products, categories, orders, customers, delivery, website settings.
- Shared responsive CSS: `css/site-responsive.css`, `css/header.css`, per-page CSS, admin breakpoints in `admin/css/admin.css`.

**Known gaps (non-blocking for demo deploy):**

- Some marketing/footer links still use `href="#"` on a few pages.
- Account pages use slightly different sidebar CSS files (behavior is wired).
- Legacy unused `*.js` files in the repo are not loaded from HTML.
- **Backend must be hosted separately** (Render, Railway, Fly.io, etc.); Vercel only hosts static frontend.

## Structure

```
frontend/
├── index.html, …          # store pages
├── css/, js/, Assets/
├── vercel.json
├── admin/                 # Atelier Portal
└── scripts/generate-env.js
```

# Arsalan Fabrics Frontend

This repository contains:

- **Storefront** — customer website (HTML/CSS/JS at repo root)
- **Admin** — Atelier Portal at `/admin/`

Backend API is a **separate repo**: `../backend` (Node.js + MongoDB).

## Local development

1. Start API (backend repo):

```bash
cd ../backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

2. Start storefront + admin (this repo):

```bash
npm install
npm run dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)

The frontend auto-points to `http://localhost:5000` for API when served on port 3000. Override in the browser console:

```js
localStorage.setItem('af_api_base', 'https://your-api.example.com');
location.reload();
```

## Demo logins (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@arsalanfabrics.com | from `.env` (`Admin@12345` default) |
| Customer | ayesha.k@email.com | from `.env` (`Customer@12345` default) |

## Structure

```
frontend/
├── index.html, …          # store pages
├── css/, js/, Assets/
└── admin/                 # Atelier Portal dashboard
```

## Deploy

Host this repo as static files (Netlify, Vercel, S3, etc.). Set `af_api_base` via a small `js/config.js` build step or environment injection pointing to your deployed API.

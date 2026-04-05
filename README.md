# Gunjan Telecom

A full-stack e-commerce and admin POS platform for a telecom retail store.
Built with **React + Vite + TypeScript + Supabase + TailwindCSS**.

---

## 🚀 Deploying to Vercel (Step by Step)

### Step 1 – Push to GitHub

Make sure your code is on GitHub. Vercel deploys directly from a Git repository.

```bash
git add .
git commit -m "feat: production ready"
git push origin main
```

### Step 2 – Import to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"** and select your GitHub repo
3. Vercel will auto-detect it as a **Vite** project — leave all build settings as-is:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3 – Add Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> Get these from: **Supabase Dashboard → Project Settings → API**

### Step 4 – Deploy 🎉

Click **Deploy**. Vercel will build and publish your site automatically.

---

## 🗄️ Supabase Setup Checklist

Run these SQL files in **Supabase → SQL Editor** in order:

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Creates all tables |
| `supabase/rls_policies.sql` | Sets up Row Level Security |
| `supabase/fix_notifications_rls.sql` | Allows guest order notifications |
| `supabase/seed_data.sql` | Adds sample products, banners & offers |

### Storage Buckets
Create two public buckets in **Supabase → Storage**:
- `products` – for product images
- `banners` – for banner images

### Auth Users (Admin Panel)
Create users in **Supabase → Authentication → Users**, then run:
```sql
-- Set roles after creating users
UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}'   WHERE email = 'admin@yourdomain.com';
UPDATE auth.users SET raw_user_meta_data = '{"role": "manager"}' WHERE email = 'manager@yourdomain.com';
UPDATE auth.users SET raw_user_meta_data = '{"role": "cashier"}' WHERE email = 'cashier@yourdomain.com';
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local

# Start dev server
npm run dev
```

App runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── components/       # Shared UI components
│   ├── ui/           # Base UI primitives (Button, Card, Modal, etc.)
│   ├── Layout.tsx    # Admin panel layout with sidebar
│   └── CustomerLayout.tsx # Storefront layout
├── context/
│   ├── DataContext.tsx   # All API calls and global state
│   └── AuthContext.tsx   # Supabase auth state
├── pages/
│   ├── Home.tsx         # Customer storefront homepage
│   ├── Shop.tsx         # Product listing
│   ├── Products.tsx     # Admin product management
│   ├── Orders.tsx       # Admin order management
│   ├── Dashboard.tsx    # Admin analytics dashboard
│   ├── Offers.tsx       # Admin banners & offers
│   └── ...
├── types.ts             # TypeScript type definitions
└── lib/
    └── supabaseClient.ts # Supabase client singleton

supabase/
├── schema.sql
├── rls_policies.sql
├── fix_notifications_rls.sql
└── seed_data.sql
```

---

## 🔑 User Roles

| Role | Access |
|------|--------|
| `admin` | Full access — all pages |
| `manager` | Products, Orders, Customers, Offers, Reports |
| `cashier` | POS, Orders, Customers only |

Admin panel: **/admin/login**
Storefront: **/**

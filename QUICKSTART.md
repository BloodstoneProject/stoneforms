# 🚀 QUICK START - Get Stoneforms Running in 5 Minutes

## ⚡ OPTION 1: Fastest Way (Recommended)

### Use the Demo Mode (No Installation)

Just deploy the existing code to Vercel:

```bash
# 1. Initialize and push to GitHub
cd formflow
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/stoneforms.git
git push -u origin main

# 2. Deploy to Vercel
# Go to vercel.com
# Import your GitHub repo
# Click Deploy
# ✅ DONE!
```

**All features work with mock data!**

---

## 🔧 OPTION 2: Run Locally

### Step 1: Install Dependencies

```bash
cd formflow
npm install
```

### Step 2: Create Environment File

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🐛 TROUBLESHOOTING

### "Module not found" errors?

```bash
# Install missing packages
npm install next@14 react react-dom
npm install lucide-react recharts zustand
npm install @supabase/supabase-js
npm install clsx tailwind-merge class-variance-authority
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D tailwindcss postcss autoprefixer
npm install -D typescript @types/node @types/react @types/react-dom
```

### "Can't find components" errors?

The UI components use ShadCN. Install them:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add label
```

### Build fails?

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

###  Page won't load?

Check these files exist:
- `app/layout.tsx`
- `app/page.tsx`  
- `app/globals.css`
- `tailwind.config.js`
- `next.config.js`

---

## ✅ WHAT WORKS OUT OF THE BOX

All pages work with mock data:

**✅ Landing Page** - `/`
**✅ Demo Form** - `/demo`
**✅ Dashboard** - `/dashboard`
**✅ Forms** - `/dashboard/forms`
**✅ Form Builder** - `/dashboard/forms/new`
**✅ Templates** - `/dashboard/templates`
**✅ Quizzes** - `/dashboard/quizzes`
**✅ Contacts** - `/dashboard/contacts`
**✅ Deals** - `/dashboard/deals`
**✅ Analytics** - `/dashboard/analytics`
**✅ Reports** - `/dashboard/reports`
**✅ Automations** - `/dashboard/automations`
**✅ Workflows** - `/dashboard/workflows/new`
**✅ Appointments** - `/dashboard/appointments`
**✅ Integrations** - `/dashboard/integrations`
**✅ Webhooks** - `/dashboard/webhooks`
**✅ Team** - `/dashboard/team`
**✅ Payment Settings** - `/dashboard/settings/payments`
**✅ White Label** - `/dashboard/settings/white-label`

---

## 📦 COMPLETE DEPENDENCIES

Here's the full `package.json` you need:

```json
{
  "name": "stoneforms",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.45.4",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "zustand": "^4.5.5",
    "recharts": "^2.12.7",
    "lucide-react": "^0.456.0",
    "date-fns": "^4.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "class-variance-authority": "^0.7.1"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^22.9.3",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "tailwindcss-animate": "^1.0.7",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.18"
  }
}
```

---

## 🎯 NEXT STEPS

### Once It's Running:

1. **Test All Pages** - Click through everything
2. **Try AI Generator** - `/dashboard/forms/new` → "AI Generate Form"
3. **Browse Templates** - `/dashboard/templates`
4. **Check Dashboard** - All features visible

### When Ready to Deploy:

1. **Push to GitHub**
2. **Deploy to Vercel** (automatic)
3. **Share demo link**
4. **Collect feedback**

### To Connect Real Database:

Say: **"Connect Supabase now"** and I'll:
- Set up Supabase project
- Connect authentication
- Wire up all CRUD operations
- Make everything functional

---

## 💡 ALTERNATIVE: Start Fresh

If nothing works, I can create a brand new minimal version:

1. **Minimal Landing Page** - Just the homepage
2. **One Dashboard Page** - Proves it works  
3. **Then Add Features** - One by one

Would you like me to:
- **A)** Create a minimal working version to start?
- **B)** Help debug the current setup?
- **C)** Just deploy to Vercel and fix there?
- **D)** Connect Supabase and make it fully functional?

---

## 🆘 IMMEDIATE HELP

Tell me:
1. **What error do you see?** (screenshot or copy/paste)
2. **What command did you run?** (`npm run dev`, etc.)
3. **What OS?** (Mac, Windows, Linux)

I'll fix it immediately! 🔧

# 🏥 Udumula Hospital Appointment Booking

A full-stack web app with AI-powered doctor booking, built with Next.js 14, Prisma, and Claude AI.

---

## 🚀 Quick Start (Step by Step)

### Prerequisites
Install these first if you don't have them:
- [Node.js 18+](https://nodejs.org) — download and install
- [VS Code](https://code.visualstudio.com) or [Cursor](https://cursor.sh)
- A free [Anthropic API key](https://console.anthropic.com)

---

### Step 1: Open the project in Cursor/VS Code

Open Cursor, then File → Open Folder → select the `medbook` folder.

---

### Step 2: Install dependencies

Open the terminal (View → Terminal) and run:

```bash
npm install
```

Wait for it to finish (1-2 minutes).

---

### Step 3: Set up environment variables

Copy the example file:
```bash
cp .env.example .env
```

Now open `.env` and fill in:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="any-random-string-here-like-mysecret123"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-your-key-from-console.anthropic.com"
```

To get your Anthropic API key:
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click "API Keys" → "Create Key"
4. Copy and paste it into `.env`

---

### Step 4: Set up the database

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

This creates a local SQLite database and adds 6 sample doctors with available time slots.

---

### Step 5: Run the app

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

---

## 🔑 Demo Login

After seeding, you can log in with:
- **Email:** `patient@demo.com`
- **Password:** `password123`

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Chat | Describe symptoms → AI recommends specialist |
| 📅 Booking | 3-step appointment booking with real slot availability |
| 👨‍⚕️ Doctors | Browse/filter 6 pre-loaded specialists |
| 📊 Dashboard | View, manage and cancel your appointments |
| 🔐 Auth | Secure login with email & password |

---

## 🗂 Project Structure

```
medbook/
├── prisma/
│   ├── schema.prisma      # Database structure
│   └── seed.ts            # Sample data
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   ├── dashboard/      # Patient dashboard
│   │   ├── doctors/        # Doctor listing
│   │   ├── book/           # Booking flow
│   │   └── api/            # Backend API routes
│   │       ├── auth/       # Auth endpoints
│   │       ├── doctors/    # Doctor & slot APIs
│   │       ├── appointments/ # Booking API
│   │       └── chat/       # AI chat API
│   ├── components/
│   │   └── AIChat.tsx      # AI chat widget
│   ├── lib/
│   │   ├── prisma.ts       # Database client
│   │   └── auth.ts         # Auth config
│   └── types/              # TypeScript types
└── .env                    # Your secrets (never commit this!)
```

---

## 🛠 Common Issues

**"Cannot find module" error:**
```bash
npm install
npx prisma generate
```

**"Database does not exist":**
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

**AI chat not working:**
- Check your `ANTHROPIC_API_KEY` in `.env`
- Make sure it starts with `sk-ant-`

**Port already in use:**
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

---

## 🚢 Deploy to Production (Optional)

1. Push code to GitHub
2. Create account on [Vercel](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard
5. Change `DATABASE_URL` to a real PostgreSQL URL (e.g., from [Supabase](https://supabase.com))
6. Deploy!

---

## ✨ Built With

- **Next.js 14** – React framework
- **Prisma** – Database ORM
- **SQLite** – Local database (upgrade to PostgreSQL for production)
- **NextAuth.js** – Authentication
- **Anthropic Claude** – AI assistant
- **TypeScript** – Type safety
- **CSS Modules** – Styling

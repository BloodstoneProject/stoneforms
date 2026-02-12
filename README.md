# FormFlow - Beautiful Forms with Powerful CRM

A modern form builder with built-in CRM capabilities, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Form Builder
- ✅ Conversational one-question-at-a-time interface
- ✅ 8+ question types (text, email, number, multiple choice, rating, etc.)
- ✅ Drag-and-drop question reordering
- ✅ Custom themes and branding
- ✅ Conditional logic and branching
- ✅ URL parameters and hidden fields
- ✅ Multiple embed options

### CRM Integration
- ✅ Automatic contact creation from submissions
- ✅ Deal pipeline management
- ✅ Contact properties and custom fields
- ✅ Lead scoring and segmentation
- ✅ Activity tracking

### Analytics & Automation
- ✅ Real-time analytics dashboard
- ✅ Question-by-question drop-off analysis
- ✅ Webhook integrations
- ✅ Automated workflows
- ✅ Email notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **State Management**: Zustand

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is fine)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd formflow
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (2-3 minutes)
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Initialize the Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `database/schema.sql`
5. Paste into the SQL editor and click "Run"

This will create all necessary tables, indexes, and policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
formflow/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── index.ts        # Core types (Form, Submission, Contact, etc.)
├── database/           # Database schemas
│   └── schema.sql     # PostgreSQL schema
└── public/           # Static assets
```

## 🎯 Roadmap - Week 1

### Day 1 ✅ (Completed)
- [x] Project setup and configuration
- [x] Database schema design
- [x] TypeScript types
- [x] Landing page
- [ ] Authentication pages (sign up/sign in)

### Day 2 (Form Builder)
- [ ] Form builder UI
- [ ] Question components
- [ ] Drag & drop functionality
- [ ] Theme customization

### Day 3 (Form Player)
- [ ] Conversational form renderer
- [ ] Logic engine
- [ ] End screens
- [ ] URL parameters

### Day 4 (Submissions)
- [ ] Submission handling
- [ ] Analytics dashboard
- [ ] Export functionality
- [ ] Response management

### Day 5 (CRM)
- [ ] Contacts database
- [ ] Deal pipeline
- [ ] Basic automation
- [ ] Email integration

### Day 6 (Integrations)
- [ ] Webhooks
- [ ] Embed options
- [ ] Email builder
- [ ] Sharing features

### Day 7 (Polish)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for all sensitive operations
- HTTPS enforced in production
- Environment variables for secrets
- Input validation and sanitization

## 📝 Database Schema

Key tables:
- `workspaces` - Multi-tenant workspace management
- `forms` - Form definitions with questions and logic
- `submissions` - Form responses with answers
- `contacts` - CRM contact records
- `deals` - Sales pipeline deals
- `pipelines` - Customizable sales stages
- `webhooks` - Integration endpoints
- `workflows` - Automation rules

## 🤝 Contributing

This is a solo project sprint, but contributions and feedback are welcome!

## 📄 License

MIT License - feel free to use this for your own projects.

## 🙏 Acknowledgments

- Inspired by Typeform's beautiful UX
- Built with amazing open-source tools
- Powered by Supabase

---

**Let's build something amazing! 🚀**

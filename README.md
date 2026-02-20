🌌 Life.OS — The Emotional Operating System

Run your memories. Preserve your evolution.

Life.OS is a futuristic emotional memory vault built with Next.js.
It transforms life moments into structured digital encodings — allowing reflection, analytics, and immersive memory replay.

This is not just a journal.
This is a Personal Operating System for Human Experience.

🚀 Vision

Life.OS is designed as a Digital Soul Archive.

Every memory becomes:

Structured data

Emotional insight

Growth analytics

A preserved life chapter

It merges technology with introspection.

✨ Core Features
🧠 Emotional Timeline

Visualize life moments in a futuristic vertical stream.

📊 Emotional Analytics Dashboard

Happiness Ratio

Growth Momentum

Emotional Stability Index

Trend Visualization

📖 Life Chapters

Organize memories into:

School

College

Career

Transformation

🎬 Memory Replay Mode

Cinematic yearly recap — like Spotify Wrapped for your life.

🔒 Private Vault Mode

Secure emotional archive with protected entries.

🎨 Immersive UI

Dark cosmic theme

Glassmorphism design

Neon glow accents

Smooth Framer Motion animations

🛠 Tech Stack
🖥 Frontend

Next.js 16 (App Router)

TypeScript

Tailwind CSS

Framer Motion

Context API

⚙ Backend

Next.js API Routes

Node.js Runtime

LowDB (JSON-based file database)

JWT-based Authentication

REST-style CRUD APIs

📂 Data is stored locally in:

/data.json


No external database required (MongoDB optional for future production).

🧱 Architecture
Life.OS
│
├── app/                 → Pages & Routes
├── app/api/             → Backend API routes
├── lib/db.ts            → LowDB configuration
├── lib/auth.ts          → JWT authentication logic
├── data.json            → Local JSON database
├── middleware.ts        → Route protection
└── components/          → UI components

🔐 Authentication

Secure login system

JWT session handling

Protected routes using middleware

Automatic redirect if not authenticated

Secure logout

Protected Pages:

/dashboard

/memory

/mood

/time-capsule

⚡ API Endpoints
Users
GET    /api/users
POST   /api/users
PUT    /api/users
DELETE /api/users

Memories
GET    /api/memories
POST   /api/memories
PUT    /api/memories
DELETE /api/memories

💻 Getting Started
npm install
npm run dev


Open:

http://localhost:3000

🌠 Roadmap

AI Mood Pattern Detection

Sentiment Analysis

Cloud Sync

Encrypted Vault Mode

Mobile Version

👨‍💻 Author

Shubham Dongare
Full Stack Developer
📧 shubhamdongare912@gmail.com

🧠 Philosophy

Your life is not just lived — it is processed, preserved, and evolved.

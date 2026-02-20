
# 🌌 Life.OS — The Emotional Operating System

> **Run your memories. Preserve your evolution.**

**Life.OS** is a futuristic emotional memory vault built with **Next.js 16**. It transforms life moments into structured digital encodings, allowing for deep reflection, advanced analytics, and immersive memory replay. 

This isn't a journal—it's a **Digital Soul Archive**.

---

## 🚀 Vision
Life.OS merges technology with introspection. Every memory becomes:
* **Structured Data** for long-term retrieval.
* **Emotional Insight** to understand your internal state.
* **Growth Analytics** to visualize your evolution.

---

## ✨ Core Features

### 🧠 Emotional Timeline
A futuristic vertical stream to visualize life moments with smooth **Framer Motion** transitions.

### 📊 Emotional Analytics
* **Happiness Ratio:** Data-driven mood tracking.
* **Growth Momentum:** Measuring personal progress.
* **Stability Index:** Visualizing emotional consistency.

### 🎬 Memory Replay Mode
A cinematic yearly recap—like **Spotify Wrapped** for your life.

### 🎨 Immersive UI
* **Glassmorphism** design with neon glow accents.
* **Dark Cosmic Theme** for a premium, focused experience.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| **Animations** | Framer Motion |
| **Database** | LowDB (Local JSON-based) |
| **Auth** | JWT & Middleware Protection |



---

## 🧱 Project Architecture

```text
Life.OS
├── app/                 → Next.js App Router (Pages & API)
│   ├── api/             → Backend REST Endpoints
│   ├── dashboard/       → Analytics UI
│   └── memory/          → Timeline & Vault
├── lib/                 → db.ts (LowDB) & auth.ts (JWT)
├── components/          → UI (Glassmorphism components)
└── data.json            → Local Emotional Database

```

---

## 🔐 API Reference

### Memories

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/memories` | Fetch all memory encodings |
| `POST` | `/api/memories` | Create a new life chapter |
| `PUT` | `/api/memories` | Update existing memory |
| `DELETE` | `/api/memories` | Wipe a memory from the archive |

---

## 💻 Getting Started

1. **Install Dependencies**
```bash
npm install

```


2. **Run Development Server**
```bash
npm run dev

```




## 🌠 Roadmap

* [ ] **AI Mood Pattern Detection:** Predictive emotional forecasting.
* [ ] **Sentiment Analysis:** Auto-categorizing memories based on text.
* [ ] **Encrypted Vault:** End-to-end encryption for sensitive data.

---

## 👨‍💻 Author

**Shubham Dongare** *Full Stack Developer* 📧 [shubhamdongare912@gmail.com](mailto:shubhamdongare912@gmail.com)

> *Your life is not just lived — it is processed, preserved, and evolved.*

```

---

### 💡 Pro-Tip for your README:
Since you mentioned **Framer Motion**, you might want to include a small code snippet in the README to show off your animation skills. Would you like me to write a **`MemoryCard.tsx`** component with a glassmorphism effect and hover animations to include in your "Code Preview" section?

```

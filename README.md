# Personify

Your AI – your way.

Personify is a lightweight onboarding web-app that helps students quickly configure ChatGPT so it understands their learning style, goals, and personality. It replaces intimidating prompt-engineering with a friendly, conversational flow and delivers a ready-to-paste Custom Instructions block & ChatGPT memory prompt.

---

## ✨ Key Features

1. **Modular selection** – pick the areas of life you want to personalise through an emoji-rich category selector.
2. **Chat-style flow** – answer interactive questions (sliders, dropdowns, toggles, etc.) in a gradual conversation rather than a dull form.
3. **One-click generation** – answers are transformed by an OpenAI endpoint into two Custom Instruction fields plus a memory prompt.
4. **Instant copy** – copy buttons & deep-links make transferring the output into ChatGPT effortless.
5. **Dark / Light themes** – global theme toggle with full reactive styling.
6. **Serverless backend** – a single Netlify function calls the OpenAI API; the deployed frontend is 100 % static.

---

## 🗂️ Project Structure (high-level)

```
├─ src/                Front-end Angular 20 application
│  ├─ app/             Stand-alone feature modules & shared services
│  │  ├─ pages/        Route-level pages: home, select, flow, loading, result
│  │  ├─ shared/       Re-usable components, models & utilities
│  │  └─ theme.service.ts  Global dark/light mode management
│  └─ styles.scss      Global SCSS theme helpers
├─ netlify/functions/  Serverless function that proxies OpenAI
├─ backend/            Express API (used for local dev only – ignored in prod)
└─ docs/               Design, progress & planning notes
```

---

## 🔄 Data Flow

1. **Selection → Flow** – user picks sub-categories; `SelectionService` sends IDs to `FlowService`.
2. **Flow → Loading** – answers collected in the chat flow are passed via Angular Router state.
3. **Loading → Serverless** – Netlify function `/openaiPromptGeneration` posts answers to OpenAI.
4. **OpenAI → Results** – response (Q1, Q2, memory prompt) is shown with copy helpers.

A visual summary:

```
SelectionService → FlowService → Loading page → Netlify Function → OpenAI → Results page
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** and **npm** (Angular 20 requirement)
- **Angular CLI**: `npm install -g @angular/cli`

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup** (choose your development approach):

   **Option A: Full stack with Netlify (recommended)**

   - Install Netlify CLI: `npm install -g netlify-cli`
   - Create `.env` in project root with:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```
   - Run: `netlify dev`
   - Access at: `http://localhost:8888`

   **Option B: Frontend-only development**

   - Run: `ng serve`
   - Access at: `http://localhost:4200`
   - ⚠️ API calls will fail without backend

   **Option C: Separate frontend + backend**

   - Create `.env` in `backend/` folder with `OPENAI_API_KEY`
   - Terminal 1: `ng serve` (frontend on :4200)
   - Terminal 2: `cd backend && npm start` (backend on :3001)

### Quick Start (Recommended)

```bash
npm install
npm install -g netlify-cli
# Add OPENAI_API_KEY to .env file
netlify dev
```

---

## �� Scripts

| Command          | Purpose                             |
| ---------------- | ----------------------------------- |
| `ng serve`       | Frontend development server (:4200) |
| `netlify dev`    | Full stack development (:8888)      |
| `ng build`       | Production build to `dist/`         |
| `netlify deploy` | Deploy to Netlify                   |

---

## 📚 Further Documents

- `docs/PROJECT_OVERVIEW.md` – original hackathon brief & complete project scope
- `docs/DEVELOPMENT_LOG.md` – chronological implementation history
- `docs/DESIGN_RULES.md` – design system & UX guidelines

---

© 2025 Parker Jones

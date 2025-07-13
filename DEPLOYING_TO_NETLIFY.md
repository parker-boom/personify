# Deploying Personify to Netlify

This is a concise, actionable checklist that mirrors the detailed guidance in `docs/serverless.txt`.

---

## 1. One-time prerequisites

1. Install Netlify CLI (optional but recommended):
   ```bash
   npm i -g netlify-cli
   netlify login
   ```
2. Ensure `OPENAI_API_KEY` is available – either in your local `.env` for `netlify dev`, or in the Netlify Site → **Settings → Environment variables** (scope: **Runtime**).

## 2. Local development

```bash
# Run the serverless function + Angular app together
netlify dev
```

- The CLI detects Angular, runs `ng serve` on port 4200, and proxies all calls to `/api/*` into the local function found in `netlify/functions/openaiPromptGeneration.js`.
- Edit code, everything hot-reloads.

### Falling back to the classic Express backend

```bash
# Separate terminals
npm run start           # Angular dev server on :4200
cd backend && npm run dev   # Express server on :3001
```

The Angular app detects `localhost` and will hit `http://localhost:3001/api/*` automatically.

## 3. Production deploy

1. Push to `main`.
2. Netlify picks up the new commit, runs the build inside the Netlify container:
   - `ng build --configuration=production` → static files in `dist/personify`
   - Bundles the single function in `netlify/functions/`.
3. Redirect rules in `netlify.toml`:
   - `/*` → `index.html` (SPA routing)
   - `/api/*` → `/.netlify/functions/openaiPromptGeneration` (serverless proxy)

## 4. Diagnostics

- Function logs: **Netlify UI → Functions → openaiPromptGeneration → Logs**.
- Local logs: shown in the same terminal that is running `netlify dev`.

---

That’s it – enjoy painless serverless deployments! 🎉

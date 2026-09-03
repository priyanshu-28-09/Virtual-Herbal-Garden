# Virtual Herbal Garden — Project Status

Last updated: 2026-09-02 by opencode. Use this file to catch up quickly in a new session.
## What this is
Full-stack **Virtual Herbal Garden** app (`D:\VHerbal\Virtual-Herbal-Garden`). Goal: "full production-ready" delivered in a 3–4 week window under a 6-phase plan. All features are considered equally important (no explicit priority order from the user).

Current status: **Phases 1–5 complete & verified. Phase 6 remains.** (Admin-panel bug-fix work was delivered as Phases 1–4 of a dedicated admin-fix plan; see "Admin bug fixes" below.)

---

## Repo layout & key conventions
- Frontend: `frontend/` (Vite + React 18, Tailwind, framer-motion, axios, react-icons, react-i18next).
- Backend: `backend/` (Express + Mongoose, JWT auth, multer uploads).
- **`ContentCreater` typo is intentional** — the content-creator frontend dir is `frontend/src/ContentCreater/...` (keep the typo).
- Backend runs on port **5001**; frontend `API_URL = http://localhost:5001/api`, `SERVER_URL = http://localhost:5001` (`frontend/src/api.js`).
- Auth: token in `localStorage['token']`, sent as `Authorization: Bearer <token>`. User info cached in `localStorage['user']`.
- `backend/middleware/authMiddleware.js`: sets `req.user`, `req.userId`, `req.token`. `adminMiddleware.js`: exports `isAdmin`, `isContentCreator` (content-creator route also allows admin).
- `getHerb` (`backend/controllers/herbController.js`) returns `{ success, data, pagination: { total, page, limit, totalPages } }`. Frontend `normalizeApiResponse` unwraps `response.data ?? payload.herbs ?? []`.
- Herb `category` is free-text String; distinct categories from `GET /api/herbs/categories` (`Herb.distinct('category')`).
- Frontend "plant of the day" / image fallback: helper `getImageSource` normalizes paths starting with `/` to `${SERVER_URL}${image}` (see `frontend/src/UserInterface/Routes/Home.jsx`).
- Category field on User model: a user can be `user` / `content-creator` / `admin`.

## Environment / shell notes
- Windows PowerShell (5.1). No `rg`/`rm` in shell — use the **grep**/**glob** tools for searching, and `Remove-Item` (PowerShell) for deletions. Never edit file contents via shell; use Edit/Write tools.
- Frontend scripts (`frontend/package.json`): `dev` = vite, `build` = `vite build`, `lint` = `eslint .`, `preview` = vite preview.

---

## What has been DONE

### Phase 1 — Audit / safety (all complete, 1.1–1.12)
- Fixed circular import in `backend/models/userModel.js`.
- Dark mode uses `class` strategy; Navbar mobile menu is full-width.
- Replaced `<style jsx>` blocks with plain `<style>` (both admin Navigation + content-creator Sidebar).
- Fixed case-sensitive import in `frontend/src/App.jsx` (UserProfile/Setting).
- Fixed reviewController field name mismatch with frontend payload.
- **Bookmark IDOR fix**: bookmark routes now take `userId` from JWT (`req.userId`) instead of request body.
- Removed stray `console.log`s across the app.
- Deleted orphan/unused files.
- Rewrote `frontend/src/UserInterface/Routes/Logout.jsx` (real logout flow).
- `LandingPage.jsx` uses a `useProtectedNavigate()` hook; `Footer.jsx` rewritten with valid `<Link>` routes.

### Phase 2 — Feature completion (all complete, 2.1–2.11)
Backend endpoints added: `PUT /users/change-password`, `PUT /users/change-email`, `PUT /users/update-profile`, `POST /users/forgot-password`, `GET /users/stats`. Added `bio` + `phone` on `userModel`.
Frontend wired: `Setting`, `UserProfile`, `Reset`, content-creator `Profile` + `AddHerb`; Home page review system; LandingPage hero stats are now dynamic (`/users/stats`); `ContentCreatorDashboard` shows real herb counts.

### Phase 3 — Search / catalog power (all complete, 3.1–3.5, verified live)
- `herbModel.js`: text index for name/description/scientificName; `isActive` filtering.
- `getHerb` rewritten: query params `q`, `category`, `page`, `limit` (default 9, max 50) + pagination.
- `getHerbCategories` added; `/categories` route registered **before** `/:herbId`.
- Removed `getAllHerbs`.
- `Home.jsx` is backend-powered: 300 ms debounced search, category chips, pagination controls, image/URL fixes.
- **Verification performed**: `/api/herbs/categories` → 6 distinct categories; `GET /api/herbs` returns `total=6, totalPages=2` for limit 9... (default 9, 6 herbs → totalPages 1; earlier check with limit 5 → totalPages 2); `?category=Adaptogen` → Ashwagandha; `?q=ashwagandha` → Ashwagandha; `npm run build` passes; no stale `filteredPlants` references.

### Phase 4 — Multilingual Hindi i18n (all complete, 4.1–4.9)
- Installed `i18next` + `react-i18next` (4 packages; `npm install` reported **25 pre-existing vulnerabilities**: 3 low / 5 moderate / 16 high / 1 critical — NOT introduced by this work; see "Known issues").
- `frontend/src/i18n.js` — i18next init; language persisted in `localStorage['language']` ('hi' or 'en', default 'en'); sets `document.documentElement.lang`.
- `frontend/src/LanguageSwitcher.jsx` — EN↔हिंदी toggle, `variant="default" | "inverse"` prop.
- `frontend/src/locales/en.json` + `hi.json` — namespaces: brand, common, nav, footer, landing, home, auth, register, reset, profile, settings, admin, creator, bookmarks, chat, tour, about, story, quiz.
- `frontend/src/index.css` — Devanagari font stack on `html[lang='hi']` (Noto Sans Devanagari / Nirmala UI / Mangal).
- `frontend/src/main.jsx` imports `./i18n`.
- **Refactored to `useTranslation()`:** Navbar, Footer, LandingPage, Home, About, Story, Bookmarks, Quiz, Settings, UserProfile, Logout, Login, Register, Reset, Chatbot, VirtualTour; admin `Navigation`, `Dashboard`, `Users`, `Logs`, `ManageContent`; content-creator `Sidebar`, `ContentCreatorDashboard`, `Profile`, `MyHerbs`, `AddHerb`.
- Deliberate scope decisions: herb/category names, quiz options, and story/chat text bodies stay English (data-level content, not UI chrome).
- **Verified:** `npm run build` passes (618 kB JS / 53 kB CSS; only chunk-size warning); both locale JSON parse; script scan of every `t('…')` shows all keys resolve in both files (only `bookmarks.count`, which resolves via plural `count_one`/`count_other`). Lint on changed files shows only **pre-existing** error patterns (unused `React` import, missing prop-types, empty blocks) — none introduced by i18n.

### Phase 5 — UI polish / responsiveness (all complete, 5.1–5.8, verified)
- Responsive admin/content-creator sidebars (drawer/hamburger/backdrop on mobile, `md:ml-64`), dark-mode polish across admin/creator/user pages, responsive tables/typography, `LanguageSwitcher` in both sidebars. Production build passes.

### Admin bug fixes (Phases 1–4 of a dedicated fix plan, all complete & verified)
- **Root cause:** guarded backend routes return 401 when the JWT is missing, and `/herbs` returns a paginated object (not an array).
- **Phase 1 — core fixes:** `ManageContent.jsx` status-toggle + delete now send `Authorization: Bearer <token>`; `Dashboard.jsx` extracts `res.data?.data` for the herbs card and sends the token to `/users/getCount`.
- **Phase 2 — shared auth helper:** `frontend/src/api.js` `API` axios instance now has a **request interceptor** that auto-attaches `Authorization: Bearer ${localStorage.getItem('token')}`. Refactored `ManageContent.jsx`, `Dashboard.jsx`, `Users.jsx` to use `API` (removed manual header boilerplate). Content-creator pages already sent tokens correctly and were left unchanged.
- **Phase 3 — real activity/logs:** new backend `Activity` model (`models/activityModel.js`), `logActivity` helper (`utils/activityLogger.js`), `GET /api/activity` (admin-only) via `controllers/activityController.js` + `routes/activityRoutes.js` (mounted in `app.js`). `herbController.js` logs create/update/delete/activate/deactivate; `userController.js` logs login/block/unblock/delete. `RecentActivityTable.jsx` + `LogsTable.jsx` now fetch real activity (replacing static mock data); i18n keys added to `en.json`/`hi.json`. Activity is **forward-looking only** (no backfill).
- **Phase 4 — verification:** `node --check` passes on all backend files; frontend builds; full admin action matrix verified live (login, getCount, herb list, status toggle, create/delete herb, block/unblock/delete user, activity feed reflecting every action). Lint shows only pre-existing patterns (unused `React` import, prop-types) — none new.
- Related earlier fixes: `createContentCreator` route made public; `createHerb` now maps `category`/`benefits`/`careInstructions`; `ManageContent.jsx` fixed the `herbs.map is not a function` response-shape bug; first admin account was created (see credentials note in session).

---

## What is LEFT

### Phase 6 — Production hardening / tests / deployment
- **Tests**: none exist. Add backend tests (Jest/Supertest or node:test — decide framework) for auth, herb endpoints, bookmarks, admin middleware; add at least a smoke set of frontend tests (Vitest). Add a `test` script to `package.json`.
- **`frontend/.env.example` is missing `VITE_GEMINI_API_KEY`** (used by `Chatbot.jsx` → Gemini 1.5-flash) — add it + document all env vars.
- **Docker**: add `Dockerfile` + `docker-compose.yml` for backend + frontend + MongoDB.
- **CI/CD**: GitHub Actions workflow (lint → build → test → optional deploy). Repo is **not yet a git repo** (`Is directory a git repo: no`) — may need `git init` + first commit.
- **Security hardening** (backend): rate limiting (express-rate-limit) on auth routes, `helmet`, CORS tightening, input validation (currently minimal), secure cookie/refresh-token option, and a review of the 25 `npm audit` findings (esp. 1 critical) — run `npm audit` and triage.

---

## Known issues / audit notes (carry-forward)
1. **25 npm vulnerabilities** (pre-existing): 3 low, 5 moderate, 16 high, 1 critical. Triage in Phase 6.
2. **Chatbot** (`frontend/src/UserInterface/Routes/LoginPages/Chatbot.jsx`) uses `import.meta.env.VITE_GEMINI_API_KEY` — undocumented in `.env.example`.
3. Admin/content-creator panels were previously non-responsive (`ml-64` wrappers, fixed sidebar) — **resolved in Phase 5**.
4. Lint baseline is dirty (many unused `React` imports, missing prop-types). It is **not** introduced by recent work and not yet "clean" — `npm run lint` currently fails if run at repo level. Consider adding prop-types or disabling rules in Phase 6.
5. Story content, herbal data, quiz options, and Chatbot knowledge base remain English by design (content data, not UI).
6. Activity/logs are **forward-looking only** — no backfill of actions that occurred before the Activity model was added (2026-09-02).

---

## How to run / verify
Backend: `cd backend && npm install && npm run dev` (expects a local MongoDB; check `backend/.env`). Frontend: `cd frontend && npm install && npm run dev`. Build check: `cd frontend && npm run build`.

Fast Phase 1–3 sanity script (PowerShell, from repo root):
```
npm install --prefix backend; npm install --prefix frontend
# start backend, then:
curl.exe http://localhost:5001/api/herbs/categories
curl.exe "http://localhost:5001/api/herbs?q=ashwagandha"
curl.exe "http://localhost:5001/api/herbs?category=Adaptogen"
```

Next session: start with **Phase 6 (tests → Docker → CI/CD → security)**. All Phase 1–5 features and the admin bug-fix plan are complete and verified.
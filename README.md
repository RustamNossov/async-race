# Async Race

**Self-estimated score: 400/400** (code quality 100 pts is reviewer-discretionary; all functional requirements implemented)

**UI deployment link:** https://fanciful-pudding-5461c5.netlify.app/

---

## Checklist / 400 pts

### 🚀 UI Deployment
- [x] Deployment Platform: Netlify — https://fanciful-pudding-5461c5.netlify.app/

### ✅ Requirements to Commits and Repository
- [x] Commit guidelines compliance (conventional commits: `init:`, `feat:`, `refactor:`, `fix:`, `docs:`)
- [x] Checklist included in README.md
- [x] Score calculation in README.md
- [x] UI deployment link in README.md

### Basic Structure (80 points)
- [x] Two Views: Garage and Winners
- [x] Garage View Content
  - [x] Name of view
  - [x] Car creation and editing panel
  - [x] Race control panel
  - [x] Garage section
- [x] Winners View Content
  - [x] Name of view
  - [x] Winners table
  - [x] Pagination
- [x] Persistent state between views

### Garage View (90 points)
- [x] CRUD operations for cars (create / update / delete; delete also removes from winners)
- [x] Color selection and display on car image (RGB color picker)
- [x] Create 100 random cars (20 brands × 30 models, random hex color)
- [x] Car management buttons (SELECT / DELETE near each car)
- [x] Pagination: 7 cars per page
- [x] Empty garage handling ("No cars in the garage yet. Create some!")
- [x] Page adjustment after deleting last car on page

### Winners View (50 points)
- [x] Display winners (wins incremented, best time kept on repeat win)
- [x] Pagination: 10 winners per page
- [x] Winners table with required columns (№, icon, name, wins, best time)
- [x] Sorting by wins and best time (server-side via `_sort` / `_order` query params)

### Race (170 points)
- [x] Start engine animation with API flow (`startEngine` → velocity/distance → animate → `drive`)
- [x] Stop engine animation and return car (await `stopEngine` response → reset position)
- [x] Responsive animation for 500px screens (track width computed dynamically)
- [x] Start race button for current page (`Promise.allSettled` over all cars on page)
- [x] Reset race button (stops all engines, returns cars to start)
- [x] Winner announcement banner (shows name and time)
- [x] Button states (A disabled while driving; B disabled while idle; race/reset toggled)
- [x] Predictable actions during race (pagination disabled mid-race; edit cleared on race start)

### Prettier and ESLint Configuration (10 points)
- [x] Prettier scripts: `format` (write) and `ci:format` (check)
- [x] ESLint setup with Airbnb + airbnb-typescript; `strict: true`, `noImplicitAny: true`

### Overall Code Quality (100 points) — _reviewer-evaluated, skip during self-check_
- [x] Modular design: API layer (`src/api/`), state (`src/store/`), UI (`src/components/`, `src/pages/`)
- [x] Small functions, no duplication, no magic numbers (constants in `src/utils/constants.ts`)
- [x] Clear names and readability; functions ≤ 40 lines
- [x] Extra React features: custom hook (`useCarAnimation`), React Router v6, Redux Toolkit

---

## Project Structure

```
src/
  api/          — fetch wrapper, typed request/response shapes, ApiError
  store/        — garageSlice, winnersSlice, raceSlice, typed hooks
  pages/        — GaragePage, WinnersPage
  components/   — garage/, winners/, common/, layout/
  hooks/        — useCarAnimation
  utils/        — constants, randomCar
```

## Running locally

```bash
# Start the mock API (port 3000)
cd async-race-api && npm start

# Start the frontend (port 5173)
npm install && npm run dev
```

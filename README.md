# Async Race

> `instructions.md` is the primary source of truth for this task. All development and acceptance criteria are derived from that file.

## Deployment

- UI deployment link: _to be added after deployment_
- Score: _to be calculated after implementation_

## Project Structure

- `instructions.md` — authoritative task requirements and evaluation criteria.
- `WORK_PLAN.md` — step-by-step implementation plan.
- `CLAUDE_PROMPT.md` — explicit AI prompt for following the task accurately.

## Checklist / 400 pts

### 🚀 UI Deployment
- [ ] Deployment Platform: GitHub Pages / Netlify / Vercel / Cloudflare Pages

### ✅ Requirements to Commits and Repository
- [ ] Commit guidelines compliance
- [ ] Checklist included in README.md
- [ ] Score calculation in README.md
- [ ] UI deployment link in README.md

### Basic Structure (80 points)
- [ ] Two Views: Garage and Winners
- [ ] Garage View Content
  - [ ] Name of view
  - [ ] Car creation and editing panel
  - [ ] Race control panel
  - [ ] Garage section
- [ ] Winners View Content
  - [ ] Name of view
  - [ ] Winners table
  - [ ] Pagination
- [ ] Persistent state between views

### Garage View (90 points)
- [ ] CRUD operations for cars
- [ ] Color selection and display on car image
- [ ] Create 100 random cars
- [ ] Car management buttons
- [ ] Pagination: 7 cars per page
- [ ] Empty garage handling
- [ ] Page adjustment after deleting last car on page

### Winners View (50 points)
- [ ] Display winners
- [ ] Pagination: 10 winners per page
- [ ] Winners table with required columns
- [ ] Sorting by wins and best time

### Race (170 points)
- [ ] Start engine animation with API flow
- [ ] Stop engine animation and return car
- [ ] Responsive animation for 500px screens
- [ ] Start race button for current page
- [ ] Reset race button
- [ ] Winner announcement banner
- [ ] Button state handling
- [ ] Predictable actions during race

### Prettier and ESLint Configuration (10 points)
- [ ] Prettier scripts: `format`, `ci:format`
- [ ] ESLint setup with Airbnb and TypeScript

### Overall Code Quality (100 points)
- [ ] Modular design
- [ ] Small functions, no duplication, no magic numbers
- [ ] Clear names and readability
- [ ] Extra React features if appropriate

## Notes for Claude

- `instructions.md` is the authoritative source for all requirements.
- `WORK_PLAN.md` contains the ordered implementation plan.
- Any implementation must preserve strict TypeScript types and follow the functional requirements set in `instructions.md`.
- Use this README to track completion and add deployment/link data when ready.

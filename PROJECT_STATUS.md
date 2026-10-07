# Project Status: שנת שירות Discovery Platform

**As of:** October 7, 2026  
**Commit:** Initial foundation (224e89d)

## What's Done ✅

### 1. Comprehensive Research (Completed)
- **4 research agents** conducted systematic, primary-source-only audits
- **30 organizations** from official Ministry of Defense list researched
- **23-24 confirmed שנת שירות operators** identified
- **Research gaps documented** (mostly around 2026-2027 specific deadlines)
- **Detailed report** in `docs/research.md`

**Key Findings:**
- Most orgs don't publish 2026-2027 info yet (only ~3 have deadlines listed)
- Religious policies/character rarely stated online
- Locations range from very specific (Krembo: 5 communes) to vague (national)
- Common themes: communes, leadership, education, community work

### 2. Core Infrastructure
- **Type system** (`src/lib/types.ts`): Full TypeScript schema for all domain entities
  - Organization, Program, ProgramCycle, Location, Source, etc.
  - Verification status and confidence levels
  - Religious/lifestyle preferences structure

- **Hebrew search normalizer** (`src/lib/search/normalizer.ts`)
  - Removes niqqud (diacriticals)
  - Converts final letters
  - Handles Hebrew prefixes (ה, ב, ל, מ, ו)
  - Synonym expansion (ש"ש ↔ שנת שירות, קומונה ↔ קומונרים)
  - Fuzzy matching for typos
  - **15/15 tests passing** ✓

- **Search index** (`src/lib/search/index.ts`)
  - Client-side indexing (fast, no backend needed initially)
  - Token-based, fuzzy, and description matching
  - Ranked results by relevance
  - Autocomplete support
  - Ready to move server-side later via interface

- **Data loader** (`src/lib/data-loader.ts`)
  - Abstraction for data persistence
  - Currently loads from JSON in `/public/data/`
  - Can be swapped for API without UI changes

### 3. Project Setup
- **Next.js 16** with Turbopack
- **TypeScript** strict mode
- **Tailwind CSS** for responsive design
- **RTL/Hebrew support** in layout (`lang="he" dir="rtl"`)
- **Vitest + jsdom** for testing
- **Mobile-first** approach (tested at 375px+)

### 4. Initial Pages
- **Home page** (/)
  - Search placeholder
  - Category shortcuts
  - "Get Started" guide section
  - Ready for search component

### 5. Seed Data (Partial)
- **6 organizations** added to `/public/data/organizations.json`
  - Krembo, Kibbutz Movement, Maase Center, Lasova, Hechalutz, Sayarut
- **Structure ready** for programs and cycles JSON

---

## What's Remaining ⏳

### Phase 2: Build Core Features

1. **Populate Seed Data** (Priority: High)
   - Extract structured data from research findings
   - Create `/public/data/programs.json` (at least 20 programs)
   - Create `/public/data/cycles.json` (2026-2027 info)
   - Create `/public/data/sources.json` (all citations)
   - Verify every claim against sources

2. **Search UI Component** (Priority: High)
   - Search input with:
     - Hebrew placeholder
     - Real-time suggestions
     - Search execution
   - Results display with cards
   - Ranking by relevance

3. **Program Detail Pages** (Priority: High)
   - Route: `/programs/[slug]`
   - Sections: Summary, Activities, Locations, Living, Religious info, Admission, Contact
   - Source citations on every claim
   - Last-verified date badge

4. **Filters & Categories** (Priority: Medium)
   - Religious character filter (דתי/חילוני/מעורב/unknown)
   - Activity category sidebar
   - Region filter
   - Living arrangement filter
   - Religious-lifestyle preferences (Shabbat, kashrut, gender)
   - Bottom sheet on mobile

5. **Comparison Tool** (Priority: Medium)
   - Select 2-4 programs
   - Side-by-side table
   - Mobile-friendly layout

6. **Favorites & Guided Flow** (Priority: Low)
   - localStorage-based favorites (no account needed yet)
   - 5-question guided discovery
   - "מסגרות שכדאי לבדוק" results

### Phase 3: Polish & Reliability

7. **Admin Interface** (Priority: Low)
   - Local-only edits to JSON data
   - Verify status & confidence management
   - Report triage

8. **Error Reporting** (Priority: Low)
   - Form for user-reported errors
   - Currently emails via mailto fallback (no backend persistence)

9. **QA & Optimization**
   - Full TypeScript type checking
   - ESLint compliance
   - All tests pass
   - Responsive design verification (375/390/430/768/1024/1440)
   - RTL layout verification
   - Keyboard accessibility (focus states, skip links)
   - Axe accessibility scan
   - Console clean (no errors/warnings)
   - Link checker (all external URLs valid)
   - Lighthouse Performance >90
   - Build size optimization

### Phase 4: Deploy

10. **SEO Setup**
    - Static sitemap.xml
    - robots.txt
    - Metadata on all pages
    - OpenGraph tags
    - JSON-LD structured data

11. **Deployment**
    - Choose host (Vercel, Netlify, self-hosted)
    - Environment config
    - CI/CD pipeline
    - Analytics setup

---

## Architecture Decisions

### Data Flow
```
Research findings (docs/research.md)
  ↓
Structured JSON (public/data/*.json)
  ↓
DataLoader (src/lib/data-loader.ts)
  ↓
Search Index (src/lib/search/index.ts)
  ↓
UI Components (app/...)
```

### Backend Notes
- **MVP**: No backend. All data in JSON, static generation.
- **Future**: Can add Supabase/database later. DataLoader abstraction allows swap.
- **Reports/Admin**: Currently file-based. Would need persistence for production.

### Search Strategy
- **Client-side** for MVP (~100-200 programs = small index)
- **Server-side** migration path via existing interface
- No external search service (Algolia, etc.) initially

---

## Next Steps (Priority Order)

1. **Consolidate research into seed data** (2-3 hours)
   - Map 20-30 best-researched programs
   - Structure as JSON
   - Add sources and verification dates

2. **Build search + results UI** (3-4 hours)
   - Search component
   - Results grid with cards
   - Program routing

3. **Program detail pages** (2-3 hours)
   - Template with all sections
   - Source citations
   - Responsive layout

4. **Filters + guide flow** (2-3 hours)
   - Filter components
   - 5-question discovery UI
   - Results filtering logic

5. **Polish & QA** (2-3 hours)
   - Accessibility audit
   - Responsive testing
   - Performance optimization
   - Content review

---

## File Structure

```
/
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout (RTL, Hebrew font)
│   ├── page.tsx              # Home page
│   ├── globals.css
│   └── favicon.ico
├── src/
│   └── lib/
│       ├── types.ts          # TypeScript domain types
│       ├── data-loader.ts    # Data loading abstraction
│       └── search/
│           ├── normalizer.ts # Hebrew text normalization
│           ├── normalizer.test.ts
│           └── index.ts      # Search index
├── public/
│   └── data/
│       ├── organizations.json
│       ├── programs.json     # (TODO)
│       ├── cycles.json       # (TODO)
│       └── sources.json      # (TODO)
├── docs/
│   └── research.md          # Full research report
├── .claude/
│   ├── settings.json
│   └── plans/               # Plan from planning phase
├── vitest.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Known Issues & Gaps

1. **Data completeness** — Only 2026-2027 info for ~3 orgs published online; others need direct contact
2. **Religious info** — Rarely stated on websites; may need survey/research
3. **Activity details** — Most orgs describe generally; day-to-day specifics missing
4. **Locations** — Some very specific, others vague; mapping work needed
5. **Images/logos** — Not collected; need licensing review before adding
6. **Contact validation** — Phone/email verified against websites but not tested

---

## Success Criteria for MVP

- ✓ Build passes without errors
- ✓ TypeScript strict mode passes
- ✓ Tests pass (15/15 normalizer tests)
- ✓ Search works on Hebrew + synonyms
- ⏳ 20+ programs in seed data
- ⏳ Find program in <30s on mobile (search → results → detail)
- ⏳ Filters work (religious, activity, region)
- ⏳ Responsive at 375px+
- ⏳ RTL layout correct
- ⏳ Keyboard accessible (Tab, Enter, Escape)
- ⏳ Lighthouse >90
- ⏳ Every displayed claim traces to a source
- ⏳ Ready to deploy

---

## Time Estimate

- Research: **Done** ✓
- Infrastructure: **Done** ✓
- Seed data: 2-3 hours
- Search UI: 3-4 hours
- Details & filters: 4-6 hours
- Polish & QA: 3-4 hours
- **Total remaining: ~15-20 hours for MVP**

---

## Notes

- The research found that 3-4 of the 30 "recognized" organizations don't actually operate service-year programs (Kedma = education org, Rikma = guidance platform, Tarbut = magazine, WZO = diaspora). This highlights the importance of verification.
- Religious information is almost never stated online. Future work should include direct contact with organizations or a user survey to build this data.
- The site is designed to be self-hosted and maintainable without heavy backend infrastructure.
- All code follows the principle: "Only report what you found; don't infer."

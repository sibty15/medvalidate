# MedValidate – Project Guide

MedValidate is a healthcare startup idea validation platform. It collects structured information about a startup idea, runs automated checks and AI-assisted analyses, and returns both surface‑level and deep insights to the user.

This document explains:

- The tech stack and architecture
- Main pages and user flows
- Dashboard structure (idea submission, results, deep analysis)
- How components and server actions work at a high level
- Current database schema (Supabase/PostgreSQL)
- Planned future enhancements (datasets, ML backend)

---

## 1. Tech Stack Overview

**Frontend**

- **Next.js (App Router)** – main web framework
- **React** – UI and component model
- **TypeScript** – type safety across the app
- **shadcn/ui components** – Cards, Buttons, Inputs, etc.
- **React Hook Form + Zod** – forms and validation
- **Sonner** – toast notifications

**Backend / Data**

- **Supabase** – hosted Postgres, auth, and API access
- **PostgreSQL** – main relational database (schema documented in `lib/db-schema.md`)

**Planned Future Backend**

- **FastAPI (Python)** – for ML/AI model execution, if/when we need a separate microservice for heavy or specialized validation logic.

---

## 2. High‑Level Architecture

- The app is organized under `app/` using the **App Router**.
- There is a logical split between:
  - **Public routes** (e.g. `(public)/login`) – auth and marketing pages.
  - **Authenticated routes** (e.g. `(authenticated)/dashboard/...`) – idea submission, results, settings, etc.
- Many pages are **Server Components** by default, with **Client Components** used for interactive parts (forms, hooks, `useSearchParams`, etc.), often wrapped in `<Suspense>`.

Data flow:

1. User signs in (Supabase auth).
2. Authenticated layout loads user context (e.g., `useAuth` hook).
3. User submits or selects a **startup idea**.
4. A **server action** (or API call) writes to Postgres and may trigger analysis.
5. Analyses/AI pipelines populate multiple tables (`scores`, `ai_insights`, `detailed_analysis_reports`, etc.).
6. Dashboard pages read from these tables and present the results: simple view vs deep analysis.

---

## 3. Main Pages and Flows

### 3.1 Public: Login

**File example:** `app/(public)/login/page.tsx`

- Uses a `LoginPageWrapper` component wrapped in:

  ```tsx
  <Suspense fallback={<Fallback />}>
    <LoginPage />
  </Suspense>
  ```

- `LoginPage` (client component) can safely use `useSearchParams` and other client hooks.
- The `Fallback` component shows a skeleton loader while the login UI is being prepared.

**Responsibilities:**

- Render login form.
- Handle redirects based on query params (e.g., `?redirect=/dashboard`).
- On success, route to the authenticated dashboard.

---

### 3.2 Authenticated: Dashboard (Overview)

**Location:** under `app/(authenticated)/dashboard/...`

The main dashboard gives an overview for the logged‑in user:

- List of submitted **startup ideas**.
- High‑level **scores** (feasibility, compliance, market demand, etc.).
- Quick links to:
  - Submit new idea
  - View full analysis
  - Download reports

**Data sources:**

- `startup_ideas` – basic info for each idea.
- `scores` – computed metrics per idea.
- Possibly `reports` – exported PDFs or similar assets.

---

### 3.3 Idea Submission Flow

Typically under something like `app/(authenticated)/dashboard/ideas/new` (exact path may vary).

**UI behaviours:**

- Form fields that map closely to `startup_ideas` columns:

  - `title`
  - `description`
  - `domain`, `subdomain`
  - `problem_statement`
  - `target_audience`
  - `unique_value_proposition`
  - `category`, `stage`
  - Optional: `team_size`, `funding_needed`, etc.

- Validation with **Zod**.
- Error messages shown via `FormMessage`.

**Server action (conceptual):**

- A server function is called on submit (via server actions or an API route) to:

  1. Validate the payload again on the server.
  2. Insert a row into `startup_ideas`.
  3. Initialize any default flags:
     - `fully_analyzed` – `false` at creation.
     - `full_analysis_done` – initially `false`/`null`, becomes `true` when deep analysis completes.
  4. Optionally queue or trigger an **analysis job** that fills in:
     - `scores`
     - `ai_insights`
     - `detailed_analysis_reports`
     - `risk_profiles`, etc.

- On success, a **Sonner toast** is shown and the user is redirected to the results page for that idea.

---

### 3.4 Results: Simple / Surface‑Level View

This view is oriented toward a **quick summary** for non‑technical users.

**Key elements (read‑only UI):**

- Overall **readiness / viability score** from `scores.readiness_score`.
- Core metrics:

  - `scores.feasibility`
  - `scores.compliance_score`
  - `scores.market_demand`
  - `scores.cultural_acceptance`
  - `scores.cost_viability`

- Basic **AI insights**:

  - High‑level `market_size`, `growth_rate`, `target_potential` from `ai_insights`.
  - Short recommendations or highlights.

**Data sources:**

- `startup_ideas`
- `scores`
- `ai_insights`

**Server behavior:**

- A server component (or server action) fetches aggregated data for one idea and passes it to client components.
- Flags like `startup_ideas.fully_analyzed` and `startup_ideas.full_analysis_done` are used to:

  - Show “analysis in progress” vs “results ready”.
  - Gate access to deeper views until background jobs complete.

---

### 3.5 Results: Deep / Detailed Analysis

The **deep analysis** view exposes richer domain‑specific information and is targeted at more advanced users (founders, analysts, investors).

**Typical sections:**

1. **Detailed Report**
   - From `detailed_analysis_reports`:
     - `executive_summary`
     - `market_analysis` (JSON)
     - `competitive_analysis` (JSON)
     - `customer_analysis` (JSON)
     - `risk_assessment` (JSON)
     - `recommendations` (JSON)

2. **Competitor Analysis**
   - From `competitor_analyses`:
     - `competitor_name`
     - `market_position`
     - `funding_raised`
     - `strengths` / `weaknesses` JSON
     - `market_share_estimated`

3. **Customer Segments**
   - From `customer_segments`:
     - `segment_name`
     - `segment_size_estimate`
     - `willingness_to_pay`
     - `pain_points` JSON

4. **Risk Profile**
   - From `risk_profiles`:
     - `risk_type`, `risk_name`, `risk_description`
     - `probability_percent`, `impact_level`
     - `mitigation_strategies` JSON

5. **Regulatory & Compliance**
   - From `regulatory_frameworks` and `compliance_checks`:
     - Key regulatory requirements for the category/jurisdiction.
     - Passed/failed rules for the idea.

6. **Market & Trend Data**
   - From `healthcare_market_data` and `market_trends`:
     - Market size and growth.
     - Current and emerging trends.
     - Opportunity scores, gaps, and trends relevant to the idea.

7. **Strategic Recommendations**
   - From `strategic_recommendations`:
     - `recommendation_type` and content.
     - `priority_level`
     - `expected_impact_on_score`
     - `implementation_difficulty`

8. **Benchmarking and Cases (if used)**
   - `failure_analyses` – case studies of failed startups and their lessons.
   - `success_analyses` – case studies of successful startups/exits.
   - `funding_sources` – matched potential investors or grants.

**Server behavior:**

- A server action or server component fetches **all** related records for the selected idea ID.
- Data is composed into a single structured object and passed into client components that render charts, tables, and rich descriptions.
- If `full_analysis_done` is still `false`, the UI can show partial content and a notice that deeper sections are still being generated.

---

### 3.6 Settings Page

**File example:** `app/(authenticated)/dashboard/settings/page.tsx`

Key points:

- Declared as a **client component** (`"use client";`).
- Uses `react-hook-form` + `zod` to manage and validate a simple profile form:

  - `fullName` (mapped from `users.full_name`)
  - `email` (mapped from `users.email`)

- On submit:
  - Makes an async call (server action or API call) to update the `users` table.
  - Uses **Sonner**’s `toast.success` to confirm updates.
- Avatar section:
  - Displays `user.avatarUrl` if available.
  - Fallback uses initials from `user.fullName` or `user.email`.
- Notifications and security:
  - Switches/buttons for:
    - Email notifications
    - Weekly summaries
    - Marketing updates
  - Security actions:
    - Change password
    - Enable 2FA
    - Delete account
  - These connect conceptually to auth and user settings in Supabase and/or custom backend logic.

---

## 4. Components and Server Actions

### 4.1 UI Components

Most UI components are imported from `@/components/ui`, following shadcn conventions:

- Layout/containers: `Card`, `CardHeader`, `CardContent`, `Separator`
- Inputs: `Input`, `Switch`, `Label`
- Feedback: `Form`, `FormField`, `FormItem`, `FormMessage`
- Icons: from `lucide-react` (e.g., `User`, `Bell`, `Shield`, `Camera`, etc.)
- Toasters: `toast` from `sonner`

These are **client components** that handle UX, form state, and validation.

### 4.2 Server Actions (Conceptual Design)

Server actions (or equivalent API routes) are responsible for:

- **Idea creation / updates**
  - Insert or update rows in `startup_ideas`.
  - Initialize or toggle `fully_analyzed` and `full_analysis_done`.
- **Triggering analyses**
  - Enqueue background jobs (or call external services/ML models).
  - Populate:
    - `scores`
    - `ai_insights`
    - `detailed_analysis_reports`
    - `risk_profiles`
    - `competitor_analyses`
    - `customer_segments`
    - `compliance_checks`
    - `strategic_recommendations`
- **Fetching aggregated results**
  - Given an `idea_id`, load all related rows from analysis tables.
  - Compose them into a single object for client rendering.
- **User profile management**
  - Read and write from/to `users`.

In future, server actions may also:

- Call a **FastAPI** service that runs intensive ML models.
- Cache results in Postgres or external caches for faster repeated access.

---

## 5. Database Schema Overview (Supabase/PostgreSQL)

The database schema is documented in `lib/db-schema.md`. Important tables (with brief purpose):

- **Core entities**
  - `users` – registered users and roles.
  - `startup_ideas` – main submitted ideas; contains:
    - Descriptive fields (title, description, domain, etc.)
    - Status and timestamps
    - Flags: `fully_analyzed` and `full_analysis_done`.

- **Scores and high‑level metrics**
  - `scores` – per‑idea numeric scores:
    - feasibility, compliance_score, market_demand, cultural_acceptance, cost_viability, readiness_score.

- **AI and detailed analysis**
  - `ai_insights` – core AI‑generated text fields (market size, growth, target potential, etc.) plus JSON insights.
  - `detailed_analysis_reports` – rich JSON‑backed deep reports for market, competition, customers, risk, and recommendations.

- **Market / environment**
  - `healthcare_market_data` – domain‑level market sizes, growth rates, gaps, trends, opportunity scores.
  - `market_trends` – trend‑level data with relevance scores.
  - `regulatory_frameworks` – rules and requirements by category/jurisdiction.

- **Validation / compliance**
  - `compliance_checks` – per‑idea rule evaluations (passed/failed, timestamps).

- **Customer & competition**
  - `customer_segments` – segments, size estimates, WTP, pain points.
  - `competitor_analyses` – competitor profiles, strengths, weaknesses, market share.

- **Risk & strategy**
  - `risk_profiles` – structured risk entries and mitigation strategies.
  - `strategic_recommendations` – prioritized strategic advice per idea.

- **Evidence & cases**
  - `success_analyses` – case studies of successful startups/exits.
  - `failure_analyses` – case studies of failed startups and lessons.

- **Funding and reports**
  - `funding_sources` – information on potential funders and their focus.
  - `reports` – generated report files, linked to ideas/users.

The application’s queries and server actions should treat these tables as the **single source of truth** for analyses.

---

## 6. Future Roadmap

### 6.1 Domain‑Specific Datasets

To improve the accuracy and depth of startup validation, MedValidate aims to integrate more specialized datasets, for example:

- Clinical guidelines and standards (to better estimate regulatory and clinical risk).
- Reimbursement rules and payer policies for different markets.
- Device and drug registries or approval databases.
- Real‑world evidence and outcome datasets (de‑identified, where allowed).
- More granular competitor and funding databases.

These will:

- Enrich `healthcare_market_data`, `market_trends`, and `regulatory_frameworks`.
- Improve `scores` and `risk_profiles` accuracy.
- Produce better `ai_insights` and `strategic_recommendations`.

### 6.2 FastAPI ML Backend

As the ML workload grows, we plan to:

- Introduce a **FastAPI** backend that exposes ML models via HTTP/JSON.
- Let Next.js server actions call FastAPI endpoints to:
  - Generate or refine scores.
  - Summarize large datasets into `ai_insights` and `detailed_analysis_reports`.
  - Run complex simulations or risk assessments.

FastAPI will:

- Handle model loading, versioning, and scaling.
- Integrate with vector stores or other ML infra where needed.
- Push results back into Supabase/Postgres for long‑term storage and retrieval.

---

## 7. Summary

- **MedValidate** combines Next.js/React UI with Supabase/Postgres to validate healthcare startup ideas.
- Users:
  - Submit ideas.
  - See quick, surface‑level results.
  - Dive into deep AI‑assisted analysis driven by a structured schema.
- The database schema is already designed for rich, multi‑table analysis.
- Roadmap:
  - Additional specialized healthcare datasets.
  - A FastAPI backend for more advanced ML models and analysis pipelines.
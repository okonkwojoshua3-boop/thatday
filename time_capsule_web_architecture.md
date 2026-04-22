# 🏗️ Web Architecture & System Design

## 1. Architecture Overview

**Architecture Style:**
- Jamstack + API aggregation layer
- Mobile-first PWA

**High-Level Components:**
- Frontend (Next.js)
- API Layer (Node.js / Edge Functions)
- Data Providers (3rd party APIs + static datasets)
- Image Generation Service
- Caching Layer (CDN + Redis)

---

## 2. System Breakdown

### 2.1 Frontend System

**Stack:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Responsibilities:**
- UI rendering
- State management
- User interactions
- Calling API layer
- Rendering share card preview

**Core Modules:**
- Date Picker Module
- Rewind Results Module
- Life Stats Module
- Share Card Module
- Error & Loading States

**State Management:**
- Lightweight: React Context / Zustand

**Routing:**
- `/` → Homepage (date selection)
- `/rewind/[date]` → Results page
- `/card/[id]` → Shareable card page

---

### 2.2 API Layer (Backend-for-Frontend)

**Stack Options:**
- Node.js (Express) OR
- Serverless (Vercel Functions / Cloudflare Workers)

**Responsibilities:**
- Aggregates multiple data sources
- Normalizes responses
- Handles caching
- Performs life stats calculations

**Endpoints:**

1. `GET /api/rewind?date=YYYY-MM-DD`
   - Returns:
     - song
     - event
     - famous_people
     - cost_data
     - life_stats

2. `GET /api/card?id=XYZ`
   - Returns card data payload

3. `POST /api/generate-card`
   - Input: structured rewind data
   - Output: image URL / base64

---

### 2.3 Data Aggregation System

**Sources:**
- Music charts API (historical)
- Historical events dataset (static JSON or API)
- Famous birthdays dataset
- Cost-of-living dataset (static + approximations)

**Strategy:**
- Preprocess datasets into normalized format
- Store frequently accessed data in cache

**Fallback Handling:**
- If missing data:
  - Show nearest available date
  - Or fallback message

---

### 2.4 Life Stats Engine

**Type:** Internal calculation service

**Inputs:**
- Selected date
- Current date

**Outputs:**
- Days lived
- Weeks/months/years
- Heartbeats
- Sleep hours
- Meals eaten
- Sunrises

**Implementation:**
- Pure functions (deterministic)
- Runs in API layer or client-side

---

### 2.5 Image Generation System

**Options:**
- Server-side rendering (Node Canvas / Puppeteer)
- Client-side Canvas (for faster MVP)

**Responsibilities:**
- Render shareable card
- Apply design templates
- Export PNG/JPEG

**Flow:**
1. User clicks “Generate Card”
2. Data passed to generator
3. Image created
4. Returned as downloadable asset

---

### 2.6 Caching System

**Layers:**

1. CDN (Vercel Edge / Cloudflare)
   - Cache API responses
   - Cache static assets

2. Application Cache (Redis or Edge KV)
   - Cache frequent dates (e.g., birthdays)

**Cache Strategy:**
- Key: `rewind:YYYY-MM-DD`
- TTL: 24h–7d depending on data

---

### 2.7 Storage System

**Needs:**
- Minimal for MVP

**Optional:**
- Store generated cards (S3 / Cloud storage)
- Store shareable links

---

## 3. Data Flow

### Rewind Flow
1. User selects date
2. Frontend calls `/api/rewind`
3. API:
   - Checks cache
   - Fetches from data sources
   - Computes life stats
   - Returns normalized response
4. Frontend renders UI

### Card Generation Flow
1. User clicks generate
2. Frontend sends data to `/api/generate-card`
3. Service generates image
4. Returns image URL/base64
5. User downloads/shares

---

## 4. Data Model (Simplified)

### Rewind Response
```
{
  date: string,
  song: {
    title: string,
    artist: string
  },
  event: {
    title: string,
    description: string
  },
  people: [
    { name: string, profession: string }
  ],
  costs: {
    bread: number,
    fuel: number,
    rent: number
  },
  life_stats: {
    days: number,
    heartbeats: number,
    sleep_hours: number
  }
}
```

---

## 5. Performance Considerations

- Precompute popular dates
- Use edge caching
- Lazy load sections
- Optimize images
- Keep API response < 500ms

---

## 6. Scalability Plan

**Phase 1 (MVP):**
- Serverless functions
- Static datasets

**Phase 2:**
- Add Redis caching
- Improve data accuracy

**Phase 3:**
- Personalization
- Heavy analytics

---

## 7. Security Considerations

- Rate limit API endpoints
- Validate input date
- Prevent abuse of image generation

---

## 8. Observability

- Logging (API errors)
- Performance monitoring (Vercel Analytics)
- Track:
  - API latency
  - Fail rates

---

## 9. Deployment

**Frontend + API:**
- Vercel

**Optional Services:**
- Cloudflare (CDN)
- AWS S3 (image storage)

---

## 10. System Diagram (Textual)

User → Frontend (Next.js)
     → API Layer
        → Cache (CDN/Redis)
        → Data Sources
        → Life Stats Engine
     ← Response

User → Generate Card
     → Image Service
     ← Image Output

---

## 11. Key Decisions

- Use serverless for speed of iteration
- Keep datasets partially static for reliability
- Optimize for shareability over deep accuracy

---

## 12. Open Technical Questions

1. Should image generation be client-side or server-side for MVP?
2. Which datasets are reliable enough for historical music?
3. Do we need persistent storage for share links early?
4. How accurate should cost-of-living data be?


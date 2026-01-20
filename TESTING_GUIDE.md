# Quick Test Guide: Verify AI Analysis Integration

## Pre-Test Checklist

### 1. Environment Setup
```bash
# Check .env file has GROQ_API_KEY
cat .env | grep GROQ_API_KEY
# Should output: GROQ_API_KEY=gsk_...
```

### 2. Run Database Migration
Open Supabase SQL Editor and run:
```sql
-- Add new columns if they don't exist
ALTER TABLE ai_insights 
ADD COLUMN IF NOT EXISTS competitors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]'::jsonb;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ai_insights' 
  AND column_name IN ('competitors', 'recommendations');
```

Expected output:
```
column_name      | data_type
-----------------+-----------
competitors      | jsonb
recommendations  | jsonb
```

---

## Test Scenario: Create & Analyze New Idea

### Step 1: Start Dev Server
```bash
cd medvalidate-nextjs
npm run dev
```

### Step 2: Login/Register
1. Navigate to `http://localhost:3000/login`
2. Login with existing account or register new one

### Step 3: Submit Test Idea
Go to `/dashboard/submit` and enter:

**Test Idea Details:**
```
Title: AI Mental Health Chatbot for Pakistani Students
Description: An AI-powered mental health support chatbot that provides 24/7 emotional support, 
stress management techniques, and crisis intervention for university students in Pakistan. 
The chatbot understands Urdu and English, respects cultural sensitivities, and connects 
users with licensed therapists when needed.

Category: Mental Health
Stage: Idea
Target Audience: University students aged 18-25 in major Pakistani cities
Problem: Mental health stigma and lack of accessible counseling services in universities
Value Proposition: Culturally-aware, anonymous, and affordable mental health support
Funding Needed: Under 1M PKR
```

### Step 4: Monitor Analysis
After submission, you should be redirected to `/dashboard/results`

**Expected Behavior:**
- Idea appears in "In Progress" tab with animated loading
- Wait 5-15 seconds for AI analysis to complete
- Idea moves to "Completed" tab with overall score

### Step 5: Verify Results Display

Click on the completed idea and verify these sections appear:

#### ✅ Score Breakdown (4 scores)
```
Market: [70-85]
Competition: [65-80]
Feasibility: [70-85]
Innovation: [70-85]
```

#### ✅ Market Analysis (3 metrics)
Should show AI-generated text like:
- Market Size: "PKR 2-5 billion mental health market in Pakistan..."
- Growth Rate: "15-20% CAGR over next 5 years..."
- Target Potential: "3-5 million university students..."

#### ✅ Competitive Landscape (NEW!)
Should show 3-5 competitors like:
- **Mindly**: Strong local presence, limited AI capabilities
- **Sehat Kahani**: Established telemedicine platform
- **InnerHour**: International player with Pakistan operations

#### ✅ AI Recommendations
Should show 3-4 actionable recommendations like:
- "Partner with 3-5 universities for pilot program"
- "Secure DRAP approval for mental health guidance"
- "Focus on Urdu localization for wider reach"

#### ✅ Risk Assessment
Should show compliance checks from AI:
- DRAP Regulatory Approval: [High/Low Risk]
- Data Privacy & Security: [Status]
- Medical Practice Licensing: [Status]

---

## Debugging

### Issue: Competitors Section Not Showing

**Check 1: Database Migration**
```sql
SELECT competitors, recommendations 
FROM ai_insights 
WHERE idea_id = (SELECT id FROM startup_ideas ORDER BY submitted_at DESC LIMIT 1);
```

If returns `column "competitors" does not exist`, run migration again.

**Check 2: Data is Stored**
If columns exist but show `null` or `[]`:
```sql
-- Check if AI analysis ran
SELECT * FROM scores WHERE idea_id = (SELECT id FROM startup_ideas ORDER BY submitted_at DESC LIMIT 1);
-- Should return 1 row with all scores filled
```

If no scores exist, analysis didn't run. Check server console for errors.

### Issue: Generic/Fake Competitors Still Showing

Example of FAKE competitors (old system):
```
Mental Health App A
Mental Health Platform B
```

Example of REAL AI competitors (new system):
```
Mindly
Sehat Kahani
InnerHour
```

**Solution:** Analysis used fallback. Check:
```bash
# Server console should show
✅ AI analysis complete for idea <id>

# NOT this:
AI analysis failed, falling back to legacy processing
```

**Fix:**
1. Check GROQ API key is valid
2. Check internet connection
3. Check Groq API quota/rate limits
4. Re-run analysis:
```sql
-- Delete old analysis
DELETE FROM scores WHERE idea_id = '<your-idea-id>';
DELETE FROM compliance_checks WHERE idea_id = '<your-idea-id>';
DELETE FROM ai_insights WHERE idea_id = '<your-idea-id>';

-- Then in your app, call:
-- await normalIdeaProcessing(ideaId)
```

### Issue: Recommendations are Score-Based, Not AI

**Fake recommendations (old):**
```
Focus on tightening regulatory compliance and refining your MVP.
Next step: validate your idea with 5–10 target customers.
```

**Real AI recommendations (new):**
```
Conduct pilot program with 3-5 hospitals in Lahore/Karachi
Secure DRAP approval early - start documentation within 30 days
Build partnerships with established healthcare providers
```

**Solution:** Same as above - AI analysis didn't run successfully.

---

## Success Criteria ✅

Your integration is working correctly if:

1. [ ] New ideas trigger AI analysis automatically
2. [ ] Console shows: `✅ AI analysis complete for idea <id>`
3. [ ] Competitors section appears with **real company names**
4. [ ] Recommendations are **specific and actionable** (not generic)
5. [ ] Market analysis has **specific numbers and projections**
6. [ ] All 4 compliance checks appear (not just 2)
7. [ ] No console errors related to missing columns

---

## Production Deployment Notes

Before deploying to production:

1. **Set Production GROQ_API_KEY** in Vercel/hosting environment variables
2. **Run Database Migration** on production Supabase instance
3. **Test Rate Limits**: Groq free tier has limits, consider upgrading
4. **Monitor Costs**: Each analysis = 1 API call (~$0.002-0.01 depending on model)
5. **Set Timeouts**: Add timeout handling for slow AI responses
6. **Add Retry Logic**: Retry failed AI calls 1-2 times before fallback

### Recommended Groq Models:
- **Development:** `llama-3.3-70b-versatile` (balanced)
- **Production:** `llama-3.3-70b-versatile` or `mixtral-8x7b-32768` (faster)

---

## Monitoring Queries

```sql
-- Count ideas by analysis status
SELECT 
  CASE 
    WHEN s.id IS NULL THEN 'analyzing'
    ELSE 'completed'
  END as status,
  COUNT(*) as count
FROM startup_ideas si
LEFT JOIN scores s ON si.id = s.idea_id
GROUP BY status;

-- Average scores across all ideas
SELECT 
  ROUND(AVG(market_demand)) as avg_market,
  ROUND(AVG(feasibility)) as avg_feasibility,
  ROUND(AVG(readiness_score)) as avg_readiness
FROM scores;

-- Ideas with AI-generated competitors
SELECT 
  si.title,
  jsonb_array_length(ai.competitors) as competitor_count
FROM startup_ideas si
JOIN ai_insights ai ON si.id = ai.idea_id
WHERE ai.competitors IS NOT NULL 
  AND jsonb_array_length(ai.competitors) > 0;
```

---

## Quick Reference: File Locations

```
medvalidate-nextjs/
├── app/
│   ├── actions/
│   │   ├── ai-actions/
│   │   │   └── SimpleResultsOfIdea.ts     ← AI prompt & analysis
│   │   ├── ideaCreationandBasicAnalysis.ts ← DB insertion
│   │   └── getIdeaWithBasicResults.tsx    ← API data fetch
│   └── (authenticated)/
│       └── dashboard/
│           └── results/
│               └── page.tsx                ← UI rendering
├── lib/
│   └── api.ts                              ← API exports
└── DATA_FLOW_ALIGNMENT.md                  ← This documentation
```

Happy testing! 🚀

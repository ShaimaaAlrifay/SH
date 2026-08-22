import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-120b'
const FRIENDLY_FALLBACK = 'صار خطأ بالاتصال. جرّب مرة ثانية.'

function extractSystemText(system) {
  if (!system) return ''
  if (typeof system === 'string') return system
  if (Array.isArray(system)) {
    return system.map((block) => block?.text || '').filter(Boolean).join('\n')
  }
  return ''
}

function toAnthropicShape(text) {
  return { content: [{ type: 'text', text }] }
}

async function callGemini(systemText, messages) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemText }] },
      contents,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Gemini responded with ${response.status}: ${detail}`)
  }

  const data = await response.json()
  const text = (data.candidates || [])
    .flatMap((c) => c?.content?.parts || [])
    .map((p) => p?.text || '')
    .filter(Boolean)
    .join('\n')

  if (!text) throw new Error('Gemini returned no text content')
  return text
}

async function callGroq(systemText, messages) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')

  const groqMessages = [
    { role: 'system', content: systemText },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: GROQ_MODEL, messages: groqMessages }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Groq responded with ${response.status}: ${detail}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  if (!text) throw new Error('Groq returned no text content')
  return text
}

/* ============================================================
   POST /api/generate-prd — turns an actual Areeb conversation
   into a structured PRDData object (see src/lib/prdSampleData.js
   for the exact shape the PDF renderer expects). Same
   Gemini-primary/Groq-fallback pattern as /api/chat, but both
   calls are forced into strict JSON-object output mode so the
   response can be parsed directly instead of scraped out of
   free-form prose.
   ============================================================ */
const MIN_USER_TURNS_FOR_PRD = 2

const PRD_SCHEMA_INSTRUCTIONS = `You are generating a Product Requirements Document from a real discovery conversation between a founder and "Areeb", an Arabic-first AI business analyst. The founder was speaking Arabic (Hejazi-Saudi dialect) — write every piece of actual analysis content (descriptions, problem/opportunity/solution text, goal descriptions, requirement descriptions, scope items, assumptions, open questions) in Arabic, matching the tone and specifics of what was actually discussed. Do not invent details the conversation never touched on — where something genuinely wasn't discussed, say so briefly rather than fabricating specifics.

Return ONLY a single JSON object (no markdown fences, no commentary) with EXACTLY this shape:

{
  "meta": { "projectName": string, "shortDescription": string, "projectSlug": string },
  "executiveSummary": {
    "description": string,
    "problem": string,
    "opportunity": string,
    "solution": string,
    "outcome": string,
    "keyInsights": [string, ...]
  },
  "problemAnalysis": {
    "currentState": string,
    "friction": string,
    "rootCause": string,
    "opportunity": string,
    "desiredState": string
  },
  "goals": [
    { "value": string, "name": string, "description": string, "measurement": string }, ...
  ],
  "functionalRequirements": [
    { "id": "FR-01", "title": string, "description": string, "priority": "Must" | "Should" | "Could" }, ...
  ],
  "userStories": [
    { "number": "01", "quote": string, "gloss": string, "acceptance": [string, ...] }, ...
  ],
  "scope": { "inScope": [string, ...], "outOfScope": [string, ...] },
  "assumptions": [string, ...],
  "openQuestions": [ { "question": string, "owner": string }, ... ]
}

Rules:
- "meta.projectSlug": a short (2-4 word) meaningful project identifier, Latin/English letters and underscores ONLY (no Arabic, no spaces, no other punctuation) — it becomes part of a downloaded filename. Transliterate or translate the Arabic project name / proper nouns into English as needed (e.g. a project called "مشروع لوفتس وكافيه أملج السياحي" should yield something like "Umluj_Loft_Cafe"; a smart-booking dashboard project could yield "Smart_Booking_Dashboard"). Use underscores between words, no leading/trailing underscore.
- "quote" in userStories must be a real first-person sentence in the founder's own words/dialect, reconstructed from what they actually said in the conversation — not a generic template. "gloss" is a short English translation of that quote.
- functionalRequirements: derive 4-10 concrete requirements from what was actually discussed; if the conversation never reached implementation detail, keep this list short and mark requirements that are inferred rather than stated.
- If the conversation is too thin to fill a field with real content, write a short honest Arabic note like "لم تتم مناقشة هذا الجانب بعد بالتفصيل" instead of inventing specifics.
- Every array must contain at least one item. Every string field must be non-empty.
- Output valid JSON only — it will be parsed programmatically.`

function buildPRDPrompt(messages) {
  const transcript = messages
    .map((m) => `${m.role === 'assistant' ? 'Areeb' : 'Founder'}: ${m.content}`)
    .join('\n\n')
  return `${PRD_SCHEMA_INSTRUCTIONS}\n\n--- CONVERSATION TRANSCRIPT ---\n\n${transcript}`
}

function stripJsonFences(text) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
}

/* Never trust raw model output for something that becomes a filename —
   strip anything that isn't [A-Za-z0-9_], collapse/trim underscores, and
   fall back to a generic slug if the result is empty (e.g. the model
   returned Arabic, punctuation-only, or omitted the field entirely). */
function sanitizeProjectSlug(raw) {
  const stripped = typeof raw === 'string' ? raw.replace(/[^A-Za-z0-9_]+/g, '_') : ''
  const collapsed = stripped.replace(/_+/g, '_').replace(/^_+|_+$/g, '')
  return collapsed || 'Areeb_PRD'
}

function normalizePRDData(raw) {
  const s = (v, fallback = 'لم تتم مناقشة هذا الجانب بعد بالتفصيل.') => (typeof v === 'string' && v.trim() ? v : fallback)
  const arr = (v) => (Array.isArray(v) && v.length ? v : [])

  const now = new Date()
  const prdId = `PRD-${now.getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return {
    meta: {
      projectName: s(raw?.meta?.projectName, 'مشروع بدون اسم'),
      shortDescription: s(raw?.meta?.shortDescription),
      projectSlug: sanitizeProjectSlug(raw?.meta?.projectSlug),
      prdId,
      version: 'v1.0',
      status: 'Draft',
      date,
    },
    executiveSummary: {
      description: s(raw?.executiveSummary?.description),
      problem: s(raw?.executiveSummary?.problem),
      opportunity: s(raw?.executiveSummary?.opportunity),
      solution: s(raw?.executiveSummary?.solution),
      outcome: s(raw?.executiveSummary?.outcome),
      keyInsights: arr(raw?.executiveSummary?.keyInsights).length
        ? raw.executiveSummary.keyInsights
        : ['لم تتم مناقشة هذا الجانب بعد بالتفصيل.'],
    },
    problemAnalysis: {
      currentState: s(raw?.problemAnalysis?.currentState),
      friction: s(raw?.problemAnalysis?.friction),
      rootCause: s(raw?.problemAnalysis?.rootCause),
      opportunity: s(raw?.problemAnalysis?.opportunity),
      desiredState: s(raw?.problemAnalysis?.desiredState),
    },
    goals: arr(raw?.goals).length
      ? raw.goals.map((g) => ({ value: s(g?.value, '—'), name: s(g?.name), description: s(g?.description), measurement: s(g?.measurement) }))
      : [{ value: '—', name: 'لم تُحدد مقاييس بعد', description: 'لم تتم مناقشة أهداف قابلة للقياس بعد بالتفصيل.', measurement: '—' }],
    functionalRequirements: arr(raw?.functionalRequirements).length
      ? raw.functionalRequirements.map((f, i) => ({ id: s(f?.id, `FR-${String(i + 1).padStart(2, '0')}`), title: s(f?.title), description: s(f?.description), priority: ['Must', 'Should', 'Could'].includes(f?.priority) ? f.priority : 'Should' }))
      : [{ id: 'FR-01', title: 'لم تُحدد متطلبات بعد', description: 'لم تصل المحادثة إلى تفاصيل وظيفية بعد.', priority: 'Should' }],
    userStories: arr(raw?.userStories).length
      ? raw.userStories.map((u, i) => ({ number: s(u?.number, String(i + 1).padStart(2, '0')), quote: s(u?.quote), gloss: s(u?.gloss, ''), acceptance: arr(u?.acceptance).length ? u.acceptance : ['لم تُحدد معايير قبول بعد.'] }))
      : [{ number: '01', quote: 'لم تتم مناقشة قصة مستخدم واضحة بعد.', gloss: '', acceptance: ['لم تُحدد معايير قبول بعد.'] }],
    scope: {
      inScope: arr(raw?.scope?.inScope).length ? raw.scope.inScope : ['لم يُحدد نطاق العمل بعد بالتفصيل.'],
      outOfScope: arr(raw?.scope?.outOfScope).length ? raw.scope.outOfScope : ['لم يُحدد ما هو خارج النطاق بعد.'],
    },
    assumptions: arr(raw?.assumptions).length ? raw.assumptions : ['لم تُطرح افتراضات صريحة أثناء المحادثة بعد.'],
    openQuestions: arr(raw?.openQuestions).length
      ? raw.openQuestions.map((q) => ({ question: s(q?.question), owner: s(q?.owner, 'Product') }))
      : [{ question: 'ما الخطوة التالية بعد هذا الملخص؟', owner: 'Product' }],
    governance: [
      { version: 'v1.0', date, change: 'تم توليد هذا المستند تلقائيًا من محادثة حقيقية مع أريب.', owner: 'Areeb', status: 'Draft' },
    ],
  }
}

async function callGeminiJSON(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Gemini responded with ${response.status}: ${detail}`)
  }

  const data = await response.json()
  const text = (data.candidates || [])
    .flatMap((c) => c?.content?.parts || [])
    .map((p) => p?.text || '')
    .filter(Boolean)
    .join('\n')

  if (!text) throw new Error('Gemini returned no text content')
  return JSON.parse(stripJsonFences(text))
}

async function callGroqJSON(prompt) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Groq responded with ${response.status}: ${detail}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  if (!text) throw new Error('Groq returned no text content')
  try {
    return JSON.parse(stripJsonFences(text))
  } catch (err) {
    // json_object mode occasionally returns truncated/malformed JSON — log
    // the actual raw text (truncated) so a real failure is diagnosable
    // instead of just "Unexpected token" with no context.
    console.warn('[areeb-proxy] Groq returned invalid JSON, first 400 chars:', text.slice(0, 400))
    throw new Error(`Groq JSON parse failed: ${err.message}`)
  }
}

async function withRetries(fn, attempts, delayMs) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) {
        console.warn(`[areeb-proxy] attempt ${i + 1}/${attempts} failed, retrying in ${delayMs}ms:`, err.message)
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }
  throw lastErr
}

app.post('/api/generate-prd', async (req, res) => {
  const messages = req.body?.messages || []
  const userTurns = messages.filter((m) => m.role === 'user').length

  if (userTurns < MIN_USER_TURNS_FOR_PRD) {
    res.status(400).json({ error: 'insufficient_conversation', message: 'المحادثة لسا قصيرة. كمل الحوار مع أريب شوي أكثر قبل ما تولّد المستند.' })
    return
  }

  const prompt = buildPRDPrompt(messages)

  try {
    const raw = await callGeminiJSON(prompt)
    res.status(200).json(normalizePRDData(raw))
    return
  } catch (err) {
    console.warn('[areeb-proxy] Gemini PRD generation (primary) failed, falling back to Groq:', err.message)
  }

  /* Groq is currently the sole working provider while Gemini's free daily
     quota is exhausted (confirmed: 20 req/day cap hit repeatedly) — no
     redundancy left if a single Groq call has a transient hiccup (network
     blip, or json_object mode occasionally returning malformed JSON), so
     retry a couple of times before actually giving up. */
  try {
    const raw = await withRetries(() => callGroqJSON(prompt), 3, 2000)
    res.status(200).json(normalizePRDData(raw))
    return
  } catch (err) {
    console.warn('[areeb-proxy] Groq PRD generation (fallback) also failed after retries:', err.message)
  }

  res.status(502).json({ error: 'generation_failed', message: 'تعذر توليد المستند من المحادثة. جرّب مرة ثانية.' })
})

app.post('/api/chat', async (req, res) => {
  const systemText = extractSystemText(req.body?.system)
  const messages = req.body?.messages || []

  try {
    const text = await callGemini(systemText, messages)
    res.status(200).json(toAnthropicShape(text))
    return
  } catch (err) {
    console.warn('[areeb-proxy] Gemini (primary) failed, falling back to Groq:', err.message)
  }

  try {
    const text = await callGroq(systemText, messages)
    res.status(200).json(toAnthropicShape(text))
    return
  } catch (err) {
    console.warn('[areeb-proxy] Groq (fallback) also failed:', err.message)
  }

  res.status(200).json(toAnthropicShape(FRIENDLY_FALLBACK))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Areeb chat proxy listening on http://localhost:${PORT}`)
})

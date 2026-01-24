# Presentation Outline: Building a Vibe Coding Agent

**Duration:** 30 min
**Format:** Web slides, some with vibe-coded interactive demos

---

## Structure Overview

| Section | Duration | Slides |
|---------|----------|--------|
| Intro | 3 min | 1-4 |
| 1. Agent | 5 min | 5-10 |
| 2. Environment | 6 min | 11-21 |
| 3. Preview | 1 min | 22 |
| 4. Feedback | 5 min | 23-31 |
| Recap | 1 min | 32 |
| Live Demo | 3 min | 33 |
| Bonus + Conclusion | 4 min | 34-38 |

---

## Slides

### INTRO (3 min)

**Slide 1: Title**
```
Let's Build a Vibe-Coding Agent!

Alexey Taktarov
CopenhagenJS · Jan 22, 2026 · Famly
```
- Type: Simple (title)

---

**Slide 2: Context**
```
You've probably used:
• Claude Code
• Cursor / Codex
• Lovable / Bolt / v0

What if you could build your own?
```
- Type: Simple (bullet points)

---

**Slide 3: My Background**
```
• Experimented with agents
• Built mini-apps
• Worked at an agent startup
• Got curious: can I build one myself?
```
- Type: Simple

---

**Slide 4: The 4 Components**
```
┌─────────────────────────────────────┐
│  1. Agent      LLM + tools + prompt │
│  2. Environment   files + build     │
│  3. Preview       show result       │
│  4. Feedback      close the loop    │
└─────────────────────────────────────┘
```
- Type: **DEMO** — Animated diagram, components appear one by one
- Idea: Boxes stack/connect with arrows

---

### 1. AGENT (6 min)

**Slide 5: What is an Agent?**
```
LLM: question → answer

Agent: question → action → result → action → result → done
```
- Type: **DEMO** — Animated loop visualization
- Idea: Show the cycle spinning, messages going back and forth

---

**Slide 6: Tool Calling Explained**
```
You: "Write a React component"

Agent: "OK, call tool: write_file"
       { path: "app.tsx", content: "..." }

You: "Done, file written"

Agent: "Great, now call tool: bundle"
       ...
```
- Type: **DEMO** — Chat-like animation with tool calls appearing
- Idea: Fake chat UI, messages stream in, tool calls highlighted

---

**Slide 7: Agent = Prompt + Tools**
```
Agent is just:
• System prompt (instructions)
• Set of functions it can call

That's it. No magic.
```
- Type: Simple

---

**Slide 8: Where Tools Run**
```
Common misconception: tools run in the cloud

Reality: tools run on YOUR machine
         YOU call them, return results

(Exception: server-side tools like
 Claude's web search, OpenAI's code interpreter)
```
- Type: Simple with small diagram

---

**Slide 9: JS Frameworks for Agents**
```
Python: LangChain, LangGraph

JavaScript:
• OpenAI Agents SDK
• Mastra
• Vercel AI SDK ← my choice (good UI support)
```
- Type: Simple (logos if available)

---

**Slide 10: Models with Tool Calling**
```
| Model              | Input $/1M | Output $/1M | Context |
|--------------------|------------|-------------|---------|
| Claude Opus 4.5    | $5         | $25         | 200K    |
| Claude Sonnet 4    | $3         | $15         | 200K    |
| GPT-4o             | $2.50      | $10         | 128K    |
| Gemini 2.5 Pro     | $1.25      | $10         | 1M      |
| DeepSeek V3        | $0.27      | $1.10       | 64K     |

My choice: Claude (best at code + tool use)
Compare: lmarena.ai/leaderboard
```
- Type: Simple (table)
- Note: Цены меняются, проверить перед докладом

---

**Slide 12: Code — Defining a Tool**
```typescript
const edit_file = tool({
  description: 'Edit file by replacing string',
  parameters: z.object({
    path: z.string(),
    old_string: z.string(),
    new_string: z.string(),
  }),
  execute: async ({ path, old_string, new_string }) => {
    const content = await Bun.file(path).text()
    const updated = content.replace(old_string, new_string)
    await Bun.write(path, updated)
    return { success: true }
  }
})
```
- Type: **CODE** — Syntax highlighted, maybe line-by-line reveal
- Note: This is from real meta-ficus code

---

### 2. ENVIRONMENT (7 min)

**Slide 13: We Need a Filesystem**
```
Agent can generate code...
but where does it go?

Options:
• Local disk
• Cloud storage
• Virtual FS (AgentFS by Turso)
• In-memory
```
- Type: Simple

---

**Slide 14: My Approach — Tools + Template**
```
template/                        Tools:
├── app.tsx    ← write_file     ┌─────────────────────┐
├── index.tsx  ← read only      │ ls()                │
├── db.ts      ← push_schema    │ read_file(path)     │
├── package.json                │ write_file(path)    │
└── tailwind.config.ts          │ edit_file(old, new) │
                                │ push_schema(schema) │
Artificial limit:               │ bundle()            │
Agent can ONLY write app.tsx    │ rename_widget(name) │
                                └─────────────────────┘
```
- Type: **DEMO** — Animated folder + tools that highlight what they touch
- Idea: Show arrow from tool to file it affects

---

**Slide 17: The Edit Problem**
```
write_file = slow (streams entire content)

Change one line?
→ Rewrite entire file
→ Slow again

Solution: edit_file tool
```
- Type: **DEMO** — Animation showing streaming text (slow) vs quick replace

---

**Slide 18: Edit = Replace All**
```typescript
edit_file({
  path: "app.tsx",
  old_string: "Hello World",
  new_string: "Hello DKjs"
})

// Just string.replace()
// Same pattern Claude Code uses
// Simple > clever
```
- Type: CODE

---

**Slide 19: Building — The Options**
```
| Tool               | Environment      | Details                    |
|--------------------|------------------|----------------------------|
| Bolt.new           | WebContainers    | Node.js in browser (WASM)  |
| Lovable            | Cloud + Supabase | Server-side, GitHub sync   |
| v0 (Vercel)        | Components only  | No runtime, just generates |
| Replit             | Container/VM     | Server-side isolation      |
| Cursor, Claude Code| Local            | Your machine               |
| ─────────────────  | ─────────────    | ────────────────────────── |
| → My approach      | Local + Bun      | Simple folder + Bun.build  |
```
- Type: **DEMO** — Table appears row by row, last row highlighted
- Idea: Show the spectrum, then zoom into our choice

---

**Slide 20: Why Bun**
```
Bun = all-in-one toolkit

• Package manager (fast)
• TypeScript support (native)
• Bundler (built-in)
• Web server (one line)
• SQLite (built-in)

No config. Agents love it.
```
- Type: Simple (Bun logo)

---

**Slide 21: Bun Build**
```typescript
await Bun.build({
  entrypoints: ['index.tsx'],
  outdir: 'builds/' + widgetId,
  target: 'browser',
  format: 'esm',
  plugins: [tailwindPlugin]
})

// Input: TypeScript + React
// Output: widget.js + widget.css
```
- Type: CODE

---

**Slide 22: Bundle Tool**
```
Agent calls: bundle()

→ Runs Bun.build()
→ Returns preview URL
→ Agent can now see the result
```
- Type: Simple with arrow flow

---

### 3. PREVIEW (1 min)

**Slide 23: Preview in iframe**
```
┌─────────────────────────────────────┐
│  Chat          │    Preview         │
│                │   ┌───────────┐    │
│  > make it red │   │           │    │
│                │   │  [widget] │    │
│  ✓ Done        │   │           │    │
│                │   └───────────┘    │
└─────────────────────────────────────┘
```
- Type: **DEMO** — Mock editor UI with chat + iframe preview
- Idea: Show the actual layout, maybe animate a change

---

### 4. FEEDBACK (6 min)

**Slide 24: The Feedback Loop**
```
Agent writes code
       ↓
Build might fail
       ↓
App might crash
       ↓
UI might be broken

Agent needs to SEE what happened.
```
- Type: **DEMO** — Animated cycle with error states
- Idea: Red flashes for errors, loop visual

---

**Slide 25: Console Bridge**
```
┌─────────────┐     postMessage     ┌─────────────┐
│   iframe    │ ──────────────────→ │   parent    │
│  (widget)   │                     │   (chat)    │
│             │  { console.error }  │             │
└─────────────┘                     └─────────────┘
```
- Type: **DEMO** — Animated message passing between two boxes

---

**Slide 27: Screenshots**
```
Code works but looks wrong?

→ Multimodal models can SEE images
→ Send screenshot to agent
→ Agent understands visual bugs
```
- Type: Simple

---

**Slide 28: Screenshot Challenge**
```
Can't screenshot DOM element directly.

html2canvas? → Inaccurate, no iframe/SVG

Solution: Headless Chrome
• Puppeteer
• Browserless (Docker)
```
- Type: Simple

---

**Slide 29: Screenshot Pipeline**
```
1. Puppeteer opens preview URL
2. Waits for render
3. Takes screenshot (2x scale)
4. Converts to WebP
5. Returns to model as image
```
- Type: **DEMO** — Animated pipeline, screenshot appearing

---

**Slide 30: Client-Side Tools**
```
Problem: console logs are in iframe
         server tools can't access them

Solution: client-side tools
         → Tool executes in browser
         → Returns result to stream
         → Chat continues
```
- Type: Simple with diagram

---

**Slide 31: Generative UI**
```
Agent: "Pick a style"

┌─────────────────────────┐
│ ○ Minimal               │
│ ○ Modern                │
│ ○ Crazy                 │
└─────────────────────────┘

→ Client-side tool renders buttons
→ User clicks
→ Result sent back to agent
```
- Type: **DEMO** — Interactive buttons that animate selection

---

**Slide 32: What We Built — Recap**
```
┌─────────────────────────────────────┐
│  1. Agent      AI SDK + Claude      │ ──→ tools
│  2. Environment   Folder + Bun      │ ──→ build
│  3. Preview       iframe            │ ──→ show
│  4. Feedback      Console + Screenshots │ ──→ loop
└─────────────────────────────────────┘

This is a working vibe coding agent.
```
- Type: **DEMO** — Same as Slide 4 but now all connected, animated flow

---

### LIVE DEMO (3 min)

**Slide 33: Live Demo**
```
Let me show you the real thing.

[Live demo of the product]
```
- Type: **LIVE DEMO** — Show meta-ficus/Tan in action
- Idea: Create a simple widget from scratch, show the loop

---

**Slide 34: Design Tips (Bonus)**
```
Making agents produce good design:

• Explicit guidelines in prompt
• Limit Tailwind to good defaults
• Specify icon set (Heroicons > Lucide)
• Provide reference mockups
• Use screenshots for feedback
```
- Type: Simple

---

### CONCLUSION (3 min)

**Slide 36: Dario Amodei Quote**
```
Today at World Economic Forum:

"We might be 6-12 months away from
 when the model is doing most, maybe all
 of what software engineers do."

"I have engineers who say I don't write
 code anymore. I just edit and do the
 things around it."
```
- Type: Simple (quote style, maybe his photo)

---

**Slide 37: The Real Gap**
```
The gap is NOT models.
Claude is already smart enough.

The gap is TOOLS.
How well you design them.
```
- Type: Simple with emphasis

---

**Slide 38: Takeaways**
```
• Choose boring technology
• Introduce artificial limits
• Design for good DX

If you want to stay in the industry:
Learn to BUILD agents, not just USE them.
```
- Type: Simple

---

## Demo Ideas Summary

| Slide | Demo Type | Description |
|-------|-----------|-------------|
| 4 | Animated diagram | 4 components appearing, connecting |
| 5 | Loop animation | Agent cycle: question → action → result |
| 6 | Chat mockup | Fake chat with tool calls streaming |
| 14 | Folder + Tools | Template structure + tools that affect files |
| 15 | Comparison | Slow streaming vs fast replace |
| 19 | Table animation | Environments table, highlight our choice |
| 22 | Editor mockup | Chat + preview layout |
| 23 | Error cycle | Feedback loop with error states |
| 25 | Message bridge | postMessage between iframe and parent |
| 28 | Pipeline | Screenshot capture flow |
| 30 | Interactive buttons | Generative UI example |
| 32 | Full flow | All 4 components connected |
| 33 | **LIVE DEMO** | Real product demo |

---

## Notes

- Keep code slides minimal (10-15 lines max)
- Demos should be self-explanatory, no voiceover needed
- Quote slide (35) is the emotional peak — pause here
- Live demo (33) is the payoff — prepare a simple widget to build

# Let's Build a Vibe-Coding Agent
## Speaker Script — CopenhagenJS, Jan 22, 2026

---

## INTRO

### Slide 1: Title
**Let's Build a Vibe-Coding Agent!**
Alexey Taktarov · CopenhagenJS · Jan 22, 2026 · Famly

> Hello everyone! Today I'm going to talk about AI coding agents.

---

### Slide 2: Tools Overview
*[Cards animate in: Claude Code/Cursor/Codex, Bolt, v0, Lovable]*

> AI coding is not something that will surprise you — I bet everyone is using it these days.
>
> You've probably used things like Claude Code, Cursor, or Codex — tools that live on your machine and produce code. Some are more autonomous, some are integrated in IDEs.
>
> But there's also a growing niche for "vibe coding" — products where you just type a prompt and don't need to be an engineer. They don't even require installing a dev environment. Things like Bolt, v0, Lovable. Lovable recently crossed $6B valuation and they're growing incredibly fast.

---

### Slide 3: Let's Build Our Own
**LET'S BUILD OUR OWN ONE.**

> So what if I tell you that anyone can build one now? This is not rocket science. The hard parts have been solved by Frontier AI Labs.
>
> By the end of this talk, you'll know how to build your own mini vibe-coding agent.

---

### Slide 4: What We Need to Build
*[4 cards highlight one by one]*
- **01 Agent** — The brain: LLM + tools
- **02 File System** — Where we store the code
- **03 Build + Preview** — How we show results to user
- **04 Feedback** — How agent knows something is wrong

> If we want to build an agent, let's define these components piece by piece:
>
> First, we need the **agent itself** — an AI that executes actions for us.
>
> Second, we need an **environment** — somewhere to store files.
>
> Third, we need a way to **build and preview** — transform code into something you can see.
>
> Finally, we need a **feedback loop**. This is actually the key component that allows agents to correct themselves without our intervention.

---

## AGENT

### Slide 5: Chat Timeline
*[Animated chat between Assistant and User]*

> So what exactly is an agent? The term is everywhere, but let me explain with an example.
>
> If you ask ChatGPT "write me a React component," it just spits out the code. That's it.
>
> But what if you need to create multiple files? You say "write me two components," and it says "here's file one, save it." You say "done, what's next?" It gives you file two. Then it says "now run npm build."
>
> You're basically being the hands for the AI. It tells you what to do, you execute.

---

### Slide 6: Tool Calling
*[3-column grid: Assistant / User / Computer]*

> Actually, no one does things like that anymore. There's a nice abstraction built into LLMs called **tool calling** or **function calling**.
>
> The difference? It's executed **automatically**. The model asks to do certain things with certain parameters — like "take this path and write this string to that file." You call the function, and pass the result back.
>
> Same conversation flow, but automatic.

---

### Slide 7: Definition
```
╔══════════════════════════════════════════╗
║   Agent = LLM + System Prompt + Tools    ║
╚══════════════════════════════════════════╝
```

> So that's the definition. An agent is just an LLM plus a system prompt plus tools. That's it.

---

### Slide 8: Frameworks
*[Python and JavaScript frameworks listed]*

> Now, how do we actually write this? There are many frameworks with these abstractions built in.
>
> For Python there's LangChain, LangGraph, LlamaIndex — we don't talk about that here at a JS meetup.
>
> For JavaScript, I personally recommend **Mastra** for background agents and workflows, and **Vercel AI SDK** which has great UI support. For this talk, I'm going with Vercel AI SDK.
>
> *[Step 2: others dim, Mastra and Vercel AI SDK highlighted]*

---

### Slide 9: Model Pricing
*[Table with models and pricing]*

> It's also important what model we choose. There's a website called LM Arena with a leaderboard that's constantly updated.
>
> Frontier models like Claude Opus 4.5, GPT-5.2, Gemini 3 Pro are excellent at coding. There are also open-source options like DeepSeek V3 and MiniMax M2.1 with different pricing.
>
> For this talk, I'm using Claude Opus — it's what I use in Claude Code by default.

---

### Slide 10: Code Structure
*[Code overview showing agent setup]*

> Here's a high-level overview of what it looks like in code. All frameworks follow the same approach:
>
> You define an agent, give it a system prompt, and provide a list of tools. Then you call `agent.generate()` with your prompt. That's it.

---

### Slide 11: Tool Example
*[write_file tool code]*

> If we expand a tool — like `write_file` — you'll see it needs a Zod schema so the model knows what parameters to output. Then it's just a regular async function that does something and returns results.

---

## FILE SYSTEM

### Slide 12: Environment
*[4 option cards]*

> Now we have the agent. Let's think about the environment. Where does the code actually live?
>
> **In Memory** — not really useful.
> **Local Disk** — simple, full access.
> **Virtual FS** — isolated layers, like AgentFS by Turso.
> **Container** — cloud or browser-based.

---

### Slide 13: Comparison
*[Table comparing products]*

> This is actually one of the most important decisions when building a vibe-coding platform.
>
> Cursor and Claude Code are **local** — they write to your machine.
> Lovable uses **cloud containers** plus Supabase.
> Bolt invented **WebContainers** — Docker running in your browser!
> Replit also uses **cloud containers**.
>
> *[Step 2: highlight "Our approach: Local + Bun"]*
>
> For this talk, we're keeping it simple: local file system with Bun.

---

### Slide 14: Project Files
*[Interactive file tree with preview]*

> Here's our project structure. It's intentionally minimal — just app.tsx, index.tsx, styles.css, and package.json.
>
> We specifically limit the agent to only write to one file for simplicity. No temptation to overcomplicate things.

---

### Slide 15: Core Tools
*[Animated: Agent calling ls, read_file, write_file]*

> The agent interacts with files through simple tools: `ls` to list files, `read_file` to read contents, and `write_file` to save changes.

---

### Slide 16: Edit Tool
*[edit_file code]*

> Here's a caveat: if you only have `write_file`, it's **slow**. Every change rewrites the entire file.
>
> The solution? An `edit_file` tool using find-and-replace. Takes a path, the old string, and the new string. Simple but very effective. This is what Claude Code uses under the hood.

---

## BUILD + PREVIEW

### Slide 17: Bun
*[Bun logo and features list]*

> Now we have files, but how do we display them in the browser?
>
> I decided to go with **Bun** — it's an all-in-one JavaScript toolkit. Package manager, TypeScript native, bundler, dev server. Super simple API. Agents love it.

---

### Slide 18: Bundle Tool
*[bundle tool code]*

> The missing piece is giving the agent a `bundle` tool. It calls `Bun.build()`, takes the HTML entry point, bundles TypeScript into JavaScript, and returns success or error logs.

---

### Slide 19: Preview Layout
*[UI skeleton: Chat on left, iframe on right]*

> Here's the UI layout. On the left, a chat interface showing the conversation and tool calls. On the right, an iframe with the live preview. The API connects them.

---

## FEEDBACK

### Slide 20: When Things Go Wrong
*[Two cards: Console Logs, Screenshots]*

> Now for feedback. LLMs aren't perfect — they make mistakes, programs crash. We need to give the agent a way to see what went wrong.
>
> Two main approaches:
> 1. **Console logs** — catch runtime errors and warnings
> 2. **Screenshots** — visual feedback for layout bugs

---

### Slide 21: Getting Console Logs
*[3-column diagram: Assistant / Server / Browser]*

> Let's start with console logs. How do we teach an agent to get them?
>
> Here's the catch: we can't do this on the server. We need **client-side tools** — tools that execute in the browser, not the agent loop.
>
> The tool call goes from Assistant → Server → Browser. Browser patches `console.log`, collects everything, and sends it back. Now the agent can see errors like "Cannot read 'map' at App.tsx:24".
>
> *[Step 6: "Tool executes in browser, not server!"]*

---

### Slide 22: Screenshot Tool *(removed)*

> *(Note: Screenshot slide was removed, but you can mention briefly)*
>
> For screenshots, we use Browserless with Puppeteer — headless Chrome that takes screenshots and passes images back to the multimodal model.

---

## DEMO

### Slide 23: Live Demo
**LIVE DEMO**

> Okay, enough theory. Let me show you how this actually works.
>
> I've built a demo — it's a tool for vibe-coding small real-time games and presentation widgets. Let me show you...
>
> *[Do live demo]*

---

## CONCLUSION

### Slide 24-26: Takeaways
*[Animated, one at a time]*

**01 — Coding agents are powerful**
> Understanding how they work makes you more effective.

**02 — The gap is not models — it's tools**
> The CEO of Anthropic said we're a year away from models doing most of what software engineers do. But models are already very capable. The actual gap is tools. Better context = better results.

**03 — Choose boring technology**
> Simple, straightforward tools that models understand well. Aim for good DX. You can even introduce artificial limits so the model is more focused.

---

### Slide 27: Thank You
**THANK YOU!**
@molefrog

> Thanks everyone! I'm @molefrog on Twitter/X. Happy to chat about agents, Bun, or anything else.

---

## QUICK REFERENCE

| Section | Slides | Key Points |
|---------|--------|------------|
| Intro | 1-4 | Products exist, let's build our own, 4 components |
| Agent | 5-11 | Chat → Tool calling → Frameworks → Code |
| File System | 12-16 | Environment options → Local+Bun → Edit tool |
| Build + Preview | 17-19 | Bun → Bundle tool → UI layout |
| Feedback | 20-21 | Console logs via client-side tools |
| Demo | 22 | Live coding demo |
| Conclusion | 23-25 | Three takeaways |

---

*Total slides: ~25*
*Estimated time: 20-25 minutes + demo*

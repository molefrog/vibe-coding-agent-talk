# Talk Transcript

When I was showing a draft of this talk to Tikhon, he said, "Everything looks great, you're going to do well. Just make sure there is a conclusion at the end." So I decided to start with conclusions — that way I have more time for the demo.

`empty slide with caption: "Conclusions"`

The first one is: great ideas stick. They can stay with us for years, quietly shaping our creative path. And then great technology helps to amplify those ideas. It might not be clear yet, but I hope by the end of this talk you'll get a glimpse of what I mean.

```slide

two list items appear:
01. Great ideas stick. They can stay with us for years, quietly shaping our creative path.

02. Great technology amplifies those ideas and unlocks new ways to express them.
```

This talk is about experiments I've been doing over the years and how they all have something in common.

---

```slide
Bret Victor talk: video and caption below
inventing on principle
2012, Bret Victor
```

A long time ago, I watched this great talk by Bret Victor called "Inventing on Principle." It's a classic. He speaks about why it's important to have a principle — and his own was that
"creates must have an immediate connection to what they are creating."

To illustrate that, he presented a bunch of interactive demos: a game editor with time travel with live reload, or diagrams of electrical circuts where every variable can be changed in real-time.

```slide
Javascript is the new punk rock
```

I was too young back then and didn't really have a principle. But what striked me was that he used JavaScript to make these interactive diagrams on his website. And around that time I also watched a talk by Stuart Memo "JavaScript is the new punk rock", where he built an guitar effect pedal embedded in his slides using Web Audio API, connected his guitar and played on stage.

That's how I discovered JavaScript.

```slide
Video of my PIDNN experiment
Caption: FIRST JS EXPERIMENTS
2013, PID Neural Network, JS + Tangle
```

I was so blown away by this technology so I decided to write a simple program to visualize how PID controller works. I made this slide where I actually used the library that Bret Victor made. It seems silly now, it was my first try.

---

```slide
Video of my Animation Talk
2018, React, React Motion
```

Fast forward some years. I was working on another presentation, and this was after I discovered React. I thought, "Wow, this is cool." Now you can do something like this but without raw JavaScript. It's more composable — like Lego blocks you can combine together.And then with react hooks, you can not only compose view components, but also reusable complex logic.

Way easier to create interactive things.
This was something I did to illustrate how to work with animations.

---

```slide
example of MDX with custom components
```

Time travel to 2022. I discovered MDX — a format that extends Markdown and lets you compile to React components. You can use custom React components within the text. I thought, "Wow, Now it's even easier to create interactive storytelling pieces."

```slide
Video of Domik.ltd
```

So I wrote this small short story, that my friend illustrated. The story had puzzles and games embedded in it. You can hover over elements, find hidden references, play with a small TV. There were games to unlock the second half of the book — you had to find hints in the text and complete a puzzle.

One thing I particularly like is this silly minigame where you could build your own house, take a picture of it, and save it.

---

```slide
Something about AI agents
```

And then comes AI. I got into LLMs, tried RAG, and got especially obsessed with **agents**.

```slide
Piano Agent pic + button to open modal with iframe
```

My first question was: what if an agent doesn't have a chat at all? What if you interact with it through something else entirely?

(open the iframe and show demo)

So I built this piano tutor. It's a piano you can play with Web Audio, and you can connect a MIDI device. But the interesting part: there's an agent running, and you interact with it by playing notes. It offers you options on screen, you respond by pressing keys. It can play melodies, give you exercises to repeat, teach you chords.

---

And then vibe coding happened. Tools like Lovable and v0 let you generate entire apps from prompts.

I thought: what if I build something similar, but intentionally constrain what it can generate? Barry Schwartz calls this the "paradox of choice" — too much freedom can actually reduce creativity.

So I built an agent that can only produce a specific type of app:

```slide
with these
```

1. **Embeddable** — fits on one screen, no routing, no scrolling. Can be embedded in a slide.
2. **Real-time by default** — local-first database built in, so you get a backend without thinking about it.
3. **Opinionated design** — curated set of libraries, strict design rules.

<live demo starts>

Let me show you a live demo. I log in — there's an OTP code — and now I'm in.

I can create a new app here. There are suggestions to help with the blank canvas problem — you don't always know what to build. There's also a gallery with community apps you can fork or use directly.

Let me paste a prompt and start building...

(demo: agent builds the app)

---

While it's working, let me explain the technical setup.

```slide
there is going to be a `ls` kind of slide with file system where you can expand folder to
show what the agent has access to
```

The agent has access to a sandboxed file system. It can read everything — source files, documentation, config. But it can only write to one file: `app.tsx`, the React component that renders on screen.

The packages are pre-installed and curated: React, Tailwind, Motion for animations, Heroicons, date-fns. No `npm install`, no adding dependencies. The agent works within these constraints.

For the tools, the agent has:

- `ls`, `read_file`, `write_file`, `edit_file` — standard file operations
- `bundle` — runs Bun's bundler and refreshes the preview
- `push_schema` — defines InstantDB tables, generates a typed `db.ts`
- `takeScreenshot` — captures the current preview so the agent can see what it built

The real-time database is InstantDB. The agent can create its own tables by calling `push_schema`. Once it does, it gets a typed client in `db.ts` that it can import and use.

---

`demo continues`

Since this is design engineering — how do you make sure agents produce good design? We all know about the purple background problem (though it's been improving).

My approach: a tool that asks you at the beginning what design style or theme you want. These are predefined themes — the agent can read the rules about aesthetics, font sizes, and so on. And you can always change the design by selecting a different theme here, and the agent will rebuild it.

---

## Ending

When I look back at these projects, I notice patterns I didn't see before. Maybe that's how principles work — you don't choose them. You notice them after years of making the same thing over and over.

Here's what I think is important for me:

- **Interactivity over static content.** Whether it's a blog post, a presentation, or a tool — use the platform fully. The web can do more than display text. Let people touch, play, explore.

- **Real-time and collaborative by default.** The things I build are meant to be shared. When multiple people can use something together, it becomes more alive.

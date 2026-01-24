# Wire Animation Notes

For animated connections between blocks in presentation slides.

---

## The Technique

SVG quadratic bezier + CSS stroke-dashoffset animation = "flowing wire" effect.

---

## Minimal React Component

```tsx
import { useEffect, useState, RefObject } from 'react'

interface WireProps {
  from: RefObject<HTMLElement>
  to: RefObject<HTMLElement>
  sag?: number  // how much the wire droops
  color?: string
  animated?: boolean
}

function Wire({ from, to, sag = 50, color = "#666", animated = true }: WireProps) {
  const [path, setPath] = useState("")

  useEffect(() => {
    const update = () => {
      const a = from.current?.getBoundingClientRect()
      const b = to.current?.getBoundingClientRect()
      if (!a || !b) return

      // Center points of blocks
      const x1 = a.left + a.width / 2
      const y1 = a.top + a.height / 2
      const x2 = b.left + b.width / 2
      const y2 = b.top + b.height / 2

      // Control point — middle, but lower (sag)
      const cx = (x1 + x2) / 2
      const cy = Math.max(y1, y2) + sag

      setPath(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [from, to, sag])

  return (
    <svg className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5 5"
        className={animated ? "animate-wire-flow" : ""}
      />
    </svg>
  )
}
```

---

## CSS Animation

```css
@keyframes wire-flow {
  to {
    stroke-dashoffset: -20;
  }
}

.animate-wire-flow {
  animation: wire-flow 0.5s linear infinite;
}
```

Or in Tailwind (add to config or use arbitrary):
```tsx
className="animate-[wire-flow_0.5s_linear_infinite]"
```

---

## Usage

```tsx
const blockA = useRef<HTMLDivElement>(null)
const blockB = useRef<HTMLDivElement>(null)

return (
  <>
    <div ref={blockA} className="...">Agent</div>
    <div ref={blockB} className="...">Tool</div>
    <Wire from={blockA} to={blockB} sag={60} color="#3b82f6" />
  </>
)
```

---

## Parameters

| Param | Default | Description |
|-------|---------|-------------|
| `sag` | 50 | How much wire droops below midpoint (px) |
| `color` | "#666" | Stroke color |
| `animated` | true | Enable flowing animation |

---

## Variations

### Multiple wires
```tsx
<Wire from={agent} to={tool1} />
<Wire from={agent} to={tool2} />
<Wire from={tool1} to={preview} />
```

### Different sag directions
```tsx
// Wire goes UP (for bottom-to-top flow)
const cy = Math.min(y1, y2) - sag
```

### Particle instead of dashes
Use a small circle that moves along the path:
```tsx
<circle r="4" fill={color}>
  <animateMotion dur="1s" repeatCount="indefinite">
    <mpath href="#wire-path" />
  </animateMotion>
</circle>
```

### Glow effect
```css
.wire-glow {
  filter: drop-shadow(0 0 3px currentColor);
}
```

---

## Libraries (if need more)

- **React Flow** — full node-based diagrams with animated edges
- **GSAP motionPath** — move objects along SVG paths
- **flow-network** — WebGL particles flowing through graph

---

## Key Points

1. SVG with `position: fixed` covers whole viewport
2. `pointer-events: none` so it doesn't block clicks
3. `z-index: -1` to stay behind content
4. Quadratic bezier `Q cx cy x2 y2` — one control point
5. Control point below = sag/droop effect
6. `stroke-dasharray` + animated `stroke-dashoffset` = flow effect

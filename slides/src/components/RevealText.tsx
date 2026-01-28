import { useEffect, useState, useRef } from "react";

const ALPHABET = "!*~abcdefghijklmnopqrstuvwxyz0123456789".split("");
const EMPTY = ""; // Special "hidden" marker

interface CharState {
  char: string;
  revealed: boolean;
}

interface RevealTextProps {
  children: string;
  visible?: boolean;
  initialVisible?: boolean;
  stagger?: number;
  speed?: number; // multiplier: 0.5 = 2x faster, 2 = 2x slower
  className?: string;
}

export const RevealText = ({
  children,
  visible = true,
  initialVisible = true,
  stagger = 20,
  speed = 1,
  className,
}: RevealTextProps) => {
  const text = children;

  const [state, setState] = useState<CharState[]>(() =>
    text.split("").map((c) => ({
      char: c === " " ? " " : initialVisible ? c : EMPTY,
      revealed: initialVisible || c === " ",
    }))
  );

  const isFirstRender = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialVisible === visible) return;
    }

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!visible) {
      // When hiding, immediately hide all
      setState(
        text.split("").map((c) => ({
          char: c === " " ? " " : EMPTY,
          revealed: c === " ",
        }))
      );
      return;
    }

    // When revealing, animate each character
    text.split("").forEach((targetChar, i) => {
      // Skip spaces
      if (targetChar === " ") return;

      const alphabet = [...ALPHABET, targetChar.toLowerCase()].filter(
        (v, idx, a) => a.indexOf(v) === idx
      );

      let step = 0;

      const animate = () => {
        setState((prev) => {
          if (prev[i].revealed) return prev;

          step = (step + 1) % alphabet.length;
          const nextChar = alphabet[step];
          const displayChar =
            targetChar === targetChar.toUpperCase()
              ? nextChar.toUpperCase()
              : nextChar;

          const next = [...prev];

          if (displayChar.toLowerCase() === targetChar.toLowerCase()) {
            next[i] = { char: targetChar, revealed: true };
          } else {
            next[i] = { char: displayChar, revealed: false };
            const delay = (16 + Math.random() * 30) * speed;
            timersRef.current[i] = setTimeout(animate, delay);
          }

          return next;
        });
      };

      timersRef.current[i] = setTimeout(animate, i * stagger * speed);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [visible, text]);

  return (
    <span className={className}>
      {text.split("").map((originalChar, i) => {
        const { char, revealed } = state[i];

        // Spaces render as-is (preserve break opportunities)
        if (originalChar === " ") {
          return " ";
        }

        return (
          <span key={i} style={{ position: "relative" }}>
            {/* Original char - always present for layout, transparent when animating */}
            <span
              style={{
                color: revealed ? "inherit" : "transparent",
              }}
            >
              {originalChar}
            </span>
            {/* Animated char - overlaid on top */}
            {!revealed && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: char === EMPTY ? 0 : 1,
                }}
              >
                {char || originalChar}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

function randomChar(target: string): string {
  const c = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return target === target.toUpperCase() ? c.toUpperCase() : c;
}

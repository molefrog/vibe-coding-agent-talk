import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import PoissonDiskSampling from "poisson-disk-sampling";
import { motion } from "motion/react";

const DOT_COLORS = [
  "#3756F2", // blue
  "#E84855", // red
  "#F9A03F", // orange
  "#2EC4B6", // teal
  "#9B5DE5", // purple
  "#00C49A", // green
];

const DOT_RADIUS = 3;
const MIN_DISTANCE = 15;
const MAX_DISTANCE = 1000;
const JITTER = 100;

const NUM_SEEDS = 6;
const SPREAD_SPEED = 2;
const MAX_DELAY = 5000;
const HIT_RADIUS = 20;

// Apps for Ficus: embeddable, real-time, single-screen, collaborative
const FICUS_APP_NAMES = [
  // Presentation & Events
  "Live Talk Rating", "Audience Q&A", "Real-time Poll", "Applause Meter",
  "Live Emoji Reactions", "Conference Bingo", "Speaker Timer with Alerts",
  // Collaboration
  "Collaborative Sticky Notes", "Team Voting Board", "Shared Cursor Canvas",
  "Live Brainstorm Wall", "Multiplayer Whiteboard", "Group Decision Wheel",
  "Real-time Retrospective", "Team Mood Check-in", "Collaborative Pixel Art",
  // Games
  "Multiplayer Trivia", "Live Quiz Battle", "Reaction Speed Game",
  "Drawing Guess Game", "Word Association Chain", "Collaborative Snake",
  "Rock Paper Scissors Arena", "Typing Race", "Memory Match Duel",
  // Interactive Widgets
  "Shared Playlist Queue", "Group Timer", "Collaborative Countdown",
  "Live Leaderboard", "Shared Bookmark Drop", "Real-time Word Cloud",
  "Interactive Seating Chart", "Live Auction Widget", "Tip Jar with Reactions",
  // Learning & Workshops
  "Code Snippet Voter", "Live Code Review", "Pair Programming Lobby",
  "Workshop Exercise Tracker", "Group Quiz with Scoreboard",
];

// General web apps (space of all possible apps)
const APP_NAMES = [
  // Short (1-2 words)
  "Timer", "Calculator", "Calendar", "Forum", "CRM", "Horoscope", "Guestbook", "Metronome",
  // Medium (2-3 words)
  "Todo App", "Weather App", "Habit Tracker", "Mood Journal", "Recipe Finder", "Quiz Maker",
  "Kanban Board", "Color Palette", "Typing Tutor", "Playlist Maker", "Gift Ideas", "Sleep Log",
  "Crypto Portfolio", "Drawing Canvas", "Expense Splitter", "Movie Watchlist", "Plant Care Guide",
  // Longer (3-4 words)
  "Personal Finance Dashboard", "Daily Standup Bot", "Team Retrospective Board", "Markdown Note Editor",
  "Local Event Finder", "Book Reading Tracker", "Coffee Shop Locator", "Workout Routine Builder",
  "Anonymous Feedback Collector", "Recipe Ingredient Scaler", "Subscription Cost Tracker",
  "Meeting Room Booker", "Freelance Invoice Generator", "Browser Tab Manager", "Podcast Episode Tracker",
  // Long (4-5 words)
  "AI Powered Writing Assistant", "Real-time Collaborative Whiteboard", "Weekly Meal Prep Planner",
  "Personal Knowledge Base System", "Automated Social Media Scheduler", "Customer Support Ticket System",
  "Multi-timezone Meeting Planner", "Startup Idea Validation Tool", "Remote Team Check-in App",
  "Open Source Project Dashboard", "Personal Carbon Footprint Calculator", "Language Learning Flashcard Deck",
  // Very long (5-6 words)
  "AI Recipe Generator from Fridge Photos", "Neighborhood Little Free Library Finder",
  "Split Bills with Friends Calculator", "Track Your Daily Water Intake App",
  "Find Local Farmers Market Near You", "Personal OKR Goal Tracking System",
  "Interactive Data Visualization Story Builder", "Remote Team Virtual Coffee Chat Matcher",
  "Turn Any Website into an API", "Build Your Own Workout Plan Generator",
  "Compare Cloud Service Pricing Side by Side", "Track Time Spent on Side Projects",
];

interface Stadium {
  cx: number;
  cy: number;
  halfLength: number;
  radius: number;
  rotation: number;
}

function isInsideStadium(px: number, py: number, stadium: Stadium): boolean {
  let dx = px - stadium.cx;
  let dy = py - stadium.cy;

  if (stadium.rotation) {
    const cos = Math.cos(-stadium.rotation);
    const sin = Math.sin(-stadium.rotation);
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    dx = rx;
    dy = ry;
  }

  const clampedDx = Math.max(0, Math.abs(dx) - stadium.halfLength);
  return clampedDx ** 2 + dy ** 2 <= stadium.radius ** 2;
}

interface Point {
  x: number;
  y: number;
  color: string;
  inside: boolean;
  delay: number;
  label: string;
}

const SpaceSlide = ({ step }: { step: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const initializedRef = useRef(false);
  const prevStepRef = useRef(step);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { width, height } = dimensions;

  const stadium = useMemo(
    (): Stadium => ({
      cx: width * 0.5,
      cy: height * 0.5,
      halfLength: width * 0.15,
      radius: height * 0.12,
      rotation: Math.PI * 0.08,
    }),
    [width, height],
  );

  const points = useMemo((): Point[] => {
    if (width === 0 || height === 0) return [];

    const pds = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: MIN_DISTANCE,
      maxDistance: MAX_DISTANCE,
      tries: 30,
    });

    let ficusIndex = 0;
    let generalIndex = 0;

    const rawPoints = pds.fill().map(([x, y]: [number, number]) => {
      const jx = x + (Math.random() - 0.5) * JITTER;
      const jy = y + (Math.random() - 0.5) * JITTER;
      const inside = isInsideStadium(jx, jy, stadium);

      // Use Ficus app names for points inside the stadium, general names for outside
      const label = inside
        ? FICUS_APP_NAMES[ficusIndex++ % FICUS_APP_NAMES.length]
        : APP_NAMES[generalIndex++ % APP_NAMES.length];

      return {
        x: jx,
        y: jy,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        inside,
        delay: 0,
        label,
      };
    });

    const seeds: Point[] = [];
    const shuffled = [...rawPoints].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(NUM_SEEDS, shuffled.length); i++) {
      seeds.push(shuffled[i]);
    }

    return rawPoints.map((p) => {
      let minDist = Infinity;
      for (const seed of seeds) {
        const dist = Math.hypot(p.x - seed.x, p.y - seed.y);
        if (dist < minDist) minDist = dist;
      }
      const baseDelay = minDist * SPREAD_SPEED;
      const randomOffset = (Math.random() - 0.5) * 200;
      return {
        ...p,
        delay: Math.min(MAX_DELAY, Math.max(0, baseDelay + randomOffset)),
      };
    });
  }, [width, height, stadium]);

  // Single effect for all D3 rendering
  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    const svg = d3.select(svgRef.current);
    const isFirstRender = !initializedRef.current;
    const stepChanged = prevStepRef.current !== step;
    prevStepRef.current = step;

    if (isFirstRender) {
      // Initial render: create circles and animate them in
      initializedRef.current = true;

      svg
        .selectAll<SVGCircleElement, Point>("circle")
        .data(points)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", DOT_RADIUS)
        .attr("fill", (d) => d.color)
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .delay((d) => d.delay)
        .ease(d3.easeCubicOut)
        .attr("opacity", 1);
    } else if (stepChanged) {
      // Step changed: animate opacity
      svg
        .selectAll<SVGCircleElement, Point>("circle")
        .data(points)
        .transition()
        .duration(600)
        .delay((d) => (step >= 2 ? d.delay * 0.3 : 0))
        .attr("opacity", (d) => (step >= 2 ? (d.inside ? 1 : 0.08) : 1));
    }
  }, [points, step]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scale = isZoomed ? 1.15 : 1;
    const centerX = width / 2;
    const centerY = height / 2;

    // Convert mouse position to unscaled coordinates
    const rawMx = e.clientX - rect.left;
    const rawMy = e.clientY - rect.top;
    const mx = centerX + (rawMx - centerX * scale) / scale;
    const my = centerY + (rawMy - centerY * scale) / scale;

    let closest: Point | null = null;
    let closestDist = HIT_RADIUS;

    for (const p of points) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < closestDist) {
        closestDist = dist;
        closest = p;
      }
    }

    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  if (width === 0) return null;

  const isZoomed = step >= 2;

  return (
    <>
      {/* Feature list in top-left corner */}
      <motion.div
        className="fixed top-6 left-8 bg-bg rounded-sm z-10"
        style={{ padding: '8px 12px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isZoomed ? 1 : 0 }}
        transition={{ duration: 0.4, delay: isZoomed ? 0.8 : 0 }}
      >
        <div className="text-lg text-primary mb-3"><span className="font-bold">**Embeddable**</span> - one screen, no routing</div>
        <div className="text-lg text-primary mb-3"><span className="font-bold">**Real-time**</span> - local-first database built in</div>
        <div className="text-lg text-primary"><span className="font-bold">**Opinionated**</span> - curated libs, strict design</div>
      </motion.div>
      <svg
        ref={svgRef}
        className="fixed inset-0 w-full h-full"
        style={{
          width,
          height,
          transform: isZoomed ? "scale(1.15)" : "scale(1)",
          transformOrigin: "center center",
          transition: "transform 0.5s ease-in-out",
          transitionDelay: "0.85s",
        }}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredPoint && (() => {
        const scale = isZoomed ? 1.15 : 1;
        const centerX = width / 2;
        const centerY = height / 2;
        // Convert point position to scaled coordinates
        const tooltipX = centerX + (hoveredPoint.x - centerX) * scale;
        const tooltipY = centerY + (hoveredPoint.y - centerY) * scale;
        return (
          <div
            className="fixed pointer-events-none bg-dark text-bg text-sm px-2 py-1 rounded-sm"
            style={{
              left: tooltipX,
              top: tooltipY - 34 * scale,
              transform: "translateX(-50%)",
            }}
          >
            {hoveredPoint.label}
          </div>
        );
      })()}
    </>
  );
};

export const slides = [{ slide: { component: SpaceSlide, steps: 2 }, title: "Paradox of Choice" }];

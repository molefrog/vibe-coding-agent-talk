import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import PoissonDiskSampling from "poisson-disk-sampling";

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
}

const SpaceSlide = ({ step }: { step: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const initializedRef = useRef(false);
  const prevStepRef = useRef(step);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    const rawPoints = pds.fill().map(([x, y]: [number, number]) => {
      const jx = x + (Math.random() - 0.5) * JITTER;
      const jy = y + (Math.random() - 0.5) * JITTER;
      return {
        x: jx,
        y: jy,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        inside: isInsideStadium(jx, jy, stadium),
        delay: 0,
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

  if (width === 0) return null;

  const isZoomed = step >= 2;

  return (
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
    />
  );
};

export const slides = [{ slide: { component: SpaceSlide, steps: 2 }, title: "Paradox of Choice" }];

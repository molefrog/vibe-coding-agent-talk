import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface WordNode extends d3.SimulationNodeDatum {
  text: string;
}

const WORD_GROUPS = [
  ["React", "TypeScript", "Tailwind"],
  ["InstantDB", "Motion", "D3"],
  ["Heroicons", "Canvas Confetti", "use-sound"],
];

const WordCloud = ({ words }: { words: string[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<WordNode, never>>();
  const nodesRef = useRef<WordNode[]>([]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Preserve existing nodes, add new ones from the edge
    const existing = new Map(nodesRef.current.map((n) => [n.text, n]));
    const nodes: WordNode[] = words.map((text) => {
      if (existing.has(text)) return existing.get(text)!;
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 100;
      return {
        text,
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
      };
    });
    nodesRef.current = nodes;

    const collisionRadius = (d: WordNode) => d.text.length * 5.5 + 16;

    if (simulationRef.current) {
      simulationRef.current.nodes(nodes);
      simulationRef.current.force(
        "collide",
        d3.forceCollide<WordNode>(collisionRadius).strength(0.7)
      );
      simulationRef.current.alpha(0.6).restart();
    } else {
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(-20))
        .force(
          "collide",
          d3.forceCollide<WordNode>(collisionRadius).strength(0.7)
        )
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05));
    }

    simulationRef.current.on("tick", () => {
      svg
        .selectAll<SVGTextElement, WordNode>("text")
        .data(nodes, (d) => d.text)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("opacity", 0)
              .text((d) => d.text)
              .call((e) =>
                e.transition().duration(300).attr("opacity", 1)
              ),
          (update) => update,
          (exit) =>
            exit
              .transition()
              .duration(200)
              .attr("opacity", 0)
              .remove()
        )
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "var(--color-muted)")
        .style("font-family", "inherit")
        .style("font-size", "14px")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "0.1em");
    });
  }, [words]);

  useEffect(() => () => simulationRef.current?.stop(), []);

  return <svg ref={svgRef} className="fixed inset-0 w-full h-full" />;
};

const WordCloudSlide = ({ step }: { step: number }) => {
  const words = WORD_GROUPS.slice(0, step).flat();
  return <WordCloud words={words} />;
};

export const slides = [
  {
    slide: { component: WordCloudSlide, steps: WORD_GROUPS.length },
    title: "Tech Stack",
  },
];

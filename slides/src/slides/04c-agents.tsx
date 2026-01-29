import { RevealText } from "../components/RevealText";

const AgentsSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-full max-w-lg flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <span className="text-muted text-base">
            <RevealText visible={step >= 1} initialVisible={false}>
              01
            </RevealText>
          </span>
          <p className="text-primary text-base">
            <RevealText visible={step >= 1} initialVisible={false} stagger={15}>
              2025 is the year of agents.
            </RevealText>
          </p>
        </div>
        <div className="flex gap-4">
          <span className="text-muted text-base">
            <RevealText visible={step >= 2} initialVisible={false}>
              02
            </RevealText>
          </span>
          <p className="text-primary text-base">
            <RevealText visible={step >= 2} initialVisible={false} stagger={15}>
              Can I create an agent that operates without a chat input?
            </RevealText>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const slides = [
  { slide: { component: AgentsSlide, steps: 2 }, title: "2026" },
];

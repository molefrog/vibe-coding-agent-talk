import { RevealText } from "../components/RevealText";

const LegoSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-full max-w-lg flex flex-col gap-6">
      <div className="flex gap-4">
        <span className="text-muted text-base">
          <RevealText visible={step >= 1} initialVisible={false}>
            01
          </RevealText>
        </span>
        <p className="text-primary text-base">
          <RevealText visible={step >= 1} initialVisible={false} stagger={15}>
            React = LEGO for interactive experiences.
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
            Things like MDX blur the line between content and code.
          </RevealText>
        </p>
      </div>
    </div>
  </div>
);

export const slides = [
  { slide: { component: LegoSlide, steps: 2 }, title: "Lego Pieces" },
];

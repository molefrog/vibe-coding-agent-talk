import { RevealText } from "../components/RevealText";

const conclusions = [
  {
    number: "01",
    text: "Great ideas stick. They can stay with us for years, quietly shaping our creative path.",
  },
  {
    number: "02",
    text: "Great technology amplifies those ideas and unlocks new ways to express them.",
  },
];

const ConclusionsSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-full max-w-lg flex flex-col gap-8">
      <div className="flex gap-4">
        <span className="text-base invisible">01</span>
        <span className="text-muted text-lg uppercase tracking-[0.15em]">
          <RevealText visible={step >= 1} initialVisible={false}>
            Conclusions
          </RevealText>
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {conclusions.map((item, i) => (
          <div key={item.number} className="flex gap-4">
            <span className="text-muted text-base">
              <RevealText visible={step >= i + 2} initialVisible={false}>
                {item.number}
              </RevealText>
            </span>
            <p className="text-primary text-base">
              <RevealText visible={step >= i + 2} initialVisible={false} stagger={15}>
                {item.text}
              </RevealText>
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const slides = [
  { slide: { component: ConclusionsSlide, steps: 3 }, title: "Conclusions" },
];

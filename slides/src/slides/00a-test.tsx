import { useState } from "react";
import { RevealText } from "../components/RevealText";

const TestSlide = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <button
        onClick={() => setVisible((v) => !v)}
        className="px-4 py-2 bg-border rounded-sm text-primary"
      >
        Toggle: {visible ? "Hide" : "Show"}
      </button>

      <div className="text-lg text-primary max-w-md text-center">
        <RevealText visible={visible} initialVisible={false} stagger={20}>
          Great ideas stick. They can stay with us for years, quietly shaping our creative path.
        </RevealText>
      </div>
    </div>
  );
};

export const slides = [
  { slide: <TestSlide key="test" />, title: "RevealText Test" },
];

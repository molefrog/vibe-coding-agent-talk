import type { ReactNode, ComponentType } from "react";
import { slides as intro } from "./00-intro";
import { slides as agent } from "./01-agent";
import { slides as filesystem } from "./02-filesystem";
import { slides as build } from "./03-build";
import { slides as feedback } from "./04-feedback";
import { slides as recap } from "./05-recap";
import { slides as demo } from "./06-demo";
import { slides as conclusion } from "./07-conclusion";

// Slide can be:
// - string: simple text
// - ReactNode: JSX element (1 step)
// - { component, steps }: stepped slide
// - { slide, title }: titled slide wrapper
export type SteppedSlide = {
  component: ComponentType<{ step: number }>;
  steps: number;
};

export type TitledSlide = {
  slide: string | ReactNode | SteppedSlide;
  title: string;
};

export type Slide = string | ReactNode | SteppedSlide | TitledSlide;

export function isTitledSlide(slide: Slide): slide is TitledSlide {
  return typeof slide === "object" && slide !== null && "title" in slide && "slide" in slide;
}

export function isSteppedSlide(slide: Slide): slide is SteppedSlide {
  return typeof slide === "object" && slide !== null && "steps" in slide && "component" in slide;
}

export function getSlideSteps(slide: Slide): number {
  if (isTitledSlide(slide)) {
    const inner = slide.slide;
    return isSteppedSlide(inner) ? inner.steps : 1;
  }
  return isSteppedSlide(slide) ? slide.steps : 1;
}

export function getSlideTitle(slide: Slide): string | undefined {
  return isTitledSlide(slide) ? slide.title : undefined;
}

export function unwrapSlide(slide: Slide): string | ReactNode | SteppedSlide {
  return isTitledSlide(slide) ? slide.slide : slide;
}

export type Section = {
  name: string;
  chapter?: string;
  slides: Slide[];
};

export const sections: Section[] = [
  { name: "intro", slides: intro },
  { name: "agent", chapter: "Agent", slides: agent },
  { name: "filesystem", chapter: "File System", slides: filesystem },
  { name: "build", chapter: "Build + Preview", slides: build },
  { name: "feedback", chapter: "Feedback", slides: feedback },
  { name: "recap", chapter: "Recap", slides: recap },
  { name: "demo", chapter: "Demo", slides: demo },
  { name: "conclusion", slides: conclusion },
];

// Get chapter and slide title for a slide index
export function getChapterForSlide(slideIndex: number): { chapter?: string; title?: string } {
  let count = 0;
  for (const section of sections) {
    if (slideIndex < count + section.slides.length) {
      const localIndex = slideIndex - count;
      const slide = section.slides[localIndex];
      return {
        chapter: section.chapter,
        title: getSlideTitle(slide),
      };
    }
    count += section.slides.length;
  }
  return {};
}

export const allSlides: Slide[] = sections.flatMap((s) => s.slides);

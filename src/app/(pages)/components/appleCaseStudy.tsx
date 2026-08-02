import type { CaseStudyContent } from "./CaseStudyModal";

export const appleCaseStudy: CaseStudyContent = {
  id: "apple",
  title: "Apple Reminders",
  heroSrc: "/images/apple/video-poster.png",
  heroVideoSrc: "/videos/reminders-hero.mp4",
  heroLogoSrc: "/images/apple/reminders-icon.png",
  ndaMailto: "mailto:jl4229@cornell.edu",
  role: "Product Design Intern",
  timeline: "March - June 2026",
  skills: "Sketch, Keynote, Claude",
  team: "3 Designers, 2 Developers, 1 Manager",
  impact:
    "Designed Reminders experiences presented to PD&M leadership and engineering, with concepts in development, while supporting internal design tickets.",
  reflectionLead: (
    <>
      My time at Apple taught me to <em>think differently</em> about what makes
      a product experience truly exceptional. Designing for Reminders was a
      uniquely rewarding experience, where the challenge was to design for
      simplicity while delivering the best possible user experience for
      productivity tools.
    </>
  ),
  lessonsIntro: "A few lessons I’ll carry with me:",
  lessons: [
    {
      title: "Simplicity-maxxing",
      body: "Making something feel effortless means constantly questioning what can be removed, refined, or made clearer without losing the capability that makes it useful.",
    },
    {
      title: "Think beyond a single feature",
      body: "The strongest ideas consider the entire system and how something can feel naturally discoverable without loudly demanding attention.",
    },
    {
      title: "Smallest details matter",
      body: "Every pixel, interaction, and piece of language shapes how intuitive and trustworthy an experience feels.",
    },
  ],
  photos: [
    {
      src: "/images/apple/reflection-1.jpg",
      alt: "Jessica with Apple colleagues in the office",
    },
    {
      src: "/images/apple/reflection-2.jpg",
      alt: "Apple team dinner",
      wide: true,
    },
    {
      src: "/images/apple/reflection-3.jpg",
      alt: "Jessica outdoors with Apple colleagues",
    },
  ],
  reflectionClose:
    "Most of all, I feel incredibly grateful for the mentorship I received throughout my time at Apple CU23. Being surrounded by such thoughtful designers was deeply inspiring, and the experience completely raised my bar for the kind of work—and designer—I hope to become.",
};

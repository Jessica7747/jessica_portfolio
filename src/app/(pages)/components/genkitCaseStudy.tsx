import type { CaseStudyContent } from "./CaseStudyModal";

export const genkitCaseStudy: CaseStudyContent = {
  id: "genkit",
  title: "Google Genkit",
  heroSrc: "/images/genkit-logo.png",
  heroLogoSrc: "/images/genkit-logo.png",
  heroMode: "logo",
  role: "Design Lead (Contract)",
  timeline: "August - January 2026",
  skills: "Figma, V0",
  teamLabel: "Team (Google)",
  team: "2 Designers, 1 PM,\n2 Developers, 1 UXR",
  impact:
    "I co-led this project with a high level of agency, working closely with a Google stakeholder team of 2 designers, 1 PM, 2 developers, and 1 user researcher, while also leading 6 student consultants through the end-to-end design process. Together, we conducted research with developers and designed an evaluation workflow spanning 8 development-ready features, translating a highly technical developer experience into intuitive, Gemini-powered interactions.",
  showNda: false,
  sections: [
    {
      title: "Problem space",
      body: "Evaluating AI-powered developer tools is complex—teams need clear ways to measure quality, compare outputs, and trust results without drowning in technical overhead. Genkit’s evaluation experience needed to make that rigor feel approachable for developers building with Gemini.",
    },
    {
      title: "Competitor analysis",
      body: "We mapped how adjacent developer platforms and LLM tooling handle evaluation, observability, and iteration. Patterns around setup friction, opaque scoring, and fragmented workflows helped us define where Genkit could feel clearer and more end-to-end.",
    },
    {
      title: "User research",
      body: "We researched with developers to understand how they currently evaluate model behavior, where confidence breaks down, and what “ready for production” means in practice. Insights shaped how we sequenced the workflow and what needed to feel immediate versus configurable.",
    },
    {
      title: "Early explorations",
      body: "Early concepts explored how to surface evaluation flows as a coherent product journey rather than a pile of technical settings—balancing flexibility for advanced users with a guided path for getting meaningful results quickly.",
    },
    {
      title: "Refinement",
      body: "Through critique with Google stakeholders and iteration with student consultants, we refined an evaluation workflow spanning 8 development-ready features—tightening language, hierarchy, and interaction patterns so Gemini-powered evaluation felt intuitive without losing depth.",
    },
    {
      title: "Reflection",
      body: "Leading both stakeholder collaboration and a student consulting team taught me how to hold product ambiguity while still shipping clarity. The strongest outcomes came from translating dense developer needs into interactions that feel simple, trustworthy, and ready to build on.",
    },
  ],
};

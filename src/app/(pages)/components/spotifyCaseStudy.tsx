import type { CaseStudyContent } from "./CaseStudyPage";

export const spotifyCaseStudy: CaseStudyContent = {
  id: "spotify",
  title: "Spotify’s Sing Along",
  heroSrc: "/images/spotify-logo.png",
  heroLogoSrc: "/images/spotify-logo.png",
  heroMode: "logo",
  role: "Product Designer",
  timeline: "Feb - May 2024",
  skills: "UX Research, Product Thinking, Prototyping",
  team: "Just me!",
  impact:
    "During my Digital Product Design class at Cornell, user research highlighted a strong desire for language-inclusive features on Spotify. I designed Sing Along with translated and romanized lyrics, plus Friend Sing Along sessions, to make enjoying non-native songs more engaging and socially connected.",
  showNda: false,
  sections: [
    {
      title: "Problem discovery",
      body: "Listening to non-native music can be full of rhythm and emotion, but it often leaves you wondering about the story behind the sound. You share a track with a friend, both vibing to the beat—then realize neither of you knows what the lyrics are saying. Without a simple way to uncover meaning in-product, the experience feels incomplete: emotional connection without deeper understanding.",
    },
    {
      title: "User research",
      body: "My research goal was to identify the main challenges users face while listening to non-native language songs on Spotify. I conducted ten interviews with current Spotify, Apple Music, and NetEase Cloud Music users to understand how they engage with non-native music.",
    },
    {
      title: "Key insights",
      body: "Users often feel disheartened when trying to learn lyrics of non-native songs because relying on external platforms disrupts their experience. They want language options integrated directly into Spotify—for smoother listening and new learning opportunities. Ideation with friends Nancy and Soha focused on two areas: enhancing lyric comprehension and making learning lyrics more enjoyable.",
    },
    {
      title: "Solution",
      body: "The final solution includes karaoke with customizable settings, sing-along with friends, and post-singing recommendations—so users can understand and connect with non-native songs in a cohesive, familiar Spotify experience. Entry stays on the selected song (top-right player controls) to keep music and karaoke connected without clutter.",
    },
    {
      title: "Design iterations",
      body: "After testing prototypes, feedback showed users wanted a more authentic shared karaoke experience—similar to singing with friends in real life. That insight expanded the flows into Friend Sing Along: invite via link, take turns, and auto-mute when it’s not your turn—alongside translation/romanization, speed, and vocal controls.",
    },
    {
      title: "Reflection",
      body: "Aside from having a karaoke mix on repeat, this project was one of my first deep dives into user-centered product design. Designing for language diversity and cultural relevance showed how universally accessible features can reach a broader audience—and sparked my passion for the process.",
    },
  ],
};

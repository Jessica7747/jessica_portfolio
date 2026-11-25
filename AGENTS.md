<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design and animation work

For any UI design, visual polish, mockup, illustration, or animation/motion work (drawers, reveals, hover effects, transitions, demos), read `.agents/skills/stageshow/SKILL.md` first and follow its workflow: plan the medium, focal object and story before code, start from its closest gold example, and rehearse (film stills at the shown width and at 390px) before handing over.

- Every motion needs a cause; hold the payoff; loops reset with a visible cause.
- Respect `prefers-reduced-motion` with a static fallback.
- Check layouts at desktop, ~1000px, ~800px and 390px before calling design work done.
- The skill lives outside `src/` and is excluded from TypeScript and ESLint; copy kit parts into `src/` rather than importing from `.agents/`.

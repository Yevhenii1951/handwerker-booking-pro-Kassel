# Testing rules

- A task is not closed until `npm run check` has passed AND its output is
  shown in the answer. Saying "it works" without test results is forbidden.
- Never edit tests and working code in the same pass. First fix/implement the
  code; if a test is legitimately outdated because logic changed, update it in
  a separate, second step.
- Never weaken, skip, or delete checks to make them green. A red check is a
  signal; fix the root cause.
- Tests must never run against the production database (see `tests/context.md`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

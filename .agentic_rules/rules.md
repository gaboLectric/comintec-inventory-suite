# Development Rules & Protocols

**IMPORTANT**: This is a summary. Refer to `MASTER_RULES.md` for the strict, detailed protocols that MUST be followed.

## 1. Core Protocols (See MASTER_RULES.md)
- **Session**: Read `.memory_bank` on start. Update on end.
- **Workflow**: Plan -> Execute -> Verify.
- **TDD**: Red -> Green -> Refactor. No code without failing tests.

## 2. Architecture & Patterns
- **Backend**: PocketBase (Go + SQLite). No custom backend code unless absolutely necessary (extend via Go hooks if needed, but prefer client-side logic where secure).
- **Frontend**: React + Vite. Use Functional Components and Hooks.
- **State Management**: React Context for global state (Auth, Theme). Local state for components.
- **Styling**: Emotion (CSS-in-JS) + Tailwind CSS (via `@apply` or utility classes). Follow `comintec-design-system`.

## 3. Code Quality
- **Imports**: Use absolute paths or clean relative paths. Avoid deep nesting `../../..`.
- **Components**: Keep components small and focused. One component per file.
- **Naming**: PascalCase for components, camelCase for functions/variables.
- **Comments**: Comment complex logic. Use JSDoc for exported functions.

## 4. Git & Version Control
- **Commits**: Use conventional commits (feat, fix, chore, refactor).
- **Branches**: Feature branches off `main` or `develop`.

## 5. Docker & Environment
- **Containers**: Ensure `pocketbase` and `frontend` are always healthy.
- **Environment Variables**: Use `.env` files. Never commit secrets.
- **Ports**: PocketBase on 8090, Frontend on 5173.

## 6. MCP & Tools
- **Context**: Use `context-mapper` to refresh context when switching tasks.
- **Memory Bank**: Update `.memory_bank/activeContext.md` when changing focus.


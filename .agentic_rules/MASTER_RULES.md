# MASTER RULES & PROTOCOLS

## 1. Session Protocol
- **Mandatory Context Refresh**: At the start of every session, you MUST read `.memory_bank/activeContext.md` and `.memory_bank/progress.md` to understand the current state.
- **Checklists**:
  - **Start**: Verify environment (Docker containers up?), check pending TODOs.
  - **End**: Update `.memory_bank/activeContext.md`, ensure all tests pass, verify no broken builds.

## 2. Development Workflow (Plan-Execute-Verify)
1.  **Plan**: Analyze the request. Break it down. Identify files to change with the tools like context_mapper mcp.
2.  **Execute**: Implement changes.
3.  **Verify**: Run tests. Verify manually if needed.
    - **User Approval**: For critical architectural changes or large refactors, ask for user confirmation before proceeding.

## 3. TDD Protocol (Red-Green-Refactor)
- **No Code Without a Failing Test**: Before writing any functional code, write a test that fails (Red).
- **Minimal Implementation**: Write just enough code to make the test pass (Green).
- **Refactor**: Improve code quality while keeping tests green.
- **Coverage**: Ensure new features have unit/integration tests.

## 4. Modification Limits
- **Scope Control**: Do not modify more than 3-5 files in a single turn without re-verifying context.
- **Atomic Changes**: Keep changes focused on the specific task.

## 5. Architecture & Patterns
- **Backend**: PocketBase (Go + SQLite).
- **Frontend**: React + Vite + Tailwind + Emotion.
- **State**: React Context + PocketBase SDK.
- **Docker**: All services must run in Docker.

## 6. Documentation
- Keep `CLAUDE.md` and `.memory_bank` updated.
- Document complex logic in code.

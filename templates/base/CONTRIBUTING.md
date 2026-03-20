# Contributing Guide

## Branching Strategy

### Main Branches

| Branch | Purpose |
|---|---|
| `main` | Production — protected, requires 2 approvals |
| `staging` | Pre-production testing — protected, requires 1 approval |
| `dev` | Active development — protected, status checks required |

### Working Branches

| Prefix | Use for |
|---|---|
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `hotfix/*` | Urgent production fixes |
| `chore/*` | Maintenance / dependency updates |
| `docs/*` | Documentation only changes |

---

## Workflow

```bash
# 1. Pull latest from dev
git checkout dev
git pull origin dev

# 2. Create your branch
git checkout -b feature/your-feature-name

# 3. Work, commit often
git add .
git commit -m "feat: add your feature"
# pre-commit hook will run automatically:
#   ✔ Prettier format check (auto-fixes if needed)
#   ✔ ESLint (via lint-staged)
#   ✔ TypeScript type check

# 4. Push and open a PR into dev
git push origin feature/your-feature-name
```

**PR flow:** `feature/*` → `dev` → `staging` → `main`

---

## Commit Message Format

```
<type>: <short description>
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that is not a feature or fix |
| `style` | UI / styling changes |
| `docs` | Documentation only |
| `chore` | Maintenance, deps, config |
| `test` | Adding or updating tests |

**Examples:**
```
feat: add user profile page
fix: correct date formatting on dashboard
chore: upgrade tailwindcss to v4
docs: update contributing guide
```

---

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce quality automatically.

### Pre-commit
Runs on every `git commit`:
- Prettier format check (auto-stages fixes if found)
- ESLint + Prettier via lint-staged (only on staged files)
- TypeScript type check

### Pre-push
Runs on every `git push`:
- Full `next build` — push is blocked if the build fails

If a hook blocks you, fix the issue it reports and try again. **Do not bypass hooks with `--no-verify`.**

---

## Code Standards

- **No `console.log()`** — use `console.warn()` or `console.error()` only
- **No `var`** — always use `const` or `let`
- **No `any`** — avoid unless absolutely necessary (triggers a warning)
- **Self-closing JSX** — `<Component />` not `<Component></Component>`
- **No unnecessary curly braces in JSX** — `title="Hello"` not `title={"Hello"}`
- **Unused variables** — prefix with `_` if intentionally unused (e.g. `_unused`)

---

## Code Review Checklist

Before requesting a review, make sure:

- [ ] All hooks pass (`pnpm lint`, `pnpm check-types`, `pnpm build`)
- [ ] No `console.log` left in the code
- [ ] New env variables are added to `.env.example`
- [ ] UI changes are tested on mobile viewport
- [ ] No commented-out code committed

Reviewers will check:
- [ ] Logic correctness
- [ ] TypeScript types are accurate (no sneaky `as any`)
- [ ] No unnecessary re-renders or missing `useCallback`/`useMemo`
- [ ] Consistent naming with the rest of the codebase

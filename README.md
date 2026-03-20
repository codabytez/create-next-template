# create-next-template

An interactive CLI that scaffolds a production-ready Next.js project with your preferred stack — only what you need, nothing you don't.

---

## Quick start

```bash
npx @codabytez/create-next-template@latest
```

Or with a specific package manager:

```bash
pnpm dlx @codabytez/create-next-template
bunx @codabytez/create-next-template
```

---

## How it works

When you run the CLI, it will ask you three questions:

1. **Project name** — used as the folder name and `package.json` name
2. **Package manager** — `npm`, `pnpm`, `yarn`, or `bun`
3. **Features** — pick any combination from the list below

The CLI then:

- Copies the base template into a new folder
- Merges in the files for each selected feature
- Generates a `layout.tsx` with the correct providers already wired up
- Merges all `.env.example` entries into a single file
- Writes a `package.json` with only the dependencies you need
- Installs dependencies
- Runs any required post-install steps (e.g. `prisma generate`)
- Initializes a git repository with an initial commit

---

## What's always included

These come with every project — they're small, universal, and always useful:

| Package                    | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `next`                     | React framework (v15)                                      |
| `react` + `react-dom`      | React runtime                                              |
| `tailwindcss` v4           | Utility-first CSS                                          |
| `@tailwindcss/postcss`     | Tailwind v4 PostCSS plugin                                 |
| `clsx`                     | Conditional class names                                    |
| `tailwind-merge`           | Merges Tailwind classes without conflicts                  |
| `class-variance-authority` | Type-safe component variants                               |
| `zod`                      | Schema validation (used for forms, env, and API responses) |
| `date-fns`                 | Lightweight date formatting and manipulation               |
| `cookies-next`             | Read/write cookies in Next.js (client + server)            |
| `lucide-react`             | Clean, consistent icon set                                 |
| `prettier`                 | Code formatter                                             |
| `eslint-plugin-prettier`   | Runs Prettier as an ESLint rule                            |
| `husky`                    | Git hooks (pre-commit, pre-push)                           |
| `lint-staged`              | Runs linters only on staged files                          |

A `cn()` utility ([lib/utils.ts](lib/utils.ts)) combining `clsx` + `tailwind-merge` is also included, as well as a base `Button` component built with CVA.

---

## Code quality tooling

Every project comes pre-configured with a full code quality pipeline — no setup needed.

### Prettier

Config in `.prettierrc.json`:

- Double quotes, semicolons, 2-space indent, 80 char line width, trailing commas (ES5)

Run manually:

```bash
pnpm format          # format everything
pnpm check-format    # check without writing
```

### ESLint

Config in `eslint.config.mjs` (flat config, ESLint v9). Includes:

- `eslint-config-next` (core web vitals + TypeScript rules)
- `eslint-plugin-prettier` (formatting errors shown as lint errors)
- Rules enforced: no `console.log`, no `var`, no unused vars, self-closing JSX, exhaustive deps, no duplicate imports

```bash
pnpm lint
```

### TypeScript

```bash
pnpm check-types     # runs tsc --noEmit, no output = no errors
```

### Git hooks (Husky)

Hooks are set up automatically after `pnpm install` via the `prepare` script.

**Pre-commit** — runs on every `git commit`:

1. Prettier format check (auto-fixes and re-stages if needed)
2. lint-staged — ESLint + Prettier on staged files only
3. TypeScript type check

**Pre-push** — runs on every `git push`:

1. Full `next build` — blocks the push if the build fails

> Do not bypass hooks with `--no-verify`. Fix the issue instead.

### Tailwind v4 custom theme

`app/globals.css` includes a commented-out `@theme` block — uncomment and fill in your design tokens:

```css
@theme {
  --color-primary: #6366f1;
  --color-secondary: #f59e0b;
  --font-sans: "Inter", sans-serif;
}
```

These become available as Tailwind utilities automatically (e.g. `bg-primary`, `text-secondary`).

---

## Selectable features

### Animations — `framer-motion`

Adds [Framer Motion](https://www.framer.com/motion/) for declarative animations.

**Files added:**

```ts
components/motion/fade-in.tsx    ← reusable fade-in wrapper
```

**Usage:**

```tsx
import { FadeIn } from "@/components/motion/fade-in";

<FadeIn delay={0.1}>
  <p>Animated content</p>
</FadeIn>;
```

---

### Data Fetching — TanStack Query + Axios

Adds [@tanstack/react-query](https://tanstack.com/query) and [Axios](https://axios-http.com/) with a pre-configured client and provider.

**Files added:**

```ts
lib/api.ts                       ← Axios instance with base URL + 401 interceptor
providers/query-provider.tsx     ← QueryClientProvider (already wired into layout)
```

**The Axios instance** reads `NEXT_PUBLIC_API_URL` from your env. If not set, it defaults to `/api`. Add to your `.env`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Usage:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.get("/users").then((res) => res.data),
});
```

---

### Forms — React Hook Form + Zod resolver

Adds [React Hook Form](https://react-hook-form.com/) with the [Zod resolver](https://github.com/react-hook-form/resolvers) for schema-driven form validation.

**Files added:**

```ts
lib/validations/example.ts               ← example Zod schema
components/forms/example-form.tsx        ← example form component
```

**How to add a new form:**

1. Define your schema in `lib/validations/`:

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

1. Use it in your component:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
});
```

---

### Extra Icons — `iconsax-reactjs`

Adds [Iconsax](https://iconsax-react.pages.dev/) — a large icon library with multiple visual styles (Linear, Outline, Broken, Bulk, Bold, TwoTone).

**Usage:**

```tsx
import { Home, Setting2, User } from "iconsax-reactjs";

<Home size={24} variant="Linear" />
<Setting2 size={20} variant="Bulk" color="#FF6B6B" />
```

Available variants: `Linear`, `Outline`, `Broken`, `Bulk`, `Bold`, `TwoTone`

> **Tip:** Use Lucide for simple UI icons and Iconsax where you need more expressive or stylized icons.

---

### Auth — Clerk

Adds [Clerk](https://clerk.com/) for authentication with pre-built sign-in and sign-up pages.

**Files added:**

```ts
middleware.ts                            ← protects all non-public routes
app/(auth)/sign-in/[[...sign-in]]/page.tsx
app/(auth)/sign-up/[[...sign-up]]/page.tsx
```

The `layout.tsx` is automatically wrapped with `<ClerkProvider>`.

**Setup steps:**

1. Create a project at [clerk.com](https://clerk.com)
2. Copy your keys into `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Accessing the current user:**

```tsx
import { useUser } from "@clerk/nextjs";

const { user, isLoaded } = useUser();
```

**In Server Components or Route Handlers:**

```ts
import { auth, currentUser } from "@clerk/nextjs/server";

const { userId } = await auth();
const user = await currentUser();
```

**To make a route public**, add it to the `isPublicRoute` matcher in `middleware.ts`:

```ts
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
]);
```

---

### Database — Prisma

Adds [Prisma ORM](https://www.prisma.io/) configured for PostgreSQL.

**Files added:**

```ts
prisma/schema.prisma             ← database schema with a starter User model
lib/db.ts                        ← singleton Prisma client (safe for dev hot-reload)
```

**Setup steps:**

1. Add your database URL to `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

1. Edit `prisma/schema.prisma` to define your models, then run:

```bash
npx prisma migrate dev --name init
```

1. Generate the Prisma client anytime you change the schema:

```bash
npx prisma generate
```

**Usage:**

```ts
import { db } from "@/lib/db";

const users = await db.user.findMany();
const user = await db.user.create({ data: { email: "...", name: "..." } });
```

> **Note:** `lib/db.ts` uses a global singleton to prevent creating multiple Prisma instances during Next.js hot-reload in development.

---

### Database — Convex

Adds [Convex](https://www.convex.dev/) — a real-time backend with live queries, mutations, and a built-in database.

**Files added:**

```ts
convex/schema.ts                 ← database schema definition
convex/users.ts                  ← example queries and mutations
providers/convex-provider.tsx    ← ConvexProvider (already wired into layout)
```

**Setup steps:**

1. Run the Convex dev server (this will prompt you to log in and create a project):

```bash
npx convex dev
```

1. Convex will automatically populate `NEXT_PUBLIC_CONVEX_URL` in your `.env.local`.

**Usage:**

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Read data (live, auto-updates)
const users = useQuery(api.users.getUsers);

// Write data
const createUser = useMutation(api.users.createUser);
await createUser({ name: "Alice", email: "alice@example.com" });
```

> **Tip:** Convex queries are reactive — components automatically re-render when the data changes, no polling or invalidation needed.

---

### Database — Appwrite

Adds [Appwrite](https://appwrite.io/) — an open-source BaaS with databases, auth, storage, and more.

**Files added:**

```ts
lib/appwrite.ts                  ← pre-configured Account, Databases, and Storage clients
```

**Setup steps:**

1. Create a project at [cloud.appwrite.io](https://cloud.appwrite.io) (or self-host)
2. Fill in your `.env`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
```

**Usage:**

```ts
import { databases, account, storage } from "@/lib/appwrite";
import { ID } from "appwrite";

// Create a document
await databases.createDocument(
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  "your-collection-id",
  ID.unique(),
  { name: "Alice", email: "alice@example.com" },
);

// Get current user
const user = await account.get();
```

---

### UI Components — shadcn/ui

Adds a `components.json` config file so you can immediately start adding [shadcn/ui](https://ui.shadcn.com/) components.

**Post-install step (required):**

```bash
npx shadcn@latest init
```

This will read the existing `components.json` and finish setting up the component system.

**Adding components:**

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input card badge
```

Components are added directly to `components/ui/` — they're yours to modify.

---

## Project structure

After scaffolding, your project will look like this (depending on selected features):

```ts
my-app/
├── app/
│   ├── (auth)/                  ← Clerk sign-in / sign-up  [auth]
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── globals.css
│   ├── layout.tsx               ← auto-generated with selected providers
│   └── page.tsx
├── components/
│   ├── forms/
│   │   └── example-form.tsx     ← [forms]
│   ├── motion/
│   │   └── fade-in.tsx          ← [animations]
│   └── ui/
│       └── button.tsx           ← always included
├── convex/                      ← [convex]
│   ├── schema.ts
│   └── users.ts
├── lib/
│   ├── api.ts                   ← [data-fetching]
│   ├── appwrite.ts              ← [appwrite]
│   ├── db.ts                    ← [prisma]
│   ├── env.ts                   ← always included
│   ├── utils.ts                 ← always included (cn function)
│   └── validations/
│       └── example.ts           ← [forms]
├── prisma/
│   └── schema.prisma            ← [prisma]
├── providers/
│   ├── convex-provider.tsx      ← [convex]
│   └── query-provider.tsx       ← [data-fetching]
├── middleware.ts                ← [auth]
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.example
└── .gitignore
```

---

## Environment variables

All `.env.example` entries from your selected features are merged into a single `.env.example` file. Copy it to get started:

```bash
cp .env.example .env
```

Then fill in the values for each service you selected.

---

## Combining features

Features are designed to work together. Common combinations:

| Stack               | Features to select                               |
| ------------------- | ------------------------------------------------ |
| SaaS starter        | Auth + Prisma + Forms + Data Fetching + UI       |
| Real-time app       | Convex + Auth + Animations + UI                  |
| Mobile-like web app | Animations + Forms + Data Fetching + Extra Icons |
| Content platform    | Appwrite + Forms + UI + Data Fetching            |
| Minimal             | Just the base (no features selected)             |

---

## Contributing

1. Clone the repo
2. Install dependencies: `pnpm install`
3. Make your changes in `src/` or `templates/`
4. Build: `pnpm run build`
5. Test locally: `node dist/index.js`

To add a new feature:

1. Add its template files under `templates/<feature-name>/`
2. Add its dependencies to `FEATURE_DEPS` in `src/helpers/packages.ts`
3. Add it to the prompts in `src/index.ts`
4. Map the template name in `FEATURE_TEMPLATE_MAP` in `src/installer.ts`
5. If it needs a provider in `layout.tsx`, update `src/generators/layout.ts`
6. If it needs env vars, add a `.env.example` under `templates/<feature-name>/` and register it in `src/helpers/env.ts`

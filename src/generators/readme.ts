import fs from "fs-extra";
import path from "path";

const FEATURE_LABELS: Record<string, string> = {
  animations: "Framer Motion",
  dataFetching: "TanStack Query + Axios",
  forms: "React Hook Form + Zod",
  extraIcons: "Iconsax React",
  auth: "Clerk",
  prisma: "Prisma (PostgreSQL)",
  convex: "Convex",
  appwrite: "Appwrite",
  ui: "shadcn/ui",
};

export async function generateReadme(
  projectPath: string,
  projectName: string,
  packageManager: string,
  features: string[]
): Promise<void> {
  const featureList = features
    .filter((f) => FEATURE_LABELS[f])
    .map((f) => `- ${FEATURE_LABELS[f]}`)
    .join("\n");

  const hasPrisma = features.includes("prisma");
  const hasConvex = features.includes("convex");
  const hasAuth = features.includes("auth");
  const hasShadcn = features.includes("ui");

  const envSection =
    hasPrisma || hasConvex || hasAuth
      ? `\n## Environment Variables\n\nCopy \`.env.example\` to \`.env\` and fill in the required values:\n\n\`\`\`bash\ncp .env.example .env\n\`\`\`\n`
      : "";

  const extraSteps: string[] = [];
  if (hasShadcn) extraSteps.push(`npx shadcn@latest init`);
  if (hasPrisma) extraSteps.push(`npx prisma migrate dev`);
  if (hasConvex) extraSteps.push(`npx convex dev`);

  const extraSection =
    extraSteps.length > 0
      ? `\n## Additional Setup\n\n\`\`\`bash\n${extraSteps.join("\n")}\n\`\`\`\n`
      : "";

  const content = `# ${projectName}

A [Next.js](https://nextjs.org) project bootstrapped with [create-next-template](https://github.com/codabytez/create-next-template).

## Tech Stack

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
${featureList ? featureList + "\n" : ""}
## Getting Started

\`\`\`bash
${packageManager} run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.
${envSection}${extraSection}
## Code Quality

This project uses ESLint, Prettier, and Husky pre-commit hooks to enforce consistent code style.

\`\`\`bash
${packageManager} run lint          # lint
${packageManager} run format        # format
${packageManager} run check-types   # type check
\`\`\`
`;

  await fs.writeFile(path.join(projectPath, "README.md"), content);
}

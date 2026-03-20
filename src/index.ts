#!/usr/bin/env node
import * as p from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import { runInstaller } from "./installer";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(
    `\n  ${chalk.bgCyan(chalk.black(" create-next-template "))}\n\n` +
      `  ${chalk.bold("Usage:")}\n` +
      `    pnpx @codabytez/create-next-template ${chalk.green("[directory]")}\n\n` +
      `  ${chalk.bold("Arguments:")}\n` +
      `    ${chalk.green("directory")}   Where to scaffold the project.\n` +
      `                Use ${chalk.cyan(".")} to scaffold into the current directory,\n` +
      `                or omit to be prompted for a name.\n\n` +
      `  ${chalk.bold("Options:")}\n` +
      `    ${chalk.cyan("-h, --help")}  Show this help message\n\n` +
      `  ${chalk.bold("Examples:")}\n` +
      `    pnpx @codabytez/create-next-template\n` +
      `    pnpx @codabytez/create-next-template ${chalk.green("my-app")}\n` +
      `    pnpx @codabytez/create-next-template ${chalk.green(".")}\n`
  );
  process.exit(0);
}

async function main() {
  console.log();
  p.intro(chalk.bgCyan(chalk.black(" create-next-template ")));

  const dirArg = args.find((a) => !a.startsWith("-"));
  const inPlace = dirArg === ".";
  const defaultName = inPlace
    ? path.basename(process.cwd())
    : dirArg ?? undefined;

  const projectName = await p.text({
    message: "What is your project name?",
    placeholder: "my-next-app",
    initialValue: defaultName,
    validate(value) {
      if (!value) return "Project name is required";
      if (!/^[a-z0-9-_]+$/.test(value))
        return "Only lowercase letters, numbers, hyphens, and underscores";
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const packageManager = await p.select({
    message: "Which package manager?",
    options: [
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
      { value: "bun", label: "bun" },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const features = await p.multiselect({
    message: "Which features do you want? (space to select)",
    options: [
      { value: "animations", label: "Animations", hint: "framer-motion" },
      {
        value: "dataFetching",
        label: "Data Fetching",
        hint: "TanStack Query + Axios",
      },
      {
        value: "forms",
        label: "Forms",
        hint: "React Hook Form + Zod resolver",
      },
      { value: "extraIcons", label: "Extra Icons", hint: "iconsax-reactjs" },
      { value: "auth", label: "Auth", hint: "Clerk" },
      { value: "prisma", label: "Database — Prisma", hint: "Prisma + PostgreSQL" },
      { value: "convex", label: "Database — Convex", hint: "Convex real-time backend" },
      { value: "appwrite", label: "Database — Appwrite", hint: "Appwrite BaaS" },
      { value: "ui", label: "UI Components", hint: "shadcn/ui" },
    ],
    required: false,
  });

  if (p.isCancel(features)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const selectedFeatures = (features as string[]) ?? [];

  // Warn if multiple databases selected
  const dbChoices = ["prisma", "convex", "appwrite"].filter((db) =>
    selectedFeatures.includes(db)
  );
  if (dbChoices.length > 1) {
    p.log.warn(
      `You selected multiple databases (${dbChoices.join(", ")}). This is supported but may require manual configuration.`
    );
  }

  const projectPath = inPlace
    ? process.cwd()
    : path.resolve(process.cwd(), projectName as string);

  await runInstaller({
    projectName: projectName as string,
    projectPath,
    packageManager: packageManager as string,
    features: selectedFeatures,
    inPlace,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

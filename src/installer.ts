import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { copyTemplate } from "./helpers/copy";
import { mergeEnvExamples } from "./helpers/env";
import { installDependencies, writePackageJson } from "./helpers/packages";
import { runCommand } from "./helpers/run";
import { generateLayout } from "./generators/layout";
import type { InstallerOptions } from "./types";

const FEATURE_TEMPLATE_MAP: Record<string, string> = {
  animations: "animations",
  dataFetching: "data-fetching",
  forms: "forms",
  extraIcons: "extra-icons",
  auth: "auth",
  prisma: "prisma",
  convex: "convex",
  appwrite: "appwrite",
  ui: "ui",
};

export async function runInstaller({
  projectName,
  projectPath,
  packageManager,
  features,
  inPlace,
}: InstallerOptions): Promise<void> {
  const s = p.spinner();

  if (!inPlace) {
    if (await fs.pathExists(projectPath)) {
      const overwrite = await p.confirm({
        message: `Directory "${projectName}" already exists. Overwrite?`,
      });
      if (!overwrite || p.isCancel(overwrite)) {
        p.cancel("Operation cancelled");
        process.exit(0);
      }
      await fs.remove(projectPath);
    }
    await fs.ensureDir(projectPath);
  }

  // 1. Scaffold
  s.start("Scaffolding project structure");
  await copyTemplate("base", projectPath);

  for (const feature of features) {
    const templateName = FEATURE_TEMPLATE_MAP[feature];
    if (templateName) {
      // Skip .env.example — handled separately via merge
      await copyTemplate(templateName, projectPath);
    }
  }

  await generateLayout(projectPath, features);
  await mergeEnvExamples(projectPath, features);

  // Make husky hooks executable
  const huskyDir = path.join(projectPath, ".husky");
  for (const hook of ["pre-commit", "pre-push"]) {
    const hookPath = path.join(huskyDir, hook);
    if (await fs.pathExists(hookPath)) {
      await fs.chmod(hookPath, 0o755);
    }
  }

  s.stop("Project structure scaffolded");

  // 2. Write package.json
  s.start("Writing package.json");
  await writePackageJson(projectPath, projectName, features);
  s.stop("package.json written");

  // 3. Install dependencies
  s.start("Installing dependencies");
  await installDependencies(projectPath, packageManager);
  s.stop("Dependencies installed");

  // 4. Post-install: Prisma generate
  if (features.includes("prisma")) {
    s.start("Running prisma generate");
    await runCommand("npx", ["prisma", "generate"], projectPath);
    s.stop("Prisma client generated");
  }

  // 5. Initialize git
  s.start("Initializing git repository");
  await runCommand("git", ["init"], projectPath);
  await runCommand("git", ["add", "-A"], projectPath);
  await runCommand(
    "git",
    ["commit", "-m", "chore: initial commit from create-next-template"],
    projectPath
  );
  s.stop("Git repository initialized");

  const hasShadcn = features.includes("ui");
  const hasPrisma = features.includes("prisma");
  const hasConvex = features.includes("convex");
  const hasAppwrite = features.includes("appwrite");

  console.log();
  p.outro(
    chalk.green("✔ Project created successfully!\n\n") +
      (inPlace ? "" : `  ${chalk.cyan("cd")} ${projectName}\n`) +
      (hasShadcn
        ? `  ${chalk.cyan("npx shadcn@latest init")}   ${chalk.gray("# set up shadcn/ui")}\n`
        : "") +
      (hasPrisma
        ? `  ${chalk.gray("# update DATABASE_URL in .env, then:")}\n  ${chalk.cyan("npx prisma migrate dev")}\n`
        : "") +
      (hasConvex
        ? `  ${chalk.cyan("npx convex dev")}             ${chalk.gray("# start Convex backend")}\n`
        : "") +
      (hasAppwrite
        ? `  ${chalk.gray("# fill in NEXT_PUBLIC_APPWRITE_* vars in .env")}\n`
        : "") +
      `  ${chalk.cyan(`${packageManager} run dev`)}`
  );
}

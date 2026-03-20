import fs from "fs-extra";
import path from "path";
import { runCommand } from "./run";

interface PackageJson {
  name: string;
  version: string;
  private: boolean;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  "lint-staged": Record<string, string[]>;
}

const BASE_DEPS: Record<string, string> = {
  next: "^15.0.0",
  react: "^18.3.0",
  "react-dom": "^18.3.0",
  clsx: "^2.1.1",
  "tailwind-merge": "^2.4.0",
  "class-variance-authority": "^0.7.0",
  zod: "^3.23.0",
  "date-fns": "^3.6.0",
  "cookies-next": "^4.2.1",
  "lucide-react": "^0.400.0",
};

const BASE_DEV_DEPS: Record<string, string> = {
  typescript: "^5.5.0",
  "@types/node": "^20.14.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  tailwindcss: "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0",
  postcss: "^8.4.0",
  // Code quality
  "@eslint/eslintrc": "^3.2.0",
  prettier: "^3.3.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-prettier": "^5.2.0",
  // Git hooks
  husky: "^9.1.0",
  "lint-staged": "^15.2.0",
};

const FEATURE_DEPS: Record<string, Record<string, string>> = {
  animations: {
    "framer-motion": "^11.3.0",
  },
  dataFetching: {
    "@tanstack/react-query": "^5.51.0",
    axios: "^1.7.0",
  },
  forms: {
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
  },
  extraIcons: {
    "iconsax-reactjs": "^1.0.1",
  },
  auth: {
    "@clerk/nextjs": "^5.2.0",
  },
  prisma: {
    "@prisma/client": "^5.16.0",
  },
  convex: {
    convex: "^1.13.0",
  },
  appwrite: {
    appwrite: "^16.0.0",
  },
};

const FEATURE_DEV_DEPS: Record<string, Record<string, string>> = {
  prisma: {
    prisma: "^5.16.0",
  },
};

export function buildPackageJson(
  projectName: string,
  features: string[]
): PackageJson {
  const deps = { ...BASE_DEPS };
  const devDeps = { ...BASE_DEV_DEPS };

  for (const feature of features) {
    Object.assign(deps, FEATURE_DEPS[feature] ?? {});
    Object.assign(devDeps, FEATURE_DEV_DEPS[feature] ?? {});
  }

  return {
    name: projectName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      prepare: "husky",
      format: "prettier --write .",
      "check-format": "prettier --check .",
      "check-types": "tsc --noEmit",
    },
    dependencies: deps,
    devDependencies: devDeps,
    "lint-staged": {
      "*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"],
      "*.{json,md,mdx,css}": ["prettier --write"],
    },
  };
}

export async function writePackageJson(
  projectPath: string,
  projectName: string,
  features: string[]
): Promise<void> {
  const pkg = buildPackageJson(projectName, features);
  await fs.writeJSON(path.join(projectPath, "package.json"), pkg, {
    spaces: 2,
  });
}

export async function installDependencies(
  projectPath: string,
  packageManager: string
): Promise<void> {
  if (packageManager === "npm" || packageManager === "pnpm") {
    await runCommand(packageManager, ["install"], projectPath);
  } else {
    await runCommand(packageManager, ["install"], projectPath);
  }
}

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
  next: "^16.2.0",
  react: "^19.2.4",
  "react-dom": "^19.2.4",
  clsx: "^2.1.1",
  "tailwind-merge": "^3.5.0",
  "class-variance-authority": "^0.7.1",
  zod: "^4.3.6",
  "date-fns": "^4.1.0",
  "cookies-next": "^6.1.1",
  "lucide-react": "^0.577.0",
};

const BASE_DEV_DEPS: Record<string, string> = {
  typescript: "^5.9.3",
  "@types/node": "^25.5.0",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  tailwindcss: "^4.2.2",
  "@tailwindcss/postcss": "^4.2.2",
  postcss: "^8.5.8",
  // Code quality
  eslint: "^10.1.0",
  "eslint-config-next": "^16.2.0",
  prettier: "^3.8.1",
  "eslint-config-prettier": "^10.1.8",
  // Git hooks
  husky: "^9.1.7",
  "lint-staged": "^16.4.0",
};

const FEATURE_DEPS: Record<string, Record<string, string>> = {
  animations: {
    "framer-motion": "^12.38.0",
  },
  dataFetching: {
    "@tanstack/react-query": "^5.91.3",
    axios: "^1.13.6",
  },
  forms: {
    "react-hook-form": "^7.71.2",
    "@hookform/resolvers": "^5.2.2",
  },
  extraIcons: {
    "iconsax-reactjs": "^0.0.8",
  },
  auth: {
    "@clerk/nextjs": "^7.0.6",
  },
  prisma: {
    "@prisma/client": "^7.5.0",
  },
  convex: {
    convex: "^1.34.0",
  },
  appwrite: {
    appwrite: "^23.0.0",
  },
};

const FEATURE_DEV_DEPS: Record<string, Record<string, string>> = {
  prisma: {
    prisma: "^7.5.0",
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

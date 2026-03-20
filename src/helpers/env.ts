import fs from "fs-extra";
import path from "path";

export async function mergeEnvExamples(
  projectPath: string,
  features: string[]
): Promise<void> {
  const TEMPLATES_DIR = path.join(__dirname, "../../templates");
  const destEnv = path.join(projectPath, ".env.example");

  let combined = await fs.readFile(destEnv, "utf-8").catch(() => "");

  const featureEnvDirs: Record<string, string> = {
    auth: "auth",
    prisma: "prisma",
    convex: "convex",
    appwrite: "appwrite",
  };

  for (const feature of features) {
    const templateDir = featureEnvDirs[feature];
    if (!templateDir) continue;
    const src = path.join(TEMPLATES_DIR, templateDir, ".env.example");
    if (!(await fs.pathExists(src))) continue;
    const content = await fs.readFile(src, "utf-8");
    combined += `\n# ${feature}\n${content}`;
  }

  await fs.writeFile(destEnv, combined.trim() + "\n");
}

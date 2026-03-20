import fs from "fs-extra";
import path from "path";

const TEMPLATES_DIR = path.join(__dirname, "../templates");

export async function copyTemplate(
  templateName: string,
  destPath: string
): Promise<void> {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!(await fs.pathExists(templatePath))) return;
  await fs.copy(templatePath, destPath, { overwrite: true });
}

export async function copyFile(
  templateName: string,
  relativeSrc: string,
  relativeDest: string,
  destRoot: string
): Promise<void> {
  const src = path.join(TEMPLATES_DIR, templateName, relativeSrc);
  const dest = path.join(destRoot, relativeDest);
  if (!(await fs.pathExists(src))) return;
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest, { overwrite: true });
}

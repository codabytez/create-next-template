import { execa } from "execa";

export async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await execa(command, args, { cwd, stdio: "inherit" });
}

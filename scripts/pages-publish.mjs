import { spawn } from "node:child_process";
import { readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function runBuild() {
  return new Promise((resolve) => {
    const child = spawn("npx", ["vite", "build"], {
      cwd: root,
      env: { ...process.env, GITHUB_PAGES: "1" },
      stdio: "inherit",
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

const code = await runBuild();
const pub = join(root, ".output/public");
const nested = join(pub, "mapa-mansao/index.html");

let html = "";
for (const path of [nested, join(pub, "index.html")]) {
  try {
    const info = await stat(path);
    if (info.size < 200) continue;
    html = await readFile(path, "utf8");
    if (html.includes("<html")) break;
    html = "";
  } catch {
    /* try the next candidate */
  }
}

if (!html) {
  console.error("pages: no HTML shell was written");
  process.exit(code || 1);
}

await writeFile(join(pub, "index.html"), html);
await writeFile(join(pub, "404.html"), html);
await writeFile(join(pub, ".nojekyll"), "");
await rm(join(pub, "index"), { force: true });
await rm(join(pub, "mapa-mansao"), { recursive: true, force: true });

if (!html.includes("/mapa-mansao/assets/")) {
  console.error("pages: asset URLs are missing the /mapa-mansao/ base");
  process.exit(1);
}

console.log(`pages: index.html ${html.length} bytes`);
if (code !== 0) {
  console.warn(`pages: vite exited ${code}; the static site was assembled anyway`);
}

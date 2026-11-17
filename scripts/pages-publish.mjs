import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

async function clearMainCopy() {
  await rm(join(root, "index.html"), { force: true });
  await rm(join(root, "404.html"), { force: true });
  await rm(join(root, ".nojekyll"), { force: true });
  await rm(join(root, "assets"), { recursive: true, force: true });
}

// Vite treats a root index.html as the renderer template. Move the published
// copy aside so the build prerenders the real app, then write it back.
await clearMainCopy();

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
    // The prerender stream writes a NUL after route ids. Inside the inline
    // script that becomes part of the string and the client never hydrates.
    html = html.replaceAll("\0", "");
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

// GitHub Pages for this repo publishes the main branch root, and the images
// already live in public/. The gh-pages artifact keeps Vite's own paths.
function forMainBranch(source) {
  return source
    .replaceAll("/mapa-mansao/favicon.svg", "/mapa-mansao/public/favicon.svg")
    .replaceAll("/mapa-mansao/mural/", "/mapa-mansao/public/mural/")
    .replaceAll("`screens/", "`public/screens/");
}

const assetDir = join(root, "assets");
await rm(assetDir, { recursive: true, force: true });
await mkdir(assetDir);
for (const name of await readdir(join(pub, "assets"))) {
  const file = join(pub, "assets", name);
  const raw = await readFile(file);
  const text = name.endsWith(".js") || name.endsWith(".css") || name.endsWith(".html");
  await writeFile(join(assetDir, name), text ? forMainBranch(raw.toString("utf8")) : raw);
}
await writeFile(join(root, "index.html"), forMainBranch(html));
await writeFile(join(root, "404.html"), forMainBranch(html));
await writeFile(join(root, ".nojekyll"), "");
console.log("pages: copied the site to the repo root for the main branch");

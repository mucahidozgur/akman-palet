// Akman Palet — derleme scripti
//   npm run build  : dist/ klasörünü üretir (CSS minify edilir)
//   npm run watch  : geliştirme sırasında CSS'i canlı izler
// Çıktı: dist/ klasörünün tamamı hosting'e yüklenir.

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOK = dirname(fileURLToPath(import.meta.url));
const SRC = join(KOK, "src");
const DIST = join(KOK, "dist");
const IZLE = process.argv.includes("--watch");

// 1) dist'i temizle
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 2) HTML, robots, sitemap ve görselleri kopyala
const SAYFALAR = [
  "index.html",
  "hizmetler.html",
  "urunler.html",
  "hakkimizda.html",
  "sss.html",
  "iletisim.html",
];
for (const dosya of [...SAYFALAR, "robots.txt", "sitemap.xml"]) {
  cpSync(join(SRC, dosya), join(DIST, dosya));
}
cpSync(join(SRC, "assets"), join(DIST, "assets"), { recursive: true });
console.log("Dosyalar kopyalandı.");

// 3) Tailwind CSS'i derle (kaynak taraması src/ klasörü üzerinden input.css'te)
const tailwind = [
  "npx @tailwindcss/cli",
  "-i src/input.css",
  "-o dist/assets/css/style.css",
  IZLE ? "--watch" : "--minify",
].join(" ");
execSync(tailwind, { stdio: "inherit", cwd: KOK, shell: true });

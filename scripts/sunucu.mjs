// Basit statik sunucu — dist/ klasörünü yerel adreste yayınlar.
// Kullanım: node scripts/sunucu.mjs  →  http://localhost:8080
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = fileURLToPath(new URL("../dist", import.meta.url));
const PORT = process.env.PORT || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const sunucu = createServer(async (istek, yanit) => {
  try {
    let yol = decodeURIComponent(new URL(istek.url, "http://localhost").pathname);
    if (yol.endsWith("/")) yol += "index.html";
    const dosya = normalize(join(KOK, yol));
    if (!dosya.startsWith(KOK + sep)) {
      yanit.writeHead(403).end("Yasak");
      return;
    }
    const icerik = await readFile(dosya);
    yanit.writeHead(200, {
      "Content-Type": MIME[extname(dosya).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    yanit.end(icerik);
  } catch {
    yanit.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    yanit.end('<h1>404</h1><p>Sayfa bulunamadı — <a href="/">ana sayfaya dön</a></p>');
  }
});

sunucu.listen(PORT, "127.0.0.1", () => {
  console.log(`Akman Palet sitesi: http://localhost:${PORT}  (durdurmak için Ctrl+C)`);
});

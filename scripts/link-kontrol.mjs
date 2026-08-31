// Akman Palet — dist çıktısında kırık link/görsel kontrolü
// Kullanım: node scripts/link-kontrol.mjs

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(KOK, "dist");
const sayfalar = readdirSync(DIST).filter((f) => f.endsWith(".html"));

let hataSayisi = 0;

for (const sayfa of sayfalar) {
  const html = readFileSync(join(DIST, sayfa), "utf8");

  // Yerel dosya referansları (href/src)
  const refDeseni = /(?:href|src)="([^"#][^"]*)"/g;
  let eslesme;
  while ((eslesme = refDeseni.exec(html)) !== null) {
    const hedef = eslesme[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(hedef)) continue; // dış kaynakları atla
    const temiz = hedef.split("#")[0].split("?")[0];
    if (!temiz) continue; // saf çapa linki
    if (!existsSync(join(DIST, temiz))) {
      console.error(`KIRIK DOSYA: ${sayfa} -> ${hedef}`);
      hataSayisi++;
    }
  }

  // Çapa linkleri (#hedef) — aynı sayfada id var mı?
  const capaDeseni = /href="([^"]*)#([^"]+)"/g;
  while ((eslesme = capaDeseni.exec(html)) !== null) {
    const hedefSayfa = eslesme[1] || sayfa;
    const capa = eslesme[2];
    const hedefHtml = readFileSync(join(DIST, hedefSayfa), "utf8");
    if (!hedefHtml.includes(`id="${capa}"`)) {
      console.error(`KIRIK ÇAPA: ${sayfa} -> ${hedefSayfa}#${capa}`);
      hataSayisi++;
    }
  }
}

console.log(hataSayisi === 0
  ? "TÜM LINKLER VE ÇAPALAR GEÇERLİ ✓"
  : `Toplam ${hataSayisi} sorun bulundu.`);

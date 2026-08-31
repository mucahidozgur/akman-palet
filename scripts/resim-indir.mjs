// Akman Palet — Unsplash görsel indirme scripti
// Kullanım: node scripts/resim-indir.mjs
// Her görsel için napi API'sinden gerçek imgix URL'si (urls.raw) alınır ve
// istenen genişlikte JPEG olarak src/assets/img/ klasörüne indirilir.
// Kaynak: unsplash.com — Ücretsiz Unsplash Lisansı (ticari kullanım serbest).

const HEDEFLER = [
  { dosya: "hero",                    id: "tWLgDQCKRYU", genislik: 1400, kalite: 70 },
  { dosya: "urun-80x120",             id: "i2I0_u98Rh4", genislik: 800 },
  { dosya: "urun-100x120",            id: "50-PtgEjLAY", genislik: 640 },
  { dosya: "urun-euro",               id: "t32lrFimPlU", genislik: 800 },
  { dosya: "urun-ozel-olcu",          id: "-CFLfHhnaoQ", genislik: 640 },
  { dosya: "urun-sandik",             id: "u0ZzvGCpOUk", genislik: 800 },
  { dosya: "hizmet-sifir-palet",      id: "m6emRGWkTfQ", genislik: 800 },
  { dosya: "hizmet-ikinci-el-palet",  id: "an7RbxMbm6E", genislik: 800 },
  { dosya: "hizmet-sandik",           id: "8dvTZPVEJWk", genislik: 800 },
  { dosya: "hizmet-kereste",          id: "i82TImeGrDU", genislik: 800 },
  { dosya: "hizmet-ikinci-el-kereste", id: "UuX-Le3bfzc", genislik: 800 },
  { dosya: "atolye-1",                id: "PxlKOcj0a3Q", genislik: 1000 },
  { dosya: "atolye-2",                id: "hdW4rZPHe2g", genislik: 1000 },
  { dosya: "atolye-3",                id: "5bjzV3g0ZJc", genislik: 1000 },
  { dosya: "kereste-detay",           id: "bBKVrH0vzB4", genislik: 800 },
];

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIKTI = join(KOK, "src", "assets", "img");
mkdirSync(CIKTI, { recursive: true });

for (const { dosya, id, genislik, kalite = 75 } of HEDEFLER) {
  try {
    const napi = await fetch(`https://unsplash.com/napi/photos/${id}`, {
      headers: { "Accept": "application/json", "User-Agent": "akmanpalet-site-builder" },
    });
    if (!napi.ok) throw new Error(`napi hata: ${napi.status}`);
    const veri = await napi.json();
    const raw = veri?.urls?.raw;
    if (!raw) throw new Error("urls.raw bulunamadı");
    const url = `${raw}&w=${genislik}&q=${kalite}&fm=jpg&fit=crop`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`indirme hata: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const yol = join(CIKTI, `${dosya}.jpg`);
    writeFileSync(yol, buf);
    console.log(`OK  ${dosya}.jpg  (${(buf.length / 1024).toFixed(0)} KB)  [${veri.alt_description ?? ""}]`);
  } catch (hata) {
    console.error(`HATA ${dosya}: ${hata.message}`);
  }
}
console.log("Tamamlandı.");

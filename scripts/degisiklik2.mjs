// Kullanıcı istekleri 2. tur:
// - Teklif formu tamamen kaldırıldı (iletisim.html)
// - Üst menüdeki ve mobil menüdeki "Teklif Al" butonları kaldırıldı (numara duruyor)
// - Kalan tüm "Teklif Al / İletişime Geçin" bağlantıları telefon aramasına yönlendirildi
// - SSS'deki "İletişime Geçin" telefon numarasına yönlendirildi
// - Harita embed'i yer sorgusuna çevrildi (yer bilgisi kartı gösterir)
import { readFileSync, writeFileSync } from "node:fs";

const SAYFALAR = ["index", "hizmetler", "urunler", "hakkimizda", "sss", "iletisim"];
const oku = (f) => readFileSync(`src/${f}.html`, "utf8");
const yaz = (f, s) => writeFileSync(`src/${f}.html`, s);

for (const f of SAYFALAR) {
  let s = oku(f);

  // Üst menüdeki (masaüstü) "Teklif Al" butonunu kaldır — telefon numarası kalır
  s = s.replace(/\s*<a href="iletisim.html#teklif-formu" class="btn btn-cta">Teklif Al<\/a>\n/, "\n");

  // Mobil menüdeki "Hemen Teklif Al" butonunu kaldır — telefon butonu kalır
  s = s.replace(
    /(<a href="tel:\+905363955673" class="btn btn-outline">0536&nbsp;395&nbsp;56&nbsp;73<\/a>\s*\n\s*)<a href="iletisim.html#teklif-formu" class="btn btn-cta">Hemen Teklif Al<\/a>\s*\n/,
    "$1"
  );

  // Kalan tüm "teklif formu" bağlantılarını telefon aramasına çevir
  s = s.replaceAll("iletisim.html#teklif-formu", "tel:+905363955673");
  yaz(f, s);
}

// ---------- iletisim.html: form bölümünü kaldır, haritayı yeniden düzenle ----------
let c = oku("iletisim");

c = c.replace("<!-- ==================== FORM + HARİTA ==================== -->", "<!-- ==================== KONUM + HARİTA ==================== -->");
c = c.replace('id="teklif-formu"', 'id="konum"');

// Form kartını kaldır, yerine bölüm başlığı koy
const i1 = c.indexOf("      <!-- Form -->");
const i2 = c.indexOf("      <!-- Harita + WhatsApp -->", i1);
if (i1 !== -1 && i2 !== -1) {
  const baslik = `      <div class="mx-auto max-w-2xl text-center" data-reveal>
        <p class="section-eyebrow">Konum</p>
        <h2 class="section-title mt-4">Bizi Ziyaret Edin</h2>
        <p class="mt-4 leading-relaxed text-ink/70">Atölyemiz Gimat'ta; telefon, e-posta veya WhatsApp üzerinden bize ulaşabilir, dilerseniz yol tarifi alıp ziyaret edebilirsiniz.</p>
      </div>

      `;
  c = c.slice(0, i1) + baslik + c.slice(i2);
}

// Konum bölümünü tek sütuna çevir
const b1 = c.indexOf("<!-- ==================== KONUM + HARİTA ==================== -->");
const b2 = c.indexOf("container-site grid gap-10 lg:grid-cols-2", b1);
if (b2 !== -1)
  c = c.slice(0, b2) + "container-site max-w-4xl" + c.slice(b2 + "container-site grid gap-10 lg:grid-cols-2".length);

// Harita: koordinat yerine yer sorgusu (yer bilgisi kartı gösterir)
c = c.replace(
  "https://www.google.com/maps?q=39.9560366,32.7633289&z=16&output=embed",
  "https://www.google.com/maps?q=Tepe+Palet+Gimat+Macun+Yenimahalle+Ankara&output=embed"
);

// Meta etiketlerinden form ifadelerini çıkar
c = c.replace(
  "Ankara'da palet ve kereste için hemen teklif formunu doldurun veya WhatsApp'tan yazın.",
  "Ankara'da palet ve kereste ihtiyaçlarınız için bizi arayın veya WhatsApp'tan yazın."
);
c = c.replace("İletişim | Akman Palet — Teklif Alın, Bize Ulaşın", "İletişim | Akman Palet — Bize Ulaşın");
c = c.replace(
  'content="Palet ve kereste ihtiyaçlarınız için hemen teklif alın."',
  'content="Palet ve kereste ihtiyaçlarınız için bizi arayın."'
);
yaz("iletisim", c);

console.log("Değişiklikler uygulandı (tur 2).");

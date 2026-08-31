// Kullanıcı istekleri doğrultusunda toplu metin değişiklikleri:
// - Gerçek telefon / WhatsApp / adres / çalışma saatleri
// - Türkiye geneli ifadeleri → sadece Ankara
// - Ana sayfadaki hızlı teklif formu kaldırıldı
// - Özel ölçü CTA'sı WhatsApp'a bağlandı
// - Harita gerçek konuma (Macun, Gimat No:18) ayarlandı
// - Değişen görsellerin alt metinleri / boyut bilgileri güncellendi
import { readFileSync, writeFileSync } from "node:fs";

const SAYFALAR = ["index", "hizmetler", "urunler", "hakkimizda", "sss", "iletisim"];
const oku = (f) => readFileSync(`src/${f}.html`, "utf8");
const yaz = (f, s) => writeFileSync(`src/${f}.html`, s);

const WA_SVG =
  '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

// ---------- Tüm sayfalarda geçerli değişiklikler ----------
for (const f of SAYFALAR) {
  let s = oku(f);
  s = s.replaceAll("tel:+905XXXXXXXXX", "tel:+905363955673");
  s = s.replaceAll("905XXXXXXXXX", "905363955673"); // wa.me + JSON-LD
  s = s.replaceAll("05XX&nbsp;XXX&nbsp;XX&nbsp;XX", "0536&nbsp;395&nbsp;56&nbsp;73");
  s = s.replaceAll("05XX XXX XX XX", "0536 395 56 73"); // input placeholder'ları
  s = s.replaceAll(
    "Örnek Sanayi Sitesi, 12. Cadde No: 34, Ostim / Ankara",
    "Macun, Gimat No:18, 06374 Yenimahalle / Ankara"
  );
  s = s.replaceAll("08:00 – 19:00", "08:00 – 18:00");
  // Değişen görsellerin alt metinleri
  s = s.replaceAll('alt="Atölyede ahşap işleyen usta"', 'alt="Atölyede tezgâh ve el aletleri"');
  // hizmet-kereste 800x500'e kırpıldı
  s = s.replaceAll(
    'hizmet-kereste.jpg" alt="Kereste deposunda istiflenen ahşap kalaslar" class="aspect-[16/10] w-full object-cover" loading="lazy" width="800" height="531"',
    'hizmet-kereste.jpg" alt="Kereste deposunda istiflenen ahşap kalaslar" class="aspect-[16/10] w-full object-cover" loading="lazy" width="800" height="500"'
  );
  s = s.replaceAll(
    'hizmet-kereste.jpg" alt="Kereste deposunda istiflenen ahşap kalaslar" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width="800" height="531"',
    'hizmet-kereste.jpg" alt="Kereste deposunda istiflenen ahşap kalaslar" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width="800" height="500"'
  );
  yaz(f, s);
}

// ---------- index.html ----------
let i = oku("index");
i = i.replace('"openingHours": "Mo-Sa 08:00-19:00"', '"openingHours": "Mo-Sa 08:00-18:00"');
i = i.replace('"areaServed": ["Ankara", "Türkiye"]', '"areaServed": ["Ankara"]');
i = i.replace(
  "Ankara içi ve çevre illere aynı gün, Türkiye geneline hızlı sevkiyat.",
  "Ankara içi ve tüm ilçelerine aynı gün hızlı sevkiyat."
);
i = i.replace("Ankara ve Türkiye Genelinde Hizmetinizdeyiz", "Ankara'nın Her Yerinde Hizmetinizdeyiz");
i = i.replace(
  "Başta Ankara ve ilçeleri olmak üzere tüm Türkiye'ye sevkiyat yapıyoruz. Bölgenizdeki palet ihtiyacınız için hemen arayın.",
  "Ankara ve tüm ilçelerine sevkiyat yapıyoruz. Bölgenizdeki palet ihtiyacınız için hemen arayın."
);
i = i.replace(
  '<span class="rounded-full bg-wood-700 px-4 py-2 text-sm font-semibold text-white">Türkiye Geneli</span>\n',
  ""
);
i = i.replace(
  "Teklif, sipariş ve ikinci el palet alımı için bize telefon, e-posta veya form üzerinden ulaşabilirsiniz.",
  "Teklif, sipariş ve ikinci el palet alımı için bize telefon, e-posta veya WhatsApp üzerinden ulaşabilirsiniz."
);
// Hızlı teklif formu bloğunu kaldır
const f1 = i.indexOf("      <!-- Hızlı teklif formu -->");
const f2 = i.indexOf("    </div>\n  </section>", f1);
if (f1 !== -1 && f2 !== -1) i = i.slice(0, f1) + i.slice(f2);
// İletişim bölümünü tek sütuna çevir
const k1 = i.indexOf('id="iletisim"');
const k2 = i.indexOf("container-site grid gap-12 lg:grid-cols-2", k1);
if (k2 !== -1)
  i = i.slice(0, k2) + "container-site max-w-3xl" + i.slice(k2 + "container-site grid gap-12 lg:grid-cols-2".length);
yaz("index", i);

// ---------- hakkimizda.html ----------
let h = oku("hakkimizda");
h = h.replace("Ankara ve Türkiye geneline hızlı sevkiyat", "Ankara geneline hızlı sevkiyat");
yaz("hakkimizda", h);

// ---------- sss.html ----------
let sss = oku("sss");
sss = sss.replace(
  "Öncelikli hizmet bölgemiz Ankara ve tüm ilçeleridir (Ostim, İvedik OSB, Sincan, Siteler, Yenimahalle, Mamak, Polatlı, Kazan, Akyurt ve diğerleri). Çevre illere düzenli sevkiyat yapıyoruz; Türkiye geneline ise anlaşmalı nakliye ile gönderim sağlıyoruz.",
  "Hizmet bölgemiz Ankara ve tüm ilçeleridir (Ostim, İvedik OSB, Sincan, Siteler, Yenimahalle, Mamak, Polatlı, Kazan, Akyurt ve diğerleri). Ankara ili dışına teslimat yapmıyoruz."
);
yaz("sss", sss);

// ---------- urunler.html: Özel Ölçü CTA → WhatsApp ----------
let u = oku("urunler");
u = u.replace(
  '<a href="iletisim.html#teklif-formu" class="btn btn-cta">Özel Ölçü Teklif Al</a>',
  `<a href="https://wa.me/905363955673?text=Merhaba%2C%20%C3%B6zel%20%C3%B6l%C3%A7%C3%BC%20palet%20i%C3%A7in%20teklif%20almak%20istiyorum." target="_blank" rel="noopener" class="btn btn-whatsapp">${WA_SVG}WhatsApp'tan Teklif Al</a>`
);
yaz("urunler", u);

// ---------- iletisim.html: Harita gerçek konum ----------
let c = oku("iletisim");
c = c.replace(
  `          <!-- DEĞİŞTİR: Haritada kendi adresinizin görünmesi için q=Ankara yerine
               tam adresinizi yazın (örn. q=Ostim+Ankara). -->
          <iframe
            src="https://www.google.com/maps?q=Ankara&output=embed"`,
  `          <iframe
            src="https://www.google.com/maps?q=39.9560366,32.7633289&z=16&output=embed"`
);
c = c.replace(
  `          </iframe>
        </div>`,
  `          </iframe>
          <div class="flex flex-wrap items-center justify-between gap-2 border-t border-wood-100 px-4 py-3">
            <p class="text-sm font-semibold text-wood-800">Macun, Gimat No:18, 06374 Yenimahalle / Ankara</p>
            <a href="https://www.google.com/maps/dir//Tepe+Palet,+Macun,+Gimat+No:18,+06374+Yenimahalle%2FAnkara/@40.0106245,32.8387134,12.21z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14d3490758acbcfb:0xfbb9202319ad93a!2m2!1d32.7633289!2d39.9560366?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener" class="text-sm font-semibold text-cta-500 hover:underline">Google Maps'te Aç →</a>
          </div>
        </div>`
);
yaz("iletisim", c);

console.log("Tüm değişiklikler uygulandı.");

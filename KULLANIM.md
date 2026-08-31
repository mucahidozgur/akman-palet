# Akman Palet Web Sitesi — Kullanım Kılavuzu

Bu proje, Tailwind CSS v4 ile derlenen çok sayfalı statik bir web sitesidir.
Kaynak dosyalar `src/` klasöründe, yayına hazır derlenmiş site `dist/` klasöründedir.

## Hızlı Başlangıç

```bash
npm install        # bağımlılıkları kur (yalnızca ilk seferde)
npm run build      # dist/ klasörünü yeniden üret
npm run watch      # geliştirme sırasında otomatik derleme
```

`npm run build` şunları yapar: `dist/`'i temizler → `src/`'teki 6 HTML sayfasını,
`robots.txt` ve `sitemap.xml`'i kopyalar → görselleri ve JS'i taşır → Tailwind CSS'i
tek ve sıkıştırılmış `dist/assets/css/style.css` dosyasına derler.

## Yayınlama (Vercel)

1. GitHub'a yükleyin (aşağıdaki "GitHub" bölümü).
2. https://vercel.com adresine GitHub hesabınızla girin → "Add New Project" →
   repoyu seçin. `vercel.json` dosyası sayesinde ayarlar otomatiktir
   (Build: `npm run build`, Çıktı: `dist`).
3. "Deploy" deyin; birkaç dakika içinde siteniz yayında olur.
4. "Domains" sekmesinden kendi alan adınızı bağlayabilirsiniz.

Manuel yükleme isterseniz: `dist/` klasörünün tamamını herhangi bir hostinge
(Netlify, cPanel...) yükleyin — site tamamen statiktir.

## Yapılacak Değişiklikler (kontrol listesi)

Güncel iletişim bilgileri zaten girildi: telefon **0536 395 56 73**, adres
**Macun, Gimat No:18, 06374 Yenimahalle / Ankara**, çalışma saatleri
**Pzt–Cmt 08:00 – 18:00**. Hâlâ değiştirilmesi gerekenler `<!-- DEĞİŞTİR: ... -->`
yorumlarıyla işaretlidir — editörünüzde `DEĞİŞTİR` araması yaparak bulun:

1. **E-posta** — `info@akmanpalet.com` (tüm sayfalarda; gerçek e-postanızla değiştirin)
2. **İletişim formu** — Şu an kaldırılmış durumda; tüm "Teklif Al" butonları telefon
   aramasına, "Özel Ölçü Teklif Al" butonu WhatsApp'a yönlendiriyor. İleride form
   eklenecekse: https://formspree.io adresinden ücretsiz hesap açıp formu
   `src/iletisim.html` içine ekleyin ve kimliği `action` değerine yazın.
3. **Alan adı** — `src/sitemap.xml` ve `src/robots.txt` içindeki
   `www.akmanpalet.com` placeholder'ını gerçek alan adınızla değiştirin.

## GitHub

```bash
gh auth login        # GitHub'a giriş (bir kez)
gh repo create akman-palet --public --source . --push
```

Veya web üzerinden: github.com/new → boş repo oluşturun → `git remote add origin <url>`
→ `git push -u origin main`.

## Sayfa Yapısı

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa: hero, hizmetler, ürünler, neden biz, bölgeler, iletişim bilgileri |
| `hizmetler.html` | 5 hizmetin detaylı anlatımı |
| `urunler.html` | Ölçü tablosu, ürün kartları, sandık/kasa, galeri |
| `hakkimizda.html` | Firma tanıtımı, üretim süreci, kalite politikası |
| `sss.html` | 8 soru-cevap (akordeon) |
| `iletisim.html` | İletişim kartları, harita (Gimat adresi), WhatsApp |

Not: Teklif formları şimdilik kaldırıldı. Tüm "Teklif Al" butonları telefon
aramasına, "Özel Ölçü Teklif Al" butonu doğrudan WhatsApp'a yönlendirir.

## Kalite Kontrolleri

```bash
npx --yes html-validate "dist/*.html"   # HTML doğrulama (şu an: 0 hata)
node scripts/link-kontrol.mjs           # kırık bağlantı ve çapa kontrolü
node scripts/sunucu.mjs                 # yerel önizleme: http://localhost:8080
```

## Görseller

Fotoğraflar `src/assets/img/` klasöründedir (ücretsiz lisanslı Unsplash fotoğrafları;
insan/yüz görünenler elendi). Kendi fotoğraflarınızı aynı isimle üzerine yazarsanız kod
değişikliği gerekmez. Önerilen ölçüler: hero en az 1400px, kart görselleri 640–900px.
Görselleri yeniden indirmek: `node scripts/resim-indir.mjs`

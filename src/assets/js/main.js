/* ============================================================
   Akman Palet — ortak site JavaScript'i
   - Mobil menü
   - Yapışkan header gölgesi
   - SSS akordeon (erişilebilir)
   - Scroll reveal animasyonları
   - İletişim formu doğrulama + Formspree/Netlify gönderimi
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  mobilMenuBaslat();
  headerKaydirmaBaslat();
  sssAkordeonBaslat();
  revealBaslat();
  formBaslat();
});

/* ---------------- Mobil menü ---------------- */
function mobilMenuBaslat() {
  var dugme = document.getElementById("menu-btn");
  var menu = document.getElementById("mobil-menu");
  if (!dugme || !menu) return;
  var ikonAc = document.getElementById("menu-ac");
  var ikonKapat = document.getElementById("menu-kapat");

  function ac(kapalimi) {
    menu.hidden = !kapalimi;
    dugme.setAttribute("aria-expanded", String(kapalimi));
    document.body.classList.toggle("overflow-hidden", kapalimi);
    // Hamburger / çarpı ikonlarını değiştir
    if (ikonAc) ikonAc.classList.toggle("hidden", kapalimi);
    if (ikonKapat) ikonKapat.classList.toggle("hidden", !kapalimi);
  }

  dugme.addEventListener("click", function () {
    ac(menu.hidden);
  });

  // Menü içindeki herhangi bir bağlantıya tıklanınca kapat
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { ac(false); });
  });

  // Escape ile kapat
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) ac(false);
  });

  // Masaüstüne geçilirse menüyü sıfırla
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && !menu.hidden) ac(false);
  });
}

/* ---------------- Header gölgesi ---------------- */
function headerKaydirmaBaslat() {
  var header = document.getElementById("site-header");
  if (!header) return;
  var guncelle = function () {
    header.classList.toggle("header-kaydirildi", window.scrollY > 8);
  };
  guncelle();
  window.addEventListener("scroll", guncelle, { passive: true });
}

/* ---------------- SSS akordeon ---------------- */
function sssAkordeonBaslat() {
  var ogeler = document.querySelectorAll(".faq-item");
  ogeler.forEach(function (oge) {
    var dugme = oge.querySelector(".faq-toggle");
    var panel = oge.querySelector(".faq-panel");
    if (!dugme || !panel) return;

    dugme.addEventListener("click", function () {
      var aciliyor = dugme.getAttribute("aria-expanded") !== "true";
      // Aynı anda tek soru açık kalsın
      ogeler.forEach(function (diger) {
        var d = diger.querySelector(".faq-toggle");
        var p = diger.querySelector(".faq-panel");
        if (d && p && diger !== oge) {
          d.setAttribute("aria-expanded", "false");
          p.setAttribute("data-open", "false");
          diger.setAttribute("data-open", "false");
        }
      });
      dugme.setAttribute("aria-expanded", String(aciliyor));
      panel.setAttribute("data-open", String(aciliyor));
      oge.setAttribute("data-open", String(aciliyor));
    });
  });
}

/* ---------------- Scroll reveal ---------------- */
function revealBaslat() {
  // .reveal sınıfını yalnızca JS çalışırken ekle (JS kapalıysa içerik gizlenmesin)
  var hedefler = document.querySelectorAll("[data-reveal]");
  hedefler.forEach(function (el) { el.classList.add("reveal"); });

  var gozlemci = new IntersectionObserver(function (girisler) {
    girisler.forEach(function (giris) {
      if (giris.isIntersecting) {
        giris.target.classList.add("is-visible");
        gozlemci.unobserve(giris.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  hedefler.forEach(function (el) { gozlemci.observe(el); });
}

/* ---------------- Form doğrulama ---------------- */
function formBaslat() {
  var formlar = document.querySelectorAll("form[data-iletisim]");
  formlar.forEach(function (form) {
    // Canlı geri bildirim: hata mesajını temizle
    form.querySelectorAll("input, textarea").forEach(function (alan) {
      alan.addEventListener("input", function () { hataTemizle(alan); });
      alan.addEventListener("blur", function () { alanDogrula(alan); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var gecerli = true;
      form.querySelectorAll("input, textarea").forEach(function (alan) {
        if (!alanDogrula(alan)) gecerli = false;
      });
      if (!gecerli) {
        var ilkHata = form.querySelector('[aria-invalid="true"]');
        if (ilkHata) ilkHata.focus();
        return;
      }
      formuGonder(form);
    });
  });
}

function alanDogrula(alan) {
  var deger = alan.value.trim();
  var mesaj = "";
  var zorunlu = alan.required;

  if (zorunlu && deger === "") {
    mesaj = "Bu alan zorunludur.";
  } else if (deger !== "" && alan.name === "ad" && deger.length < 2) {
    mesaj = "Lütfen en az 2 karakter girin.";
  } else if (deger !== "" && alan.name === "telefon") {
    var rakamlar = deger.replace(/\D/g, "");
    var telesapka = rakamlar.replace(/^(90)/, "");
    if (telesapka.length < 10 || telesapka.length > 11) {
      mesaj = "Lütfen geçerli bir telefon numarası girin (örn. 0532 123 45 67).";
    }
  } else if (deger !== "" && alan.name === "eposta") {
    var epostaDeseni = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!epostaDeseni.test(deger)) {
      mesaj = "Lütfen geçerli bir e-posta adresi girin.";
    }
  } else if (deger !== "" && alan.name === "mesaj" && deger.length < 10) {
    mesaj = "Mesajınız en az 10 karakter olmalıdır.";
  }

  hataGoster(alan, mesaj);
  return mesaj === "";
}

function hataGoster(alan, mesaj) {
  var hataEl = alan.parentElement.querySelector(".form-error");
  if (!hataEl) return;
  if (mesaj) {
    hataEl.textContent = mesaj;
    hataEl.hidden = false;
    alan.setAttribute("aria-invalid", "true");
    alan.setAttribute("aria-describedby", hataEl.id || "hata-" + alan.name);
  } else {
    hataTemizle(alan);
  }
}

function hataTemizle(alan) {
  var hataEl = alan.parentElement.querySelector(".form-error");
  if (hataEl) hataEl.hidden = true;
  alan.removeAttribute("aria-invalid");
  alan.removeAttribute("aria-describedby");
}

function durumGoster(form, tur, mesaj) {
  var durum = form.querySelector(".form-durum");
  if (!durum) return;
  durum.hidden = false;
  durum.textContent = mesaj;
  durum.className = "form-durum";
  if (tur === "success") {
    durum.classList.add("form-durum--success");
  } else if (tur === "error") {
    durum.classList.add("form-durum--error");
  } else {
    durum.classList.add("form-durum--info");
  }
}

function formuGonder(form) {
  var action = form.getAttribute("action") || "";

  // Form entegrasyonu henüz yapılandırılmadıysa kullanıcıya bilgi ver
  if (action.includes("FORM_KIMLIGINIZ")) {
    durumGoster(
      form,
      "info",
      "Form henüz yapılandırılmadı. KULLANIM.md dosyasındaki adımlarla Formspree (veya Netlify Forms) kimliğinizi ekleyin."
    );
    return;
  }

  var gonderen = form.querySelector('button[type="submit"]');
  if (gonderen) gonderen.disabled = true;

  fetch(action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  })
    .then(function (res) {
      if (res.ok) {
        form.reset();
        durumGoster(form, "success", "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
      } else {
        return res.json().catch(function () { return null; }).then(function (veri) {
          var mesaj = (veri && veri.errors && veri.errors[0] && veri.errors[0].message) ||
            "Mesaj gönderilemedi. Lütfen telefon veya WhatsApp üzerinden ulaşın.";
          durumGoster(form, "error", mesaj);
        });
      }
    })
    .catch(function () {
      durumGoster(form, "error", "Bağlantı hatası oluştu. Lütfen telefon veya WhatsApp üzerinden ulaşın.");
    })
    .finally(function () {
      if (gonderen) gonderen.disabled = false;
    });
}

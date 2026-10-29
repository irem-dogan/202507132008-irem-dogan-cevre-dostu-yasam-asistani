"use strict";
/* =====================================================================
   Çevre Dostu Yaşam Asistanı - uygulama.js
   Bölümler:
   0) Yardımcılar
   1) Menü / sayfa geçişi
   2) Ana sayfa
   3) Geri dönüşüm rehberi
   4) Su ve enerji tasarrufu
   5) Günlük görevler
   6) Asistan (DEMO - gerçek yapay zekâ YOK)
   ===================================================================== */

/* ---------- 0) YARDIMCILAR ---------- */
const $ = (s, k = document) => k.querySelector(s);
const $$ = (s, k = document) => [...k.querySelectorAll(s)];

// Tarayıcı hafızası (sayfa kapanınca da kalır). Hata verirse sessizce geçer.
const hafiza = {
  oku(anahtar, varsayilan) {
    try {
      const v = localStorage.getItem(anahtar);
      return v === null ? varsayilan : JSON.parse(v);
    } catch (e) { return varsayilan; }
  },
  yaz(anahtar, deger) {
    try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) { /* önemsiz */ }
  }
};

// Türkçe harfleri sadeleştirir: "Şişe Camı" -> "sise cami" (aramayı kolaylaştırır)
function sadelestir(metin) {
  return metin
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Öğeyi güvenli oluşturur (kullanıcı yazısı textContent ile eklenir)
function oge(etiket, sinif, yazi) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (yazi !== undefined) e.textContent = yazi;
  return e;
}
/* ---------- VERİLER (içeriği buradan değiştirebilirsin) ---------- */

const KATEGORILER = [
  { id: "kagit", ad: "Kâğıt", emoji: "📄", renk: "#1e88e5", kutu: "Mavi kutu",
    atilir: ["Gazete, dergi", "Karton kutu", "Defter, kitap", "Ofis kâğıdı"],
    atilmaz: ["Yağlı veya ıslak kâğıt", "Kâğıt mendil, peçete"],
    ipucu: "Karton kutuları açıp düzleştir, yerden kazan." },
  { id: "plastik", ad: "Plastik", emoji: "🧴", renk: "#f9a825", kutu: "Sarı kutu",
    atilir: ["Pet su/meşrubat şişesi", "Şampuan, deterjan şişesi", "Yoğurt, margarin kabı", "Plastik ambalaj"],
    atilmaz: ["Yağlı, kirli kaplar", "Diş fırçası, oyuncak gibi karışık eşyalar"],
    ipucu: "Şişeyi çalkala, kapağını tak, ezip hacmini küçült." },
  { id: "cam", ad: "Cam", emoji: "🫙", renk: "#2e7d32", kutu: "Yeşil kutu",
    atilir: ["Cam şişe", "Cam kavanoz", "Cam sos/reçel kabı"],
    atilmaz: ["Ayna, pencere camı", "Porselen, seramik, kristal", "Ampul"],
    ipucu: "İçini boşalt ve çalkala. Kapakları metal/plastik olarak ayır." },
  { id: "metal", ad: "Metal", emoji: "🥫", renk: "#757575", kutu: "Gri kutu",
    atilir: ["İçecek (kola) kutusu", "Konserve kutusu", "Temiz alüminyum folyo", "Metal kapaklar"],
    atilmaz: ["Boya, kimyasal kutuları", "Pil"],
    ipucu: "Konserve kutusunun içini çalkala, keskin kenara dikkat et." },
  { id: "pil", ad: "Atık Pil", emoji: "🔋", renk: "#d32f2f", kutu: "Özel pil kutusu",
    atilir: ["Kalem pil", "Düğme pil", "Küçük şarj edilebilir piller"],
    atilmaz: ["Çöpe veya lavaboya atma!"],
    ipucu: "Market, okul ve belediyelerdeki atık pil kutularına at. Tek bir pil bile toprağı kirletebilir." },
  { id: "organik", ad: "Organik Atık", emoji: "🍎", renk: "#6d4c41", kutu: "Kahverengi kutu / kompost",
    atilir: ["Meyve-sebze kabuğu", "Çay ve kahve telvesi", "Yumurta kabuğu", "Bahçe artıkları"],
    atilmaz: ["Plastik poşet", "Kemik, et, süt ürünü (evde kompostta önerilmez)"],
    ipucu: "Bahçen varsa kompost yapabilirsin; balkonda küçük kompost kutuları da var." },
  { id: "ozel", ad: "Özel Atıklar", emoji: "⚠️", renk: "#7b1fa2", kutu: "Toplama noktası",
    atilir: ["Ampul, floresan", "Eski telefon, şarj aleti (elektronik atık)", "Bitkisel atık yağ", "Kullanılmayan ilaçlar"],
    atilmaz: ["Genel çöpe atma"],
    ipucu: "Atık yağı kapalı şişede biriktir; ilaçları eczanedeki atık ilaç kutusuna bırak." }
];

// Arama için örnek atıklar. kat: kategori kimliği ya da "genel"
const ATIKLAR = [
  { ad: "Pet şişe", kat: "plastik", not: "Kapağını tak, ezerek at." },
  { ad: "Su şişesi", kat: "plastik", not: "Çalkalayıp at." },
  { ad: "Market poşeti", kat: "plastik", not: "Önce tekrar kullan, sonra plastik kutusuna at." },
  { ad: "Şampuan şişesi", kat: "plastik", not: "İçini durula." },
  { ad: "Yoğurt kabı", kat: "plastik", not: "Durulayıp at." },
  { ad: "Gazete", kat: "kagit", not: "Kuru olmalı." },
  { ad: "Karton kutu", kat: "kagit", not: "Düzleştir." },
  { ad: "Defter", kat: "kagit", not: "Tel ve kapak plastiklerini ayırabilirsen daha iyi." },
  { ad: "Pizza kutusu", kat: "kagit", not: "Temiz kısmı kâğıda; yağlı kısmı genel çöpe." },
  { ad: "Süt kutusu (karton içecek kutusu)", kat: "kagit", not: "Çoğu yerde kâğıt kutusuna; belediyene göre değişebilir." },
  { ad: "Cam şişe", kat: "cam", not: "Kapağı ayır." },
  { ad: "Cam kavanoz", kat: "cam", not: "İçini çalkala." },
  { ad: "Kırık bardak", kat: "genel", not: "Geri dönüşüm camına karışmaz. Gazeteye sarıp genel çöpe at." },
  { ad: "Ayna", kat: "genel", not: "Cam kutusuna atılmaz, genel çöpe (sararak) at." },
  { ad: "Kola kutusu", kat: "metal", not: "Ezerek at." },
  { ad: "Konserve kutusu", kat: "metal", not: "İçini yıka." },
  { ad: "Alüminyum folyo", kat: "metal", not: "Yağdan temizse." },
  { ad: "Pil", kat: "pil", not: "Atık pil kutusuna." },
  { ad: "Ampul", kat: "ozel", not: "Kırmadan toplama noktasına götür." },
  { ad: "Eski telefon", kat: "ozel", not: "Elektronik atık noktasına ver." },
  { ad: "Atık yağ (kızartma yağı)", kat: "ozel", not: "Kapalı şişede biriktir, toplama noktasına ver. Lavaboya dökme." },
  { ad: "İlaç", kat: "ozel", not: "Eczanedeki atık ilaç kutusuna at." },
  { ad: "Meyve kabuğu", kat: "organik", not: "Kompost için ideal." },
  { ad: "Çay telvesi", kat: "organik", not: "Bitkilere de iyi gelir." },
  { ad: "Yumurta kabuğu", kat: "organik", not: "Ezip kompost kutusuna." },
  { ad: "Kâğıt peçete / mendil", kat: "genel", not: "Kirli olduğu için genel çöpe." },
  { ad: "Diş fırçası", kat: "genel", not: "Karışık malzeme; genel çöp." }
];

const SU_IPUCLARI = [
  { e: "🪥", b: "Diş fırçalarken musluğu kapat", m: "Açık musluk dakikada birkaç litre su akıtır. Kapatınca her seferinde litrelerce su kazanırsın." },
  { e: "🚿", b: "Duşu kısa tut", m: "Duş süresini 10 dakikadan 5 dakikaya indirmek günde onlarca litre su kazandırır." },
  { e: "💧", b: "Damlayan musluğu tamir et", m: "Sızıntı küçük görünse de bir yılda ciddi miktarda su boşa gider." },
  { e: "🍽️", b: "Bulaşık makinesini doldurarak çalıştır", m: "Yarım dolu makine yerine tam dolu çalıştırmak hem su hem enerji tasarrufu sağlar." },
  { e: "🪣", b: "Sebze yıkama suyunu biriktir", m: "Çiçekleri sulamak için bu suyu kullanabilirsin." },
  { e: "🌱", b: "Bitkileri sabah veya akşam sula", m: "Güneş yokken su daha az buharlaşır, bitki suyu daha iyi kullanır." },
  { e: "🧺", b: "Çamaşır makinesini tam dolu çalıştır", m: "Az çamaşır için sık çalıştırmak yerine biriktirip tek seferde yıka." },
  { e: "🚰", b: "Bardağını çeşme yerine sürahiden doldur", m: "Soğuk su için musluğu akıtıp beklemek yerine buzdolabında su sürahisi tut." }
];

const ENERJI_IPUCLARI = [
  { e: "💡", b: "LED ampul kullan", m: "LED ampuller eski akkor ampullere göre çok daha az elektrik harcar ve uzun yaşar." },
  { e: "🔌", b: "Kullanmadığın cihazın fişini çek", m: "Şarj aletleri ve bekleme modundaki cihazlar da elektrik çeker." },
  { e: "🌞", b: "Gün ışığından yararlan", m: "Perdeleri aç, gündüz lambayı gereksiz yakma." },
  { e: "🌡️", b: "Kışın termostatı bir derece düşür", m: "Bir derece fark bile ısınma giderini gözle görülür azaltır. Kalın giyinmek de işe yarar." },
  { e: "🧊", b: "Buzdolabı kapağını uzun süre açık tutma", m: "Ne alacağına önceden karar ver, kapıyı hızlıca kapat." },
  { e: "👚", b: "Çamaşırları açıkta kurut", m: "Kurutma makinesi çok enerji harcar. Mümkünse asarak kurut." },
  { e: "💻", b: "Bilgisayarı kullanmıyorsan uyku moduna al", m: "Ekranı kapatmak ve uyku moduna geçmek enerji tasarrufu sağlar." },
  { e: "🚶", b: "Kısa mesafeleri yürü veya bisikletle git", m: "Hem yakıt tasarrufu hem sağlık için kazançlıdır." }
];

const GUNUN_IPUCLARI = [
  "Bez bir alışveriş çantası, yılda yüzlerce plastik poşetin yerini tutabilir.",
  "Geri dönüştürülecek ambalajları kutuya atmadan önce hafifçe durulamak, diğer atıkların kirlenmesini önler.",
  "Pilleri çöpe değil, atık pil kutularına at.",
  "Duş süresini 2 dakika kısaltmak, bir yılda binlerce litre su kazandırabilir.",
  "Kullanmadığın şarj aletini prizde bırakma.",
  "Yeniden kullanılabilir su şişesi taşımak, tek kullanımlık plastiği azaltır.",
  "Yemek artıklarını azaltmak için market listesiyle alışverişe çık.",
  "Kâğıdın iki yüzünü de kullan, ikinci yüzü müsvedde olabilir."
];

const GOREVLER = [
  { id: "g1", metin: "Plastik, kâğıt ve camı ayrı kutuda biriktir", puan: 15 },
  { id: "g2", metin: "Diş fırçalarken musluğu kapalı tut", puan: 15 },
  { id: "g3", metin: "Kullanmadığın bir cihazın fişini çek", puan: 15 },
  { id: "g4", metin: "Duşu 5 dakika veya daha kısa tut", puan: 20 },
  { id: "g5", metin: "Yanında bez çanta veya kendi şişeni taşı", puan: 15 },
  { id: "g6", metin: "Bir arkadaşına geri dönüşüm bilgisi anlat", puan: 20 }
];

/* ---------- 1) MENÜ / SAYFA GEÇİŞİ ---------- */
const SAYFALAR = ["ana", "geridonusum", "tasarruf", "gorevler", "asistan"];

function sayfaGoster() {
  let hedef = location.hash.replace("#", "");
  if (!SAYFALAR.includes(hedef)) hedef = "ana";
  $$(".sayfa").forEach(s => { s.hidden = s.id !== hedef; });
  $$(".menu a").forEach(a => a.classList.toggle("aktif", a.dataset.sayfa === hedef));
  window.scrollTo({ top: 0 });
  if (hedef === "ana") anaSayfaYenile();
}
window.addEventListener("hashchange", sayfaGoster);

// data-git="sayfa" olan tüm butonlar o sayfaya götürür
$$("[data-git]").forEach(b => b.addEventListener("click", () => { location.hash = b.dataset.git; }));

/* ---------- 2) ANA SAYFA ---------- */
function selamMetni() {
  const saat = new Date().getHours();
  let s = "İyi geceler";
  if (saat >= 5 && saat < 12) s = "Günaydın";
  else if (saat >= 12 && saat < 18) s = "İyi günler";
  else if (saat >= 18 && saat < 23) s = "İyi akşamlar";
  const isim = hafiza.oku("cda_isim", "");
  return isim ? `${s}, ${isim}!` : `${s}!`;
}

let ipucuSira = Math.floor(Date.now() / 86400000) % GUNUN_IPUCLARI.length;
function ipucuGoster() { $("#gununIpucu").textContent = GUNUN_IPUCLARI[ipucuSira]; }

function anaSayfaYenile() {
  $("#selam").textContent = selamMetni();
  const { biten, toplam } = gorevDurumu();
  $("#ozetSayi").textContent = `${biten} / ${toplam}`;
  $("#ozetCubuk").style.width = `${(biten / toplam) * 100}%`;
  ipucuGoster();
}

$("#isimKaydet").addEventListener("click", () => {
  hafiza.yaz("cda_isim", $("#isimGirdisi").value.trim());
  $("#selam").textContent = selamMetni();
});
$("#isimGirdisi").value = hafiza.oku("cda_isim", "");
$("#isimGirdisi").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("#isimKaydet").click();
  }
});
$("#yeniIpucu").addEventListener("click", () => {
  ipucuSira = (ipucuSira + 1) % GUNUN_IPUCLARI.length;
  ipucuGoster();
});

/* ---------- 3) GERİ DÖNÜŞÜM ---------- */
function kategoriBul(id) { return KATEGORILER.find(k => k.id === id); }

function kategorileriCiz() {
  const kap = $("#kategoriler");
  kap.innerHTML = "";
  KATEGORILER.forEach(k => {
    const kart = oge("article", "kart kat-kart");
    kart.style.borderTopColor = k.renk;
    kart.appendChild(oge("h3", "", `${k.emoji} ${k.ad}`));
    const rozet = oge("span", "kutu-rengi", k.kutu);
    rozet.style.background = k.renk;
    kart.appendChild(rozet);

    kart.appendChild(oge("p", "etiket evet", "✔ Atılır"));
    const l1 = oge("ul");
    k.atilir.forEach(x => l1.appendChild(oge("li", "", x)));
    kart.appendChild(l1);

    kart.appendChild(oge("p", "etiket hayir", "✘ Atılmaz"));
    const l2 = oge("ul");
    k.atilmaz.forEach(x => l2.appendChild(oge("li", "", x)));
    kart.appendChild(l2);

    kart.appendChild(oge("p", "", "💡 " + k.ipucu));
    kap.appendChild(kart);
  });
}

function atikAra() {
  const sorgu = sadelestir($("#atikAra").value);
  const kap = $("#aramaSonuc");
  kap.innerHTML = "";
  if (!sorgu) return;

  const bulunan = ATIKLAR.filter(a => sadelestir(a.ad).includes(sorgu)).slice(0, 6);
  if (bulunan.length === 0) {
    const d = oge("div", "sonuc bos");
    d.textContent = "Bu atığı listemde bulamadım. Yerel belediyenin geri dönüşüm bilgisine bakmanı öneririm.";
    kap.appendChild(d);
    return;
  }
  bulunan.forEach(a => {
    const d = oge("div", "sonuc");
    const kat = kategoriBul(a.kat);
    d.style.borderLeftColor = kat ? kat.renk : "#9e9e9e";
    const yer = kat ? `${kat.emoji} ${kat.ad} (${kat.kutu})` : "🗑️ Genel atık";
    const baslik = oge("strong", "", `${a.ad} → ${yer}`);
    d.appendChild(baslik);
    d.appendChild(oge("div", "", a.not));
    kap.appendChild(d);
  });
}
$("#atikAraBtn").addEventListener("click", atikAra);
$("#atikAra").addEventListener("input", atikAra);
$("#atikAra").addEventListener("keydown", e => { if (e.key === "Enter") atikAra(); });

/* ---------- 4) SU VE ENERJİ ---------- */
let aktifSekme = "su";
function ipuclariniCiz() {
  const liste = aktifSekme === "su" ? SU_IPUCLARI : ENERJI_IPUCLARI;
  const kap = $("#ipucuListesi");
  kap.innerHTML = "";
  liste.forEach(i => {
    const k = oge("article", "kart ipucu-kart");
    k.appendChild(oge("div", "emoji", i.e));
    k.appendChild(oge("h4", "", i.b));
    k.appendChild(oge("p", "", i.m));
    kap.appendChild(k);
  });
  $$(".sekme").forEach(b => b.classList.toggle("aktif", b.dataset.sekme === aktifSekme));
}
$$(".sekme").forEach(b => b.addEventListener("click", () => {
  aktifSekme = b.dataset.sekme;
  ipuclariniCiz();
}));

const DUS_LITRE_DK = 9; // yaklaşık değer
function dusHesapla() {
  const simdi = Number($("#dusSimdi").value);
  const hedef = Number($("#dusHedef").value);
  const sonuc = $("#hesapSonuc");
  if (!(simdi > 0) || !(hedef > 0)) {
    sonuc.textContent = "Lütfen geçerli süreleri (dakika) gir.";
    return;
  }
  if (hedef >= simdi) {
    sonuc.textContent = "Hedef süre şimdikinden kısa olursa tasarruf hesaplanır. 🙂";
    return;
  }
  const gunluk = (simdi - hedef) * DUS_LITRE_DK;
  const yillik = gunluk * 365;
  sonuc.textContent =
    `Günde yaklaşık ${gunluk} litre, yılda yaklaşık ${yillik.toLocaleString("tr-TR")} litre su tasarrufu! 🎉`;
}
$("#hesaplaBtn").addEventListener("click", dusHesapla);

/* ---------- 5) GÜNLÜK GÖREVLER ---------- */
function bugunAnahtari() {
  const t = new Date();
  const ay = String(t.getMonth() + 1).padStart(2, "0");
  const gun = String(t.getDate()).padStart(2, "0");
  return `cda_gorev_${t.getFullYear()}-${ay}-${gun}`; // her gün yeni anahtar = otomatik sıfırlanır
}
let tamamlananlar = hafiza.oku(bugunAnahtari(), []);

function gorevDurumu() {
  const biten = GOREVLER.filter(g => tamamlananlar.includes(g.id)).length;
  const puan = GOREVLER.filter(g => tamamlananlar.includes(g.id)).reduce((t, g) => t + g.puan, 0);
  return { biten, toplam: GOREVLER.length, puan };
}

function gorevleriCiz() {
  const liste = $("#gorevListesi");
  liste.innerHTML = "";
  GOREVLER.forEach(g => {
    const li = oge("li");
    const btn = oge("button", "gorev" + (tamamlananlar.includes(g.id) ? " bitti" : ""));
    btn.type = "button";
    btn.setAttribute("role", "checkbox");
    btn.setAttribute("aria-checked", String(tamamlananlar.includes(g.id)));
    btn.appendChild(oge("span", "kutu", "âœ“"));
    btn.appendChild(oge("span", "metin", g.metin));
    btn.appendChild(oge("span", "gp", `+${g.puan}`));
    btn.addEventListener("click", () => gorevDegistir(g.id));
    li.appendChild(btn);
    liste.appendChild(li);
  });

  const { biten, toplam, puan } = gorevDurumu();
  $("#gorevSayac").textContent = `${biten} / ${toplam} tamamlandı`;
  $("#gorevPuan").textContent = `${puan} puan`;
  $("#gorevCubuk").style.width = `${(biten / toplam) * 100}%`;
  $("#gorevMesaj").textContent =
    biten === toplam ? "🎉 Tebrikler! Bugünün tüm görevlerini tamamladın."
    : biten === 0 ? "Hadi bir görevle başlayalım!"
    : "Harika gidiyorsun, devam et!";
}

function gorevDegistir(id) {
  tamamlananlar = tamamlananlar.includes(id)
    ? tamamlananlar.filter(x => x !== id)
    : [...tamamlananlar, id];
  hafiza.yaz(bugunAnahtari(), tamamlananlar);
  gorevleriCiz();
}

$("#gorevSifirla").addEventListener("click", () => {
  tamamlananlar = [];
  hafiza.yaz(bugunAnahtari(), tamamlananlar);
  gorevleriCiz();
});
$("#tarihYazi").textContent =
  new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
  " · Görevler her gün yenilenir.";

/* ---------- 6) ASİSTAN (DEMO) ----------
   ÖNEMLİ: Burada gerçek yapay zekâ YOKTUR. Aşağıdaki liste önceden yazılmış
   örnek cevaplardır. Soruda geçen kelimeye göre bir cevap seçilir.
   Gerçek yapay zekâ eklemek istersen, bir sunucu (backend) üzerinden
   bir yapay zekâ servisine bağlanmak gerekir (OKU-BENI.md dosyasına bak).
   API anahtarını asla bu dosyaya yazma: herkes görebilir! */
const DEMO_CEVAPLAR = [
  { k: ["merhaba", "selam", "slm", "naber"], c: "Merhaba! ğŸŒ¿ Ben demo asistanım. Geri dönüşüm, su ve enerji tasarrufu hakkında hazır örnek cevaplarım var." },
  { k: ["tesekkur", "sagol", "eyvallah"], c: "Rica ederim! Gezegen için bir adım daha attın. ğŸŒ" },
  { k: ["atik pil", "pil kutusu", "atık pil kutusuna", "düğme pil", "sarzli pil", "sarjli pil"], c: "Atık pilleri (kalem pil, düğme pil ve küçük şarjlı piller) asla çöpe atma! Market, okul, belediye veya eczanelerdeki atık pil toplama kutularına bırak. İçindeki ağır metaller toprağa ve suya zarar verir. ğŸ”‹" },
  { k: ["pil", "piller", "batarya", "bataryalar"], c: "Pilleri çöpe atma! Kalem pil, düğme pil ve küçük şarjlı pilleri atık pil kutularına bırak. Büyük araç aküleri gibi özel atıklar için belediyenin yönergelerini kontrol et. ğŸ”‹" },
  { k: ["pet sise", "pet siseleri", "pet siseyi", "su siseyi", "meşrubat sisesi"], c: "PET su/meşrubat şişelerini boşaltıp çalkala, kapağını takarak hafifçe ezip sarı (plastik) kutuya at. Ne kadar az yer kaplarsa o kadar kolay taşınır. â™»ï¸" },
  { k: ["sari kutu"], c: "Plastik ambalajlar genellikle sarı kutuya gider. Åişeleri durulayıp, kapağını takarak atman daha iyi sonuç verir. Yağlı ve çok kirli plastikler her zaman geri dönüştürülemeyebilir. â™»ï¸" },
  { k: ["plastik", "plastikler", "poşet", "naylon poşet"], c: "Plastik ambalajları mümkünse durulayarak, kapağını takarak sarı kutuya at. Bez çanta kullanarak tek kullanımlık poşet tüketimini azaltabilirsin. Çok kirli veya yağlı plastikler genel çöpe gidebilir. â™»ï¸" },
  { k: ["cam sise", "cam kavanoz", "cam siseleri", "cam kavanozu"], c: "Temiz cam şişe ve kavanozları yeşil (cam) kutuya at. İçlerini boşaltıp çalkalaman genellikle yeterlidir. Kapağı metal veya plastikse ayrı olarak değerlendirebilirsin. ğŸ«™" },
  { k: ["yesil kutu"], c: "Temiz cam şişe ve kavanozlar yeşil kutuya gider. Ayna, pencere camı, porselen, seramik ve kristal cam kutusuna atılmaz. ğŸ«™" },
  { k: ["cam", "camlar"], c: "Cam şişe ve kavanozlar yeşil kutuya gider. İçlerini boşaltıp hafifçe çalkala. Ayna, ampul, porselen, seramik ve kırık ev camı geri dönüşüm camına karışmamalıdır. ğŸ«™" },
  { k: ["karton kutu", "pizza kutusu", "süt kutusu", "karton ambalaj"], c: "Kuru karton kutuları düzleştirerek mavi (kâğıt) kutuya at. Yağlı pizza kutusunun yağlı kısmı geri dönüştürülemez, o kısmı genel çöpe at. Süt/karton içecek kutuları belediyene göre farklı değerlendirilebilir. ğŸ“„" },
  { k: ["mavi kutu"], c: "Kuru gazete, dergi, defter ve kartonlar mavi kutuya gider. Islak, yağlı veya çok kirli kâğıtlar genellikle geri dönüştürülemez. ğŸ“„" },
  { k: ["kagit", "kagitlar", "karton", "gazete", "defter"], c: "Kuru kâğıt ve kartonlar mavi kutuya gider. Kâğıt mendil, peçete, yağlı kâğıt ve ıslak kâğıtlar geri dönüştürülemez; genellikle genel çöpe gider. ğŸ“„" },
  { k: ["metal", "teneke", "konserve kutusu", "aluminyum folyo", "alüminyum folyo", "kola kutusu"], c: "Temiz içecek kutuları, konserve kutuları ve temiz alüminyum folyolar gri (metal) kutuya atılır. İçlerini çalkalamak yeterli, keskin kenarlara dikkat et. ğŸ¥«" },
  { k: ["ampul", "floresan", "elektronik atik", "eski telefon", "sarj aleti", "kulaklik"], c: "Ampul, floresan lamba, eski telefon, şarj aleti gibi elektronik atıklar genel çöpe atılmaz. Belediyenin veya mağazaların elektronik atık toplama noktalarına teslim et. âš ï¸" },
  { k: ["lavaboya dökebilir miyim", "lavaboya dokebilir miyim", "kizartma yagini lavaboya dokebilir miyim", "kullanılmış yağı lavaboya dökebilir miyim", "kullanilmis yagi lavaboya dokebilir miyim"], c: "Hayır, kullanılmış yemek veya kızartma yağını lavaboya dökmemelisin. Yağ soğuduğunda katılaşarak boruları tıkayabilir, arıtma tesislerine zarar verebilir ve su kirliliğine yol açar. 🛢️" },
  { k: ["kullanılmış yemek yağını ne yapmalıyım", "kullanilmis yemek yagini ne yapmaliyim", "yemek yağını ne yapmalıyım", "yemek yagini ne yapmaliyim", "kullanılmış yemek yağını nasıl değerlendiririm"], c: "Yağın tamamen soğumasını bekle. Ardından sızdırmaz, uygun bir kapta (ör. boş plastik şişe) biriktir. Kapağını sıkıca kapattıktan sonra belediyenin veya çevrendeki yetkili atık yağ toplama noktasının kabul koşullarını kontrol ederek teslim et. 🛢️" },
  { k: ["atık yağ nereye dökülür", "atik yag nereye dokulur", "kullanılmış yağ nereye dökülür", "kullanilmis yag nereye dokulur"], c: "Atık yağ asla lavaboya veya toprağa dökülmemelidir. Hem boruları tıkayabilir hem de yer altı sularını kirletebilir. Yağı sızdırmaz bir kapta biriktirip, yetkili bir atık yağ toplama noktasına vermen gerekir. 🛢️" },
  { k: ["kullanılmış yağı nereye verebilirim", "kullanilmis yagi nereye verebilirim", "kullanılmış yemek yağını nereye verebilirim", "kullanilmis yemek yagini nereye verebilirim"], c: "Bölgendeki belediyenin atık yağ toplama hizmetini veya yetkili atık yağ toplama noktasını kontrol etmeni öneririm. Birçok belediye belirli günlerde toplama yapar, bazı noktalarda ise doğrudan teslim kabulü yapar. 🛢️" },
  { k: ["atik yagi", "atık yağ", "kizartma yagi", "kizartma yağı", "kullanilmis yag", "yag biriktirmek", "kullanılmış yemek yağı", "kullanılmış yemek yagi", "kullanilmis yemek yagi", "kullanilmis yemek yağı", "yemek yagi", "yemek yağı"], c: "Kullanılmış yemek veya kızartma yağını lavaboya veya toprağa dökme. Yağ tamamen soğuyunca sızdırmaz bir kapta biriktirip, belediyenin belirttiği atık yağ toplama noktasına teslim et. 🛢️" },
  { k: ["ilac", "ilaclar", "son kullanma tarihi gecmis ilac", "kullanilmamis ilac"], c: "Kullanılmayan veya son kullanma tarihi geçmiş ilaçları çöpe veya tuvalete atma. Eczanelerdeki atık ilaç kutularına bırak. ğŸ’Š" },
  { k: ["kompost", "bahce kompostu", "ev kompostu", "komposta atmak"], c: "Meyve-sebze kabuğu, çay telvesi ve temiz yumurta kabuğu ev kompostu için uygundur. Et, kemik, süt ürünleri, yağlı yemek artıkları ve bazı işlenmiş ürünler ev kompostuna genellikle uygun değildir. ğŸ" },
  { k: ["organik atik", "meyve kabugu", "sebze kabugu", "cay telvesi", "yumurta kabugu"], c: "Meyve-sebze kabuğu, çay telvesi ve temiz yumurta kabukları organik atıktır. Bahçen varsa kompost yapabilir, YOKsa belediyenin organik atık toplama sistemine göre değerlendir. ğŸ" },
  { k: ["su tasarrufu", "su israfi", "muslugu kapat", "damlayan musluk"], c: "Su tasarrufu için pratik yollar: diş fırçalarken musluğu kapat, damlayan musluğu tamir ettir, bulaşık ve çamaşır makinelerini tam dolu çalıştır, bitkileri sabah veya akşam sula. Su ve Enerji sayfasındaki duş hesaplayıcısını da deneyebilirsin. ğŸ’§" },
  { k: ["dus", "dus suyu", "kisa dus", "dus süresi"], c: "Duşu kısa tutmak en kolay su tasarrufu yöntemidir. 10 dakikalık duşu 5 dakikaya indirmek günde onlarca litre su kazandırabilir. Su ve Enerji sayfasındaki duş tasarrufu hesaplayıcısıyla ne kadar tasarruf edebileceğini görebilirsin. ğŸš¿" },
  { k: ["elektrik tasarrufu", "fatura dusurmek", "faturayi dusurmek", "elektrik faturasını dusurmek"], c: "Elektrik tasarrufu için: LED ampul kullan, kullanmadığın cihazların fişini çek (bekleme modundaki cihazlar da enerji harcar), gün ışığından yararlan, kışın termostatı bir derece düşür ve kısa mesafeleri yürü/bisikletle git. âš¡" },
  { k: ["enerji", "led ampul", "fisini cek", "bekleme modu"], c: "Enerji tasarrufu için pratik öneriler: LED ampul kullan, kullanmadığın cihazların fişini çek, pencere/kapı aralıklarını kontrol et, çamaşırları mümkünse açıkta kurut ve bilgisayarı kullanmıyorsan uyku moduna al. âš¡" },
  { k: ["isitma", "kalorifer", "termostat", "klima"], c: "Isıtma giderlerini azaltmak için termostatı 1 derece düşürmek bile fark yaratabilir. Kalın giyinmek, perdeleri gece kapatmak ve pencere/kapı aralıklarını yalıtmak da etkili yöntemlerdir. ğŸŒ¡ï¸" },
  { k: ["cevre dostu temizlik", "dogal temizlik", "ev yapimi temizlik", "beyaz sirke temizlik"], c: "Seyreltilmiş beyaz sirke, karbonat ve limon suyu birçok yüzey için çevre dostu ve ucuz temizlik alternatifidir. Ancak mermer ve bazı hassas taş yüzeylerde sirke kullanılmamalıdır. Güçlü sentetik kimyasallara göre daha az kirletici olabilir. ğŸŒ¿" },
  { k: ["temizlik urunleri", "yuzey temizleyici", "bulasik deterjani", "konsantre temizlik"], c: "Mümkünse konsantre ürünler, geri dönüştürülebilir ambalajlı veya yeniden dolumlu temizlik ürünlerini tercih et. Aşırı miktarda ürün kullanmak yerine dozajına dikkat etmek hem bütçene hem çevreye yardımcı olur. ğŸŒ¿" },
  { k: ["geri donusum", "donusum", "sifir atik", "ayristirmak", "nereden atilir"], c: "Geri dönüşümün temeli: ayır, durula, doğru kutuya at. Atık adını Geri Dönüşüm sayfasındaki arama kutusuna yazarak nereye atılacağını bulabilirsin. Kutu renkleri ve kurallar belediyeden belediyeye değişebilir. â™»ï¸" },
  { k: ["gorev", "gorevler", "puan", "ilerleme"], c: "Günlük görevler sayfasında 6 görev var. Tamamladıkça işaretle, puanlarını ve ilerleme çubuğunu gör! âœ…" },
  { k: ["poset", "alisveris cantasi", "bez canta"], c: "Bez çanta kullanmak plastik poşet tüketimini azaltır. Poşet aldıysan çöp poşeti olarak yeniden kullan. ğŸ›ï¸" }
];

const ONERILER = ["Pil nereye atılır?", "Pet şişe hangi kutuya gider?", "Atık yağı nereye bırakmalıyım?", "Duş suyu nasıl tasarruf ederim?", "Kompost nedir?", "Çevre dostu temizlik nasıl yaparım?", "Elektrik faturasını nasıl düşürürüm?", "Karton kutu nereye atılır?"];

function cevapBul(soru) {
  const kelimeler = sadelestir(soru).split(" ");
  const bosluklu = " " + kelimeler.join(" ") + " ";
  for (const giris of DEMO_CEVAPLAR) {
    for (const anahtar of giris.k) {
      const a = sadelestir(anahtar);
      const eslesti = a.includes(" ")
        ? bosluklu.includes(" " + a + " ")                       // çok kelimeli: aynen geç
        : kelimeler.some(w => w === a || (a.length > 3 && w.startsWith(a))); // tek kelime
      if (eslesti) return giris.c;
    }
  }
  return "Bu soruya hazır bir örnek cevabım YOK. ğŸ™ˆ (Bu bir demo; gerçek yapay zekâ bağlı değil.) Åunları sorabilirsin: pil, plastik, cam, kâğıt, su tasarrufu, elektrik tasarrufu, kompost, atık yağ.";
}

function mesajEkle(yazi, kim) {
  const m = oge("div", "mesaj " + kim, yazi);
  $("#sohbet").appendChild(m);
  $("#sohbet").scrollTop = $("#sohbet").scrollHeight;
  return m;
}

function soruSor(soru) {
  soru = soru.trim();
  if (!soru) return;
  mesajEkle(soru, "ben");
  const bekle = mesajEkle("Yazıyor...", "bot yaziyor");
  setTimeout(() => {
    bekle.remove();
    mesajEkle(cevapBul(soru), "bot");
  }, 600);
}

$("#sohbetForm").addEventListener("submit", e => {
  e.preventDefault();
  const girdi = $("#soruGirdisi");
  soruSor(girdi.value);
  girdi.value = "";
  girdi.focus();
});

function asistaniHazirla() {
  mesajEkle("Merhaba! 🌿 Ben bu uygulamanın DEMO asistanıyım. Gerçek bir yapay zekâ değilim; hazır örnek cevaplarla çalışıyorum. Aşağıdaki önerilerden birini seçebilir ya da kendi sorunu yazabilirsin.", "bot");
  const kap = $("#oneriler");
  ONERILER.forEach(o => {
    const b = oge("button", "oneri", o);
    b.type = "button";
    b.addEventListener("click", () => soruSor(o));
    kap.appendChild(b);
  });
}

/* ---------- BAÅLAT ---------- */
kategorileriCiz();
ipuclariniCiz();
dusHesapla();
gorevleriCiz();
asistaniHazirla();
sayfaGoster();

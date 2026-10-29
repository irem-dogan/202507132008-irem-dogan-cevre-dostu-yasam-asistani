# 🌿 Çevre Dostu Yaşam Asistanı

Türkçe, yeşil-beyaz tasarımlı, tek sayfalık bir **prototip (MVP)**. Kurulum gerektirmez, internet gerektirmez, ücretsizdir.

> ⚠️ **Önemli:** Asistan bölümü **DEMO**'dur. Gerçek bir yapay zekâ bağlantısı **yoktur**. Cevaplar, kod içine yazılmış hazır örnek yanıtlardan anahtar kelimeye göre seçilir. Yazdığın sorular hiçbir yere gönderilmez.

---

## 1. Neler var?

| Bölüm | Ne yapar? |
|---|---|
| **Ana Sayfa** | Saate göre selam, isim kaydetme, günün ipucu, görev ilerlemesi, hızlı butonlar |
| **Geri Dönüşüm** | Atık adı yazınca hangi kutuya gideceğini gösteren arama + 7 kategori kartı |
| **Su & Enerji** | Su / Enerji sekmeleri, 8'er ipucu, duş tasarrufu hesaplayıcı |
| **Görevler** | 6 günlük görev, tıklayınca tamamlanır, puan ve ilerleme çubuğu, her gün yenilenir |
| **Asistan (DEMO)** | Soru yazma kutusu, öneri butonları, hazır örnek cevaplar |

Menü ve tüm butonlar gerçekten çalışır. Görev durumun ve ismin tarayıcında saklanır.

## 2. Kullanılan teknolojiler (sade anlatım)

- **HTML**: Sayfanın iskeleti (başlıklar, butonlar, kutular).
- **CSS**: Görünüm (renkler, yuvarlak köşeler, yeşil-beyaz tema).
- **JavaScript**: Davranış (menü geçişi, görev işaretleme, arama, demo sohbet).
- **localStorage**: Tarayıcının küçük not defteri. İsmini ve görevlerini kaydeder.

Hiçbir kütüphane, paket, sunucu veya ücretli servis kullanılmadı.

## 3. Dosyalar

```
cevre-dostu-asistan/
├── index.html      → Sayfanın yapısı (bunu açacaksın)
├── stil.css        → Renkler ve tasarım
├── uygulama.js     → Tüm çalışan kısım + içerik verileri
├── OKU-BENI.md     → Bu rehber
└── PROJE-OZETI.md  → Sunum için kısa proje özeti
```

## 4. Windows'ta çalıştırma

### Yöntem A: En kolay (önerilen)

1. İndirdiğin **zip** dosyasına sağ tıkla → **Tümünü ayıkla…** → bir klasör seç (örn. Masaüstü).
   *(Zip'in içinden doğrudan açma; önce ayıkla.)*
2. Klasörün içindeki **index.html** dosyasına çift tıkla.
3. Tarayıcında (Edge, Chrome, Firefox) uygulama açılır. Hepsi bu. ✅

### Yöntem B: Yerel sunucuyla (isteğe bağlı)

Bilgisayarında Python kuruluysa:

1. Klasörü aç, adres çubuğuna `cmd` yazıp Enter'a bas.
2. Şunu yaz:
   ```
   python -m http.server 8000
   ```
3. Tarayıcıda `http://localhost:8000` adresini aç.
4. Kapatmak için komut penceresinde `Ctrl + C`.

### Sorun giderme

- **Görevler kaydedilmiyor:** Tarayıcın gizli sekmede veya site verilerini engelliyor olabilir. Normal pencerede aç.
- **Sayfa bozuk görünüyor:** `index.html`, `stil.css` ve `uygulama.js` **aynı klasörde** olmalı.
- **Hiçbir şey olmuyor:** Zip'ten ayıklamadan açmış olabilirsin. Önce klasöre ayıkla.

## 5. Kendi içeriğini nasıl değiştirirsin?

Kod bilmeden de değiştirebilirsin; `uygulama.js` dosyasını Not Defteri ile aç:

- **Görevler:** `const GOREVLER = [` satırını bul, metni ve puanı değiştir.
- **İpuçları:** `SU_IPUCLARI`, `ENERJI_IPUCLARI`, `GUNUN_IPUCLARI` listeleri.
- **Aranabilir atıklar:** `const ATIKLAR = [` listesine yeni satır ekle.
- **Asistan cevapları:** `const DEMO_CEVAPLAR = [` listesine yeni `k` (anahtar kelimeler) ve `c` (cevap) ekle. Anahtar kelimeleri **Türkçe harfsiz, küçük harfle** yaz (örn. `"sise"`, `"yag"`).
- **Renkler:** `stil.css` dosyasının en üstündeki `:root { ... }` bölümü.

Değişiklikten sonra tarayıcıda **F5** ile sayfayı yenile.

## 6. Gerçek yapay zekâyı sonra nasıl eklersin? (gelecek adım)

Şu an eklenmedi. Eklemek istersen mantık şöyle olur:

1. Küçük bir **sunucu (backend)** yazılır.
2. Sunucu, bir yapay zekâ servisinin API'sine bağlanır (çoğu servis ücretli veya sınırlı ücretsizdir).
3. Sayfadaki sohbet kutusu, soruyu kendi sunucuna gönderir; sunucu cevabı geri döndürür.

🔐 **API anahtarını asla `uygulama.js` içine yazma.** Tarayıcıdaki dosyayı herkes görebilir, anahtarın çalınır.

## 7. Bilinen sınırlar

- Geri dönüşüm kutu renkleri ve kuralları belediyeye göre değişebilir; uygulama genel bilgi verir.
- Duş hesaplayıcı yaklaşık bir değer (dakikada ~9 litre) kullanır.
- Asistan yalnızca hazır anahtar kelimelere cevap verir.

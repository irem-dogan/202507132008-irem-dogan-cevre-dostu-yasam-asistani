# Proje Özeti: Çevre Dostu Yaşam Asistanı

## Projenin amacı
Gençlerin ve öğrencilerin geri dönüşümü öğrenmesini, su ve enerji tasarrufu yapmasını ve her gün küçük çevre görevleri tamamlamasını kolaylaştıran, Türkçe bir web uygulaması prototipidir.

## Bu prototip ne yapıyor?
- **Geri dönüşüm rehberi:** Atığı ara, hangi kutuya gideceğini gör.
- **Su ve enerji ipuçları:** 16 pratik öneri + duş tasarrufu hesaplayıcı.
- **Günlük görevler:** 6 görevi işaretle, puan topla, ilerlemeni gör.
- **Asistan bölümü (DEMO):** Soru yaz, hazır örnek cevap al.

> **Dürüstlük notu:** Asistan bölümünde gerçek yapay zekâ **yok**. Cevaplar önceden yazılmış, anahtar kelimeyle seçilen örneklerdir. Sunumda bunu açıkça söyle.

## Kullanılan teknoloji
Sadece **HTML + CSS + JavaScript**. Kurulum, sunucu veya ücretli servis gerekmez. `index.html` çift tıklanınca çalışır.

---

## Sunumda anlatabileceğin dört kavram

### 1) MVP (Minimum Viable Product / En Az Çalışan Ürün)
Fikrin en küçük ama gerçekten çalışan ilk sürümü. Amaç, her şeyi bitirmek değil; **hızlıca bir şey gösterip geri bildirim almaktır.**
- *Bu projede:* Beş bölüm çalışıyor ama veritabanı, kullanıcı girişi ve gerçek yapay zekâ yok. Bunlar sonraki adımlar.
- *Benzetme:* Bir restoran açmadan önce, arkadaşlara yemeği tadım porsiyonuyla denetmek.

### 2) Claude
**Anthropic** şirketinin geliştirdiği yapay zekâ asistanı. Yazılı komutu (prompt) anlar; metin, plan ve kod üretebilir.
- *Bu projede:* Kodun ve rehber metinlerinin hazırlanmasında **Claude** kullanıldı. Öğrenci "ne istediğini" Türkçe tarif etti, Claude dosyaları üretti.
- *Önemli:* Claude'un ürettiği şeyi **çalıştırıp kontrol etmek** hâlâ insanın işidir.

### 3) OpenCode
Terminalde (komut satırında) çalışan, **açık kaynaklı bir yapay zekâ kodlama aracı**. Bir yapay zekâ modeline bağlanıp proje klasöründeki dosyaları okuyabilir, düzenleyebilir ve yeni dosyalar yazabilir.
- *Bu projede:* OpenCode **kullanılmadı**; proje Claude ile hazırlandı. Aynı proje isteği OpenCode gibi bir kodlama aracına da verilebilir. Sunumda "benzer işi yapan alternatif araç" olarak anlat.
- *Dürüst cümle:* "Bu projede OpenCode kullanmadım, ama aynı isteği ona da verebilirdim."

### 4) MCP (Model Context Protocol)
Yapay zekâ modellerinin **dış araçlara ve verilere bağlanması için ortak bir kural/standart**. Bir tür "evrensel priz" gibi düşün: bir kez standarda uyunca, yapay zekâ takvim, dosya, veritabanı gibi araçları aynı yolla kullanabilir.
- *Bu projede:* MCP **kullanılmadı**. İleride asistanı gerçek bir veri kaynağına bağlamak istersek (örn. belediyenin atık toplama bilgisi) MCP kullanılabilir.
- *Benzetme:* Farklı cihazların hepsinin USB-C ile şarj olması.

---

## Önerilen 5 slaytlık sunum akışı
1. **Sorun:** Geri dönüşüm ve tasarruf konusunda pratik, Türkçe, kolay erişilebilir araç eksik.
2. **Çözüm:** Çevre Dostu Yaşam Asistanı (ekran görüntüsü).
3. **Canlı demo (2 dk):** Atık ara → görev işaretle → duş hesapla → asistana "Pil nereye atılır?" yaz.
4. **Nasıl yapıldı:** Claude ile hazırlandı; HTML/CSS/JS; MVP mantığı. OpenCode ve MCP'yi kavram olarak anlat.
5. **Sınırlar ve gelecek:** Asistan demo; gerçek yapay zekâ, kullanıcı hesabı, belediyeye özel veri sonraki adım.

## Sunumda söylenecek 3 net cümle
- "Bu bir MVP: en küçük çalışan sürüm."
- "Asistan bölümü demo, gerçek yapay zekâ bağlı değil."
- "Sonraki adım: güvenli bir sunucu üzerinden gerçek yapay zekâ bağlamak."

## Olası sorular ve kısa cevaplar
- **Neden gerçek yapay zekâ yok?** Ücretsiz ve kurulumsuz bir MVP istedik. Gerçek bağlantı sunucu ve API anahtarı gerektirir.
- **Bilgiler doğru mu?** Genel bilgilerdir; kutu renkleri belediyeye göre değişebilir.
- **Verilerim nereye gidiyor?** Hiçbir yere. İsim ve görevler sadece kendi tarayıcında saklanır.

# rr — WA Web Starter

Starter project Next.js siap di-deploy dari **GitHub → Vercel**, dengan panduan
jujur tentang kemungkinan dan batasan integrasi WhatsApp Web.

## Pertanyaan utama: bisa nggak?

**Bisa, tapi tidak dengan cara yang Anda kira.**

Berikut jawaban rinci untuk rencana Anda: *"buka link di banyak perangkat, tetap pakai WhatsApp Web biasa, tapi sesi disimpan di Vercel, embed WhatsApp Web, deploy GitHub ke Vercel"*:

| Harapan | Realitas teknis |
|---|---|
| Embed `web.whatsapp.com` di iframe di Vercel | ❌ Tidak bisa. WhatsApp Web mengirim header `X-Frame-Options: DENY`, browser memblokir pemakaian di iframe. |
| Simpan sesi WhatsApp Web di database Vercel | ❌ Tidak mudah. Sesi tersimpan di browser pengguna (localStorage/IndexedDB + service worker), bukan file yang dapat di-upload ke server. |
| Vercel menyimpan "DB" dan memelihara koneksi WhatsApp | ❌ Serverless Functions tidak punya disk permanen dan tidak boleh memelihara WebSocket berkepanjangan. |
| Deploy GitHub → Vercel | ✅ Bisa, untuk halaman website dan API serverless (webhook, dsb.). |

## Apa yang bisa dilakukan (alternatif)

1. **WhatsApp Multi-Device (bawaan, paling mudah dan aman)**  
   Buka `web.whatsapp.com` di setiap perangkat dan pasang hingga 4 perangkat terhubung secara bersamaan. Sesi tetap dikelola WhatsApp bawaan, tidak perlu deploy apa-apa.

2. **whatsapp-web.js / Baileys (klien non-resmi)**  
   Membutuhkan Node.js server yang **selalu hidup** (Railway, Render, VPS, Fly.io) — **tidak cocok untuk Vercel Serverless**. Ada risiko akun WhatsApp kena blokir/ban karena melanggar Terms of Service WhatsApp.

3. **WhatsApp Business API (resmi Meta via BSP, mis. Twilio, MessageBird, 360dialog)** ✅ *Direkomendasikan untuk produksi*  
   Vercel Serverless Functions cukup untuk menangani webhook dan mengirim pesan. Integrasi resmi, tidak ada risiko ban, dan cocok dengan arsitektur GitHub → Vercel.

## Isi starter ini

- `app/api/qr/route.ts` — contoh endpoint QR (hanya demo, bukan pairing WhatsApp asli).
- `app/api/session/route.ts` — simpan/baca metadata sesi ke **Vercel KV** (GET/POST).
- `app/api/webhook/route.ts` — webhook resmi WhatsApp Business API (verifikasi + terima pesan).
- `.env.example` — variabel lingkungan yang harus diisi di Vercel.

## Cara deploy ke Vercel

1. Push project ini ke GitHub:
   ```bash
   git add -A
   git commit -m "Init starter WA web Vercel"
   git push origin arena/c4b69421-rr
   ```
2. Masuk ke [vercel.com](https://vercel.com), pilih **Add New Project**, impor repository GitHub ini.
3. Di **Settings → Environment Variables**, isi variabel dari `.env.example`.
4. Aktifkan **Vercel KV** (Storage → Create KV), lalu hubungkan ke project ini agar variabel `KV_*` terisi otomatis.
5. Klik **Deploy**. Setiap push ke GitHub akan otomatis di-deploy ulang oleh Vercel.

## Peringatan

Penggunaan klien WhatsApp non-resmi (whatsapp-web.js, Baileys, dll.) untuk otomatisasi pesan pribadi melanggar Terms of Service WhatsApp dan dapat mengakibatkan pemblokiran nomor telepon. Untuk bisnis produksi, gunakan WhatsApp Business API resmi.

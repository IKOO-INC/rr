import KVSessionList from '@/components/KVSessionList'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">rr — WA Web Starter</h1>
        <p className="text-gray-600">
          Contoh project Next.js siap di-deploy dari GitHub ke Vercel, dengan pendekatan
          integrasi WhatsApp yang realistis.
        </p>
      </header>

      <div className="callout mb-8">
        <p className="font-semibold mb-1">
          Jawaban singkat: <strong>tidak bisa langsung</strong> men-embed web.whatsapp.com
          di dalam iframe di Vercel dan menyimpan sesi WhatsApp Web di database Vercel.
        </p>
        <p className="text-sm text-gray-700 mb-2">Alasannya:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>
            web.whatsapp.com mengirim header <code className="font-mono">X-Frame-Options: DENY</code>,
            jadi browser memblokir pemakaian di dalam iframe (termasuk di Vercel).
          </li>
          <li>
            Sesi WhatsApp Web tersimpan di browser pengguna (localStorage / IndexedDB +
            service worker), bukan sebagai file yang mudah dipindahkan ke database server.
          </li>
          <li>
            Vercel Serverless Functions tidak punya disk permanen dan tidak boleh memelihara
            koneksi WebSocket berkepanjangan yang dibutuhkan WhatsApp Web.
          </li>
        </ul>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alternatif yang bisa dilakukan</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <strong>WhatsApp Multi-Device (bawaan, paling mudah).</strong> Gunakan
            <code className="font-mono">web.whatsapp.com</code> langsung dan pantau hingga
            4 perangkat terhubung sekaligus. Tidak perlu deploy apa-apa.
          </li>
          <li>
            <strong>whatsapp-web.js / Baileys.</strong> Klien WhatsApp non-resmi yang perlu
            Node.js server yang selalu hidup (Railway, Render, VPS, Fly.io) —
            <strong>tidak cocok untuk Vercel Serverless</strong> dan berisiko kena blokir/ban
            dari WhatsApp karena melanggar ToS.
          </li>
          <li>
            <strong>WhatsApp Business API (resmi Meta via BSP, mis. Twilio, MessageBird,
            360dialog).</strong> Ini pendekatan yang direkomendasikan untuk produksi.
            Vercel Serverless Functions cukup untuk menangani webhook dan mengirim pesan.
            Contoh ada di <code className="font-mono">app/api/webhook/route.ts</code>.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Apa yang ada di starter ini</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><code className="font-mono">app/api/qr/route.ts</code> — contoh endpoint QR (hanya demo, bukan sesi WhatsApp asli).</li>
          <li><code className="font-mono">app/api/session/route.ts</code> — simpan/baca metadata sesi ke Vercel KV.</li>
          <li><code className="font-mono">app/api/webhook/route.ts</code> — webhook resmi WhatsApp Business API (verify + terima pesan).</li>
          <li><code className="font-mono">.env.example</code> — variabel yang harus diisi di Vercel.</li>
        </ul>
      </section>

      <KVSessionList />
    </main>
  )
}

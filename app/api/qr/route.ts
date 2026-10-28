import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET() {
  // HANYA DEMO: ini menghasilkan QR dari URL web.whatsapp.com,
  // bukan kode pairing sesi WhatsApp asli.
  const qrDataUrl = await QRCode.toDataURL('https://web.whatsapp.com/', {
    type: 'image/png',
    margin: 1,
    width: 300,
  })

  return NextResponse.json({
    ok: true,
    qrImage: qrDataUrl,
    note:
      'Ini QR demo. WhatsApp Web tidak bisa di-embed via iframe (X-Frame-Options: DENY), ' +
      'dan whatsapp-web.js tidak berjalan di Vercel Serverless Functions.',
  })
}

import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Verifikasi webhook WhatsApp Business API dari Meta
  if (mode === 'subscribe' && token === process.env.WA_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge ?? '', { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Contoh struktur webhook WhatsApp Business API:
    // body.entry[0].changes[0].value.messages[0] ...
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2))

    // TODO: tulis pesan masuk ke Vercel KV / DB, lalu balas via WhatsApp Business API
    // menggunakan WA_BUSINESS_ACCESS_TOKEN dan WA_BUSINESS_PHONE_NUMBER_ID.

    return NextResponse.json({ status: 'received' })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal memproses webhook' },
      { status: 500 }
    )
  }
}

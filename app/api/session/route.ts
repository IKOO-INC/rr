import { NextResponse, type NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

const SESSION_PREFIX = 'wa:session:'

function kvReady() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function GET() {
  if (!kvReady()) {
    return NextResponse.json(
      {
        error: 'Vercel KV belum dikonfigurasi',
        hint: 'Setel KV_REST_API_URL dan KV_REST_API_TOKEN di Vercel Environment Variables.',
      },
      { status: 503 }
    )
  }

  try {
    const keys = await kv.keys(`${SESSION_PREFIX}*`)
    const sessions: any[] = []

    for (const key of keys) {
      const data = await kv.get(key)
      if (data) {
        sessions.push({ id: key.replace(SESSION_PREFIX, ''), ...(data as any) })
      }
    }

    sessions.sort((a: any, b: any) =>
      new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    )

    return NextResponse.json({ ok: true, sessions })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal memuat sesi' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  if (!kvReady()) {
    return NextResponse.json(
      { error: 'Vercel KV belum dikonfigurasi' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const id = body.id || `sess_${Date.now()}`
    const key = `${SESSION_PREFIX}${id}`
    const session = {
      id,
      name: body.name || 'Sesi Baru',
      device: body.device || '-',
      lastSeen: body.lastSeen || new Date().toISOString(),
      status: body.status || 'offline',
    }

    await kv.set(key, session)
    return NextResponse.json({ ok: true, session })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal menyimpan sesi' },
      { status: 500 }
    )
  }
}

'use client'

import { useEffect, useState } from 'react'

type Session = {
  id: string
  name: string
  device: string
  lastSeen: string
  status: string
}

export default function KVSessionList() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/session')
      .then((r) => {
        if (!r.ok) throw new Error('Gagal memuat sesi')
        return r.json()
      })
      .then((data: Session[]) => {
        setSessions(data || [])
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e?.message || 'KV belum dikonfigurasi di Vercel')
        setLoading(false)
      })
  }, [])

  return (
    <section className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Metadata Sesi (Vercel KV)</h2>
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : error ? (
        <div className="callout">
          {error}
          <br className="hidden md:block" />
          Isi variabel <code className="font-mono text-sm">KV_REST_API_URL</code> dan
          <code className="font-mono text-sm">KV_REST_API_TOKEN</code> di Vercel → Settings → Environment Variables.
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Nama</th>
                <th className="pb-2">Perangkat</th>
                <th className="pb-2">Terakhir Aktif</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    Belum ada sesi. Tambah data contoh melalui halaman admin atau panggil POST /api/session.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2">{s.name}</td>
                    <td className="py-2">{s.device}</td>
                    <td className="py-2 text-gray-500">{s.lastSeen}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === 'online'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

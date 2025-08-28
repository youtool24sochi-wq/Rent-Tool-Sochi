import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/home/`, { cache:'no-store', method: 'GET' })

    if (!res.ok) throw new Error(`Upstream responded ${res.status}`)
    const data = await res.json()

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 },
    )
  }
}

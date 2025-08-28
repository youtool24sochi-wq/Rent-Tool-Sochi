import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tool_id: string }> },
) {
  try {
    const { tool_id } = await params

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${tool_id}/`,
      { cache: 'no-store', method: 'GET' },
    )

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

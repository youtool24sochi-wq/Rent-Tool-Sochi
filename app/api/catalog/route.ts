import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '12'
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const min_price = searchParams.get('min_price') || ''
    const max_price = searchParams.get('max_price') || ''
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const upstream =
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog?limit=${limit}&offset=${offset}` +
      (search ? `&search=${encodeURIComponent(search)}` : '') +
      (category ? `&category=${category}` : '') +
      (min_price ? `&min_price=${min_price}` : '') +
      (max_price ? `&max_price=${max_price}` : '')

    const res = await fetch(upstream, { cache: 'no-store', method: 'GET' })

    if (!res.ok) throw new Error(`Upstream responded ${res.status}`)
    const data = await res.json()

    return NextResponse.json({ ...data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 },
    )
  }
}

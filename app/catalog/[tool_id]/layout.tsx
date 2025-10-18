import type { Metadata } from 'next'

export const revalidate = 0

export async function generateMetadata(
  { params }: { params: Promise<{ tool_id: string }> },
): Promise<Metadata> {
  const { tool_id } = await params

  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${tool_id}/`,
    { cache: 'no-store', method: 'GET' },
  )

  if (!apiRes.ok) {
    const fallbackImg = 'https://renttoolspeed.ru/og/no-photo.png'

    return {
      title: 'Инструмент',
      description: 'Аренда: Цена уточняется',
      openGraph: { images: [{ url: fallbackImg }] },
      twitter: { card: 'summary_large_image', images: [fallbackImg] },
    }
  }

  const payload = await apiRes.json()

  const tool = payload?.data ?? payload

  const name: string = tool?.name ?? 'Инструмент'
  const price: string =
    tool?.price_per_day != null
      ? `${Math.trunc(Number(tool.price_per_day))} ₽/день`
      : 'Цена уточняется'

  const firstImage: string | undefined =
    tool?.main_image
      ? `https://api.renttoolspeed.ru${tool.main_image}`
      : Array.isArray(tool?.images) && tool.images.length > 0
        ? `https://api.renttoolspeed.ru${tool.images[0]}`
        : undefined

  const img = firstImage ?? 'https://renttoolspeed.ru/og/no-photo.png'
  const url = `https://renttoolspeed.ru/catalog/${tool_id}`

  return {
    title: name,
    description: `Аренда: ${price}`,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: name,
      description: `Аренда: ${price}`,
      images: [{ url: img, width: 1200, height: 630, alt: name }],
      siteName: 'RentToolSochi',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: `Аренда: ${price}`,
      images: [img],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

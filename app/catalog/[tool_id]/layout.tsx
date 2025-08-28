import { CatalogIdGET } from '@/services/catalog-api'

import type { Metadata } from 'next'

interface Props {
  params: Promise<{ tool_id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool_id } = await params
  const res = await CatalogIdGET(tool_id)
  const data = res?.data || {}
  const name = data?.name || 'Инструмент'
  const price = data?.price_per_day != null ? `${Math.trunc(Number(data.price_per_day))} ₽/день` : 'Цена уточняется'
  const url = `https://rent-tool-speed.vercel.app/catalog/${tool_id}`
  const img = data?.main_image ? `https://rts.badk.xyz${data.main_image}` : 'https://rent-tool-speed.vercel.app/og-default.jpg'

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

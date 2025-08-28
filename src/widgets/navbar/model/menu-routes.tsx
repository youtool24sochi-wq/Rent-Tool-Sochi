import type { ReactNode } from 'react'

import {
  AppstoreOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

export interface MenuRoute {
  label: string
  href: string
  icon: ReactNode
}

export const menuRoutes: MenuRoute[] = [
  { label: 'Каталог',   href: '/catalog',   icon: <AppstoreOutlined /> },
  { label: 'О нас',     href: '/about',    icon: <InfoCircleOutlined /> },
]

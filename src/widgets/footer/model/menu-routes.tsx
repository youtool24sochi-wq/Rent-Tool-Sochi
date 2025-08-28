import type { ReactNode } from 'react'

import {  WhatsAppOutlined, PhoneOutlined, MailOutlined, SendOutlined } from '@ant-design/icons'

export interface FooterLink {
  href: string
  icon: ReactNode
  label: string
}

export const footerLinks: FooterLink[] = [
  { label: 'Telegram',  href: 'https://t.me/YouToolSochi', icon: <SendOutlined /> },
  { label: 'WhatsApp',  href: 'https://wa.me/79996555139', icon: <WhatsAppOutlined /> },
  { label: 'Мобильный', href: 'tel:+79388742460',         icon: <PhoneOutlined /> },
  { label: 'E-mail',    href: 'mailto:you.tool24@mail.ru',   icon: <MailOutlined /> },
]

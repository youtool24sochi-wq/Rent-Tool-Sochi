'use client'

import Link from 'next/link'

import { footerLinks } from '../model/menu-routes'

import styles from './footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <span className={styles.brand}>© 2024 RentTool. Аренда инструментов в Сочи</span>

      <div className={styles.links}>
        {footerLinks.map(l => {
          const isExternal = l.href.startsWith('http')

          return (
            <Link
              key={l.href}
              href={l.href}
              className={styles.link}
              aria-label={l.label}
              prefetch={false}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {l.icon}
            </Link>
          )
        })}

      </div>
    </div>

    <svg className={styles.wave} viewBox="0 0 1440 32" preserveAspectRatio="none">
      <path d="M0,16 Q360,32 720,16 T1440,16 V32 H0 Z" fill="#f97316" />
    </svg>
  </footer>
)

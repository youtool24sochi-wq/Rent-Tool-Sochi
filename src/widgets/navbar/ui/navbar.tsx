'use client'

import React from 'react'

import {
  MenuOutlined,
  CloseOutlined,
  WhatsAppOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Drawer, Menu, Button, Dropdown, Flex, Tooltip } from 'antd'
import { MenuProps } from 'antd'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { TelegramOutlined } from '@/shared/assets/icons'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { setLogout } from '@/store/features/auth/authSlice'

import { menuRoutes } from '../model/menu-routes'

import styles from './navbar.module.css'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])
  const authed = hydrated && isAuth && !!user

  const close = () => setOpen(false)

  const handleLogout = () => {
    dispatch(setLogout())
    router.push('/')
    router.refresh()
  }

  const menuItems: MenuProps['items'] = [
    { key: 'profile', icon: <ProfileOutlined />, label: <Link href="/profile">Профиль</Link> },
    { key: 'orders', icon: <ShoppingOutlined />, label: <Link href="/profile">Мои заказы</Link> },
    { type: 'divider' },
    { key: 'logout', danger: true, icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
  ]

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div onClick={() => router.push('/')} className={styles.logo}>
            <span className={styles.logoMark}>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </span>
            <h1 className={styles.logoText}>
              Rent<span className={styles.logoTextAccent}>Tool</span>Sochi
            </h1>
          </div>

          <nav className={styles.navDesktop}>
            {menuRoutes.map(r => (
              <li
                key={r.href}
                onClick={() => router.push(r.href)}
                className={`${styles.navLink} ${pathname === r.href ? styles.navActive : ''}`}
              >
                {r.label}
              </li>
            ))}
          </nav>

          <div className={styles.rightSide}>
            <div className={styles.phone}>
              <span className={styles.statusDot} />
              <Tooltip title="Ежедневно с 9:00 до 18:00">
                <a style={{ cursor: 'pointer' }} href="tel:+79388742460">
                  +7 (938) 874-24-60
                </a>
              </Tooltip>
            </div>

            <div className={styles.socialGroup}>
              <a href="https://wa.me/78621234567" className={`${styles.socialIcon} ${styles.iconWa}`}>
                <WhatsAppOutlined />
              </a>
              <a href="https://t.me/YouToolSochi
" className={`${styles.socialIcon} ${styles.iconTg}`}
              >
                <TelegramOutlined />
              </a>
            </div>

            {authed ? (
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                dropdownRender={() => (
                  <div className={styles.dropdownCard}>
                    <div className={styles.userBox}>
                      <div className={styles.userBigAvatar}>
                        {user.name?.[0] || user.email?.[0]}
                      </div>
                      <h3 className={styles.userName}>{user.name}</h3>
                      <p className={styles.userEmail}>{user.email}</p>
                    </div>

                    <div className={styles.menuDivider} />

                    <Menu selectable={false} items={menuItems} onClick={close} style={{ border: 'none', boxShadow: 'none' }} />
                  </div>
                )}
              >
                <button className={styles.avatarBtn}>
                  <span className={styles.avatar}>{user.name?.[0] || user.email?.[0]}</span>
                  <Flex align="center" gap={8}>
                    <span>{user.name}</span>
                    <svg className={styles.svgArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Flex>
                </button>
              </Dropdown>
            ) : (
              <Button onClick={() => router.push('/auth')} type="primary">
                Войти
              </Button>
            )}
          </div>

          <button className={styles.burgerBtn} onClick={() => setOpen(true)}>
            <MenuOutlined className={styles.burgerIcon} />
          </button>
        </div>
      </header>

      <Drawer
        width={380}
        closable={false}
        placement="right"
        open={open}
        onClose={close}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <span className={styles.logoMark}>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </span>
            <span style={{ fontWeight: 700, color: '#111827' }}>RentToolSochi</span>
          </Link>
          <Button type="text" icon={<CloseOutlined />} onClick={close} />
        </div>

        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {menuRoutes.map(r => (
            <Link
              key={r.href}
              href={r.href}
              onClick={close}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#111827',
                fontWeight: 500,
              }}
            >
              {r.icon}
              {r.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          {authed ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8 }}>
                <span className={styles.avatar}>{user.name?.[0] || user.email?.[0]}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{user.name}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{user.email}</p>
                </div>
              </div>
              <Menu selectable={false} items={menuItems} onClick={close} style={{ border: 'none' }} />
            </>
          ) : (
            <Link href="/auth" onClick={close} style={{ display: 'block' }}>
              <Button type="primary" block>
                Войти в аккаунт
              </Button>
            </Link>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div className={styles.phone} style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>
              <span className={styles.statusDot} />
              <a style={{ cursor: 'pointer' }} href="tel:+79388742460">
                +7 (938) 874-24-60
              </a>
            </div>
            <div className={styles.socialGroup} style={{ justifyContent: 'center' }}>
              <a href="https://wa.me/78621234567" className={`${styles.socialIcon} ${styles.iconWa}`}>
                <WhatsAppOutlined />
              </a>
              <a href="https://t.me/YouToolSochi
" className={`${styles.socialIcon} ${styles.iconTg}`}
              >
                <TelegramOutlined />
              </a>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

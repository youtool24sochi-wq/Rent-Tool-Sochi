'use client'

import React from 'react'

import {
  PhoneOutlined,
  WhatsAppOutlined,
  SendOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Button, Popover, Flex } from 'antd'
import Link from 'next/link'

import styles from './button-popover.module.css'

export const ButtonPopover = () => {
  const [open, setOpen] = React.useState(false)

  const overlay = (
    <div className={styles.card}>
      <Flex align="center" gap={8} className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.title}>Онлайн поддержка</span>
      </Flex>

      <Flex align="center" gap={8} className={styles.row}>
        <PhoneOutlined className={styles.phone}/>
        <a href="tel:+79388742460">+7 (938) 874-24-60</a>
      </Flex>

      <Flex gap={12} className={styles.links}>
        <Link
          href="https://wa.me/79996555139"
          target="_blank"
          className={styles.iconLink}
        >
          <WhatsAppOutlined />
        </Link>
        <Link
          href="https://t.me/YouToolSochi"
          target="_blank"
          className={styles.iconLink}
        >
          <SendOutlined />
        </Link>
      </Flex>

      <Link href="mailto:you.tool24@mail.ru" className={styles.mail}>
        <MailOutlined /> you.tool24@mail.ru
      </Link>
    </div>
  )

  return (
    <Popover
      content={overlay}
      placement="topRight"
      open={open}
      overlayClassName={styles.popover}
      trigger="click"
      onOpenChange={setOpen}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        className={styles.btn}
        icon={(
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      />
    </Popover>
  )
}

'use client'

import React from 'react'

import { ShoppingCartOutlined, CalendarOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { Popover, List, Button, Empty, Tag, DatePicker, InputNumber, Select, Tooltip, Divider, Typography, Flex, notification } from 'antd'
import ruRU from 'antd/es/date-picker/locale/ru_RU'
import dayjs, { Dayjs } from 'dayjs'
import Image from 'next/image'

import { CartAllDELETE, CartCheckAvailability, CartCheckoutCreate } from '@/services/cart-api'
import { CartType } from '@/shared/types/cart/cart.interface'

import styles from './cart-popover.module.css'

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type NotificationApi = ReturnType<typeof notification.useNotification>[0];

interface Props {
  carts: CartType.Item[]
  cartsLoading: boolean
  handleDeleteCart: any
  api: NotificationApi
  router: AppRouterInstance
}

const toNumber = (v: unknown, fallback = 0) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  if (v == null) return fallback
  const s = String(v)
    .replace(/\u202F|\u00A0/g, '')
    .replace(/[^0-9,.\-]/g, '')
    .replace(/,/g, '.')
  const m = s.match(/-?\d+(\.\d+)?/)
  const n = m ? Number(m[0]) : NaN

  return Number.isFinite(n) ? n : fallback
}

export default function CartPopover({ carts, cartsLoading, handleDeleteCart, api, router } : Props) {
  const MAX_DAYS = 365
  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs())
  const [perItem, setPerItem] = React.useState<Record<number, { days: number; stock_quantity: number }>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const moneyInt = React.useCallback((n: unknown) => Math.round(toNumber(n, 0)), [])

  const fmt = React.useCallback((n: unknown) => {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(moneyInt(n))
  }, [moneyInt])

  const dateFormat = 'DD/MM/YYYY'
  const today = dayjs().startOf('day')
  const maxDate = today.add(1, 'year')
  const toIsoZ = React.useCallback((d: Dayjs) => `${d.format('YYYY-MM-DD')}T00:00:00Z`, [])

  const disabledDate = React.useCallback((current: Dayjs) => !!current && (current.startOf('day').isBefore(today) || current.startOf('day').isAfter(maxDate)), [maxDate, today])

  const count = carts.length

  React.useEffect(() => {
    setPerItem(prev => {
      const next: Record<number, { days: number; stock_quantity: number }> = {}

      for (const i of carts) {
        const p = prev[i.tool_id]
        const d = Math.min(MAX_DAYS, Math.max(1, toNumber(p?.days, 1)))
        const q = Math.max(1, Math.floor(toNumber(p?.stock_quantity, 1)))

        next[i.tool_id] = { days: d, stock_quantity: q }
      }

      return next
    })
  }, [carts])

  const onOpenChange = React.useCallback((v: boolean) => setOpen(v), [])
  const onStartChange = React.useCallback((val: Dayjs | null) => setStartDate(val), [])
  const onDaysChange = React.useCallback((id: number, v: number | null) => {
    const next = Math.min(MAX_DAYS, Math.max(1, Number(v || 1)))

    setPerItem(prev => ({ ...prev, [id]: { ...prev[id], days: next } }))
  }, [])
  const onQtyChange = React.useCallback((id: number, v: number) => {
    const maxQty = Math.max(1, Math.floor(toNumber(carts.find(i => i.tool_id === id)?.stock_quantity, 1)))
    const next = Math.min(maxQty, Math.max(1, Number(v || 1)))

    setPerItem(prev => ({ ...prev, [id]: { ...prev[id], stock_quantity: next } }))
  }, [carts])

  const onCheckout = React.useCallback(async () => {
    if (!startDate) {
      api.error({ message:'Выберите дату начала аренды', placement:'top' })

      return
    }
    setSubmitting(true)
    try {
      const checks = await Promise.all(carts.map(async item => {
        const cfg = perItem[item.tool_id] || { days: 1, stock_quantity: 1 }
        const startISO = toIsoZ(startDate.startOf('day'))
        const endISO = toIsoZ(startDate.startOf('day').add(cfg.days, 'day'))
        const requestedQty = cfg.stock_quantity
        const res = await CartCheckAvailability(String(item.tool_id), startISO, endISO, String(requestedQty)) as any
        const data = res?.data || {}
        const ok = res?.status === 200 && data.is_available === true && Number(data.available_quantity ?? 0) >= requestedQty

        return { item, ok, data, requestedQty }
      }))

      const unavailable = checks.filter(c => !c.ok)

      if (unavailable.length > 0) {
        const msg = unavailable.map(c => `«${c.item.name}»: доступно ${Number(c.data?.available_quantity ?? 0)} из ${c.requestedQty}`).join('; ')

        api.error({ message: `Недоступно для выбранных дат: ${msg}. Попробуйте изменить даты бронирования или выбрать другой инструмент.`, placement: 'top' })

        return
      }

      const payload = {
        tool_ids: carts.map(item => ({
          tool_id: item.tool_id,
          end_date: perItem[item.tool_id]?.days || 1,
          quantity: perItem[item.tool_id]?.stock_quantity || 1,
        })),
        start_date: startDate ? startDate.format(dateFormat) : '',
      }

      const response = await CartCheckoutCreate(payload)

      if (response?.statusText === 'Created' || response?.status === 201) {
        router.push(`/checkout/${response.data.id}`)
        await CartAllDELETE()
        api.success({ message: 'Заказ почти готов. Проверьте паспортные данные и укажите адрес доставки', placement: 'top', duration: 3 })
      }
      if (response.response.data[0] === 'У вас уже есть активный черновик заказа. Сначала завершите или отмените его.') {
        api.error({ message: response.response.data[0], placement: 'top' })
      }
      setOpen(false)
    } catch (error) {
      console.log('failed', error)
    } finally {
      setSubmitting(false)
    }
  }, [carts, perItem, startDate, toIsoZ])

  const total = React.useMemo(() =>
    carts.reduce((sum, i) => {
      const cfg = perItem[i.tool_id] || { days: 1, stock_quantity: 1 }
      const price = moneyInt(i.final_price)
      const days = Math.min(MAX_DAYS, Math.max(1, toNumber(cfg?.days, 1)))
      const qty = Math.max(1, Math.floor(toNumber(cfg?.stock_quantity, 1)))
      const sub = price * days * qty

      return Number.isFinite(sub) ? sum + sub : sum
    }, 0)
  , [carts, perItem, moneyInt])

  const content = (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerIcon}><ShoppingCartOutlined /></span>
        <span className={styles.headerTitle}>Ваша корзина</span>
        {count > 0 && <span className={styles.headerCount}>{count}</span>}
      </div>

      {count === 0 ? (
        <div className={styles.emptyWrap}><Empty description="Корзина пуста" /></div>
      ) : (
        <>
          <div className={styles.controls_head}>
            <div className={styles.controlCol}>
              <Tooltip title="Выберите дату начала аренды">
                <DatePicker
                  className={styles.field}
                  value={startDate}
                  onChange={onStartChange}
                  placeholder="Дата начала"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={disabledDate}
                  allowClear={false}
                  format={dateFormat}
                  locale={ruRU}
                />
              </Tooltip>
            </div>
            <div className={styles.controlCol} style={{ justifySelf: 'end' }}>
              <Tooltip title="Максимальный срок аренды на один инструмент — 365 дней">
                <Tag icon={<InfoCircleOutlined />} className={styles.daysTag}>до 365 дней</Tag>
              </Tooltip>
            </div>
          </div>

          <Divider style={{ margin: 0 }}/>

          <List
            className={styles.list}
            dataSource={carts}
            loading={cartsLoading}
            renderItem={(item) => {
              const cfg = perItem[item.tool_id] || { days: 1, stock_quantity: 1 }
              const price = moneyInt(item.final_price)
              const days = Math.min(MAX_DAYS, Math.max(1, toNumber(cfg?.days, 1)))
              const qty = Math.max(1, Math.floor(toNumber(cfg?.stock_quantity, 1)))
              const stockQty = Math.max(1, Math.floor(toNumber(item.stock_quantity, 1)))
              const rawSubtotal = price * days * qty
              const subtotal = Number.isFinite(rawSubtotal) ? rawSubtotal : 0
              const quantityOptions = Array.from({ length: stockQty }, (_, i) => ({ label: `${i + 1} шт.`, value: i + 1 }))

              return (
                <List.Item className={styles.item} key={item.tool_id}>
                  <Flex vertical>
                    <div className={styles.thumbWrap}>
                      <Image src={`https://api.renttoolspeed.ru${item.main_image}` || 'https://renttoolspeed.ru/og/no-photo.png'} alt={item.name} fill width={0} height={0} unoptimized className={styles.thumb} sizes="80px" />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 className={styles.title} style={{ margin: 0, flex: 1 }}>{item.name}</h4>
                        <Button
                          type="text"
                          danger
                          size="middle"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteCart(item.tool_id)}
                        />
                      </div>

                      <div className={styles.meta} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 }}>
                        <Tag className={styles.daysTag}>в наличии: {stockQty}</Tag>
                        <Tag className={styles.daysTag}>{fmt(price)}₽/день</Tag>
                      </div>

                      <div className={styles.total}>
                        <Tag className={styles.daysTag}>{days} дн. × {qty}шт = {fmt(subtotal)}₽</Tag>
                      </div>

                      <div className={styles.controls}>
                        <div className={styles.controlCol}>
                          <Tooltip title={`Введите от 1 до ${MAX_DAYS} дней`}>
                            <InputNumber
                              min={1}
                              max={MAX_DAYS}
                              value={days}
                              status={days >= MAX_DAYS ? 'warning' : undefined}
                              onChange={(v) => onDaysChange(item.tool_id, v)}
                              className={styles.field}
                              addonAfter="дн."
                            />
                          </Tooltip>
                        </div>
                        <div className={styles.controlCol}>
                          <Select
                            disabled={stockQty <= 1}
                            value={qty}
                            options={quantityOptions}
                            onChange={(v) => onQtyChange(item.tool_id, v)}
                            className={styles.field}
                            popupMatchSelectWidth={140}
                          />
                        </div>
                      </div>
                      <div className={styles.total}>
                        <Tag className={styles.daysTag}><b>Итого: {fmt(subtotal)}₽</b></Tag>
                      </div>
                    </div>
                  </Flex>
                </List.Item>
              )
            }}
          />

          <Divider style={{ margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography.Text strong>Итого к оплате:</Typography.Text>
            <Typography.Title level={5} style={{ margin: 0 }}>{fmt(total)}₽</Typography.Title>
          </div>

          <Button type="primary" block className={`${styles.applyBtn} btnOrange`} style={{ marginTop: 10 }} onClick={onCheckout} loading={submitting}>
            Оформить заказ
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className={styles.wrap}>
      <Popover
        open={open}
        onOpenChange={onOpenChange}
        trigger="click"
        placement="topRight"
        overlayClassName={styles.popover}
        overlayStyle={{ padding: 0, maxWidth: 560 }}
        content={content}
      >
        <button className={styles.fab} onClick={() => setOpen(!open)}>
          <ShoppingCartOutlined className={styles.fabIcon} />
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
      </Popover>
    </div>
  )
}

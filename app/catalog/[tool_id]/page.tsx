'use client'

import React from 'react'

import { HeartFilled, HeartOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { Carousel, Row, Col, Tag, Button, List, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { CartDELETE, CartListGET, CartPOST } from '@/services/cart-api'
import { CatalogIdAuthGET, CatalogIdGET } from '@/services/catalog-api'
import { FavoriteDELETE, FavoritePOST } from '@/services/favorites-api'
import { TelegramOutlined } from '@/shared/assets/icons'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { CartType } from '@/shared/types/cart/cart.interface'
import { CatalogProductTypes } from '@/shared/types/catalog/catalog-product-card.interface'
import CartPopover from '@/widgets/cart-popover/cart-popover'

import Loader from '../../loading'

import styles from './page.module.css'

export default function CatalogDetail() {
  const { tool_id } = useParams()
  const router = useRouter()
  const api = useNotificationApi()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const [catalog, setCatalog] = React.useState<CatalogProductTypes.ItemDetail | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [carts, setCarts] = React.useState<CartType.Item[]>([])
  const [cartsLoading, setCartsLoading] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [favPending, setFavPending] = React.useState(false)

  const basePrice = catalog?.price_per_day != null ? Number(catalog.price_per_day) : 0
  const finalPriceRaw = (catalog as any)?.final_price != null ? Number((catalog as any).final_price) : (catalog?.discount != null ? basePrice * (1 - Number(catalog.discount) / 100) : null)
  const discountVal = catalog?.discount != null ? Number(catalog.discount) : null
  const hasDiscount = finalPriceRaw !== null && discountVal !== null && discountVal > 0 && finalPriceRaw < basePrice
  const finalPrice = finalPriceRaw !== null ? Math.trunc(finalPriceRaw) : null
  const basePriceTrunc = Math.trunc(basePrice)

  const loadCatalog = async () => {
    if (!tool_id) return
    setLoading(true)
    try {
      const response = isAuth ? await CatalogIdAuthGET(tool_id) : await CatalogIdGET(tool_id)

      if (!response) {
        api.error({ message: 'Произошла ошибка. Попробуйте позже', placement: 'top' })

        return
      }
      setCatalog(response.data)
      if (isAuth && response?.data.is_in_cart) setIsAdded(true)
      if (isAuth && response?.data.is_in_favorite) setIsFavorite(true)
    } catch {
      api.error({ message: 'Произошла ошибка. Попробуйте позже', placement: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const loadCarts = async () => {
    setCartsLoading(true)
    try {
      const response = await CartListGET() as any

      if (response.status === 200) setCarts(response.data)
    } catch {
    } finally {
      setCartsLoading(false)
    }
  }

  React.useEffect(() => {
    loadCatalog()
  }, [tool_id])

  React.useEffect(() => {
    if (isAuth) loadCarts()
  }, [isAuth])

  const specsObj = React.useMemo(() => {
    const s = catalog?.specs as unknown

    if (!s) return null
    if (typeof s === 'string') {
      try {
        const parsed = JSON.parse(s)

        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) return parsed as Record<string, unknown>

        return null
      } catch {
        return null
      }
    }
    if (typeof s === 'object' && !Array.isArray(s) && Object.keys(s as Record<string, unknown>).length > 0) return s as Record<string, unknown>

    return null
  }, [catalog?.specs])

  const handleCartAdd = React.useCallback(async (tool_id: number) => {
    if (isAuth) {
      try {
        const response = await CartPOST({ tool_id })

        if (response.message === 'Инструмент уже в корзине') {
          api.error({ message: response.message, placement: 'top' })
        } else {
          api.success({ message: response.message, placement: 'top' })
          loadCarts()
        }
        setIsAdded(true)
      } catch {
        api.error({ message: 'Неизвестная ошибка', placement: 'top' })
      }
    } else {
      router.push('/auth')
      api.error({ message: 'Сначала авторизуйтесь' , placement: 'top' })
    }
  }, [isAuth])

  const handleDeleteCart = React.useCallback(async(tool_id: string) =>{
    try {
      const response = await CartDELETE(tool_id)

      if (response?.status === 200 || response?.statusText === 'OK') {
        api.success({ message: response.data.message, placement: 'top', duration: 1.5 })
        loadCarts()
      }
    } catch {
      api.error({ message: 'Неизвестная ошибка', placement: 'top' })
    }
  }, [])

  const handleFavoriteToggle = React.useCallback(async () => {
    if (!isAuth) {
      router.push('/auth')
      api.error({ message: 'Сначала авторизуйтесь', placement: 'top' })

      return
    }
    if (!catalog?.tool_id || favPending) return
    try {
      setFavPending(true)
      if (isFavorite) {
        const dataToSend = {
          tool_id: String(tool_id),
        }
        const res = await FavoriteDELETE(dataToSend)

        if (res?.status === 200 || res?.statusText === 'OK') {
          setIsFavorite(false)
        } else {
          api.error({ message: 'Не удалось удалить из избранного', placement: 'top' })
        }
      } else {
        const res = await FavoritePOST({ tool_id: catalog.tool_id })

        if (res) {
          setIsFavorite(true)
        } else {
          api.error({ message: 'Не удалось добавить в избранное', placement: 'top' })
        }
      }
    } catch {
      api.error({ message: 'Неизвестная ошибка', placement: 'top' })
    } finally {
      setFavPending(false)
    }
  }, [isAuth, catalog?.tool_id, isFavorite, favPending])

  const handleShare = React.useCallback(async (app: 'telegram' | 'whatsapp') => {
    const name = catalog?.name || 'Без названия'
    const priceStr = hasDiscount ? `${finalPrice} ₽/день` : (basePrice > 0 ? `${basePriceTrunc} ₽/день` : 'Цена уточняется')
    const url = catalog?.tool_id ? `https://renttoolspeed.ru/catalog/${catalog.tool_id}` : ''
    const header = 'С вами поделились инструментом:'
    const namePrice = [name, priceStr].filter(Boolean).join(' ')
    const text = [header, namePrice, url].filter(Boolean).join('\n')
    const imgSrc = (catalog?.main_image || (catalog?.images && catalog.images[0])) ? `https://api.renttoolspeed.ru${catalog?.main_image || catalog?.images?.[0]}` : ''

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        let files: File[] = []

        if (imgSrc) {
          try {
            const res = await fetch(imgSrc)
            const blob = await res.blob()
            const fname = `tool.${(blob.type.split('/')[1] || 'jpg')}`

            files = [new File([blob], fname, { type: blob.type || 'image/jpeg' })]
          } catch {}
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const can = (navigator as any).canShare ? (navigator as any).canShare(files.length ? { files } : {}) : true

        await (navigator as any).share(files.length ? { text, files } : { text })

        return
      }
    } catch {}
    if (app === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    } else {
      window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    }
  }, [catalog?.name, catalog?.tool_id, hasDiscount, finalPrice, basePrice, basePriceTrunc, catalog?.main_image, catalog?.images])

  if (loading || !catalog) return <Loader />

  const fade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.div className={`${styles.layout} container`} initial="hidden" animate="show" variants={fade}>
      <Row gutter={[48, 48]}>
        <Col xs={24} md={12}>
          <Carousel
            dots={catalog.images.length > 1}
            arrows={catalog.images.length > 1}
            className={styles.carousel}
          >
            {catalog.images.length ? (
              catalog.images.map((item, index) => (
                <div key={index} className={styles.imgWrap}>
                  <Image
                    src={`https://api.renttoolspeed.ru${item}`}
                    alt={catalog.name || 'Изображение инструмента'}
                    className={styles.image}
                    sizes="100vw"
                    width={0}
                    height={0}
                  />
                </div>
              ))
            ) : (
              <div className={styles.imgWrap}>
                <Image
                  src={'https://renttoolspeed.ru/og/no-photo.png'}
                  alt="Нет изображения"
                  className={styles.image}
                  sizes="100vw"
                  width={0}
                  height={0}
                />
              </div>
            )}
          </Carousel>
        </Col>

        <Col xs={24} md={12}>
          <div className={styles.info}>
            <div className={styles.header}>
              <h1 className={styles.title}>{catalog.name || 'Без названия'}</h1>
              <Button
                type="text"
                shape="circle"
                className={`${styles.btnFavorite} ${isFavorite ? styles.btnFavoriteActive : ''}`}
                onClick={handleFavoriteToggle}
                disabled={!catalog.tool_id || favPending}
                icon={isFavorite ? <HeartFilled className={styles.favIcon}/> : <HeartOutlined className={styles.favIcon}/>}
              />
            </div>

            <div className={styles.meta}>
              {catalog?.category?.name && <Tag className={styles.tag}>{catalog.category.name}</Tag>}
              {catalog?.brand && <Tag className={styles.tag}>{catalog.brand}</Tag>}
              {catalog?.badge && <Tag className={styles.tag}>{catalog.badge}</Tag>}
            </div>

            <div className={styles.priceBlock}>
              {hasDiscount ? (
                <>
                  <span className={styles.price}>{finalPrice} ₽/день</span>
                  <span className={styles.priceOld}>{basePriceTrunc} ₽/день</span>
                  <span className={styles.discountBadge}>-{Math.trunc(discountVal!)}%</span>
                </>
              ) : basePrice > 0 ? (
                <span className={styles.price}>{basePriceTrunc} ₽/день</span>
              ) : (
                <span className={styles.price}>Цена уточняется</span>
              )}
            </div>

            {catalog.description && <p className={styles.desc}>{catalog.description}</p>}

            {specsObj && (
              <div className={styles.specs}>
                <List
                  size="small"
                  dataSource={Object.entries(specsObj)}
                  renderItem={([k, v]) => (
                    <List.Item className={styles.specItem}>
                      <span className={styles.specKey}>{k}</span>
                      <span className={styles.specVal}>{String(v ?? '')}</span>
                    </List.Item>
                  )}
                />
              </div>
            )}

            {!catalog?.is_available ? (
              <Tooltip title="Инструмент недоступен">
                <Button
                  type="primary"
                  size="large"
                  className={styles.btnPrimary}
                  disabled={true}
                >
                  {isAdded ? 'В корзине' : 'Добавить в корзину'}
                </Button>
              </Tooltip>
            ) : (
              <Button
                type="primary"
                size="large"
                className={styles.btnPrimary}
                disabled={!catalog.tool_id || isAdded}
                onClick={() => !isAdded && handleCartAdd(catalog.tool_id)}
              >
                {isAdded ? 'В корзине' : 'Добавить в корзину'}
              </Button>
            )}

            <div className={styles.shareBlock}>
              <span className={styles.shareLabel}>Поделиться</span>
              <div className={styles.shareBtns}>
                <Button
                  type="primary"
                  size="large"
                  className={`${styles.shareBtn} ${styles.shareBtnTg}`}
                  icon={<TelegramOutlined />}
                  onClick={() => handleShare('telegram')}
                  aria-label="Поделиться в Telegram"
                >
                  Telegram
                </Button>

                <Button
                  type="primary"
                  size="large"
                  className={`${styles.shareBtn} ${styles.shareBtnWa}`}
                  icon={<WhatsAppOutlined />}
                  onClick={() => handleShare('whatsapp')}
                  aria-label="Поделиться в WhatsApp"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {isAuth ? <CartPopover router={router} api={api} handleDeleteCart={handleDeleteCart} carts={carts} cartsLoading={cartsLoading}/> : null}
    </motion.div>
  )
}

'use client'
/* eslint-disable no-unused-vars */

import React from 'react'

import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

import { CatalogProductTypes } from '@/shared/types/catalog/catalog-product-card.interface'

import styles from './catalog-product-card.module.css'

type Props = {
  product: CatalogProductTypes.Item
  onAddToCart?: (tool_id: number) => Promise<void>
  onToggleFavorite?: (tool_id: number) => void
  favPending?: boolean
}

const toNumber = (v: unknown, fallback = 0) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  if (v == null) return fallback
  const s = String(v).replace(/\u202F|\u00A0/g, '').replace(/[^0-9,.\-]/g, '').replace(/,/g, '.')
  const m = s.match(/-?\d+(\.\d+)?/)
  const n = m ? Number(m[0]) : NaN

  return Number.isFinite(n) ? n : fallback
}

function CatalogProductCard({ product, onAddToCart, onToggleFavorite, favPending }: Props) {
  const basePrice = toNumber(product.price_per_day, 0)
  const finalPrice = product.final_price !== null && product.final_price !== undefined ? toNumber(product.final_price, 0) : null
  const discountVal = product.discount !== null && product.discount !== undefined ? toNumber(product.discount, 0) : null
  const hasDiscount = finalPrice !== null && discountVal !== null && discountVal > 0 && finalPrice < basePrice
  const statusLabel = product.status === 'available' ? 'В наличии' : product.status === 'unavailable' ? 'Нет в наличии' : product.status
  const isFav = Boolean(product.is_in_favorite)

  return (
    <div className={styles.card}>
      {product.badge ? (
        <span className={`${styles.badge}`}>
          {product.badge}
        </span>
      ) : (
        <span className={`${styles.badge} ${product.status === 'unavailable' ? styles.badgeUnavailable : ''}`}>
          {statusLabel}
        </span>
      )}

      {hasDiscount && <span className={styles.badgeRight}>-{Math.trunc(discountVal!)}%</span>}

      <div className={styles.thumbWrap}>
        <Link href={`/catalog/${product.tool_id}`}>
          <Image
            src={product.main_image ? `https://api.renttoolspeed.ru${product.main_image}` : 'https://renttoolspeed.ru/og/no-photo.png'}
            alt={product.name}
            fill
            unoptimized
            className={styles.thumbImg}
            sizes="256px"
          />
        </Link>

        <button
          type="button"
          aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={() => onToggleFavorite?.(product.tool_id)}
          disabled={Boolean(favPending)}
        >
          {isFav ? <HeartFilled className={styles.favIcon} /> : <HeartOutlined className={styles.favIcon} />}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>
        {product.description ? <p className={styles.desc}>{product.description}</p> : <p style={{ color: 'transparent' }} className={styles.desc}>Нету описание</p>}

        <div className={styles.priceRow}>
          {hasDiscount ? (
            <>
              <span className={styles.discount}>{Math.trunc(finalPrice!)}₽</span>
              <span className={styles.old}>{Math.trunc(basePrice)}₽</span>
            </>
          ) : (
            <span className={styles.price}>{Math.trunc(basePrice)}₽</span>
          )}
        </div>
      </div>

      <div className={styles.btnRow}>
        {!product.is_available ? (
          <Tooltip title="Товара нет в наличии">
            <Button type="primary" block className={`${styles.antBtn} btnOrange`} disabled icon={<ShoppingCartOutlined />}>
              В корзину
            </Button>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            icon={product.is_in_cart ? null : <ShoppingCartOutlined />}
            block
            className={`${styles.antBtn} btnOrange`}
            disabled={!product.tool_id || product.is_in_cart}
            onClick={() => !product.is_in_cart && onAddToCart?.(product.tool_id)}
          >
            {product.is_in_cart ? 'В корзине ✓' : 'В корзину'}
          </Button>
        )}

        <Link href={`/catalog/${product.tool_id}`} className={styles.moreBtn}>
          Подробнее
        </Link>
      </div>
    </div>
  )
}

export default React.memo(
  CatalogProductCard,
  (prev, next) =>
    prev.product.tool_id === next.product.tool_id &&
    prev.product.is_in_cart === next.product.is_in_cart &&
    prev.product.is_in_favorite === next.product.is_in_favorite &&
    prev.product.status === next.product.status &&
    prev.product.final_price === next.product.final_price &&
    prev.product.price_per_day === next.product.price_per_day &&
    Boolean(prev.favPending) === Boolean(next.favPending),
)

'use client'

import { ArrowRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { noPhoto } from '@/shared/assets/images'
import { HomeType } from '@/shared/types/home/home.interface'

import styles from './home-product-card.module.css'

interface Props {
  product: HomeType.Product
  // eslint-disable-next-line no-unused-vars
  onRent?: (item: HomeType.Product) => void
}

export default function HomeProductCard({ product }: Props) {
  const router = useRouter()
  const hasDiscount = product.final_price !== null && product.discount !== null

  const statusLabel =
    product.status === 'available'
      ? 'В наличии'
      : product.status === 'unavailable'
        ? 'Нет в наличии'
        : product.status

  return (
    <div className={styles.card}>
      {product.badge ? (
        <span className={`${styles.badge}`}>
          {product.badge}
        </span>
      ) : (
        <span
          className={`${styles.badge} ${
            product.status === 'unavailable' ? styles.badgeUnavailable : styles.left
          }`}
        >
          {statusLabel}
        </span>
      )}

      {hasDiscount && (
        <span className={`${styles.badge} ${styles.right}`}>
          -{parseInt(product.discount)}%
        </span>
      )}

      <div className={styles.thumbWrap}>
        <Image
          src={product.main_image ? `https://rts.badk.xyz${product.main_image}` : noPhoto}
          alt={product.name}
          fill
          priority
          unoptimized
          className={styles.thumbImg}
          sizes="128px"
        />
      </div>

      <div className={styles.title}>{product.name}</div>

      <div className={styles.priceRow}>
        {hasDiscount ? (
          <>
            <span className={styles.discount}>{product.final_price}₽/день</span>
            <span className={styles.old}>{Math.trunc(parseInt(product.price_per_day))}₽</span>
          </>
        ) : (
          <span className={styles.price}>{product.price_per_day}₽/день</span>
        )}
      </div>

      <Button
        type="primary"
        icon={<ArrowRightOutlined />}
        block
        className={`${styles.antBtn} btnOrange`}
        onClick={() => router.push('/catalog')}
      >
        Арендовать
      </Button>
    </div>
  )
}

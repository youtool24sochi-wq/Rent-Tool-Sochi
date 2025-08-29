'use client'

import React from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { List, Input, Pagination, Flex } from 'antd'
import Item from 'antd/es/list/Item'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { CartDELETE, CartListGET, CartPOST } from '@/services/cart-api'
import { CatalogCategoriesGET, CatalogProductsAuthGET, CatalogProductsGET } from '@/services/catalog-api'
import { FavoritePOST, FavoriteDELETE } from '@/services/favorites-api'
import CatalogProductCard from '@/shared/components/catalog-product-card/catalog-product-card'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { useClient } from '@/shared/hooks/useClient'
import { debounce } from '@/shared/tools/debounce'
import { CartType } from '@/shared/types/cart/cart.interface'
import { CatalogProductTypes } from '@/shared/types/catalog/catalog-product-card.interface'
import CartPopover from '@/widgets/cart-popover/cart-popover'
import CatalogFilters from '@/widgets/catalog-filters/ui/catalog-filters'

import Loader from '../loading'

import styles from './page.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Catalog() {
  const clientReady = useClient()
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const api = useNotificationApi()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const pageSize = 12
  const [catalogs, setCatalogs] = React.useState<CatalogProductTypes.Response | null>(null)
  const [catalogsLoading, setCatalogLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<CatalogProductTypes.Categories[] | null>(null)
  const [categoriesLoading, setCategoriesLoading] = React.useState(false)
  const [carts, setCarts] = React.useState<CartType.Item[]>([])
  const [cartsLoading, setCartsLoading] = React.useState(false)
  const [initialLoaded, setInitialLoaded] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [categoryFilter, setCategoryFilter] = React.useState<number>()
  const [priceRange, setPriceRange] = React.useState<[number | undefined, number | undefined]>([undefined, undefined])
  const [favPendingIds, setFavPendingIds] = React.useState<Set<number>>(new Set())

  const setFavBusy = React.useCallback((id: number, busy: boolean) => {
    setFavPendingIds((prev) => {
      const next = new Set(prev)

      if (busy) next.add(id)
      else next.delete(id)

      return next
    })
  }, [])

  const patchCatalogCartFlag = React.useCallback((tool_id: number, inCart: boolean) => {
    setCatalogs((prev) => {
      if (!prev) return prev
      const results = prev.results.map((it) => (it.tool_id === tool_id ? { ...it, is_in_cart: inCart } : it))

      return { ...prev, results }
    })
  }, [])

  const patchCatalogFavoriteFlag = React.useCallback((tool_id: number, inFav: boolean) => {
    setCatalogs((prev) => {
      if (!prev) return prev
      const results = prev.results.map((it) => (it.tool_id === tool_id ? { ...it, is_in_favorite: inFav } : it))

      return { ...prev, results }
    })
  }, [])

  const loadCatalogs = async (page = 1, search = '', category?: number, min_price?: number, max_price?: number) => {
    setCatalogLoading(true)
    try {
      const response = isAuth
        ? await CatalogProductsAuthGET(search, page, pageSize, category, min_price, max_price)
        : await CatalogProductsGET(search, page, pageSize, category, min_price, max_price)

      if (!response) {
        api.error({ message: 'Произошла ошибка. Попробуйте позже', placement: 'top' })

        return
      }
      setCatalogs(response)
    } catch (error) {
      console.log('failed to fetch catalogs', error)
    } finally {
      setCatalogLoading(false)
    }
  }

  const loadCategories = async () => {
    setCategoriesLoading(true)
    try {
      const response = await CatalogCategoriesGET()

      if (!response) return
      setCategories(response.data)
    } catch {
    } finally {
      setCategoriesLoading(false)
    }
  }

  const loadCarts = async () => {
    setCartsLoading(true)
    try {
      const response = (await CartListGET()) as any

      if (response.status === 200) setCarts(response.data)
    } catch {
    } finally {
      setCartsLoading(false)
    }
  }

  React.useEffect(() => {
    Promise.all([loadCatalogs(1, initialSearch), loadCategories()]).then(() => setInitialLoaded(true))
  }, [])

  React.useEffect(() => {
    if (isAuth) loadCarts()
  }, [isAuth])

  const handleCartAdd = React.useCallback(
    async (tool_id: number) => {
      if (!isAuth) {
        router.push('/auth')
        api.error({ message: 'Сначала авторизуйтесь', placement: 'top' })

        return
      }
      try {
        const response = await CartPOST({ tool_id })

        if (response.message === 'Инструмент уже в корзине') {
          api.error({ message: response.message, placement: 'top', duration: 1.5 })
        } else {
          api.success({ message: response.message, placement: 'top', duration: 1.5 })
          patchCatalogCartFlag(tool_id, true)
          loadCarts()
        }
      } catch {
        api.error({ message: 'Неизвестная ошибка', placement: 'top' })
      }
    },
    [isAuth, router, api, patchCatalogCartFlag],
  )

  const handleDeleteCart = React.useCallback(
    async (tool_id: string) => {
      try {
        const response = await CartDELETE(tool_id)

        if (response?.status === 200 || response?.statusText === 'OK') {
          patchCatalogCartFlag(Number(tool_id), false)
          loadCarts()
        }
      } catch {
        api.error({ message: 'Неизвестная ошибка', placement: 'top' })
      }
    },
    [api, patchCatalogCartFlag],
  )

  const handleToggleFavorite = React.useCallback(
    async (tool_id: number) => {
      if (!isAuth) {
        router.push('/auth')
        api.error({ message: 'Сначала авторизуйтесь', placement: 'top' })

        return
      }
      if (favPendingIds.has(tool_id)) return
      const item = catalogs?.results.find((it) => it.tool_id === tool_id)
      const isFav = Boolean(item?.is_in_favorite)

      try {
        setFavBusy(tool_id, true)
        if (isFav) {
          const dataToSend = { tool_id: String(tool_id) }
          const res = await FavoriteDELETE(dataToSend)

          if (res?.status === 200 || res?.statusText === 'OK') {
            patchCatalogFavoriteFlag(tool_id, false)
          } else {
            api.error({ message: 'Не удалось удалить из избранного', placement: 'top' })
          }
        } else {
          const res = await FavoritePOST({ tool_id })

          if (res) {
            patchCatalogFavoriteFlag(tool_id, true)
          } else {
            api.error({ message: 'Не удалось добавить в избранное', placement: 'top' })
          }
        }
      } catch {
        api.error({ message: 'Неизвестная ошибка', placement: 'top' })
      } finally {
        setFavBusy(tool_id, false)
      }
    },
    [isAuth, router, api, catalogs, favPendingIds, setFavBusy, patchCatalogFavoriteFlag],
  )

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setCurrentPage(1)
        loadCatalogs(1, value, categoryFilter, priceRange[0], priceRange[1])
      }, 1500),
    [categoryFilter, priceRange],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handleSearchSubmit = () => {
    setCurrentPage(1)
    loadCatalogs(1, searchQuery, categoryFilter, priceRange[0], priceRange[1])
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') handleSearchSubmit()
  }

  const handlePageChange = (page: number) => {
    if (page === currentPage) return
    setCurrentPage(page)
    loadCatalogs(page, searchQuery, categoryFilter, priceRange[0], priceRange[1])
  }

  const handleFilterApply = (values: { category?: number; price?: [number, number] }) => {
    const [min_price, max_price] = Array.isArray(values.price) ? values.price : [undefined, undefined]

    setCategoryFilter(values.category)
    setPriceRange([min_price, max_price])
    setCurrentPage(1)
    loadCatalogs(1, searchQuery, values.category, min_price, max_price)
  }

  const handleFilterReset = () => {
    setCategoryFilter(undefined)
    setPriceRange([undefined, undefined])
    setSearchQuery('')
    setCurrentPage(1)
    loadCatalogs()
  }

  if (!clientReady || !initialLoaded) return <Loader />

  return (
    <div className={styles.page}>
      <div className={styles.bgLayer} aria-hidden />
      <div className={styles.ellipses} aria-hidden>
        <div className={styles.ellipseLeft} />
        <div className={styles.ellipseRight} />
      </div>

      <div className={styles.particles} aria-hidden>
        <svg className={styles.tool1} width="64" height="64" viewBox="0 0 64 64">
          <rect x="6" y="26" width="30" height="12" rx="3" />
          <rect x="34" y="29" width="8" height="6" rx="1" />
          <circle cx="48" cy="32" r="6" />
        </svg>
        <svg className={styles.tool2} width="54" height="54" viewBox="0 0 54 54">
          <rect x="8" y="26" width="30" height="8" rx="2" />
          <rect x="34" y="10" width="6" height="28" rx="2" />
          <rect x="20" y="8" width="22" height="8" rx="2" />
        </svg>
        <svg className={styles.tool3} width="60" height="60" viewBox="0 0 60 60">
          <circle cx="24" cy="30" r="12" />
          <rect x="34" y="28" width="18" height="4" rx="2" />
        </svg>
        <svg className={styles.tool4} width="58" height="58" viewBox="0 0 58 58">
          <rect x="10" y="14" width="26" height="10" rx="2" />
          <rect x="20" y="24" width="6" height="24" rx="2" />
          <rect x="18" y="48" width="10" height="6" rx="2" />
        </svg>
        <svg className={styles.tool5} width="56" height="56" viewBox="0 0 56 56">
          <rect x="10" y="20" width="36" height="8" rx="2" />
          <circle cx="22" cy="24" r="3" />
          <circle cx="34" cy="24" r="3" />
        </svg>
        <svg className={styles.tool6} width="48" height="48" viewBox="0 0 48 48">
          <rect x="20" y="8" width="8" height="26" rx="2" />
          <polygon points="24,36 18,44 30,44" />
        </svg>
        <svg className={styles.tool7} width="62" height="62" viewBox="0 0 62 62">
          <rect x="8" y="26" width="30" height="10" rx="2" />
          <rect x="32" y="16" width="6" height="10" rx="2" />
          <rect x="38" y="28" width="16" height="6" rx="2" />
        </svg>
        <svg className={styles.tool8} width="46" height="46" viewBox="0 0 46 46">
          <rect x="8" y="20" width="24" height="6" rx="2" />
          <rect x="12" y="12" width="16" height="6" rx="2" />
          <rect x="18" y="26" width="8" height="12" rx="2" />
        </svg>
        <svg className={styles.tool9} width="50" height="50" viewBox="0 0 50 50">
          <rect x="10" y="18" width="30" height="8" rx="4" />
          <rect x="22" y="26" width="6" height="16" rx="3" />
        </svg>
        <svg className={styles.tool10} width="60" height="60" viewBox="0 0 60 60">
          <rect x="10" y="22" width="40" height="10" rx="3" />
          <rect x="18" y="18" width="24" height="6" rx="3" />
          <circle cx="30" cy="27" r="2.5" />
          <circle cx="38" cy="27" r="2.5" />
        </svg>
        <svg className={styles.tool11} width="44" height="44" viewBox="0 0 44 44">
          <circle cx="20" cy="24" r="10" />
          <rect x="28" y="22" width="10" height="4" rx="2" />
        </svg>
        <svg className={styles.tool12} width="64" height="64" viewBox="0 0 64 64">
          <rect x="14" y="14" width="36" height="10" rx="2" />
          <rect x="28" y="24" width="8" height="26" rx="2" />
          <rect x="24" y="50" width="16" height="6" rx="3" />
        </svg>
      </div>

      <div className={`${styles.layout} container`}>
        <Flex className={styles.left}>
          <CatalogFilters
            categories={categories}
            categoriesLoading={categoriesLoading}
            onApply={handleFilterApply}
            onReset={handleFilterReset}
          />
          <span className={styles.found}>Найдено: {catalogs?.count ?? 0}</span>
        </Flex>

        <div className={styles.content}>
          <div className={styles.search}>
            <div className={styles.searchBar}>
              <Input
                className={styles.searchInput}
                placeholder="Поиск оборудования..."
                size="large"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                allowClear={false}
              />
              <button
                type="button"
                className={styles.searchButton}
                aria-label="Найти"
                onClick={handleSearchSubmit}
                disabled={catalogsLoading}
              >
                <SearchOutlined />
              </button>
            </div>
          </div>

          <List
            grid={{ gutter: 16, column: 4, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={catalogs?.results}
            loading={catalogsLoading}
            renderItem={(item) => (
              <Item key={item.tool_id}>
                <motion.div variants={fadeUp} initial="hidden" animate="show">
                  <CatalogProductCard
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={handleCartAdd}
                    favPending={favPendingIds.has(item.tool_id)}
                    product={{ ...item, is_in_cart: Boolean(item.is_in_cart) }}
                  />
                </motion.div>
              </Item>
            )}
          />

          <div className={styles.pagination}>
            <Pagination
              pageSize={pageSize}
              align="center"
              total={catalogs?.count ?? 0}
              current={currentPage}
              showSizeChanger={false}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {isAuth ? (
        <CartPopover
          router={router}
          api={api}
          handleDeleteCart={handleDeleteCart}
          carts={carts}
          cartsLoading={cartsLoading}
        />
      ) : null}
    </div>
  )
}

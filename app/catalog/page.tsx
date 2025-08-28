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
          const dataToSend = {
            tool_id: String(tool_id),
          }
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
    <>
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
    </>
  )
}

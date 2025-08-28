import $axios from '@/shared/api/axios'
import { API_URL } from '@/shared/utils/consts'

export const CatalogProductsGET = async (
  search: string | undefined = '',
  page: number = 1,
  limit: number = 12,
  category?: number,
  min_price?: number,
  max_price?: number,
) => {
  const params = new URLSearchParams()

  params.append('page', page.toString())
  params.append('limit', limit.toString())
  if (search) params.append('search', search)
  if (category) params.append('category', category.toString())
  if (min_price !== undefined) params.append('min_price', min_price.toString())
  if (max_price !== undefined) params.append('max_price', max_price.toString())

  try {
    const response = await fetch(`/api/catalog?${params.toString()}`, { method: 'GET' })
    const data = await response.json()

    return data
  } catch (error) {
    console.log('failed ro fetch catalog products', error)
  }
}

export const CatalogProductsAuthGET = async (
  search: string | undefined = '',
  page: number | any = 1,
  limit: number | any = 12,
  category?: number,
  min_price?: number,
  max_price?: number,
) => {

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)

  try {
    const { data } = await $axios.get(`${API_URL}/catalog?limit=${limit}&offset=${offset}` +
      (search ? `&search=${search}` : '') +
      (category ? `&category=${category}` : '') +
      (min_price ? `&min_price=${min_price}` : '') +
      (max_price ? `&max_price=${max_price}` : ''))

    return data
  } catch (error) {
    console.log('failed to fetch catalog products', error)
    throw error
  }
}

export const CatalogCategoriesGET = async () => {
  try {
    const response = await fetch('/api/catalog/categories/', { method: 'GET' })
    const data = await response.json()

    return data
  } catch (error) {
    console.log('failed to fetch catalog categories', error)
  }
}

export const CatalogIdGET = async (tool_id: string | string[] | undefined) => {
  try {
    const response = await fetch(`/api/catalog/${tool_id}/`)
    const data = await response.json()

    return data
  } catch (error) {
    console.log('failed to fetch tool id',error)
  }
}

export const CatalogIdAuthGET = async (tool_id: string | string[] | undefined) => {
  try {
    const response = await $axios.get(`${API_URL}/tools/${tool_id}/`)

    return response
  } catch (error) {
    console.log(error)
  }
}

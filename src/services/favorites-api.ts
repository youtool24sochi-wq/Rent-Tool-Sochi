import $axios from '@/shared/api/axios'
import { FavoritesTypes } from '@/shared/types/favorites/favorites.interface'
import { API_URL } from '@/shared/utils/consts'

export const FavoriteGET = async () => {
  try {
    const response = await $axios.get<FavoritesTypes.FavoritesResponse>(`${API_URL}/tools/favorite/`)

    return response
  } catch (error: any) {
    console.log('error add cart', error)
  }
}

export const FavoritePOST = async (dataToSend: {tool_id: number}) => {
  try {
    const response = await $axios.post(`${API_URL}/tools/favorite/`, dataToSend)

    return response.data
  } catch (error: any) {
    console.log('error add cart', error)
  }
}

export const FavoriteDELETE = async (dataToSend: {tool_id: string}) => {
  try {
    const response = await $axios.delete(`${API_URL}/tools/favorite/`, { data: dataToSend , headers: { 'Content-Type': 'application/json' } })

    return response
  } catch (error) {
    console.log('failed to delete cart', error)
  }
}

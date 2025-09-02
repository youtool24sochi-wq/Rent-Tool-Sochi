import axios from 'axios'

import $axios from '@/shared/api/axios'
import { UsersTypes } from '@/shared/types/users/users.interface'
import { API_URL } from '@/shared/utils/consts'

export const UserMeGET = async () => {
  const { data } = await $axios.get<UsersTypes.Individual>(`${API_URL}/users/me/`)

  return data
}

export const UserMeLegalGET = async () => {
  const { data } = await $axios.get<UsersTypes.Legal>(`${API_URL}/users/me_legal/`)

  return data
}

export const UsersOrdersGET = async () => {
  try {
    const response = await $axios.get<UsersTypes.Order[]>(`${API_URL}/users/orders/`)

    return response.data
  } catch (error) {
    console.log('failed to fetch orders', error)
  }
}

export const UsersUpdateDataPATCH = async (payload: Partial<UsersTypes.Individual> | FormData) => {
  try {
    const isFD = typeof FormData !== 'undefined' && payload instanceof FormData
    const { data } = await $axios.patch(`${API_URL}/users/update_data/`, payload, {
      headers: isFD ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })

    return data
  } catch (error) {
    console.log('failed to patch user data', error)
  }
}

export const UsersMeLegalPATCH = async (payload: Partial<UsersTypes.Legal>) => {
  try {
    const { data } = await $axios.patch(`${API_URL}/users/me_legal_update/`, payload)

    return data
  } catch (error) {
    console.log('failed to patch legal data' , error)
  }
}

export const AuthUrlGET = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/oauth2/google-oauth2/url/`)

    return response
  } catch (error) {
    console.log('failed to fetch google link', error)
  }
}

import axios from 'axios'

import $axios from '@/shared/api/axios'
import { CartType } from '@/shared/types/cart/cart.interface'
import { API_URL } from '@/shared/utils/consts'

export const CartListGET = async () => {
  try {
    const response = await $axios.get(`${API_URL}/cart/`)

    return response
  } catch (error) {
    console.log('error', error)
  }
}

export const CartPOST = async (dataToSend: CartType.Form) => {
  try {
    const response = await $axios.post(`${API_URL}/cart/`, dataToSend)

    return response.data
  } catch (error: any) {
    console.log('error add cart', error)
  }
}

export const CartDELETE = async (tool_id: string) => {
  try {
    const response = await $axios.delete(`${API_URL}/cart/${tool_id}/`)

    return response
  } catch (error) {
    console.log('failed to delete cart', error)
  }
}

export const CartAllDELETE = async () => {
  try {
    const response = await $axios.delete(`${API_URL}/cart/clear_cart/`)

    return response
  } catch (error) {
    console.log('failed to delete cart', error)
  }
}

export const CartCheckAvailability = async (tool_id: string, start_date: string, end_date: string, quantity: string) => {
  try {
    const response = await axios.get(`${API_URL}/tools/${tool_id}/check_availability/`, { params: { start_date: start_date, end_date: end_date, quantity: quantity } })

    return response
  } catch (error) {
    console.log('failed to fetch availablity tools', error)
  }
}

export const CartCheckoutCreate = async (dataToSend: CartType.CheckoutRequestData) => {

  try {
    const response = await $axios.post(`${API_URL}/checkout/`, dataToSend)

    return response
  } catch (error: any) {
    console.log('failed to create checkout', error)

    return error
  }
}

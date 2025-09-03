import $axios from '@/shared/api/axios'
import { API_URL } from '@/shared/utils/consts'

export const CheckoutOrderIdGET = async (id: string | string[] | undefined) => {
  try {
    const response = await $axios.get(`${API_URL}/checkout/${id}/`)

    return response.data
  } catch (error) {
    console.log('failed to get order id', error)
  }
}

export const CheckoutUpdateCustomerDataPATCH = async (
  id: string | string[] | undefined,
  payload: { customer_data_type:string; payment_method:string | null; work_address?: string },
) => {
  const { data } = await $axios.patch(`${API_URL}/checkout/${id}/update_customer_data/`, payload)

  return data
}

export const CheckoutGetContractGET = async (id: string | string[] | undefined) => {
  const { data } = await $axios.get(`${API_URL}/checkout/${id}/get_contract/`)

  return data as {
    contract_id: number
    contract_file_url: string
    order_id: number
    customer_data_type: 'individual' | 'legal'
  }
}

export const CheckoutFinalizePATCH = async (
  id: string | string[] | undefined,
  payload:
    | FormData
    | { agreement_accepted: boolean; contract_accepted: boolean; receipt?: File | null },
) => {
  let form: FormData

  if (payload instanceof FormData) {
    form = payload
  } else {
    form = new FormData()
    form.append('agreement_accepted', String(payload.agreement_accepted))
    form.append('contract_accepted', String(payload.contract_accepted))
    if (payload.receipt) form.append('receipt', payload.receipt as Blob)
  }

  const { data } = await $axios.patch(
    `${API_URL}/checkout/${id}/finalize/`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return data
}

export const CheckoutCancel = async (id: string | string[] | undefined) => {
  const { data } = await $axios.delete(`${API_URL}/checkout/${id}/cancel/`)

  return data
}

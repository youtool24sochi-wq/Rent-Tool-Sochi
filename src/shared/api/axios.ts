import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

import { API_URL } from '../utils/consts'

export interface Tokens { access: string; refresh: string }
export interface RetryableAxiosRequestConfig extends AxiosRequestConfig { _retry?: boolean }

const $axios = axios.create()

$axios.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    if (!config.headers) config.headers = {}
    if (!config.headers.Authorization) {
      const tokens = JSON.parse(localStorage.getItem('tokens') || 'null') as Tokens | null

      if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`
      }
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

$axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableAxiosRequestConfig

    if (error.response?.status === 401 && !config._retry) {
      config._retry = true
      const access = await refreshAccessToken()

      if (access) {
        if (!config.headers) config.headers = {}
        config.headers.Authorization = `Bearer ${access}`

        return $axios(config)
      }
    }

    return Promise.reject(error)
  },
)

async function refreshAccessToken(): Promise<string | undefined> {
  try {
    const tokens = JSON.parse(localStorage.getItem('tokens') || 'null') as Tokens | null

    if (!tokens?.refresh) return

    const { data } = await axios.post<{ access: string }>(
      `${API_URL}/token/refresh/`,
      { refresh: tokens.refresh },
    )

    localStorage.setItem('tokens', JSON.stringify({ access: data.access, refresh: tokens.refresh }))

    return data.access
  } catch (e) {
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
    try {
      window.dispatchEvent(new Event('auth:logout'))
    } catch {}
    console.log('error with refreshing access token', e)
  }
}
export default $axios

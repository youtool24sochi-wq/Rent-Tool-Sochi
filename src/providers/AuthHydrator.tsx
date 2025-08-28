'use client'
import React from 'react'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { hydrateFromStorage, setLogout } from '@/store/features/auth/authSlice'

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    const tokens = (() => {
      try {
        return JSON.parse(localStorage.getItem('tokens') ?? 'null')
      } catch {
        return null
      }
    })()
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') ?? 'null')
      } catch {
        return null
      }
    })()

    if (!tokens) {
      localStorage.removeItem('user')
      dispatch(setLogout())
    } else {
      dispatch(hydrateFromStorage({ tokens, user }))
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tokens' && e.newValue === null) {
        localStorage.removeItem('user')
        dispatch(setLogout())
      }
    }

    window.addEventListener('storage', onStorage)

    return () => window.removeEventListener('storage', onStorage)
  }, [dispatch])

  React.useEffect(() => {
    const onForceLogout = () => dispatch(setLogout())

    window.addEventListener('auth:logout', onForceLogout)

    return () => window.removeEventListener('auth:logout', onForceLogout)
  }, [dispatch])

  return <>{children}</>
}

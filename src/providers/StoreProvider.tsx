'use client'

import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/store/store'

import { AuthHydrator } from './AuthHydrator'

export function StoreProvider({ children } : {children: ReactNode}) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
      </AuthHydrator>
    </Provider>
  )
}

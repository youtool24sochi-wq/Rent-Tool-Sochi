'use client'

import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { refreshOAuth2Token, userMe } from '@/store/features/auth/authSlice'

export default function AuthCallBack() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const api = useNotificationApi()
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    if (isAuth) {
      router.push('/')

      return
    }

    const access = searchParams.get('access_token')

    if (access) {
      dispatch(refreshOAuth2Token(access))
      dispatch(userMe()).finally(() => {
        router.push('/')
        api.success({
          message: 'Вы успешно вошли через гугл',
        })
      })
    } else {
    //   router.replace('/auth')
      api.error({
        message: 'Ссылка недействительна или токены отсутствуют',
        description: 'Попробуйте пройти регистрацию ещё раз или используйте актуальную ссылку из письма.',
        placement: 'top',
      })
    }

    setChecked(true)
  }, [dispatch, isAuth, router, searchParams])

  if (!checked) {
    return null
  }

  return <div/>
}

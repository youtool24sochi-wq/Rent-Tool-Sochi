'use client'

import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { setTokens, userMe } from '@/store/features/auth/authSlice'

export default function VerifyEmail() {
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

    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')

    if (access && refresh) {
      dispatch(setTokens({ refresh, access }))
      dispatch(userMe()).finally(() => {
        router.push('/')
        api.success({
          message: 'Вы успешно прошли регистрацию и подтвердили адрес электронной почты',
        })
      })
    } else {
      router.replace('/auth')
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

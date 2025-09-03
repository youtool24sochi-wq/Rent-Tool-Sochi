'use client'
import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { refreshOAuth2Token, userMe } from '@/store/features/auth/authSlice'

import Loader from '../../loading'

export default function AuthCallBack() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const api = useNotificationApi()
  const searchParams = useSearchParams()
  const isAuth = useAppSelector((s) => s.auth.isAuth)
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      if (isAuth) {
        router.replace('/')
        setChecked(true)

        return
      }

      const access = searchParams.get('access_token')

      if (!access) {
        router.replace('/auth')
        api.error({
          message: 'Ссылка недействительна или токены отсутствуют',
          description: 'Попробуйте пройти регистрацию ещё раз или используйте актуальную ссылку из письма.',
          placement: 'top',
        })
        setChecked(true)

        return
      }

      try {
        await dispatch(refreshOAuth2Token(access)).unwrap()

        await dispatch(userMe()).unwrap()

        router.replace('/')
        api.success({ message: 'Вы успешно вошли через Google', placement: 'top' })
      } catch {
        router.replace('/auth')
        api.error({ message: 'Произошла ошибка, попробуйте позже', placement: 'top' })
      } finally {
        setChecked(true)
      }
    })()
  }, [dispatch, isAuth, router, searchParams, api])

  if (!checked) return <Loader/>

  return <div />
}

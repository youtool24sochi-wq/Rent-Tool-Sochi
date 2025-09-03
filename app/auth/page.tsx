'use client'

import React from 'react'

import { Tabs, Button, Form, Segmented, Flex } from 'antd'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { AuthUrlGET } from '@/services/user-api'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { isPhoneLike, normalizePhone } from '@/shared/tools/authPhone'
import { AuthTypes } from '@/shared/types/auth/auth.interface'
import { TextField } from '@/shared/ui/textfield/textfield'
import { TextFieldPassword } from '@/shared/ui/textfield-password/textfield-password'
import { loginIdentifierRules, registerRules } from '@/shared/validation/auth/authValidate'
import { loginAuth, register } from '@/store/features/auth/authSlice'

import styles from './page.module.css'

export default function Auth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isAuth  = useAppSelector((state) => state.auth.isAuth)
  const [tab, setTab] = React.useState<'login' | 'register'>('login')
  const [submittedRegister, setSubmittedRegister] = React.useState(false)
  const [submittedLogin , setSubmiitedLogin] = React.useState(false)
  const [identifierType, setIdentifierType] = React.useState<'email' | 'phone'>('phone')
  const [registerIdentifierType, setRegisterIdentifierType] = React.useState<'email' | 'phone'>('phone')
  const [authUrl, setAuthUrl] = React.useState<{auth_url: string, backend_name: string}>()
  const api = useNotificationApi()

  const searchParams = useSearchParams()
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const code = searchParams.get('code')

  const loadAuthUrl = async () => {
    try {
      const response = await AuthUrlGET()

      setAuthUrl(response?.data)
    } catch (error) {
      console.log('error', error)

    }
  }

  React.useEffect(() => {
    if (isAuth) {
      router.push('/')
    }
    loadAuthUrl()
  }, [isAuth])

  const handleSubmitLogin = React.useCallback(
    async (data: AuthTypes.LoginUser) => {
      setSubmiitedLogin(true)
      const { login } = data
      const phoneLike = isPhoneLike(login)
      const dataToSend: AuthTypes.LoginUser = phoneLike ? { ...data, login: normalizePhone(login) } : data

      try {
        const response: any = await dispatch(loginAuth(dataToSend)).unwrap()

        if (response.message === 'Вход выполнен успешно') {
          router.push('/')
          api.success({
            message: response.message,
            placement: 'top',
          })
        }
      } catch (errorReq: any) {
        if (errorReq.data.error) {
          api.error({ message: errorReq.data.error, placement: 'top' })
        } else {
          api.error({ message: 'Не удалось войти', placement: 'top' })
        }
      } finally {
        setSubmiitedLogin(false)
      }
    },
    [api, dispatch],
  )

  const handleSubmitRegister = React.useCallback(
    async (data: AuthTypes.RegisterUser & { first_name?: string; last_name?: string; middle_name?: string; email?: string; phone?: string }) => {
      setSubmittedRegister(true)
      try {
        const payload: any = { ...data }

        delete payload.phone

        if (registerIdentifierType === 'phone') {
          const cleanedPhone = normalizePhone(data.phone || '')

          payload.phone = cleanedPhone
        }

        const response = await dispatch(register(payload)).unwrap()

        if (response) {
          router.push('/')
          if (response.access && response.refresh) {
            api.success({ message: 'Вы успешно зарегистрировались', placement: 'top' })
          } else {
            api.info({ message: response.message, placement: 'top' })
          }
        }
      } catch (error: any) {
        if (error?.data.email?.[0] === 'Пользователь с таким email уже существует') {
          api.error({ message: error?.data.email?.[0], placement: 'top' })
        } else if (error?.data.non_field_errors?.[0] === 'Пароли не совпадают') {
          api.error({ message: error?.data.non_field_errors?.[0], placement: 'top' })
        } else {
          api.error({ message: 'Неизвестная ошибка', placement: 'top' })
        }
      } finally {
        setSubmittedRegister(false)
      }
    },
    [api, dispatch, registerIdentifierType],
  )

  const loginRules = React.useMemo(
    () => loginIdentifierRules(identifierType),
    [identifierType],
  )

  const registerIdentifierRules = React.useMemo(
    () => (registerIdentifierType === 'email' ? registerRules.email : registerRules.phone),
    [registerIdentifierType],
  )

  return (
    <main className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <Flex align={'center'} vertical>
          <div className={styles.logo}>
            <span className={styles.logoDark}>Rent</span>
            <span className={styles.logoAccent}>Tool</span>
            <span className={styles.logoDark}>Sochi</span>
          </div>
          <p className={styles.paragraph}>Аренда инструментов</p>
        </Flex>

        <Tabs
          activeKey={tab}
          onChange={(k) => setTab(k as 'login' | 'register')}
          className={styles.tabs}
          items={[
            {
              key: 'login',
              label: 'Вход',
              children: (
                <Form
                  layout="vertical"
                  size="large"
                  onFinish={(value) => handleSubmitLogin(value)}
                  className={styles.form}
                >
                  <TextField
                    name="login"
                    label={(
                      <div className={styles.identifierLabel}>
                        <span>Телефон или email</span>
                        <Segmented
                          options={[
                            { label: 'Телефон', value: 'phone' },
                            { label: 'Email', value: 'email' },
                          ]}
                          size="small"
                          value={identifierType}
                          onChange={(value) => setIdentifierType(value as 'email' | 'phone')}
                        />
                      </div>
                    )}
                    placeholder={identifierType === 'email' ? 'Email' : 'Телефон'}
                    rules={loginRules}
                    className={styles.field}
                  />
                  <TextFieldPassword
                    name="password"
                    label="Пароль"
                    placeholder="Пароль"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                    className={styles.field}
                  />
                  <div className={styles.consentText}>
                    Продолжая регистрацию, вы подтверждаете, что ознакомились и соглашаетесь с условиями{' '}
                    <a onClick={() => router.push('/personal-data')}>Политики обработки персональных данных</a>.
                  </div>
                  <Button loading={submittedLogin} htmlType="submit" block className={`${styles.btn_submit}`}>
                    Войти
                  </Button>
                  <div className={styles.switchLine}>
                    <a onClick={() => router.push('/auth/reset-password')} className={styles.forgot}>Забыли пароль?</a>
                    <div className={styles.no_account}>
                      <span>Нет аккаунта?</span>
                      <a onClick={() => setTab('register')}>Регистрация</a>
                    </div>
                  </div>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Регистрация',
              children: (
                <Form
                  layout="vertical"
                  size="large"
                  onFinish={(data) => handleSubmitRegister(data)}
                  className={styles.form}
                >
                  <TextField
                    name="last_name"
                    label="Фамилия"
                    placeholder="Фамилия"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                    className={styles.field}
                  />
                  <TextField
                    name="first_name"
                    label="Имя"
                    placeholder="Имя"
                    rules={[{ required: true, message: 'Введите имя' }]}
                    className={styles.field}
                  />
                  <TextField
                    name="middle_name"
                    label="Отчество"
                    placeholder="Отчество"
                    className={styles.field}
                  />
                  <TextField
                    name={registerIdentifierType === 'email' ? 'email' : 'phone'}
                    label={(
                      <div className={styles.identifierLabel}>
                        <span>Телефон или email</span>
                        <Segmented
                          options={[
                            { label: 'Телефон', value: 'phone' },
                            { label: 'Email', value: 'email' },
                          ]}
                          size="small"
                          value={registerIdentifierType}
                          onChange={(value) => setRegisterIdentifierType(value as 'email' | 'phone')}
                        />
                      </div>
                    )}
                    placeholder={registerIdentifierType === 'email' ? 'Email' : 'Телефон'}
                    rules={registerIdentifierRules}
                    className={styles.field}
                  />
                  {/*
                  {registerIdentifierType === 'phone' ? (
                    <TextField
                      name={'email'}
                      label={'Email'}
                      placeholder={'Email'}
                      rules={[emailFormat]}
                      className={styles.field}
                    />
                  ) : null}
                    */}
                  <TextFieldPassword
                    name="password"
                    label="Пароль"
                    placeholder="Пароль"
                    rules={registerRules.password}
                    className={styles.field}
                  />
                  <TextFieldPassword
                    name="password_confirm"
                    label="Повторите пароль"
                    placeholder="Повторите пароль"
                    rules={registerRules.passwordConfirm}
                    className={styles.field}
                  />
                  <div className={styles.consentText}>
                    Продолжая регистрацию, вы подтверждаете, что ознакомились и соглашаетесь с условиями{' '}
                    <a onClick={() => router.push('/personal-data')}>Политики обработки персональных данных</a>.
                  </div>
                  <Button htmlType="submit" block loading={submittedRegister} className={`${styles.btn_submit} btnOrange`} size="large">
                    Зарегистрироваться
                  </Button>
                  <div className={styles.switchLineRegister}>
                    <span>Уже есть аккаунт?</span>
                    <a onClick={() => setTab('login')}>Войти</a>
                  </div>
                </Form>
              ),
            },
          ]}
        />
        <div className={styles.oauthWrap}>
          <div className={styles.oauthDivider}>
            <span />или войти через<span />
          </div>

          <a href={authUrl?.auth_url} className={styles.oauthBtn}>
            <Image
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              width={20}
              height={20}
              alt=""
              unoptimized
            />
            Google
          </a>
          {/*
          <a className={styles.oauthBtn}>
            <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
              <circle cx="16" cy="16" r="16" fill="#FC3F1D" />
              <path
                d="M17.7 23.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-3.7-2.2V10.7c0-.6.5-1.1 1.1-1.1h1.8c.6 0 1.1.5 1.1 1.1v10.6c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-1.7 1.1-3.1 2.7-3.7z"
                fill="#fff"
              />
            </svg>
            Яндекс
          </a> */}
        </div>
      </div>
    </main>
  )
}

'use client'

import React, { useState } from 'react'

import { Form, Button, Steps, Input } from 'antd'
import { useRouter } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { AuthTypes } from '@/shared/types/auth/auth.interface'
import PincodeField from '@/shared/ui/pincode-field/pincode-field'
import { passwordReset, passwordResetConfirm } from '@/store/features/auth/authSlice'

import styles from './page.module.css'

export default function ResetPassword() {
  const dispatch = useAppDispatch()
  const api = useNotificationApi()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPin, setLoadingPin] = useState(false)

  const [email, setEmail] = useState('')

  const handleEmailSubmit = React.useCallback( async (data: AuthTypes.PasswordReset) => {
    setLoadingEmail(true)
    try {
      const { email } = data
      const response = await dispatch(passwordReset(data)).unwrap()

      if (response.status === 200) {
        setEmail(email)
        setStep(1)
        api.success({
          message: response.data.message,
          placement: 'top',
        })
      }
    } catch (error) {
      console.log('error', error)
      api.error({ message: 'Неизвестная ошибка. Попытайтесь снова.', placement: 'top' })
    } finally {
      setLoadingEmail(false)
    }
  }, [])

  const handleConfirmSubmit = React.useCallback( async (data: AuthTypes.PasswordResetConfirm) => {
    setLoadingPin(true)

    try {
      const response = await dispatch(passwordResetConfirm(data)).unwrap()

      if (response.status === 200 ) {
        router.push('/auth')
        api.success({
          message: 'Пароль успешно изменен',
          placement: 'top',
        })
      }

    } catch (error: any) {
      if (error?.data.non_field_errors?.[0] === 'Пароли не совпадают') {
        api.error({ message: error?.data.non_field_errors?.[0], placement: 'top' })
      } else if (error?.data.error === 'Недействительный или истекший PIN-код сброса пароля') {
        api.error({ message: error.data.error, placement: 'top' })
      } else {
        api.error({ message: 'Неизвестная ошибка. Попытайтесь снова.', placement: 'top' })
      }

    } finally {
      setLoadingPin(false)
    }
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.card}>
        <Steps
          size="small"
          current={step}
          className={styles.steps}
          items={[{ title: 'Email' }, { title: 'Новый пароль' }]}
        />

        {step === 0 && (
          <>
            <h1 className={styles.title}>Сброс пароля</h1>
            <p className={styles.subtitle}>Введите адрес электронной почты</p>

            <Form
              layout="vertical"
              size="large"
              onFinish={handleEmailSubmit}
              className={styles.form}
            >
              <Form.Item
                className={styles.formItem}
                name="email"
                rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email', message: 'Неверный формат' },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Button
                htmlType="submit"
                block
                loading={loadingEmail}
                className={`${styles.btn_submit} btnOrange`}
              >
                Отправить код
              </Button>
            </Form>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className={styles.title}>Сброс пароля</h1>
            <p className={styles.subtitle}>Код отправлен на {email}</p>

            <Form
              layout="vertical"
              size="large"
              onFinish={handleConfirmSubmit}
              className={styles.form}
            >
              <Form.Item className={styles.formItem} name="pin_code" rules={[{ required: true, message: 'Введите код' }]}>
                <PincodeField />
              </Form.Item>

              <Form.Item
                className={styles.formItem}
                name="new_password"
                rules={[
                  { required: true, message: 'Введите новый пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
              >
                <Input.Password placeholder="Новый пароль" />
              </Form.Item>

              <Form.Item
                className={styles.formItem}
                name="new_password_confirm"
                rules={[
                  { required: true, message: 'Повторите новый пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
              >
                <Input.Password placeholder="Повторите пароль" />
              </Form.Item>

              <Button
                htmlType="submit"
                block
                className={`${styles.btn_submit} btnOrange`}
                loading={loadingPin}
              >
                Сбросить пароль
              </Button>
            </Form>
          </>
        )}
      </div>
    </main>
  )
}

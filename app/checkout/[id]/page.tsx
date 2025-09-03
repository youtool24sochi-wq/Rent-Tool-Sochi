'use client'

import React from 'react'

import { Button, Form, Radio, Typography, Space, Row, Col, Card, DatePicker, Steps, Flex } from 'antd'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { CheckoutOrderIdGET, CheckoutUpdateCustomerDataPATCH, CheckoutGetContractGET, CheckoutFinalizePATCH, CheckoutCancel } from '@/services/checkout-api'
import { UserMeGET, UserMeLegalGET, UsersUpdateDataPATCH, UsersMeLegalPATCH } from '@/services/user-api'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { CheckoutTypes } from '@/shared/types/checkout/checkout.interface'
import { UsersTypes } from '@/shared/types/users/users.interface'
import { DraggerFileField } from '@/shared/ui/dragger-file-field/dragger-file-field'
import { TextField } from '@/shared/ui/textfield/textfield'
import { registerRules } from '@/shared/validation/auth/authValidate'

import Loader from '../../loading'

import styles from './page.module.css'

const { Title, Text, Link } = Typography

type CustomerType = 'individual' | 'legal'
type PaymentMethod = 'cash' | 'online'

export default function Checkout() {
  const { id } = useParams()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const router = useRouter()
  const api = useNotificationApi()

  const [order, setOrder] = React.useState<CheckoutTypes.Item | null>(null)
  const [isOrderLoading, setIsOrderLoading] = React.useState(false)

  const [customerType, setCustomerType] = React.useState<CustomerType>('individual')
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod | null>(null)
  const [offerAccepted, setOfferAccepted] = React.useState(false)
  const [paymentSelected, setPaymentSelected] = React.useState(false)

  const [me, setMe] = React.useState<UsersTypes.Individual | null>(null)
  const [meLegal, setMeLegal] = React.useState<UsersTypes.Legal | null>(null)

  const [step, setStep] = React.useState<'form' | 'contract'>('form')
  const [contractUrl, setContractUrl] = React.useState<string | null>(null)
  const [contractDownloadName, setContractDownloadName] = React.useState<string>('contract.docx')
  const [agreeContract, setAgreeContract] = React.useState(false)
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null)

  const [submitting, setSubmitting] = React.useState(false)
  const [canceling, setCanceling] = React.useState(false)

  const [form] = Form.useForm()
  const [formLegal] = Form.useForm()
  const orgTypeWatch = Form.useWatch('organization_type', formLegal) as 'LLC' | 'IP' | undefined

  const loadOrder = React.useCallback(async (orderId: string | string[] | undefined) => {
    setIsOrderLoading(true)
    try {
      const response = await CheckoutOrderIdGET(orderId)

      setOrder(response || null)
      setPaymentMethod(response.payment_method)
      if (response?.checkout_step === 'customer_data') {
        setStep('contract')
        await openContract()
      }
    } catch {
      console.log('error')
    } finally {
      setIsOrderLoading(false)
    }
  }, [])

  const loadMe = React.useCallback(async () => {
    try {
      const data = await UserMeGET()

      setMe(data)
    } catch {
      console.log('error')
    }
  }, [])

  const loadMeLegal = React.useCallback(async () => {
    try {
      const data = await UserMeLegalGET()

      setMeLegal(data)
    } catch {
      setMeLegal(null)
    }
  }, [])

  React.useEffect(() => {
    if (!isAuth) router.push('/auth')
    loadOrder(id)
    loadMe()
  }, [isAuth,id, loadMe, loadOrder])

  React.useEffect(() => {
    if (!me) return
    form.setFieldsValue({
      first_name: me.first_name,
      middle_name: me.middle_name,
      last_name: me.last_name,
      address: me.address,
      work_address: order?.work_address || me.work_address || '',
      passport_series: me.passport_series,
      passport_number: me.passport_number,
      passport_issued_by: me.passport_issued_by,
      // inn: me.inn,
      passport_issued_date: me.passport_issued_date ? dayjs(me.passport_issued_date) : undefined,
      passport_department: me.passport_department,
      birth_date: me.birth_date ? dayjs(me.birth_date) : undefined,
      birth_place: me.birth_place,
      phone_number: me.phone_number,
    })
  }, [me, order, form])

  React.useEffect(() => {
    if (customerType === 'legal' && !meLegal) {
      loadMeLegal()
    }
  }, [customerType, meLegal, loadMeLegal])

  const handleCancel = async () => {
    try {
      setCanceling(true)
      await CheckoutCancel(id)
      router.push('/')
    } catch {
      api.error({ message: 'Не удалось отменить заказ', placement: 'top' })
    } finally {
      setCanceling(false)
    }
  }

  const openContract = async () => {
    try {
      const res = await CheckoutGetContractGET(id)

      if (res?.contract_file_url) {
        const fileUrl = res.contract_file_url

        setContractUrl(fileUrl)
        const name = decodeURIComponent(fileUrl.split('/').pop() || `contract_${order?.id || ''}.docx`)

        setContractDownloadName(name)

        return
      }
      api.error({ message: 'Договор недоступен', placement: 'top' })
    } catch {
      api.error({ message: 'Не удалось получить договор', placement: 'top' })
    }
  }

  const proceedCustomerData = async (payload: { customer_data_type: CustomerType; payment_method: PaymentMethod | null; work_address?: string }) => {
    await CheckoutUpdateCustomerDataPATCH(id, payload)
    const updated = await CheckoutOrderIdGET(id)

    setOrder(updated || null)
    if (updated?.checkout_step === 'customer_data') {
      setStep('contract')
      await openContract()
    } else {
      api.error({ message: 'Шаг оформления не обновился', placement: 'top' })
    }
  }

  const submitIndividual = async () => {
    const values = await form.validateFields()

    setSubmitting(true)
    try {
      if (!offerAccepted) {
        api.warning({ message: 'Необходимо согласиться с публичной офертой', placement: 'top' })

        return
      }
      if (!paymentSelected) {
        api.warning({ message: 'Необходимо выбрать способ оплаты', placement: 'top' })

        return
      }
      if (!me?.is_complete) {

        await UsersUpdateDataPATCH({
          first_name: values.first_name,
          middle_name: values.middle_name,
          last_name: values.last_name,
          address: values.address,
          work_address: values.work_address || '',
          passport_series: values.passport_series,
          passport_number: values.passport_number,
          passport_issued_by: values.passport_issued_by,
          passport_issued_date: dayjs(values.passport_issued_date).format('YYYY-MM-DD'),
          passport_department: values.passport_department,
          birth_date: dayjs(values.birth_date).format('YYYY-MM-DD'),
          birth_place: values.birth_place,
          phone: values.phone_number,
        })
        const refreshed = await UserMeGET()

        setMe(refreshed)
        if (!refreshed.is_complete) {
          api.error({ message: 'Паспортные данные не сохранены', placement: 'top' })

          return
        }
      }
      await proceedCustomerData({
        customer_data_type: 'individual',
        payment_method: paymentMethod,
        work_address: values.work_address || '',
      })
    } catch {
      api.error({ message: 'Не удалось продолжить', placement: 'top' })
    } finally {
      setSubmitting(false)
    }
  }

  const submitLegal = async () => {
    const values = await formLegal.validateFields()

    setSubmitting(true)
    try {
      if (!offerAccepted) {
        api.warning({ message: 'Необходимо согласиться с публичной офертой', placement: 'top' })

        return
      }
      if (!paymentSelected) {
        api.warning({ message: 'Необходимо выбрать способ оплаты', placement: 'top' })

        return
      }
      if (!meLegal?.is_complete) {
        const body: any = {
          phone: values.phone,
          organization_type: values.organization_type,
          company_name: values.company_name,
          legal_address: values.legal_address,
          inn: values.inn,
          bank_account: values.bank_account,
          director_full_name: values.director_full_name,
        }

        if (values.organization_type === 'LLC') body.kpp = values.kpp
        if (values.work_address) body.work_address = values.work_address

        await UsersMeLegalPATCH(body)
        const refreshed = await UserMeLegalGET()

        setMeLegal(refreshed)
        if (!refreshed.is_complete) {
          api.error({ message: 'Данные юр. лица не сохранены', placement: 'top' })

          return
        }
      }
      await proceedCustomerData({
        customer_data_type: 'legal',
        payment_method: paymentMethod,
        work_address: values.work_address || '',
      })
    } catch {
      api.error({ message: 'Не удалось продолжить', placement: 'top' })
    } finally {
      setSubmitting(false)
    }
  }

  const finalize = async () => {
    if (!agreeContract) {
      api.warning({ message: 'Необходимо согласиться с договором', placement: 'top' })

      return
    }
    if (paymentMethod === 'online' && !receiptFile) {
      api.warning({ message: 'Приложите чек об оплате', placement: 'top' })

      return
    }

    const formData = new FormData()

    formData.append('agreement_accepted', String(order?.checkout_step === 'customer_data' ? true : false))
    formData.append('contract_accepted', String(!!agreeContract))
    if (paymentMethod === 'online' && receiptFile) {
      formData.append('receipt', receiptFile)
    }

    setSubmitting(true)
    try {
      await CheckoutFinalizePATCH(id, formData)
      api.success({ message: 'Заказ завершён', placement: 'top' })
      router.push('/profile')
    } catch {
      api.error({ message: 'Не удалось завершить заказ', placement: 'top' })
    } finally {
      setSubmitting(false)
    }
  }

  const isLocked = order?.checkout_step === 'customer_data'
  const readonlyIndividual = !!me?.is_complete || isLocked
  const readonlyLegal = !!meLegal?.is_complete || isLocked

  const showIndividualVisible = step === 'form' && customerType === 'individual'
  const showLegalVisible = step === 'form' && customerType === 'legal'

  const renderIndividualForm = () => (
    <Card className={styles.card}>
      <div className={styles.sectionHeader}>Ваши данные</div>
      <Form form={form} layout="vertical" className={styles.form}>
        <Row gutter={[16, 12]}>
          <Col xs={24} md={8}><TextField name="last_name" label="Фамилия" rules={[{ required: true }, { max: 50 }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24} md={8}><TextField name="first_name" label="Имя" rules={[{ required: true }, { max: 50 }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24} md={8}><TextField name="middle_name" label="Отчество" rules={[{ required: true }, { max: 50 }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24}><TextField name="address" label="Адрес прописки" rules={[{ required: true }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24} md={8}><TextField name="passport_series" label="Серия паспорта" maxLength={4} rules={[{ required: true }, { pattern: /^\d{4}$/, message: '4 цифры' }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24} md={8}><TextField name="passport_number" label="Номер паспорта" maxLength={6} rules={[{ required: true }, { pattern: /^\d{6}$/, message: '6 цифр' }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24} md={8}><TextField name="passport_department" label="Код подразделения" maxLength={7} rules={[{ required: true }, { pattern: /^\d{3}-\d{3}$/, message: 'Код подразделения должен быть в формате XXX-XXX' }]} readOnly={readonlyIndividual} /></Col>
          <Col xs={24}><TextField name="passport_issued_by" label="Кем выдан паспорт" rules={[{ required: true }]} readOnly={readonlyIndividual} /></Col>
          {/* <Col xs={24}><TextField name="inn" label="ИНН" maxLength={12} placeholder="ИНН" readOnly={readonlyIndividual} rules={[{ pattern: /^\d{10,12}$/, message: '10–12 цифр' }, { max: 12, message: 'Не более 12 символов' }]}/></Col> */}
          <Col xs={24} md={12}>
            <Form.Item name="passport_issued_date" label="Дата выдачи паспорта" rules={[{ required: true }]}>
              <DatePicker className={styles.picker} format="DD.MM.YYYY" disabled={readonlyIndividual} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="birth_date" label="Дата рождения" rules={[{ required: true }]}>
              <DatePicker className={styles.picker} format="DD.MM.YYYY" disabled={readonlyIndividual} />
            </Form.Item>
          </Col>
          <Col xs={24}><TextField name="birth_place" label="Место рождения" rules={[{ required: true }]} readOnly={readonlyIndividual} /></Col>
          {me?.phone_number ? null : ( <Col xs={24}><TextField name="phone_number" rules={registerRules.phone} label="Номер телефона"  /></Col>)}
          <Col xs={24}><TextField name="work_address" label="Адрес работы" readOnly={isLocked} /></Col>
        </Row>
      </Form>
    </Card>
  )

  const renderLegalForm = () => {
    const initialOrgType = (meLegal?.organization_type as 'LLC' | 'IP') || 'LLC'
    const initialValues = meLegal ? {
      phone: meLegal.phone,
      organization_type: initialOrgType,
      company_name: meLegal.company_name,
      legal_address: meLegal.legal_address,
      inn: meLegal.inn,
      kpp: initialOrgType === 'LLC' ? meLegal.kpp : undefined,
      bank_account: meLegal.bank_account,
      director_full_name: meLegal.director_full_name,
      work_address: order?.work_address || meLegal.work_address || '',
    } : undefined

    const currentOrgType = orgTypeWatch || formLegal.getFieldValue('organization_type') || 'LLC'
    const isIP = currentOrgType === 'IP'

    return (
      <Card className={styles.card}>
        <div className={styles.sectionHeader}>Данные организации</div>
        <Form
          form={formLegal}
          layout="vertical"
          className={styles.form}
          key={meLegal ? `legal-${meLegal.updated_at || meLegal.id}` : 'legal-empty'}
          initialValues={initialValues}
        >
          <Row gutter={[16, 12]}>
            {me?.phone_number ? null : (
              <Col xs={24} md={8}>
                <TextField name="phone" label="Телефон" rules={registerRules.phone} readOnly={readonlyLegal} />
              </Col>
            )}

            <Col xs={24} md={16}>
              <Form.Item name="organization_type" label="Тип организации" rules={[{ required: true }]}>
                <Radio.Group
                  disabled={readonlyLegal}
                  className={styles.segment}
                  onChange={(e) => {
                    if (e.target.value === 'IP') formLegal.setFieldValue('kpp', undefined)
                  }}
                >
                  <Radio.Button value="LLC">ООО</Radio.Button>
                  <Radio.Button style={{ marginLeft: 8 }} value="IP">ИП</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24}><TextField name="company_name" label="Название компании" rules={[{ required: true }, { max: 255 }]} readOnly={readonlyLegal} /></Col>
            <Col xs={24}><TextField name="legal_address" label="Юридический адрес" rules={[{ required: true }]} readOnly={readonlyLegal} /></Col>
            <Col xs={24} md={8}><TextField name="inn" label="ИНН" maxLength={12} rules={[{ required: true }, { pattern: /^\d{10,12}$/, message: '10–12 цифр' }]} readOnly={readonlyLegal} /></Col>

            {!isIP && (
              <Col xs={24} md={8}>
                <TextField
                  name="kpp"
                  label="КПП"
                  maxLength={9}
                  rules={[{ required: true, message: 'Обязательное поле для ООО' }, { pattern: /^\d{9}$/, message: '9 цифр' }]}
                  readOnly={readonlyLegal}
                />
              </Col>
            )}

            <Col xs={24} md={isIP ? 16 : 8}><TextField name="bank_account" label="Расчётный счёт" maxLength={20} rules={[{ required: true }, { pattern: /^\d{20}$/, message: '20 цифр' }]} readOnly={readonlyLegal} /></Col>
            <Col xs={24}><TextField name="director_full_name" label="ФИО директора/ИП" rules={[{ required: true }, { max: 255 }]} readOnly={readonlyLegal} /></Col>
            <Col xs={24}><TextField name="work_address" label="Адрес работы инструмента" readOnly={isLocked} /></Col>
          </Row>
        </Form>
      </Card>
    )
  }

  if (isOrderLoading) return <Loader />
  if (!order) return <div className="container"><Title level={3}>Заказ не найден</Title></div>

  const currentStepIndex = step === 'form' ? 0 : 1

  const goContract = async () => {
    setStep('contract')
    if (!contractUrl) await openContract()
  }

  return (
    <div className={`container ${styles.checkout}`}>
      <div className={styles.header}>
        <div>
          <Title level={3} className={styles.title}>Оформление заказа №{order.id}</Title>
          <Text className={styles.meta}>Статус: {order.status_display} • Сумма: {order.total_price}₽</Text>
        </div>
        <Button danger onClick={handleCancel} loading={canceling}>Отменить</Button>
      </div>

      <Card className={styles.card}>
        <Steps
          current={currentStepIndex}
          items={[{ title: 'Данные' }, { title: 'Договор' }, { title: 'Готово' }]}
          className={styles.steps}
        />
      </Card>

      <div className={styles.parking}>
        {!showIndividualVisible && <Form form={form} />}
        {!showLegalVisible && <Form form={formLegal} />}
      </div>

      {step === 'form' ? (
        <>
          <Card className={styles.card}>
            <div className={styles.sectionHeader}>Опции оформления</div>
            <Form layout="vertical" className={styles.formInline}>
              <Row gutter={[16, 12]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Тип клиента" required>
                    <Radio.Group
                      value={customerType}
                      onChange={async (e) => {
                        const val = e.target.value as CustomerType

                        setCustomerType(val)
                      }}
                      className={styles.segment}
                      disabled={isLocked}
                    >
                      <Flex gap={8}>
                        <Radio.Button value="individual">Физ. лицо</Radio.Button>
                        <Radio.Button value="legal">Юр. лицо</Radio.Button>
                      </Flex>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Способ оплаты" required>
                    <Radio.Group
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value); setPaymentSelected(true)
                      }}
                      className={styles.segment}
                      disabled={isLocked}
                    >
                      <Flex gap={8}>
                        <Radio.Button value="cash">Наличные</Radio.Button>
                        <Radio.Button value="online">Онлайн</Radio.Button>
                      </Flex>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label={<>Публичная оферта <Link href="/public-offer/" target="_blank">/public-offer/</Link></>} required>
                    <Radio.Group
                      value={offerAccepted ? 'yes' : undefined}
                      onChange={() => setOfferAccepted(true)}
                      disabled={isLocked}
                    >
                      <Radio value="yes">Согласен</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {customerType === 'individual' ? renderIndividualForm() : renderLegalForm()}

          <div className={styles.footer}>
            {isLocked ? (
              <Button type="primary" className="btnOrange" onClick={goContract}>
                К договору
              </Button>
            ) : (
              <Button
                type="primary"
                className="btnOrange"
                loading={submitting}
                onClick={customerType === 'individual' ? submitIndividual : submitLegal}
              >
                Продолжить
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <Card className={styles.card}>
            <div className={styles.sectionHeader}>Договор аренды</div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {contractUrl ? (
                <Space>
                  <a href={contractUrl} download={contractDownloadName}>
                    <Button>Скачать</Button>
                  </a>
                </Space>
              ) : (
                <Text>Файл договора недоступен</Text>
              )}
              <Form layout="vertical" className={styles.formInline}>
                <Form.Item label="Согласие с договором" required>
                  <Radio.Group value={agreeContract ? 'yes' : undefined} onChange={() => setAgreeContract(true)}>
                    <Radio value="yes">Согласен</Radio>
                  </Radio.Group>
                </Form.Item>
                {paymentMethod === 'online' && (
                  <>
                    <Form.Item label="Чек об оплате" required>
                      <DraggerFileField
                        beforeUpload={() => false}
                        maxCount={1}
                        onChange={(info) => {
                          const f = info?.fileList?.[0]?.originFileObj as File | undefined

                          setReceiptFile(f || null)
                        }}
                        onRemove={() => {
                          setReceiptFile(null)

                          return true
                        }}
                      />
                    </Form.Item>
                    <Form.Item label={false}>
                      <div className={styles.requisites}>
                        <p><span>Получатель:</span> Валерий Николаевич</p>
                        <p><span>Банк:</span> Озон Банк</p>
                        <p><span>Номер счёта:</span> 89996555139</p>
                        <p><span>Назначение:</span> Оплата заказа</p>
                      </div>
                    </Form.Item>
                  </>
                )}
              </Form>
            </Space>
          </Card>

          <div className={styles.footer}>
            <Button onClick={() => setStep('form')}>Назад</Button>
            <Space>
              <Button type="primary" className="btnOrange" loading={submitting} onClick={finalize}>Завершить</Button>
            </Space>
          </div>
        </>
      )}
    </div>
  )
}

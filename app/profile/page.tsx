'use client'

import React from 'react'

import {
  UserOutlined,
  ProfileOutlined,
  StarOutlined,
  FileTextOutlined,
  SettingOutlined,
  CalendarOutlined,
  ShopOutlined,
  SendOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import {
  Tabs,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Row,
  Col,
  Descriptions,
  Progress,
  Table,
  Flex,
  Avatar,
  Grid,
  Segmented,
  Form,
  Input,
  DatePicker,
  Select,
  Empty,
  Tooltip,
} from 'antd'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { FavoriteGET } from '@/services/favorites-api'
import { UserMeGET, UserMeLegalGET, UsersUpdateDataPATCH, UsersMeLegalPATCH, UsersOrdersGET } from '@/services/user-api'
import { noPhoto } from '@/shared/assets/images'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { FavoritesTypes } from '@/shared/types/favorites/favorites.interface'
import { UsersTypes } from '@/shared/types/users/users.interface'
import { DraggerFileField } from '@/shared/ui/dragger-file-field/dragger-file-field'

import Loader from '../loading'

import styles from './page.module.css'

const { Title, Text } = Typography

const stagger = { show: { transition: { staggerChildren: 0.12 } } }
const fadeInUp: any = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function fmtDate(d?: string) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')

  if (!y || !m || !day) return d

  return `${day}.${m}.${y}`
}

export default function Profile() {
  const router = useRouter()
  const screens = Grid.useBreakpoint()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isMd = mounted ? !!screens.md : false
  const tabPosition = isMd ? 'left' : 'top'
  const api = useNotificationApi()

  const isAuth = useAppSelector((s) => s.auth.user !== null)
  const [user, setUser] = React.useState<UsersTypes.Individual | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [party, setParty] = React.useState<'individual' | 'legal'>('individual')
  const [legal, setLegal] = React.useState<UsersTypes.Legal | null>(null)
  const [loadingLegal, setLoadingLegal] = React.useState(false)
  const [orders, setOrders] = React.useState<UsersTypes.Order[]>()
  const [isOrdersLoading, setIsOrdersLoading] = React.useState(false)
  const [ordersLoaded, setOrdersLoaded] = React.useState(false)
  const [favorites, setFavorites] = React.useState<FavoritesTypes.FavoritesResponse>()
  const [isFavoritesLoading, setIsFavoritesLoading] = React.useState(false)
  const [favoritesLoaded, setFavoritesLoaded] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('profile')

  const [editingProfile, setEditingProfile] = React.useState(false)
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [editingIndividual, setEditingIndividual] = React.useState(false)
  const [savingIndividual, setSavingIndividual] = React.useState(false)
  const [editingLegal, setEditingLegal] = React.useState(false)
  const [savingLegal, setSavingLegal] = React.useState(false)

  const [formProfile] = Form.useForm()
  const [formIndividual] = Form.useForm()
  const [formLegal] = Form.useForm()

  const [avatarAction, setAvatarAction] = React.useState<'keep' | 'remove' | 'replace'>('keep')

  const avatarUrl = React.useMemo<string | null>(() => {
    const a = user?.avatar

    if (!a) return null

    return /^https?:\/\//.test(a) ? a : `https://api.renttoolspeed.ru${a}`
  }, [user?.avatar])

  const loadUserIndividual = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await UserMeGET()

      setUser(response)
    } catch {
      api.error({ message: 'Не удалось загрузить профиль', placement: 'top' })
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUserLegal = React.useCallback(async () => {
    setLoadingLegal(true)
    try {
      const response = await UserMeLegalGET()

      setLegal(response)
    } catch {
      api.error({ message: 'Не удалось загрузить данные юр. лица', placement: 'top' })
    } finally {
      setLoadingLegal(false)
    }
  }, [])

  const loadUsersOrders = React.useCallback(async () => {
    setIsOrdersLoading(true)
    try {
      const response = await UsersOrdersGET()

      if (response) setOrders(response)
      setOrdersLoaded(true)
    } catch {
      api.error({ message: 'Не удалось загрузить данные заказов', placement: 'top' })
    } finally {
      setIsOrdersLoading(false)
    }
  }, [])

  const loadUsersFavorites = React.useCallback(async () => {
    setIsFavoritesLoading(true)
    try {
      const response: any = await FavoriteGET()

      setFavorites(response?.data)
      setFavoritesLoaded(true)
    } catch {
      api.error({ message: 'Не удалось загрузить избранное', placement: 'top' })
    } finally {
      setIsFavoritesLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!isAuth) return
    loadUserIndividual()
  }, [isAuth, loadUserIndividual])

  React.useEffect(() => {
    if (party === 'legal' && isAuth && !legal && !loadingLegal) loadUserLegal()
  }, [party, isAuth, legal, loadingLegal, loadUserLegal])

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!isAuth) router.replace('/auth')
    }, 0)

    return () => clearTimeout(t)
  }, [isAuth, router])

  React.useEffect(() => {
    if (editingProfile && user) {
      formProfile.setFieldsValue({
        last_name: user.last_name || '',
        name: user.name || user.first_name || '',
        middle_name: user.middle_name || '',
        address: user.address || '',
      })
    }
  }, [editingProfile, user, formProfile])

  React.useEffect(() => {
    if (editingIndividual && user) {
      formIndividual.setFieldsValue({
        passport_series: user.passport_series || '',
        passport_number: user.passport_number || '',
        passport_issued_by: user.passport_issued_by || '',
        passport_issued_date: user.passport_issued_date ? dayjs(user.passport_issued_date) : null,
        passport_department: user.passport_department || '',
        birth_date: user.birth_date ? dayjs(user.birth_date) : null,
        birth_place: user.birth_place || '',
        address: user.address || '',
      })
    }
  }, [editingIndividual, user, formIndividual])

  React.useEffect(() => {
    if (editingLegal) {
      formLegal.setFieldsValue({
        organization_type: legal?.organization_type || 'LLC',
        company_name: legal?.company_name || '',
        legal_address: legal?.legal_address || '',
        kpp: legal?.kpp || '',
        inn: legal?.inn || '',
        bank_account: legal?.bank_account || '',
        director_full_name: legal?.director_full_name || '',
      })
    }
  }, [editingLegal, legal, formLegal])

  const profileFill = Math.min(
    100,
    [
      user?.name || user?.first_name,
      user?.last_name,
      user?.phone_number,
      user?.address,
      user?.passport_series,
      user?.passport_number,
    ].filter(Boolean).length * 12,
  )

  const isIndividual = party === 'individual'
  const isLegal = party === 'legal'
  const hasIndividual = Boolean(user?.is_complete)
  const hasLegal = Boolean(legal?.is_complete)
  const legalUpdated = legal?.updated_at ? fmtDate(legal.updated_at.slice(0, 10)) : '—'

  const normalizeStatus = React.useCallback((s?: string) => (s || '').toLowerCase(), [])
  const isDraft = React.useCallback((o: UsersTypes.Order) => normalizeStatus(o.status) === 'draft', [normalizeStatus])

  const draftOrders = React.useMemo(
    () => (orders || []).filter(isDraft).sort((a, b) => a.id - b.id),
    [orders, isDraft],
  )
  const tableOrders = React.useMemo(
    () =>
      (orders || [])
        .filter((o) => !isDraft(o))
        .sort((a, b) => dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf()),
    [orders, isDraft],
  )

  const getOrderThumb = (o: UsersTypes.Order) => {
    const img = o.items?.[0]?.tool?.main_image

    return img || noPhoto
  }
  const getOrderTitle = (o: UsersTypes.Order) => o.items?.[0]?.tool?.name || 'Заказ'
  const getOrderDueText = (o: UsersTypes.Order) => {
    if (o.end_date) return `Аренда до ${fmtDate(o.end_date.slice(0, 10))}`
    if (o.start_date) return `Создан ${fmtDate(o.start_date.slice(0, 10))}`

    return '—'
  }
  const getStatusTag = (o: UsersTypes.Order) => {
    const text = o.status_display || o.status || ''

    return <Tag className={styles.tagOrange}>{text}</Tag>
  }

  const getToolNames = (o: UsersTypes.Order) =>
    (o.items || [])
      .map((it) => it.tool?.name || `Товар #${it.id}`)
      .filter(Boolean)

  const renderToolsCell = (_: any, record: { source: UsersTypes.Order }) => {
    const names = getToolNames(record.source)
    const shown = names.slice(0, 3)
    const rest = names.slice(3)

    return (
      <Space wrap size={6}>
        {shown.map((n, i) => (
          <Tag key={`${record.source.id}-${i}`} className={styles.tagMuted}>{n}</Tag>
        ))}
        {rest.length > 0 && (
          <Tooltip
            placement="top"
            title={(
              <Space direction="vertical" size={2}>
                {rest.map((n, i) => (
                  <Text key={`${record.source.id}-rest-${i}`} className={styles.subMuted}>{n}</Text>
                ))}
              </Space>
            )}
          >
            <Tag className={styles.tagSoft}>+{rest.length} ещё</Tag>
          </Tooltip>
        )}
      </Space>
    )
  }

  const ordersTableData = React.useMemo(
    () =>
      tableOrders.map((item) => {
        const period =
          item.start_date && item.end_date
            ? `${fmtDate(item.start_date.slice(0, 10))} — ${fmtDate(item.end_date.slice(0, 10))}`
            : '—'
        const sum = typeof item.total_price === 'number' ? `${item.total_price.toLocaleString('ru-RU')} ₽` : '—'
        const statusText = item.status_display || item.status || '—'
        const status = item.status || '-'

        return { key: item.id, period, sum, statusText, source: item, status }
      }),
    [tableOrders],
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'orders' && isAuth && !ordersLoaded && !isOrdersLoading) loadUsersOrders()
    if (value === 'favorites' && isAuth && !favoritesLoaded && !isFavoritesLoading) loadUsersFavorites()
  }

  if (loading) return <Loader />

  return (
    <div className={styles.page}>
      <div className={styles.ellipseLeft} aria-hidden />
      <div className={styles.ellipseRight} aria-hidden />
      <svg className={styles.bgOrbs} viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" aria-hidden>
        <circle cx="200" cy="200" r="60">
          <animate attributeName="cy" values="200;300;200" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1200" cy="700" r="80">
          <animate attributeName="cy" values="700;600;700" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="800" cy="400" r="40">
          <animate attributeName="cx" values="800;900;800" dur="7s" repeatCount="indefinite" />
        </circle>
      </svg>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} className={styles.wrap}>
        <motion.div variants={fadeInUp}>
          <Card bordered className={styles.hero}>
            <Flex align={isMd ? 'center' : 'start'} justify="space-between" className={styles.heroHead}>
              <Flex align="center" gap={12} className={styles.heroHeadLeft}>
                <UserOutlined className={styles.heroIcon} />
                <Title level={2} className={styles.heroTitle}>Личный кабинет</Title>
                <Tag className={styles.softTag}>Проверен</Tag>
              </Flex>
              <Space className={styles.heroHeadRight}>
                <Tag className={styles.idTag}><span suppressContentEditableWarning>ID: {(user?.id || 0).toString().padStart(6, '0')}</span></Tag>
              </Space>
            </Flex>

            <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
              <Col xs={24} md={14}>
                <Card bordered className={styles.userCard}>
                  {!editingProfile && (
                    <Space direction="vertical" style={{ width: '100%' }} size={14}>
                      <Flex align="center" gap={14} className={styles.userRow}>
                        {avatarUrl ? (
                          <Avatar src={avatarUrl ?? undefined} size={isMd ? 72 : 56} className={styles.avatar} />
                        ) : (
                          <Avatar icon={<UserOutlined />} size={isMd ? 72 : 56} className={styles.avatar} />
                        )}
                        <Space direction="vertical" size={2} className={styles.userText}>
                          <Title level={4} className={styles.blockTitle}>{user?.full_name || user?.email || 'Пользователь'}</Title>
                          <Text className={styles.subMuted}>{user?.email || '—'}</Text>
                        </Space>
                      </Flex>
                      <Descriptions column={isMd ? 2 : 1} className={styles.desc}>
                        <Descriptions.Item label="Телефон">{user?.phone_number || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Адрес">{user?.address || '—'}</Descriptions.Item>
                      </Descriptions>
                      <Space wrap className={styles.ctaRow}>
                        <Button icon={<ShopOutlined />} onClick={() => router.push('/catalog')} className={styles.btnGhost}>В каталог</Button>
                        <Button onClick={() => handleTabChange('orders')} icon={<CalendarOutlined />} className={styles.btnDark}>Мои заказы</Button>
                        <Button icon={<UserOutlined />} className={styles.btnWhite} onClick={() => {
                          setEditingProfile(true); setActiveTab('profile')
                        }}
                        >Редактировать</Button>
                      </Space>
                    </Space>
                  )}

                  {editingProfile && (
                    <div className={styles.editCard}>
                      <Flex gap={10} vertical className={styles.editHead}>
                        <Title level={4} className={styles.blockTitleSmall}>Редактирование профиля</Title>
                        <Tag className={styles.tagMuted}>Доступно: имя, фамилия, отчество, адрес, фото</Tag>
                      </Flex>
                      <Form form={formProfile} layout="vertical" className={styles.editForm} requiredMark={false}>
                        <Row gutter={[12, 12]}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="last_name"
                              label="Фамилия"
                              rules={[{ required: true, message: 'Введите фамилию' }, { max: 50, message: 'До 50 символов' }]}
                            >
                              <Input placeholder="Иванов" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="name"
                              label="Имя"
                              rules={[{ required: true, message: 'Введите имя' }, { max: 50, message: 'До 50 символов' }]}
                            >
                              <Input placeholder="Иван" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="middle_name"
                              label="Отчество"
                              rules={[{ max: 50, message: 'До 50 символов' }]}
                            >
                              <Input placeholder="Иванович" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="address"
                              label="Адрес"
                              rules={[{ max: 255, message: 'До 255 символов' }]}
                            >
                              <Input placeholder="г. Бишкек, ул. ..." />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <DraggerFileField
                              name="avatar"
                              label="Аватар"
                              multiple={false}
                              maxCount={1}
                              listType="picture"
                              accept="image/*"
                              beforeUpload={() => false}
                              onChange={(info) => {
                                const list = info?.fileList || []

                                if (!list.length) {
                                  setAvatarAction('remove')

                                  return
                                }
                                const hasNew = list.some((f: any) => !!f.originFileObj)

                                setAvatarAction(hasNew ? 'replace' : 'keep')
                              }}
                              deleteFunc={() => {
                                setAvatarAction('remove')
                              }}
                            />
                          </Col>
                        </Row>
                      </Form>
                      <Flex align="center" justify="end" gap={8} className={styles.editBar}>
                        <Button className={styles.btnWhite} onClick={() => {
                          setEditingProfile(false); setAvatarAction('keep'); formProfile.resetFields()
                        }}
                        >Отменить</Button>
                        <Button className={styles.btnPrimary} loading={savingProfile} onClick={async () => {
                          try {
                            setSavingProfile(true)
                            const values = await formProfile.validateFields()
                            const payloadKeys: Array<keyof UsersTypes.Individual> = ['last_name', 'middle_name', 'name', 'address']
                            const hasNewFile =
                              Array.isArray(values.avatar) && values.avatar.some((f: any) => !!f.originFileObj)

                            if (avatarAction === 'replace' && hasNewFile) {
                              const fd = new FormData()

                              payloadKeys.forEach((k) => {
                                if (values[k] !== undefined && values[k] !== null) fd.append(k, values[k])
                              })
                              const fileItem = values.avatar.find((f: any) => !!f.originFileObj)

                              fd.append('avatar', fileItem.originFileObj)
                              await UsersUpdateDataPATCH(fd as any)
                            } else {
                              const data: Partial<UsersTypes.Individual> = {}

                              payloadKeys.forEach((k) => {
                                if (values[k] !== undefined) (data as any)[k] = values[k]
                              })
                              if (avatarAction === 'remove') {
                                data.avatar = null
                              }
                              await UsersUpdateDataPATCH(data)
                            }
                            await loadUserIndividual()
                            setEditingProfile(false)
                            setAvatarAction('keep')
                            api.success({ message: 'Профиль обновлён', placement: 'top' })
                          } catch {
                            api.error({ message: 'Не удалось сохранить профиль', placement: 'top' })
                          } finally {
                            setSavingProfile(false)
                          }
                        }}
                        >Сохранить</Button>
                      </Flex>
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} md={10}>
                <Card bordered className={styles.progressCard}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Flex align="center" gap={8}>
                      <Tag className={styles.badgeDark}>Заполненность профиля</Tag>
                      <Text className={styles.subMuted}> <span suppressHydrationWarning>{profileFill}%</span></Text>
                    </Flex>
                    <Progress percent={profileFill} showInfo={false} className={styles.progress} />
                    <Text className={styles.subMuted}>Заполните документы полностью для полного доступа к сервису</Text>
                    <Button onClick={() => setActiveTab('docs')} className={styles.btnPrimary}>Загрузить документы</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} className={styles.tabsWrap}>
          <Tabs
            tabPosition={tabPosition}
            className={styles.tabs}
            activeKey={activeTab}
            more={{ icon: null }}
            onChange={handleTabChange}
            items={[
              {
                key: 'profile',
                label: <Flex align="center" gap={8}><UserOutlined /><span>Профиль</span></Flex>,
                children: (
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} lg={12}>
                        <Card bordered className={styles.blockCard}>
                          <Title level={4} className={styles.blockTitle}>Контакты</Title>
                          <Descriptions column={1} className={styles.desc}>
                            <Descriptions.Item label="ФИО">{user?.full_name || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Телефон">{user?.phone_number || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Адрес">{user?.address || '—'}</Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                    </Row>
                  </Space>
                ),
              },
              {
                key: 'orders',
                label: <Flex align="center" gap={8}><ProfileOutlined /><span>Заказы</span></Flex>,
                children: (
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {isOrdersLoading && !ordersLoaded ? (
                      <Loader />
                    ) : (
                      <>
                        <Row gutter={[12, 12]}>
                          {draftOrders.length ? (
                            draftOrders.map((item) => (
                              <Col xs={24} md={12} key={item.id}>
                                <Card bordered className={styles.orderCard}>
                                  <Flex align="center" gap={12} className={styles.orderHead}>
                                    <Image src={getOrderThumb(item)} alt="" unoptimized className={styles.thumb} />
                                    <Space size={0} direction="vertical" className={styles.orderText}>
                                      <Text className={styles.orderTitle}>{getOrderTitle(item)}</Text>
                                      <Text className={styles.subMuted}>{getOrderDueText(item)}</Text>
                                      {getStatusTag(item)}
                                    </Space>
                                  </Flex>
                                  <Space wrap style={{ marginTop: 12 }}>
                                    <Button onClick={() => router.replace(`/checkout/${item.id}`)} className={styles.btnPrimary}>Перейти</Button>
                                  </Space>
                                </Card>
                              </Col>
                            ))
                          ) : (
                            <Col span={24}>
                              <Card bordered className={styles.blockCard}>
                                <Empty description="Нет черновиков заказов" />
                              </Card>
                            </Col>
                          )}
                        </Row>

                        <Card bordered className={styles.blockCard}>
                          <Title level={4} className={styles.blockTitle}>История заказов</Title>
                          <div className={styles.tableScroll}>
                            <Table
                              size="middle"
                              pagination={false}
                              className={styles.table}
                              loading={isOrdersLoading && ordersLoaded}
                              scroll={{ x: 520 }}
                              columns={[
                                {
                                  title: 'Инструменты',
                                  dataIndex: 'source',
                                  key: 'tools',
                                  render: renderToolsCell,
                                },
                                { title: 'Период', dataIndex: 'period', key: 'period' },
                                { title: 'Сумма', dataIndex: 'sum', key: 'sum' },
                                {
                                  title: 'Статус',
                                  dataIndex: 'statusText',
                                  key: 'status',
                                  render: (item: any) => (
                                    <Tooltip title={item === 'На проверке' ? 'Ваш заказ находится на проверке у менеджера' : null}>
                                      <Tag className={styles.tagOrange}>{item}</Tag>
                                    </Tooltip>
                                  ),
                                },
                              ]}
                              dataSource={ordersTableData}
                              locale={{ emptyText: <Empty description="История пуста" /> }}
                            />
                          </div>
                        </Card>
                        <Card bordered className={`${styles.blockCard} ${styles.helpCard}`}>
                          <Flex align="center" justify="space-between" gap={16} wrap className={styles.helpRow}>
                            <Space direction="vertical" size={4}>
                              <Title level={4} className={styles.blockTitle}>Вопросы или проблемы с заказом?</Title>
                              <Text className={styles.subMuted}>Напишите нам в удобном мессенджере — отвечаем оперативно.</Text>
                            </Space>

                            <Space wrap size={[8, 8]} className={styles.contactBtns}>
                              <Link
                                href="https://t.me/YouToolSochi"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Открыть чат в Telegram @YouToolSochi"
                                title="Telegram: @YouToolSochi"
                                className={`${styles.btnGhost} ${styles.contactBtn}`}
                              >
                                <SendOutlined/> <span>@YouToolSochi</span>
                              </Link>

                              <Link
                                href="https://wa.me/79996555139"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Открыть чат в WhatsApp на номер +7 999 655-51-39"
                                title="WhatsApp: +7 (999) 655-51-39"
                                className={`${styles.btnPrimary} ${styles.contactBtn}`}
                              >
                                <WhatsAppOutlined /> <span>+7 (999) 655-51-39</span>
                              </Link>
                            </Space>
                          </Flex>
                        </Card>
                      </>
                    )}
                  </Space>
                ),
              },
              {
                key: 'favorites',
                label: <Flex align="center" gap={8}><StarOutlined /><span>Избранное</span></Flex>,
                children: (
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {isFavoritesLoading && !favoritesLoaded ? (
                      <Loader />
                    ) : (
                      <Row gutter={[12, 12]}>
                        {(favorites?.favorites || []).length ? (
                          favorites!.favorites.map((f) => (
                            <Col xs={24} md={12} key={f.tool_id}>
                              <Card bordered className={styles.favoriteCard}>
                                <Flex align="center" gap={14} className={styles.favoriteRow}>
                                  <Image src={f.main_image || noPhoto} alt="" unoptimized className={styles.favoriteImg} />
                                  <Space size={0} direction="vertical" style={{ flex: 1 }} className={styles.favoriteText}>
                                    <Text className={styles.favoriteTitle}>{f.name}</Text>
                                    <Text className={styles.favoriteDesc}>{f.description}</Text>
                                  </Space>
                                  <Link href={`/catalog/${f.tool_id}`}>
                                    <Button className={styles.btnPrimary}>Подробнее</Button>
                                  </Link>
                                </Flex>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Col span={24}>
                            <Card bordered className={styles.blockCard}>
                              <Empty description="Список избранного пуст" />
                            </Card>
                          </Col>
                        )}
                      </Row>
                    )}
                  </Space>
                ),
              },
              {
                key: 'docs',
                label: <Flex align="center" gap={8}><FileTextOutlined /><span>Документы</span></Flex>,
                children: (
                  <Row gutter={[12, 12]}>
                    <Col xs={24} lg={16}>
                      <Card bordered className={styles.filesCard}>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                            <Flex align="center" gap={12}>
                              <UserOutlined className={styles.statIcon} />
                              <Title level={4} className={styles.blockTitle}>Ваши данные</Title>
                            </Flex>
                            <Segmented
                              value={party}
                              onChange={(v) => setParty(v as 'individual' | 'legal')}
                              options={[
                                { label: 'Физ. лицо', value: 'individual' },
                                { label: 'Юр. лицо', value: 'legal' },
                              ]}
                            />
                          </Flex>

                          {isIndividual && (
                            <>
                              {!editingIndividual && (
                                <>
                                  <Descriptions column={1} className={styles.desc}>
                                    <Descriptions.Item label="ФИО">{user?.full_name || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Паспорт: серия">{user?.passport_series || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Паспорт: номер">{user?.passport_number || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Кем выдан">{user?.passport_issued_by || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Дата выдачи">{fmtDate(user?.passport_issued_date)}</Descriptions.Item>
                                    <Descriptions.Item label="Код подразделения">{user?.passport_department || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Дата рождения">{fmtDate(user?.birth_date)}</Descriptions.Item>
                                    <Descriptions.Item label="Место рождения">{user?.birth_place || '—'}</Descriptions.Item>
                                    {/* <Descriptions.Item label="ИНН">{user?.inn || '—'}</Descriptions.Item> */}
                                    <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Телефон">{user?.phone_number || '—'}</Descriptions.Item>
                                  </Descriptions>
                                  <Space wrap>
                                    <Button className={styles.btnGhost} icon={<UserOutlined />} onClick={() => setEditingIndividual(true)}>
                                      {hasIndividual ? 'Изменить данные' : 'Добавить данные'}
                                    </Button>
                                  </Space>
                                </>
                              )}

                              {editingIndividual && (
                                <div className={styles.editCard}>
                                  <Title level={5} className={styles.blockTitleSmall}>Данные физ. лица</Title>
                                  <Form form={formIndividual} layout="vertical" className={styles.editForm} requiredMark={false}>
                                    <Row gutter={[12, 12]}>
                                      <Col xs={12} md={8}>
                                        <Form.Item
                                          name="passport_series"
                                          label="Серия"
                                          rules={[{ pattern: /^\d{4}$/, message: '4 цифры' }, { max: 4, message: 'Не более 4 символов' }]}
                                        >
                                          <Input placeholder="ID/АН" maxLength={4} />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={12} md={8}>
                                        <Form.Item
                                          name="passport_number"
                                          label="Номер"
                                          rules={[{ pattern: /^\d{6}$/, message: '6 цифр' }, { max: 6, message: 'Не более 6 символов' }]}
                                        >
                                          <Input placeholder="123456" maxLength={6} />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={8}>
                                        <Form.Item
                                          name="passport_department"
                                          label="Код подразделения"
                                          rules={[{ pattern: /^\d{3}-\d{3}$/, message: 'Формат XXX-XXX' }, { max: 7, message: 'Не более 7 символов' }]}
                                        >
                                          <Input placeholder="000-000" maxLength={7} />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="passport_issued_by"
                                          label="Кем выдан"
                                          rules={[{ required: true, message: 'Укажите кем выдан' }]}
                                        >
                                          <Input placeholder="ГУВД ..." />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="passport_issued_date"
                                          label="Дата выдачи"
                                          rules={[{ required: true, message: 'Укажите дату выдачи' }]}
                                        >
                                          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="birth_date"
                                          label="Дата рождения"
                                          rules={[{ required: true, message: 'Укажите дату рождения' }]}
                                        >
                                          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="birth_place"
                                          label="Место рождения"
                                          rules={[{ required: true, message: 'Укажите место рождения' }]}
                                        >
                                          <Input placeholder="г. ..." />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24}>
                                        <Form.Item
                                          name="address"
                                          label="Адрес проживания"
                                          rules={[{ required: true, message: 'Укажите адрес' }]}
                                        >
                                          <Input placeholder="г. Бишкек, ул. ..." />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Form>
                                  <Flex align="center" justify="end" gap={8} className={styles.editBar}>
                                    <Button className={styles.btnWhite} onClick={() => {
                                      setEditingIndividual(false); formIndividual.resetFields()
                                    }}
                                    >Отменить</Button>
                                    <Button className={styles.btnPrimary} loading={savingIndividual} onClick={async () => {
                                      try {
                                        setSavingIndividual(true)
                                        const values = await formIndividual.validateFields()
                                        const data: Partial<UsersTypes.Individual> = {
                                          passport_series: values.passport_series,
                                          passport_number: values.passport_number,
                                          passport_issued_by: values.passport_issued_by,
                                          passport_issued_date: values.passport_issued_date ? values.passport_issued_date.format('YYYY-MM-DD') : undefined,
                                          passport_department: values.passport_department,
                                          birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : undefined,
                                          birth_place: values.birth_place,
                                          address: values.address,
                                        }

                                        await UsersUpdateDataPATCH(data)
                                        await loadUserIndividual()
                                        setEditingIndividual(false)
                                        api.success({ message: 'Данные обновлены', placement: 'top' })
                                      } catch {
                                        api.error({ message: 'Не удалось сохранить данные', placement: 'top' })
                                      } finally {
                                        setSavingIndividual(false)
                                      }
                                    }}
                                    >Сохранить</Button>
                                  </Flex>
                                </div>
                              )}
                            </>
                          )}

                          {isLegal && (
                            <>
                              {!editingLegal && (
                                <>
                                  <Descriptions column={1} className={styles.desc}>
                                    <Descriptions.Item label="Тип организации">{legal?.organization_type || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Наименование">{legal?.company_name || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{legal?.email || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Телефон">{legal?.phone || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Юр. адрес">{legal?.legal_address || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="ИНН">{legal?.inn || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="КПП">{legal?.kpp || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Расчётный счёт">{legal?.bank_account || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="ФИО директора">{legal?.director_full_name || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Обновлено">{legalUpdated}</Descriptions.Item>
                                  </Descriptions>
                                  <Space wrap>
                                    <Button className={styles.btnGhost} icon={<UserOutlined />} disabled={loadingLegal} onClick={() => setEditingLegal(true)}>
                                      {hasLegal ? 'Изменить данные' : 'Добавить данные'}
                                    </Button>
                                  </Space>
                                </>
                              )}

                              {editingLegal && (
                                <div className={styles.editCard}>
                                  <Title level={5} className={styles.blockTitleSmall}>Данные юр. лица</Title>
                                  <Form form={formLegal} layout="vertical" className={styles.editForm} requiredMark={false}>
                                    <Row gutter={[12, 12]}>
                                      <Col xs={24} md={12}>
                                        <Form.Item name="organization_type" label="Тип организации" initialValue="LLC" rules={[{ required: true, message: 'Выберите тип' }]}>
                                          <Select
                                            options={[
                                              { value: 'LLC', label: 'LLC' },
                                              { value: 'IP', label: 'IP' },
                                            ]}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="company_name"
                                          label="Наименование"
                                          rules={[{ required: true, message: 'Укажите наименование' }, { max: 255, message: 'До 255 символов' }]}
                                        >
                                          <Input placeholder="ООО «Ромашка»" />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="legal_address"
                                          label="Юридический адрес"
                                          rules={[{ required: true, message: 'Укажите юр. адрес' }]}
                                        >
                                          <Input placeholder="Адрес" />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          noStyle
                                          shouldUpdate={(p, c) => p.organization_type !== c.organization_type || p.kpp !== c.kpp}
                                        >
                                          {({ getFieldValue }) => {
                                            const isLLC = getFieldValue('organization_type') === 'LLC'

                                            return (
                                              <Form.Item
                                                name="kpp"
                                                label="КПП"
                                                rules={[
                                                  ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                      const need = getFieldValue('organization_type') === 'LLC'

                                                      if (!need && !value) return Promise.resolve()
                                                      if (need && !value) return Promise.reject(new Error('Обязательное поле для ООО'))
                                                      if (value && !/^\d{9}$/.test(value)) return Promise.reject(new Error('9 цифр'))

                                                      return Promise.resolve()
                                                    },
                                                  }),
                                                ]}
                                              >
                                                <Input maxLength={9} disabled={!isLLC} />
                                              </Form.Item>
                                            )
                                          }}
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item
                                          name="bank_account"
                                          label="Расчётный счёт"
                                          rules={[{ required: true, message: 'Укажите счёт' }, { pattern: /^\d{20}$/, message: '20 цифр' }, { max: 20, message: 'До 20 символов' }]}
                                        >
                                          <Input maxLength={20} />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} md={12}>
                                        <Form.Item name="inn" label="ИНН" rules={[{ pattern: /^\d{10,12}$/, message: '10–12 цифр' }, { max: 12, message: 'Не более 12 символов' }]} >
                                          <Input placeholder="ИНН" maxLength={12} />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24}>
                                        <Form.Item
                                          name="director_full_name"
                                          label="ФИО директора"
                                          rules={[{ required: true, message: 'Укажите ФИО' }, { max: 255, message: 'До 255 символов' }]}
                                        >
                                          <Input />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Form>
                                  <Flex align="center" justify="end" gap={8} className={styles.editBar}>
                                    <Button className={styles.btnWhite} onClick={() => {
                                      setEditingLegal(false); formLegal.resetFields()
                                    }}
                                    >Отменить</Button>
                                    <Button className={styles.btnPrimary} loading={savingLegal} onClick={async () => {
                                      try {
                                        setSavingLegal(true)
                                        const values = await formLegal.validateFields()
                                        const data: Partial<UsersTypes.Legal> = {
                                          organization_type: values.organization_type,
                                          company_name: values.company_name,
                                          legal_address: values.legal_address,
                                          inn: values.inn,
                                          kpp: values.kpp,
                                          bank_account: values.bank_account,
                                          director_full_name: values.director_full_name,
                                        }

                                        await UsersMeLegalPATCH(data as UsersTypes.Legal)
                                        await loadUserLegal()
                                        setEditingLegal(false)
                                        api.success({ message: 'Данные юр. лица обновлены', placement: 'top' })
                                      } catch {
                                        api.error({ message: 'Не удалось сохранить данные юр. лица', placement: 'top' })
                                      } finally {
                                        setSavingLegal(false)
                                      }
                                    }}
                                    >Сохранить</Button>
                                  </Flex>
                                </div>
                              )}
                            </>
                          )}
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'settings',
                label: <Flex align="center" gap={8}><SettingOutlined /><span>Настройки</span></Flex>,
                children: (
                  <Card bordered className={styles.blockCardWide}>
                    <Title level={4} className={styles.blockTitle}>Настройки профиля</Title>
                    <Flex align="center" justify="space-between" className={styles.settingRow}>
                      <Text className={styles.settingTitle}>Прочие настройки</Text>
                      <Space wrap>
                        <Button onClick={() => router.push('/auth/reset-password')} className={styles.btnWhite}>Изменить пароль</Button>
                      </Space>
                    </Flex>
                  </Card>
                ),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

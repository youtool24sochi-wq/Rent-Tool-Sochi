'use client'

import React from 'react'

import { FileTextOutlined, DownloadOutlined, UserOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons'
import { Typography, Card, Descriptions, Button, Space, Tabs, Tag, Divider, Row, Col, Flex, Segmented } from 'antd'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { UserMeGET, UserMeLegalGET } from '@/services/user-api'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { UsersTypes } from '@/shared/types/users/users.interface'

import styles from './page.module.css'

const { Title, Paragraph, Text } = Typography

const stagger = { show: { transition: { staggerChildren: 0.15 } } }
const fadeInUp: any = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

function fmtDate(d?: string) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')

  if (!y || !m || !day) return d

  return `${day}.${m}.${y}`
}

export default function PublicOffer() {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.isAuth)
  const [user, setUser] = React.useState<UsersTypes.Individual | null>(null)
  const [legal, setLegal] = React.useState<UsersTypes.Legal | null>(null)
  const [party, setParty] = React.useState<'individual' | 'legal'>('individual')
  const initRef = React.useRef(false)
  const handleClick = () => router.push(isAuth ? '/profile' : '/auth')

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      const [meRes, meLegalRes] = await Promise.allSettled([UserMeGET(), UserMeLegalGET()])

      if (!mounted) return
      if (meRes.status === 'fulfilled') setUser(meRes.value || null)
      if (meLegalRes.status === 'fulfilled') setLegal(meLegalRes.value || null)
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    if (initRef.current) return
    if (legal?.is_complete) {
      setParty('legal')
      initRef.current = true

      return
    }
    if (user?.is_complete) {
      setParty('individual')
      initRef.current = true
    }
  }, [user, legal])

  const isIndividual = party === 'individual'
  const isLegal = party === 'legal'
  const hasIndividual = Boolean(user?.is_complete)
  const hasLegal = Boolean(legal?.is_complete)

  const individualFullName =
    user && [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(' ')

  const legalUpdated = legal?.updated_at ? fmtDate(legal.updated_at.slice(0, 10)) : '—'

  return (
    <div className={styles.page}>
      <div className={styles.ellipseLeft} aria-hidden />
      <div className={styles.ellipseRight} aria-hidden />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={styles.wrap}>
        <motion.div variants={fadeInUp}>
          <Card className={styles.hero} bordered>
            <Space size={12} direction="vertical" style={{ width: '100%' }}>
              <Flex align={'center'} justify={'space-between'} className={styles.heroHead}>
                <Flex align={'center'}>
                  <FileTextOutlined className={styles.heroIcon} />
                  <Title level={2} className={styles.heroTitle}>Публичная оферта</Title>
                </Flex>
                <Tag className={styles.versionTag} color="default">Редакция от 10.08.2025 • г. Сочи</Tag>
              </Flex>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Card bordered className={styles.userCard}>
                    <Space style={{ width: '100%' }} direction="vertical" size={8}>
                      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                        <Space align="center">
                          <UserOutlined className={styles.userIcon} />
                          <Title level={4} className={styles.blockTitle}>Ваши данные</Title>
                        </Space>
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
                          <Descriptions column={1} className={styles.desc}>
                            <Descriptions.Item label="ФИО">{individualFullName || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Телефон">{user?.phone_number || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Адрес">{user?.address || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Паспорт: серия">{user?.passport_series || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Паспорт: номер">{user?.passport_number || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Кем выдан">{user?.passport_issued_by || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Дата выдачи">{fmtDate(user?.passport_issued_date)}</Descriptions.Item>
                            <Descriptions.Item label="Код подразделения">{user?.passport_department || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Дата рождения">{fmtDate(user?.birth_date)}</Descriptions.Item>
                            <Descriptions.Item label="Место рождения">{user?.birth_place || '—'}</Descriptions.Item>
                          </Descriptions>
                          <Space wrap>
                            <Button className={styles.btnGhost} onClick={handleClick} icon={<UserOutlined />}>
                              {hasIndividual ? 'Изменить данные' : 'Добавить данные'}
                            </Button>
                          </Space>
                        </>
                      )}

                      {isLegal && (
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
                            <Button className={styles.btnGhost} onClick={handleClick} icon={<UserOutlined />}>
                              {hasLegal ? 'Изменить данные' : 'Добавить данные'}
                            </Button>
                          </Space>
                        </>
                      )}
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <Card bordered className={styles.filesCard}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Title level={5} className={styles.blockTitleSmall}>Файлы</Title>
                      <Space wrap>
                        <Button className={styles.btnGhost} href="/docs/public-offer.docx" icon={<DownloadOutlined />}>DOCX</Button>
                        <Button className={styles.btnGhost} href="/docs/public-offer.pdf" icon={<DownloadOutlined />}>PDF</Button>
                      </Space>
                      <Space>
                        <LockOutlined />
                        <Text className={styles.muted}>Документы доступны для скачивания в формате DOCX и PDF.</Text>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className={styles.offerCard} bordered>
            <Tabs
              className={styles.tabs}
              items={[
                {
                  key: 'view',
                  label: 'Просмотр',
                  children: (
                    <div className={styles.offerBody}>
                      <Typography>
                        <Title level={3} className={styles.sectionTitle}>Договор на оказание услуг (Публичная оферта)</Title>
                        <Paragraph>Настоящая оферта представляет собой официальное предложение Индивидуального Предпринимателя Кузнецовы Валентины Анатольевны, далее именуемого «Исполнитель», адресованное неопределенному кругу лиц, заключить договор на оказание услуг на нижеследующих условиях.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Термины</Title>
                        <Paragraph>Публичная оферта – предложение Исполнителя, адресованное Заказчику (юридическому лицу, индивидуальному предпринимателю или физическому лицу), заключить договор на оказание услуг на условиях, содержащихся в настоящей публичной оферте. Акцепт публичной оферты – полное и безоговорочное принятие Заказчиком условий настоящей публичной оферты путем совершения действий, указанных в разделе «Общие условия». Акцепт создает договор и признается заключенным. Договор – возмездное соглашение между Исполнителем и Заказчиком на оказание услуг, заключенное посредством акцепта публичной оферты. Исполнитель – Индивидуальный Предприниматель Кузнецова Валентина Анатольевна. Заказчик – юридическое лицо, индивидуальный предприниматель или физическое лицо, принявшее условия оферты и оплатившее услуги. Стороны – Исполнитель и Заказчик совместно.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Предмет оферты</Title>
                        <Paragraph>Исполнитель обязуется оказать Заказчику услуги по аренде строительного инструмента или оборудования, указанные в Договоре, а Заказчик обязуется принимать и оплачивать услуги в соответствии с условиями Оферты. Исполнитель вправе привлекать к оказанию услуг третьих лиц без предварительного согласия Заказчика. Услуги оказываются при условии оплаты. Акцептом договора-оферты является факт оплаты Заказчиком выбранной Услуги.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Общие условия оказания услуг</Title>
                        <Paragraph>Исполнитель оказывает услуги при выполнении следующих условий: Заказчик предоставил всю требуемую информацию для аренды оборудования; Заказчик осуществил акцепт оферты; Заказчик согласен на обработку персональных данных согласно ФЗ-152. Услуги предоставляются в объеме, соответствующем сумме предоплаты. Правила аренды указаны в заключаемом договоре. При нарушении требований оферты Исполнитель вправе отказать в услугах. Исполнитель не несет ответственности за несанкционированное использование данных, предоставленных Заказчиком, третьими лицами.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Права и обязанности сторон</Title>
                        <Paragraph>Исполнитель обязан в случае досрочного отказа Заказчика, предусмотренного Офертой, возвратить денежные средства по письменному требованию Заказчика за вычетом 30% от суммы предоплаты и стоимости фактически оказанных услуг, в течение десяти рабочих дней с момента расторжения. Исполнитель соблюдает правила, описанные в заключенном и согласованном сторонами договоре.</Paragraph>
                        <Paragraph>Исполнитель вправе временно приостановить оказание услуг по техническим, технологическим и иным причинам на время их устранения. Если причины связаны с некачественным или технически уставшим инструментом Исполнителя, плата за услуги на период приостановки не взимается; в иных случаях плата взимается согласно договору. Исполнитель вправе приостановить оказание услуг при нарушении Заказчиком обязательств, а также вносить изменения в Оферту в установленном порядке.</Paragraph>
                        <Paragraph>Заказчик обязан оплачивать услуги в соответствии с условиями договора, предоставлять адреса работы оборудования, предоставлять запрашиваемую информацию для заключения договора аренды, возвращать инструмент в полном объеме, исправном и опрятном виде, принимать оказанные услуги, обезличивать персональные данные при передаче Исполнителю любых носителей, соблюдать правила договора. Заказчик имеет право потребовать возврат средств в полном объеме, если инструмент неисправен или технически устав. В остальных случаях при возврате инструмента возврат осуществляется за вычетом 30% от невыполненных услуг. Заказчик вправе вернуть инструмент ранее срока аренды; оплаченную сумму можно зачесть в будущие сделки или вернуть за вычетом 30% от неоказанных услуг.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Стоимость услуг и порядок расчетов</Title>
                        <Paragraph>Стоимость услуг определяется Исполнителем в российских рублях и может корректироваться согласно Приложению №1 и заключаемому договору. Исполнитель вправе изменять цены в одностороннем порядке. Оплата производится платежным поручением по реквизитам Исполнителя или наличными с указанием в назначении платежа: «С офертой, ознакомлен». Услуги предоставляются на условиях 100% предоплаты.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Особые условия и ответственность</Title>
                        <Paragraph>Стороны несут ответственность по законодательству РФ. Заказчик самостоятельно несет ответственность за соблюдение законодательства, включая авторские права, товарные знаки, защиту прав потребителей, а также за достоверность сведений при акцепте. Исполнитель не несет ответственности за действия Заказчика и убытки Заказчика. Совокупная ответственность Исполнителя ограничена суммой платежа Заказчика. Исполнитель освобождается от ответственности при форс-мажоре, включая действия органов власти, стихийные бедствия, отключения электроэнергии, сбои сети, забастовки, гражданские волнения и иные обстоятельства непреодолимой силы.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Арбитраж</Title>
                        <Paragraph>Споры разрешаются путем переговоров с претензионным порядком. Ответ на претензию предоставляется в течение 10 календарных дней с момента получения. При недостижении соглашения споры подлежат рассмотрению в арбитражном суде г. Сочи.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Срок действия и изменения договора</Title>
                        <Paragraph>Акцепт Заказчиком создает договор в соответствии со статьей 438 ГК РФ. Договор вступает в силу с момента акцепта и действует до исполнения обязательств Исполнителем в объеме предоплаты либо до расторжения. Внесение изменений в Оферту влечет внесение таких изменений в заключенный договор и вступает в силу одновременно с изменениями. В случае отзыва Оферты Исполнителем договор считается прекращенным с момента отзыва, возврат предоплаты осуществляется в порядке, установленном Офертой.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Заключительные положения</Title>
                        <Paragraph>Договор может быть расторгнут по соглашению сторон либо во внесудебном порядке по требованию одной из сторон при существенном нарушении условий или в иных случаях, предусмотренных законодательством РФ. Отсутствие бумажного экземпляра договора с подписями сторон при фактической оплате не является основанием считать договор незаключенным. Стороны вправе оформить договор в форме письменного документа.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Приложение №1. Стоимость предоставляемых услуг</Title>
                        <Paragraph>Стоимость услуг указывается и может корректироваться при подписании и заключении договора между сторонами. На стоимость влияют сроки аренды, адреса работы и скидки, предоставляемые Исполнителем.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Реквизиты Исполнителя</Title>
                        <Paragraph>
                          Наименование: ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ КУЗНЕЦОВА ВАЛЕНТИНА АНАТОЛЬЕВНА
                          <br />ИНН: 410119156242
                          <br />ОГРНИП: 320410100001345
                          <br />Расчётный счёт: 40802810436170008414
                          <br />Наименование банка: СЕВЕРО-ВОСТОЧНОЕ ОТДЕЛЕНИЕ N8645 ПАО СБЕРБАНК
                          <br />БИК: 044442607
                          <br />Корсчёт: 30101810300000000607
                          <br />ИНН банка: 7707083893
                          <br />КПП банка: 410143001
                          <br />Адрес обслуживающего подразделения: г. Петропавловск-Камчатский, ул. Лукашевского, 2
                          <br />Юридический адрес: г. Сочи, промышленный переулок, 6
                        </Paragraph>
                        <Divider className={styles.divider} />
                        <Space>
                          <SecurityScanOutlined />
                          <Text className={styles.muted}>Использование персональных данных осуществляется по ФЗ-152. Принятие оферты фиксируется техническими средствами и сохраняется в журнале акцептов.</Text>
                        </Space>
                      </Typography>
                    </div>
                  ),
                },
                {
                  key: 'files',
                  label: 'Документы',
                  children: (
                    <div className={styles.filesPane}>
                      <Space direction="vertical" size={12}>
                        <Space wrap>
                          <Button className={styles.btnPrimary} href="/docs/public-offer.pdf" icon={<DownloadOutlined />}>Скачать PDF</Button>
                          <Button className={styles.btnGhost} href="/docs/public-offer.docx" icon={<DownloadOutlined />}>Скачать DOCX</Button>
                        </Space>
                        <Text className={styles.muted}>Для неизменяемой фиксации условий используйте PDF.</Text>
                      </Space>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

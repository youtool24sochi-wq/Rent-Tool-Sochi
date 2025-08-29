'use client'

import React from 'react'

import {
  SearchOutlined,
  ArrowRightOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  TagOutlined,
} from '@ant-design/icons'
import {
  Button,
  List,
  Card,
  Row,
  Col,
  Tooltip,
  Avatar,
  Rate,
  Collapse,
} from 'antd'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useNotificationApi } from '@/providers/NotificationProvider'
import { HomePopularGET, HomeVideoGET } from '@/services/home-api'
import HomeProductCard from '@/shared/components/home-product-card/home-product-card'
import { HomeType } from '@/shared/types/home/home.interface'
import { ButtonPopover } from '@/widgets/button-popover/button-popover'

import Loader from './loading'
import styles from './page.module.css'

const { Item } = List

const faqItems = [
  {
    key: '1',
    label: 'Как происходит аренда инструмента?',
    children: (
      <p className={styles.faqAnswer}>
        Выбираете инструмент в каталоге, указываете даты аренды, оплачиваете онлайн.
        Мы доставляем инструмент в указанное время и место.
      </p>
    ),
  },
  {
    key: '2',
    label: 'Нужен ли залог?',
    children: (
      <p className={styles.faqAnswer}>
        Нет, залог не требуется. Мы работаем по предоплате и доверяем нашим клиентам.
      </p>
    ),
  },
  {
    key: '3',
    label: 'Какая зона доставки?',
    children: (
      <p className={styles.faqAnswer}>
        Доставляем по всему Сочи и пригородам. В центре города доставка бесплатная,
        в&nbsp;отдалённые районы&nbsp;— от&nbsp;200 ₽.
      </p>
    ),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.15 } },
}

export default function Home() {
  const api = useNotificationApi()
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [products, setProducts] = React.useState<HomeType.Product[] | undefined>(undefined)
  const [productsLoading, setProductsLoading] = React.useState(false)
  const [videoLoading, setVideoLoading] = React.useState(false)
  const [video, setVideo] = React.useState<HomeType.Video | null>(null)

  const goSearch = () => {
    const q = query.trim()

    router.push(q ? `/catalog?search=${encodeURIComponent(q)}` : '/catalog')
  }

  const loadProducts = async () => {
    setProductsLoading(true)
    try {
      const response = await HomePopularGET()

      if (!response) {
        api.error({ message: 'Произошла ошибка. Попробуйте позже', placement: 'top' })

        return
      }

      setProducts(response.data.products)
    } catch (error) {
      console.log('error', error)
    } finally {
      setProductsLoading(false)
    }
  }

  const loadVideo = async () => {
    setVideoLoading(true)
    try {
      const response = await HomeVideoGET()

      if (!response) {
        api.error({ message: 'Произошла ошибка. Попробуйте позже', placement: 'top' })

        return
      }
      setVideo(response.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setVideoLoading(false)
    }
  }

  React.useEffect(() => {
    loadVideo()
    loadProducts()
  }, [])

  if (videoLoading) {
    return <Loader/>
  }

  return (
    <>
      <motion.section
        className={styles.hero}
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <video className={styles.videoBg} src={`https://api.renttoolspeed.ru${video?.video_url.video_url}`} autoPlay loop muted playsInline />
        <div className={styles.overlay} />

        <div className={styles.particles}>
          <motion.svg
            width="60" height="60" className={styles.p1}
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          >
            <rect x="18" y="8" width="24" height="24" rx="4" />
          </motion.svg>
          <motion.svg
            width="32" height="32" className={styles.p2}
            animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
          >
            <circle cx="16" cy="16" r="10" />
          </motion.svg>
          <motion.svg
            width="48" height="48" className={styles.p3}
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
          >
            <rect x="12" y="8" width="24" height="32" rx="3" />
          </motion.svg>
          <svg width="52" height="52" className={styles.p4}>
            <rect x="22" y="14" width="8" height="28" rx="2" />
            <rect x="16" y="8" width="20" height="6" rx="2" />
          </svg>
          <svg width="46" height="46" className={styles.p5}>
            <polygon points="23,6 29,13 17,13" />
            <rect x="21" y="13" width="4" height="24" rx="1" />
          </svg>
          <svg width="38" height="38" className={styles.p6}>
            <circle cx="19" cy="19" r="6" />
            <rect x="17" y="2" width="4" height="34" rx="1" />
          </svg>
        </div>

        <motion.div variants={fadeUp} className={`${styles.container} container`}>
          <h1 className={styles.heading}>
            Аренда <span className={styles.accent}>инструментов</span> в <br /> Сочи
          </h1>

          <p className={styles.lead}>
            Профессиональный инструмент. Честные цены. Отсутствие залога и всё это —
            <span className={styles.brand}> RentToolSochi</span>
          </p>

          <motion.div variants={fadeUp} className={styles.searchWrap}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Найти инструмент…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goSearch()}
            />
            <Button htmlType="button" className={styles.searchBtn} icon={<SearchOutlined />} onClick={goSearch} />
          </motion.div>

          <motion.div variants={fadeUp} className={styles.actions}>
            <Link href="/catalog">
              <button className={`${styles.btnPrimary} btnOrange`}>
                <ArrowRightOutlined style={{ marginRight: 10 }} />
                Смотреть каталог
              </button>
            </Link>

            <Link href="/catalog">
              <button className={styles.btnGhost}>
                <TagOutlined style={{ marginRight: 10 }} />
                Акции
              </button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statVal}>100+</div>
              <div className={styles.statLbl}>Инструментов</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statVal}>200+</div>
              <div className={styles.statLbl}>Клиентов</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statVal}>24/7</div>
              <div className={styles.statLbl}>Поддержка</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <div className={`${styles.section_catalog} container`}>
        <div className={styles.catalogHead}>
          <div className={styles.badge}>
            <AppstoreOutlined className={styles.badgeIcon} />
            <span>Популярные категории</span>
          </div>

          <h2 className={styles.catalogTitle}>Каталог инструментов</h2>

          <p className={styles.catalogSub}>
            Выберите нужный инструмент и забронируйте онлайн. Более 500+ профессиональных инструментов в наличии
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <List
            grid={{ gutter: 16, column: 4, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            loading={productsLoading}
            dataSource={products}
            renderItem={(item) => (
              <Item key={item.tool_id}>
                <motion.div variants={fadeUp}>
                  <HomeProductCard product={item} />
                </motion.div>
              </Item>
            )}
          />
        </motion.div>

        <div className={styles.catalogFooter}>
          <Link href="/catalog" className={styles.catalogMore}>
            <ArrowRightOutlined />
            Смотреть весь каталог
          </Link>
          <p className={styles.catalogNote}>Более 500+ профессиональных инструментов</p>
        </div>
      </div>

      <section className={styles.benefits}>
        <div className={styles.benefitsOverlay} />
        <svg className={styles.benefitsWave} viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path d="M0,32 Q360,64 720,32 T1440,32 V64 H0 Z" fill="#f97316" />
        </svg>

        <div className={`${styles.benefitsInner} container`}>
          <h2 className={styles.benefitsTitle}>Почему выбирают нас</h2>
          <p className={styles.benefitsSub}>Надежность, качество и удобство в каждом инструменте</p>

          <Row
            gutter={[24, 24]}
            justify="center"
          >
            <Col xs={24} md={8}>
              <motion.div variants={fadeUp}>
                <Card className={styles.benefitCard} bordered={false}>
                  <Tooltip className={styles.tootlip} title="Гарантия качества">
                    <SafetyCertificateOutlined className={styles.benefitIcon} />
                  </Tooltip>
                  <h3 className={styles.benefitCardTitle}>Гарантия качества</h3>
                  <p className={styles.benefitCardDesc}>
                    Все инструменты проходят регулярное техническое обслуживание
                  </p>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} md={8}>
              <motion.div variants={fadeUp}>
                <Card className={styles.benefitCard} bordered={false}>
                  <Tooltip className={styles.tootlip} title="Быстрая доставка">
                    <ClockCircleOutlined className={styles.benefitIcon} />
                  </Tooltip>
                  <h3 className={styles.benefitCardTitle}>Быстрая доставка</h3>
                  <p className={styles.benefitCardDesc}>Доставляем в течение 1‑2 часов по всему Сочи</p>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} md={8}>
              <motion.div variants={fadeUp}>
                <Card className={styles.benefitCard} bordered={false}>
                  <Tooltip className={styles.tootlip} title="24/7 поддержка">
                    <CustomerServiceOutlined className={styles.benefitIcon} />
                  </Tooltip>
                  <h3 className={styles.benefitCardTitle}>24/7 поддержка</h3>
                  <p className={styles.benefitCardDesc}>Круглосуточная техническая поддержка и консультации</p>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={`${styles.testimonialsInner} container`}>
          <h2 className={styles.testimonialsTitle}>Отзывы наших клиентов</h2>
          <p className={styles.testimonialsSub}>Что говорят о нас довольные клиенты</p>

          <Row gutter={[24, 24]}  >
            <Col xs={24} md={12}>
              <Card className={styles.testimonialCard} bordered={false}>
                <div className={styles.testimonialHead}>
                  <Avatar className={styles.avatar} size={48} style={{ background: 'rgba(249,115,22,.2)', color: '#f97316' }}>
                    А
                  </Avatar>
                  <div>
                    <h4 className={styles.testimonialName}>Александр Петров</h4>
                    <Rate disabled defaultValue={5} className={styles.rate} />
                  </div>
                </div>
                <p className={styles.testimonialText}>
                  «Отличный сервис! Арендовал дрель для ремонта, доставили быстро, инструмент в идеальном состоянии. Рекомендую!»
                </p>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className={styles.testimonialCard} bordered={false}>
                <div className={styles.testimonialHead}>
                  <Avatar className={styles.avatar} size={48} style={{ background: 'rgba(249,115,22,.2)', color: '#f97316' }}>
                    М
                  </Avatar>
                  <div>
                    <h4 className={styles.testimonialName}>Мария Сидорова</h4>
                    <Rate disabled defaultValue={5} className={styles.rate} />
                  </div>
                </div>
                <p className={styles.testimonialText}>
                  «Пользовалась сервисом несколько раз. Всегда вежливые менеджеры, качественные инструменты, удобная система бронирования.»
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <motion.section
        className={styles.faq}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`${styles.faqInner} container`}>
          <h2 className={styles.faqTitle}>Часто задаваемые вопросы</h2>
          <p className={styles.faqSub}>Ответы на популярные вопросы</p>

          <Collapse
            accordion
            ghost
            size="large"
            expandIconPosition="end"
            items={faqItems}
            className={styles.faqList}
          />
        </div>
      </motion.section>
      <ButtonPopover/>
    </>
  )
}

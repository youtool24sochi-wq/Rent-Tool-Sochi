'use client'

import React from 'react'

import {
  SearchOutlined,
  ArrowRightOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import {
  Button,
  List,
  Card,
  Row,
  Col,
  Tooltip,
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

        <motion.div variants={fadeUp} className={`${styles.heroContainer} container`}>
          <motion.h1 className={styles.heading}>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Аренда{' '}
            </motion.span>
            <motion.span
              className={styles.accent}
              initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 40px rgba(249, 115, 22, 0.8)',
                transition: { duration: 0.3 },
              }}
            >
              <span className={styles.sparkleText}>
                инструментов
                <motion.div
                  className={styles.sparkles}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={styles.sparkle}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        x: [0, Math.random() * 30 - 15],
                        y: [0, Math.random() * 30 - 15],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.3 + 1.2,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                    />
                  ))}
                </motion.div>
              </span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {' '}в <br /> Сочи
            </motion.span>
          </motion.h1>

          <motion.p
            className={styles.lead}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Профессиональный инструмент. Честные цены. Отсутствие залога и всё это —
            </motion.span>
            <motion.span
              className={styles.brand}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 1.3,
                ease: 'easeOut',
              }}
            >
              {' '}RentToolSochi
            </motion.span>
          </motion.p>

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

            <Link href="tel:+89388742460">
              <button className={styles.btnGhost}>
                <PhoneOutlined style={{ marginRight: 10 }} />
                Связаться с нами
              </button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.statsRow}>
            <motion.div
              className={styles.statBox}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <motion.div
                className={styles.statVal}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
              >
                100+
              </motion.div>
              <div className={styles.statLbl}>Инструментов</div>
            </motion.div>
            <motion.div
              className={styles.statBox}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <motion.div
                className={styles.statVal}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5, type: 'spring' }}
              >
                200+
              </motion.div>
              <div className={styles.statLbl}>Клиентов</div>
            </motion.div>
            <motion.div
              className={styles.statBox}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <motion.div
                className={styles.statVal}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
              >
                24/7
              </motion.div>
              <div className={styles.statLbl}>Поддержка</div>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.benefitsTitle}>Почему выбирают нас</h2>
            <p className={styles.benefitsSub}>Надежность, качество и удобство в каждом инструменте</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Row
              gutter={[24, 24]}
              justify="center"
            >
              <Col xs={24} md={8}>
                <motion.div variants={fadeUp}>
                  <Card className={styles.benefitCard} bordered={false}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Tooltip className={styles.tootlip} title="Гарантия качества">
                        <SafetyCertificateOutlined className={styles.benefitIcon} />
                      </Tooltip>
                    </motion.div>
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
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Tooltip className={styles.tootlip} title="Быстрая доставка">
                        <ClockCircleOutlined className={styles.benefitIcon} />
                      </Tooltip>
                    </motion.div>
                    <h3 className={styles.benefitCardTitle}>Быстрая доставка</h3>
                    <p className={styles.benefitCardDesc}>Доставляем в течение 1‑2 часов по всему Сочи</p>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={8}>
                <motion.div variants={fadeUp}>
                  <Card className={styles.benefitCard} bordered={false}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Tooltip className={styles.tootlip} title="24/7 поддержка">
                        <CustomerServiceOutlined className={styles.benefitIcon} />
                      </Tooltip>
                    </motion.div>
                    <h3 className={styles.benefitCardTitle}>24/7 поддержка</h3>
                    <p className={styles.benefitCardDesc}>Круглосуточная техническая поддержка и консультации</p>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      <section className={styles.maps}>
        <div className={`${styles.mapsInner} container`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.mapsTitle}>Мы на картах</h2>
            <p className={styles.mapsSub}>Найдите нас в популярных картографических сервисах</p>
          </motion.div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Card className={styles.yandexMapCard} bordered={false}>
                  <div className={styles.mapCardContent}>
                    <h3 className={styles.mapCardTitle}>Наше местоположение</h3>
                    <p className={styles.mapCardDesc}>Найдите нас на Яндекс.Картах</p>
                  </div>
                  <div className={styles.yandexMapContainer}>
                    <div style={{ position:'relative', overflow:'hidden' }}>
                      <a
                        href="https://yandex.ru/maps/org/youtool/82146067837/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'0px' }}
                      >
                        YouTool
                      </a>
                      <a
                        href="https://yandex.ru/maps/239/sochi/category/rental/184108219/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'14px' }}
                      >
                        Пункт проката в Сочи
                      </a>
                      <a
                        href="https://yandex.ru/maps/239/sochi/category/construction_tools/184107567/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'28px' }}
                      >
                        Строительный инструмент в Сочи
                      </a>
                      <iframe
                        src="https://yandex.ru/map-widget/v1/?display-text=%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D0%B0%20%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0&filter=alternate_vertical%3ARequestWindow&ll=39.739781%2C43.602683&mode=search&oid=82146067837&ol=biz&sctx=ZAAAAAgBEAAaKAoSCVhzgGCO3ENAERTQRNjwykVAEhIJHViOkIE81j8R95ScE3toyz8iBgABAgMEBSgKOABA8YAHSAFiHnJlbGV2X2V4cGVyaW1lbnQ9c2ltaWxhcnNfZXhwM2IncmVtb3ZlX3NuaXBwZXQ9cmVsYXRlZF9hZHZlcnRzXzFvcmcvMS54agJydZ0BzczMPaABAKgBAL0BebQ7OcIBSaeL%2BMKjBP2KpoKyAqWmkOGvAaCJlpc01drm974D0LTjsaXk%2FJlt38jRu70Do46knJYG1uaOnKgDisiE%2BZsFy4yoxYkGv4%2FDzB2CAiPQsNGA0LXQvdC00LAg0LjQvdGB0YLRgNGD0LzQtdC90YLQsIoCJzE4NDEwNzU1MSQxODQxMDgyMTkkMTg0MTA3NTY3JDE4NDEwNzU3MZICAJoCDGRlc2t0b3AtbWFwc6oCMTM1MTcxNzM0NDI5LDE3OTE0NTExNDU0NiwyMDQ5NDc4MTA5NzgsODcwOTkxMDI3NjTaAigKEgkMObaeIeBDQBFc79cOf81FQBISCQA%2BKZMa2rA%2FEQAoUIvBw6Q%2F4AIB&sll=39.746353%2C43.604771&sspn=0.034791%2C0.021434&text=%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D0%B0%20%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0&z=15.32"
                        width="100%"
                        height="400"
                        frameBorder="0"
                        allowFullScreen={true}
                        style={{ position:'relative', borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Card className={styles.yandexReviewsCard} bordered={false}>
                  <div className={styles.mapCardContent}>
                    <h3 className={styles.mapCardTitle}>Отзывы о нас</h3>
                    <p className={styles.mapCardDesc}>Что говорят клиенты на Яндекс.Картах</p>
                  </div>
                  <div className={styles.yandexReviewsContainer}>
                    <div style={{ width:'100%', height:'500px', overflow:'hidden', position:'relative' }}>
                      <iframe
                        style={{ width:'100%', height:'100%', border:'1px solid #e6e6e6', borderRadius:'12px', boxSizing:'border-box' }}
                        src="https://yandex.ru/maps-reviews-widget/82146067837?comments"
                      />
                      <a
                        href="https://yandex.ru/maps/org/youtool/82146067837/"
                        target="_blank"
                        style={{
                          boxSizing:'border-box',
                          textDecoration:'none',
                          color:'#b3b3b3',
                          fontSize:'10px',
                          fontFamily:'YS Text,sans-serif',
                          padding:'0 20px',
                          position:'absolute',
                          bottom:'8px',
                          width:'100%',
                          textAlign:'center',
                          left:'0',
                          overflow:'hidden',
                          textOverflow:'ellipsis',
                          display:'block',
                          maxHeight:'14px',
                          whiteSpace:'nowrap',
                        }}
                      >
                        YouTool на карте Сочи — Яндекс Карты
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
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

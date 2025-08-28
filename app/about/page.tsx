'use client'

import React from 'react'

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  MessageOutlined,
  IdcardOutlined,
  LockOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  WhatsAppOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Typography, Row, Col, Card, Space, Button, Tag, Collapse, Divider } from 'antd'
import { motion } from 'framer-motion'

import styles from './page.module.css'

const { Title, Paragraph, Text } = Typography

const stagger = { show: { transition: { staggerChildren: 0.15 } } }
const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function About() {
  return (
    <div className={styles.page}>

      <div className={styles.content}>
        <div className={styles.ellipseLeft} aria-hidden />
        <div className={styles.ellipseRight} aria-hidden />

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <Card className={styles.heroCard} bordered>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Title level={2} className={styles.titleCenter}>О компании и преимуществах</Title>

                <ul className={styles.bulletList}>
                  <li>
                    Работаем с <strong>21.06.2024</strong>, провели <strong>более 1000 сделок</strong>.
                  </li>
                  <li>Самые гибкие условия аренды в Сочи, регулярные акции и скидки.</li>
                  <li>Подарили клиентам <strong>более 500&nbsp;000₽ бонусов</strong> за год.</li>
                  <li>Проверенные инструменты, честные цены, быстрая доставка по всему городу.</li>
                  <li>Онлайн-оплата, электронные договоры, поддержка 24/7 в WhatsApp и Telegram.</li>
                  <li>Удобный личный кабинет, история заказов, доставка по всему Сочи и пригородам.</li>
                </ul>

                <Card className={styles.benefitsCard} bordered>
                  <Space align="center">
                    <CheckCircleOutlined />
                    <Title level={4} style={{ margin: 0 }}>Преимущества RentToolSochi</Title>
                  </Space>

                  <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                    <Col xs={24} sm={12}>
                      <Space align="start">
                        <SafetyCertificateOutlined className={styles.iconAccent} />
                        <Text>Проверенные инструменты и честные цены</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space align="start">
                        <CarOutlined className={styles.iconAccent} />
                        <Text>Доставка через партнеров (Яндекс)</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space align="start">
                        <MessageOutlined className={styles.iconAccent} />
                        <Text>Поддержка 24/7 в WhatsApp и Telegram</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space align="start">
                        <ClockCircleOutlined className={styles.iconAccent} />
                        <Text>Удобный личный кабинет и история заказов</Text>
                      </Space>
                    </Col>
                  </Row>
                </Card>

                <Row gutter={[16, 16]}>
                  <Col md={12} xs={24}>
                    <Card className={styles.sectionCard} bordered>
                      <Title level={5} className={styles.sectionTitle}>Для физических лиц</Title>
                      <ul className={styles.bulletListSm}>
                        <li>Для подтверждение личности необходимо отправить фото паспорта.</li>
                        <li>
                          Ваши данные хранятся и обрабатываются по закону РФ
                          <Text strong> «О персональных данных»</Text> и защищены.
                        </li>
                        <li>После подтверждения — договор аренды и возможность онлайн-оплаты.</li>
                        <li>Вся история заказов и документов доступна в личном кабинете.</li>
                      </ul>
                    </Card>
                  </Col>

                  <Col md={12} xs={24}>
                    <Card className={styles.sectionCard} bordered>
                      <Title level={5} className={styles.sectionTitle}>Для юридических лиц</Title>
                      <ul className={styles.bulletListSm}>
                        <li>Нужны карточка предприятия и паспорт руководителя.</li>
                        <li>Отправим договор заранее для ознакомления до оплаты.</li>
                        <li>Оплата по безналичному расчету и онлайн доступна.</li>
                        <li>Все документы формируются автоматически и доступны в ЛК.</li>
                      </ul>
                    </Card>
                  </Col>
                </Row>

                <Card className={styles.sectionCardSoft} bordered>
                  <Space direction="vertical" size={4}>
                    <Title level={5} className={styles.sectionTitle}>Онлайн-оплата и договор</Title>
                    <Paragraph className={styles.muted}>
                      После оформления заказа вы получаете ссылку на онлайн-оплату.
                      Договор аренды формируется автоматически и отправляется на почту.
                      Все платежи защищены и проходят через сертифицированные платежные системы.
                    </Paragraph>
                  </Space>
                </Card>

                <Card className={styles.sectionCard} bordered>
                  <Title level={5} className={styles.sectionTitle}>О сервисе RentToolSochi</Title>
                  <ul className={styles.bulletListSm}>
                    <li>Удобный каталог инструментов с фильтрами по цене, категории и бренду.</li>
                    <li>Выбирайте даты аренды и оформляйте заказ онлайн.</li>
                    <li>В личном кабинете — история заказов, документы и поддержка.</li>
                    <li>Доставка по всему Сочи и пригородам.</li>
                    <li>Поддержка работает 24/7 — мы всегда на связи!</li>
                  </ul>
                </Card>

                <Card className={styles.privacyCard} bordered>
                  <Space size={8} align="center" className={styles.privacyHeader}>
                    <LockOutlined />
                    <Title level={5} style={{ margin: 0 }}>Политика конфиденциальности</Title>
                  </Space>
                  <Paragraph className={styles.muted} style={{ marginBottom: 8 }}>
                    Мы строго соблюдаем требования законодательства РФ о персональных данных (152-ФЗ).
                    Данные используются только для оформления и сопровождения аренды, не передаются третьим лицам и
                    защищены современными средствами шифрования.
                  </Paragraph>
                  <Paragraph className={styles.muted}>
                    С полной политикой можно ознакомиться&nbsp;
                    <a href="/privacy" className={styles.link} target="_blank" rel="noopener noreferrer">
                      по ссылке
                    </a>
                    &nbsp;или запросить текст по электронной почте.
                  </Paragraph>
                  <Space split={<Divider type="vertical" />} wrap>
                    <Tag icon={<IdcardOutlined />} className={styles.tagSoft}>152-ФЗ</Tag>
                    <Tag icon={<FileTextOutlined />} className={styles.tagSoft}>Оферта / Договор</Tag>
                    <Tag icon={<SafetyCertificateOutlined />} className={styles.tagSoft}>Шифрование</Tag>
                  </Space>
                </Card>
              </Space>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section
          className={styles.faqWrap}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <Card bordered className={styles.faqCard}>
              <Title level={3} style={{ marginBottom: 12 }}>Часто задаваемые вопросы</Title>
              <Collapse
                items={[
                  {
                    key: '1',
                    label: 'Как оформить аренду?',
                    children: (
                      <Paragraph className={styles.muted}>
                        Выберите инструмент в каталоге, укажите даты, загрузите необходимые документы и оплатите онлайн.
                        После подтверждения заказа мы доставим инструмент в удобное время.
                      </Paragraph>
                    ),
                  },
                  {
                    key: '2',
                    label: 'Как быстро происходит доставка?',
                    children: (
                      <Paragraph className={styles.muted}>
                        В среднем доставка по Сочи занимает 1–2 часа. В отдалённые районы — по договорённости.
                      </Paragraph>
                    ),
                  },
                  {
                    key: '3',
                    label: 'Можно ли получить консультацию?',
                    children: (
                      <Paragraph className={styles.muted}>
                        Да, специалисты помогут с выбором — пишите в WhatsApp или Telegram, либо через форму обратной связи.
                      </Paragraph>
                    ),
                  },
                ]}
                accordion
                className={styles.collapse}
              />
            </Card>
          </motion.div>
        </motion.section>

        <motion.section
          className={styles.ctaBar}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} md={12}>
                <Title level={4} className={styles.ctaTitle}>Остались вопросы? Свяжитесь с нами прямо сейчас!</Title>
              </Col>
              <Col xs={24} md="auto">
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<WhatsAppOutlined />}
                    href="https://wa.me/79996555139"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="large"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    icon={<SendOutlined />}
                    href="https://t.me/YouToolSochi"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="large"
                  >
                    Telegram
                  </Button>
                </Space>
              </Col>
            </Row>
          </motion.div>
        </motion.section>
      </div>

    </div>
  )
}

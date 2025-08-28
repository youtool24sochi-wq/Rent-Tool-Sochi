'use client'

import React from 'react'

import { LockOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons'
import { Typography, Card, Button, Space, Tabs, Tag, Divider, Row, Col, Flex } from 'antd'
import { motion } from 'framer-motion'

import styles from './page.module.css'

const { Title, Paragraph, Text } = Typography

const stagger = { show: { transition: { staggerChildren: 0.15 } } }
const fadeInUp: any = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

export default function PersonalData() {
  return (
    <div className={styles.page}>
      <div className={styles.ellipseLeft} aria-hidden />
      <div className={styles.ellipseRight} aria-hidden />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={styles.wrap}>
        <motion.div variants={fadeInUp}>
          <Card className={styles.hero} bordered>
            <Space size={12} direction="vertical" style={{ width: '100%' }}>
              <Flex vertical className={styles.heroHead}>
                <Flex gap={8} align="center">
                  <LockOutlined className={styles.heroIcon} />
                  <Title level={2} className={styles.heroTitle}>Персональные данные и согласие</Title>
                </Flex>
                <div>
                  <Tag className={styles.versionTag} color="default">Редакция от 10.08.2025 • г. Сочи</Tag>
                </div>
              </Flex>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size={4}>
                    <Text className={styles.muted}>Перед продолжением работы ознакомьтесь с политикой обработки персональных данных. Авторизация и ввод кода подтверждения означают согласие с условиями.</Text>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Card bordered className={styles.filesCard}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Title level={5} className={styles.blockTitleSmall}>Файлы</Title>
                      <Space wrap>
                        <Button className={styles.btnPrimary} href="/docs/personal-data.pdf" icon={<DownloadOutlined />}>Скачать PDF</Button>
                        <Button className={styles.btnGhost} href="/docs/personal-data.docx" icon={<DownloadOutlined />}>Скачать DOCX</Button>
                      </Space>
                      <Space>
                        <FileTextOutlined />
                        <Text className={styles.muted}>PDF подходит для печати и неизменяемой фиксации условий</Text>
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
                        <Title level={3} className={styles.sectionTitle}>Политика конфиденциальности и обработка персональных данных</Title>
                        <Paragraph>Политика определяет порядок и условия обработки персональных данных пользователя сервиса, действительна с момента публикации и применяется до принятия новой редакции.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Администратор</Title>
                        <Paragraph>Индивидуальный предприниматель Кузнецова Валентина Анатольевна, ИНН 410119156242, ОГРНИП 320410100001345, юридический адрес: г. Сочи, промышленный переулок, 6.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Термины</Title>
                        <Paragraph>Персональные данные — информация, относящаяся к определенному или определяемому физическому лицу. Обработка — действия с персональными данными, включая сбор, запись, систематизацию, хранение, уточнение, использование, передачу, обезличивание, блокирование, удаление, уничтожение.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Состав обрабатываемых данных</Title>
                        <Paragraph>ФИО, паспортные данные, адрес регистрации, контактный телефон, адрес электронной почты, учетные идентификаторы, сведения о действиях в сервисе, файлы Cookies и аналогичные идентификаторы.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Цели обработки</Title>
                        <Paragraph>Регистрация и идентификация пользователя, предоставление доступа к сервису и материалам, заключение и исполнение договоров, информирование об услугах, обеспечение безопасности, ведение учета и отчетности, выполнение требований законодательства РФ.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Правовые основания</Title>
                        <Paragraph>Согласие субъекта персональных данных, исполнение договора, исполнение обязательных требований закона, а также законные интересы администратора при соблюдении прав пользователя.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Cookies и технические данные</Title>
                        <Paragraph>Используются Cookies. Автоматически фиксируются дата и время действия, URL, Referer, User-Agent, ClientID, разрешение экрана, данные о посещенных разделах. Управлять Cookies можно в настройках браузера; блокирование может ограничить работу сервиса.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Передача третьим лицам</Title>
                        <Paragraph>Данные могут передаваться уполномоченным лицам и партнерам по поручению для исполнения договора при условии соблюдения конфиденциальности и требований ФЗ-152. Трансграничная передача осуществляется при наличии необходимого уровня защиты.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Хранение и защита</Title>
                        <Paragraph>Применяются правовые, организационные и технические меры, включая ограничение доступа, учет носителей, хранение в защищенных сегментах, использование сертифицированных средств защиты. Сроки хранения определяются целями обработки и требованиями закона.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Права пользователя</Title>
                        <Paragraph>Получать сведения об обработке, требовать уточнения, блокирования или уничтожения данных, отзывать согласие, обжаловать действия администратора в уполномоченный орган и суд. Запрос направляется по контактам администратора.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Согласие и его отзыв</Title>
                        <Paragraph>Согласие предоставляется путем совершения действий в сервисе, включая авторизацию и подтверждение кода. Согласие действует до отзыва. Отзыв не влияет на обработку, необходимую для исполнения закона или договора и на обработку, осуществленную до получения отзыва.</Paragraph>
                        <Divider className={styles.divider} />
                        <Title level={4} className={styles.sectionTitle}>Заключительные положения</Title>
                        <Paragraph>Продолжая использование сервиса, пользователь подтверждает, что ознакомлен с политикой и принимает ее условия. Версия политики, доступная на странице, является актуальной. Факты согласия и ключевые события фиксируются техническими средствами и сохраняются в журнале.</Paragraph>
                      </Typography>
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

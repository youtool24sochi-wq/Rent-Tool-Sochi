'use client'

import React from 'react'

import { FilterOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Grid } from 'antd'

import { useClient } from '@/shared/hooks/useClient'
import { CatalogProductTypes } from '@/shared/types/catalog/catalog-product-card.interface'
import { SelectField } from '@/shared/ui/select-field/select-field'
import SliderField from '@/shared/ui/slider-field/slider-field'

import styles from './catalog-filters.module.css'

const { useBreakpoint } = Grid

interface Props {
  categories: CatalogProductTypes.Categories[] | null
  categoriesLoading: boolean
  // eslint-disable-next-line no-unused-vars
  onApply: (values: { category?: number; price?: [number, number] }) => void
  onReset: () => void
}

export default function CatalogFilters({ categories, onApply, onReset }: Props) {
  const clientReady = useClient()
  const screens = useBreakpoint()
  const [open, setOpen] = React.useState(false)
  const [form] = Form.useForm()

  if (!clientReady) return null

  const content = (
    <>
      <div className={styles.title}>
        <h2>Фильтры</h2>
      </div>
      <Form form={form} layout="vertical" className={styles.form} onFinish={onApply}>
        <SelectField
          label="Категория"
          name="category"
          placeholder="Все"
          options={[
            { value: '', label: 'Все' },
            ...(categories?.map((item) => ({ value: item.category_id, label: item.name })) ?? []),
          ]}
        />
        <SliderField
          label="Цена, ₽"
          name="price"
          range
          min={1000}
          max={10000}
          tooltip={{ formatter: (value) => `${value}₽` }}
        />
        <Button htmlType="submit" onClick={() => (open ? setOpen(false) : null)} className={`${styles.btn_submit} btnOrange`}>
          Применить
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            form.resetFields()
            onReset()
          }}
          className={styles.btn_reset}
        >
          Сбросить
        </Button>
      </Form>
    </>
  )

  if (screens.lg) return <aside className={styles.sidebar}>{content}</aside>

  return (
    <>
      <Button type="text" icon={<FilterOutlined />} className={styles.mobileBtn} onClick={() => setOpen(true)}>
        Фильтры
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Фильтры" placement="right" width={320} styles={{ body: { padding: 24 } }}>
        {content}
      </Drawer>
    </>
  )
}

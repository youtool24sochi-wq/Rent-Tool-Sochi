import React from 'react'

import { InboxOutlined } from '@ant-design/icons'
import { Upload, Form, message } from 'antd'

import cls from './dragger-file-field.module.css'

import type { UploadProps, UploadFile } from 'antd/lib/upload/interface'

const { Dragger } = Upload

function normFile(e: any) {
  const fileList = Array.isArray(e) ? e : e?.fileList

  return fileList && fileList.length > 0 ? fileList : null
}

interface Props extends UploadProps {
  rules?: any[]
  initialValue?: string
  valuePropName?: string
  label?: string
  defaultFilePath?: string | string[] | { id?: number; image: string }[]
  // eslint-disable-next-line no-unused-vars
  deleteFunc?: (file: any) => void
  name?: string
}

export const DraggerFileField: React.FC<Props> = (props) => {
  const { deleteFunc, onChange, name, valuePropName, label, ...uploadProps } = props

  const handleRemove = async (file: UploadFile) => {
    try {
      if (file.status === 'done' && file.url) {
        deleteFunc?.(parseInt(file.uid))
      }
    } catch {
      message.error('Ошибка при удалении файла')
    }
  }

  const handleChange = (info: any) => {
    if (onChange) {
      onChange(info)
    }
  }

  if (!name) {
    return (
      <div className={cls.draggerField}>
        {label && <div className="ant-form-item-label"><label>{label}</label></div>}
        <Dragger {...uploadProps} onChange={(info) => handleChange(info)} onRemove={handleRemove}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Выберите файл</p>
          <p className="ant-upload-hint">Здесь можно загрузить один или несколько файлов</p>
        </Dragger>
      </div>
    )
  }

  return (
    <Form.Item
      name={name}
      valuePropName={valuePropName || 'fileList'}
      label={label}
      className={cls.draggerField}
      getValueFromEvent={normFile}
    >
      <Dragger {...uploadProps} onChange={(info) => handleChange(info)} onRemove={handleRemove}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Выберите файл</p>
        <p className="ant-upload-hint">Здесь можно загрузить один или несколько файлов</p>
      </Dragger>
    </Form.Item>
  )
}

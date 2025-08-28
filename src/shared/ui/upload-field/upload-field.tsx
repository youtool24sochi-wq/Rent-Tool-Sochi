import React from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'

import cls from './upload-field.module.css'

import type { UploadProps } from 'antd'

const CustomUploadProps: UploadProps = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} файлы ийгиликтүү жүктөлдү`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} файлын жүктөө ишке ашкан жок.`)
    }
  },
}

interface Props extends UploadProps {
  rules?: Rule[]
  initialValue?: string
  label?: string
}

export const UploadField: React.FC<Props> = (props) => (
  <FormItem
    className={cls.uploadField}
    style={props.style}
    initialValue={props.initialValue}
    rules={props.rules}
    name={props.name}
    label={props.label}
  >
    <Upload {...CustomUploadProps}>
      <Button icon={<UploadOutlined />}>Жүктөө үчүн басыңыз</Button>
    </Upload>
  </FormItem>
)

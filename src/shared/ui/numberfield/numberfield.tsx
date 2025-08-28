import React from 'react'

import { InputNumber } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import { InputNumberProps } from 'antd/lib'

import cls from './numberfield.module.css'

interface Props extends InputNumberProps {
  label?: string
  initialValue?: string
  rules?: Rule[]
  maxLength?: number
}

export const InputNumberField: React.FC<Props> = (props) => {
  return (
    <FormItem
      className={`${cls.numberField}`}
      label={props.label}
      style={props.style}
      initialValue={props.initialValue}
      rules={props.rules}
      name={props.name}
    >
      <InputNumber
        className={props.className}
        placeholder={props.placeholder}
        disabled={props.disabled}
        type={props.type}
        onChange={props.onChange}
        maxLength={props.maxLength}
      />
    </FormItem>
  )
}

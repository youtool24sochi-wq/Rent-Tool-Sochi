import React from 'react'

import { Input, InputProps } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'

import cls from './textfield.module.css'

interface Props extends InputProps {
  label?: string | React.ReactNode
  initialValue?: string
  text?: string
  rules?: Rule[]
  maxLength?: number
  readOnly?: boolean
  isSimple?: boolean
}

export const TextField: React.FC<Props> = (props) => {
  return (
    <FormItem
      className={`${props.isSimple ? '' : cls.textField} ${props.disabled && cls.textField_disabled}`}
      label={props.label}
      style={props.style}
      initialValue={props.initialValue}
      rules={props.rules}
      name={props.name}
    >
      {
        props.text ? (
          <p className={cls.textField__description}>
            {props.text}
          </p>
        ) : null
      }

      <Input
        className={`${cls.textField__input} ${props.className}`}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={props.onChange}
        type={props.type}
        maxLength={props.maxLength}
        readOnly={props.readOnly}
        value={props.value}
      />
    </FormItem>
  )
}

import React from 'react'

import { Input } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import { PasswordProps } from 'antd/es/input'

import cls from './textfield-password.module.css'

interface Props extends PasswordProps {
  label?: string
  initialValue?: string
  text?: string
  rules?: Rule[]
  maxLength?: number
}

export const TextFieldPassword: React.FC<Props> = (props) => {
  return (
    <FormItem
      className={`${cls.textField} ${props.disabled && cls.textField_disabled}`}
      label={props.label}
      style={props.style}
    >
      {
        props.text ? (
          <p className={cls.textField__description}>
            {props.text}
          </p>
        ) : null
      }

      <FormItem
        name={props.name}
        rules={props.rules}
        initialValue={props.initialValue}
        noStyle
      >
        <Input.Password
          className={cls.textField__input}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onChange={props.onChange}
          type={props.type}
          maxLength={props.maxLength}
        />
      </FormItem>
    </FormItem>
  )
}

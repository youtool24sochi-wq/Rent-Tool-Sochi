import React from 'react'

import { DatePicker } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import dayjs, { Dayjs } from 'dayjs'

import cls from './date-picker-field.module.css'

import type { DatePickerProps } from 'antd'

interface Props extends DatePickerProps {
  label?: string
  rules?: Rule[]
  initialValue?: string
  pickerMode?: 'year' | 'month' | 'date'
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: Dayjs | null) => void
}

export const DatePickerField: React.FC<Props> = ({
  label,
  name,
  rules,
  pickerMode,
  className,
  onChange,
  ...rest
}) => {
  const handleChange: DatePickerProps['onChange'] = (dateValue) => {
    onChange?.(dateValue as Dayjs | null)
  }

  return (
    <FormItem
      label={label}
      className={cls.dateField}
      name={name}
      rules={rules}
      getValueProps={(value) => ({
        value: value ? (dayjs.isDayjs(value) ? value : dayjs(value)) : value,
      })}
    >
      <DatePicker
        picker={pickerMode}
        onChange={handleChange}
        className={`${cls.datepicker} ${className || ''}`}
        {...rest}
      />
    </FormItem>
  )
}

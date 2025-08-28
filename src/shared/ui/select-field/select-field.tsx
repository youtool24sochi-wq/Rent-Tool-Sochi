import { Select } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import { SelectProps } from 'antd/lib'

import cls from './select-field.module.css'

interface Props extends SelectProps {
  label?: string
  name?: string
  initialValue?: string
  rules?: Rule[]
  height?: number
}

export const SelectField: React.FC<Props> = ({
  label,
  name,
  initialValue,
  rules,
  className,
  ...selectProps
}) => {
  return (
    <FormItem
      className={cls.selectField}
      label={label}
      initialValue={initialValue}
      rules={rules}
      name={name}
    >
      <Select {...selectProps} className={className} />
    </FormItem>
  )
}

import { Radio } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import { RadioGroupProps } from 'antd/es/radio'

import cls from './radio-field.module.css'

interface Props extends RadioGroupProps {
  label?: string
  name?: string
  initialValue?: string | number | boolean
  rules?: Rule[]
  className?: string
}

export const RadioField: React.FC<Props> = ({
  label,
  name,
  initialValue,
  rules,
  className,
  ...groupProps
}) => (
  <FormItem
    className={cls.radioField}
    label={label}
    name={name}
    rules={rules}
    initialValue={initialValue}
  >
    <Radio.Group {...groupProps} className={className} />
  </FormItem>
)

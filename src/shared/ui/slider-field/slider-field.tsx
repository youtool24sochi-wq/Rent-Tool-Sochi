import { Slider } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import { SliderSingleProps, SliderRangeProps } from 'antd/es/slider'

import cls from './slider-field.module.css'

interface CommonProps {
  label?: string
  name?: string
  rules?: Rule[]
  className?: string
  initialValue?: number | [number, number]
}

type SingleSliderProps = CommonProps &
  Omit<SliderSingleProps, 'range' | 'defaultValue'> & {
    range?: false
  }

type RangeSliderProps = CommonProps &
  Omit<SliderRangeProps, 'range' | 'defaultValue'> & {
    range: true
  }

export type SliderFieldProps = SingleSliderProps | RangeSliderProps

export default function SliderField({
  label,
  name,
  rules,
  className,
  initialValue,
  ...sliderProps
}: SliderFieldProps) {
  return (
    <FormItem
      className={cls.sliderField}
      label={label}
      name={name}
      rules={rules}
      initialValue={initialValue}
    >
      <Slider {...(sliderProps as SliderSingleProps & SliderRangeProps)} className={className} />
    </FormItem>
  )
}

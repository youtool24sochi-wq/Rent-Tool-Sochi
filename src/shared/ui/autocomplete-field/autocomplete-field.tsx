import React from 'react'

import { AutoComplete, AutoCompleteProps, Spin } from 'antd'
import { Rule } from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'

import cls from './autocomplete-field.module.css'

interface Props extends AutoCompleteProps {
  label?: string,
  rules?: Rule[],
  initialValue?: string,
  name?: string,
  isLoadingProducts?: boolean
  optionLabelProp?: string
  value?: any
}

export const AutoCompleteField:React.FC<Props> = (props) => {
  return (
    <FormItem
      label={props.label}
      className={cls.autoCompleteField}
      name={props.name}
      rules={props.rules}
      initialValue={props.initialValue}
    >
      <Spin spinning={props.isLoadingProducts}>
        <AutoComplete
          options={props.options}
          placeholder={props.placeholder}
          filterOption={props.filterOption}
          className={props.className}
          onSearch={props.onSearch}
          onSelect={props.onSelect}
          onChange={props.onChange}
          value={props.value}
        />
      </Spin>
    </FormItem>
  )
}

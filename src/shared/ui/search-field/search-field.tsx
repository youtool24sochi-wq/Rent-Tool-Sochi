import { Input } from 'antd'
import { InputProps } from 'antd/lib'

import cls from './search-field.module.css'

interface Props extends InputProps {
   name?: string
}

export const SearchField: React.FC<Props> = (props) => {
  return (
    <Input
      name={props.name}
      className={cls.search__input}
      placeholder="Поиск"
      onChange={props.onChange}
      size={props.size}
      prefix={props.prefix}
    />
  )
}

import { Rule } from 'antd/es/form'
const RUS_PHONE_PATTERN = /^(\+7|8)\d{10}$/

export const required = (message: string): Rule => ({
  required: true,
  message,
})

export const emailFormat: Rule = {
  type: 'email',
  message: 'Неверный формат email',
}

export const phoneFormat: Rule = {
  validator: (_: unknown, value: string) => {
    const trimmed = (value ?? '').trim()

    return RUS_PHONE_PATTERN.test(trimmed)
      ? Promise.resolve()
      : Promise.reject(
        new Error('Телефон строго в виде +7XXXXXXXXXX или 8XXXXXXXXXX без разделителей'),
      )
  },
}

export const loginIdentifierRules = (
  type: 'email' | 'phone',
): Rule[] =>
  type === 'email'
    ? [required('Введите email'), emailFormat]
    : [required('Введите телефон'), phoneFormat]

export const registerRules = {
  email: [required('Введите email'), emailFormat] as Rule[],
  phone: [required('Введите телефон'), phoneFormat] as Rule[],
  password: [required('Введите пароль')] as Rule[],
  passwordConfirm: [required('Повторите пароль')] as Rule[],
}

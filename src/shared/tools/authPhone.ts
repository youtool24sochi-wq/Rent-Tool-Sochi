export const normalizePhone = (raw: string): string => {
  const phone = raw.replace(/[\s\-()]/g, '')

  if (phone.startsWith('8')) return '+7' + phone.slice(1)
  if (phone.startsWith('7')) return '+7' + phone.slice(1)

  return phone
}

export const isPhoneLike = (value: string): boolean =>
  /^(\+7|7|8)\d{9,}/.test(value)

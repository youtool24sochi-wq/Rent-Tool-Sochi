'use client'

import { useState, useRef, useEffect } from 'react'

import styles from './pincode-field.module.css'

type Props = {
  length?: number
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void
}

export default function PincodeField({ length = 6, value = '', onChange }: Props) {
  const [codes, setCodes] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] || ''),
  )

  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const joined = codes.join('')

    if (joined !== value) onChange?.(joined)
  }, [codes, value, onChange])

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...codes]

    next[idx] = val
    setCodes(next)
    if (val && idx < length - 1) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[idx] && idx > 0) inputs.current[idx - 1]?.focus()
  }

  return (
    <div className={styles.wrap}>
      {codes.map((c, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={c}
          className={styles.input}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          ref={(el) => {
            inputs.current[i] = el
          }}
        />
      ))}
    </div>
  )
}

interface DebounceOptions {
  loading?: boolean;
}

// eslint-disable-next-line no-unused-vars
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
  { loading = false }: DebounceOptions = {},
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<F>) => {
    const shouldCall = loading && !timer

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null
      if (!loading) {
        func(...args)
      }
    }, delay)

    if (shouldCall) {
      func(...args)
    }
  }

  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  return debounced
}

export const HomeVideoGET = async () => {
  try {
    const response = await fetch('/api/home/video/', { method: 'GET' })
    const data = await response.json()

    return data
  } catch (error) {
    console.log('failed to fetch catalog categories', error)
  }
}

export const HomePopularGET = async () => {
  try {
    const response = await fetch('/api/home/popular/', { method: 'GET' })
    const data = await response.json()

    return data
  } catch (error) {
    console.log('failed to fetch catalog categories', error)
  }
}

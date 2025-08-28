import localFont from 'next/font/local'

const Inter = localFont({
  src: [
    { path: './Inter_18pt-Light.ttf',    weight: '300', style: 'normal' },
    { path: './Inter_18pt-Regular.ttf',  weight: '400', style: 'normal' },
    { path: './Inter_18pt-Medium.ttf',   weight: '500', style: 'normal' },
    { path: './Inter_18pt-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './Inter_24pt-Bold.ttf',     weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
})

export { Inter }

import localFont from "next/font/local";

export const GeistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMono-Regular.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Medium.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-SemiBold.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  fallback: ['Pretendard Variable'],
})
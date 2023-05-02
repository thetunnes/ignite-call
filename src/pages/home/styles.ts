import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1120px) / 2)',

  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  gap: '$20',
})

export const Hero = styled('div', {
  maxWidth: 480,

  [`> ${Heading}`]: {},
  [`> ${Text}`]: {
    maskType: '$2',
    color: '$gray200',
  },

  '@media(max-width: 600px)': {
    maxWidth: '$6xl',
    textAlign: 'center',

    [`> ${Heading}`]: {},
    // [`> ${Text}`]: {
    //   maskType: '$2',
    //   color: '$gray200',
    // },
  },
})

export const Preview = styled('div', {
  overflow: 'hidden',
  paddingRight: '$8',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})

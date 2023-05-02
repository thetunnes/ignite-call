import { globalCss } from '@ignite-ui/react'

export const GlobalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    width: '100%',
    background: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})

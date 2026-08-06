import '../styles/tailwind.css'

import type { ReactNode } from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import { ThemeProvider } from 'styled-components'

import { theme } from '../styles/theme'

const preview: Preview = {
  decorators: [
    (Story): ReactNode => (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-mm-neutral-0 p-mm-4xl text-mm-neutral-900">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'Neutral 0',
      values: [
        { name: 'Neutral 0', value: '#ffffff' },
        { name: 'Neutral 50', value: '#fcfcfc' },
        { name: 'Neutral 100', value: '#f0f0f0' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { height: '812px', width: '375px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { height: '1024px', width: '768px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { height: '900px', width: '1280px' },
        },
      },
    },
  },
}

export default preview

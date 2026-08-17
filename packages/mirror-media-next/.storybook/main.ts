import { defineMain } from '@storybook/nextjs-vite/node'
import svgr from 'vite-plugin-svgr'

const config = defineMain({
  framework: '@storybook/nextjs-vite',
  stories: ['../components/ui/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  async viteFinal(config) {
    config.publicDir = false
    config.plugins = [
      ...(config.plugins ?? []),
      svgr({
        include: '**/*.svg',
      }),
    ]

    return config
  },
})

export default config

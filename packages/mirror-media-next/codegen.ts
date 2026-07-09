import type { CodegenConfig } from '@graphql-codegen/cli'

const scalarConfig = {
  ID: 'string',
  DateTime: 'string',
  JSON: 'unknown',
  Json: 'unknown',
  Upload: 'unknown',
}

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    'apollo/__generated__/content/': {
      schema: 'apollo/schema/content.graphql',
      documents: [
        'apollo/query/**/*.js',
        'apollo/fragments/**/*.js',
        '!apollo/query/magazine-orders.js',
        '!apollo/query/magazine-orders.ts',
        '!apollo/__generated__/**',
      ],
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
      config: {
        scalars: scalarConfig,
      },
    },
    'apollo/__generated__/member/': {
      schema: 'apollo/schema/member.graphql',
      documents: [
        'apollo/membership/**/*.{js,ts}',
        'apollo/query/magazine-orders.{js,ts}',
        '!apollo/__generated__/**',
      ],
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
      config: {
        scalars: scalarConfig,
      },
    },
    'apollo/__generated__/story/': {
      schema: 'apollo/schema/story.graphql',
      documents: ['apollo/codegen-documents/story.graphql'],
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
      config: {
        scalars: scalarConfig,
      },
    },
  },
}

export default config

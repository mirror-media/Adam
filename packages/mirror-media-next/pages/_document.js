//This file is used to override default Document of Nextjs, and update update the `<html>` and `<body>` tags used to render a page.
//We also add server-side setting of `styled-components`, which can be rendered at timing of page has visible content but not interactive.
//For more detail, please visited documentation of [Nextjs](https://nextjs.org/docs/advanced-features/custom-document) and [styled-component](https://styled-components.com/docs/advanced#server-side-rendering)

import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

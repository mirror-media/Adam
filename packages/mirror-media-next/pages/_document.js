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
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />

          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta
            name="msapplication-TileColor"
            content="#5bbad5"
            key="msapplication-TileColor"
          />
          <meta name="theme-color" content="#ffffff" key="theme-color" />
          <meta
            name="google-site-verification"
            content="8tUjQvQoBEANJ6nRE9fMnsw2qODvbAgqDjSkLj-Mdw0"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

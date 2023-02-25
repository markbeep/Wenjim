import Document, { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
          <link rel="icon" type="image/png" href="/assets/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WFP61JCLV3"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WFP61JCLV3');
          `,
          }}
        />
      </Html>
    );
  }
}

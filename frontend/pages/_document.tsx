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
          <title>Wenjim | ASVZ Data & Graphs</title>
          <meta name="title" content="Wenjim | ASVZ Data & Graphs" />
          <meta
            name="description"
            content="View data & graphs from ASVZ, find out what spots are the least crowded, and at what time how many are in the gym."
          />
          <meta name="keywords" content="asvz, sport, wenjim, data, graph" />
          <meta name="robots" content="index, follow" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta name="author" content="Markbeep" />

          <meta name="og:title" content="Wenjim | ASVZ Data & Graphs" />
          <meta
            name="og:description"
            content="Open source ASVZ Data and Graphs"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

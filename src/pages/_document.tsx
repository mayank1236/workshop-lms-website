import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react';

export default function Document() {

  return (
    <Html lang="en">
      <Head>
        <script src="https://chimpstatic.com/mcjs-connected/js/users/9d8dcd663984aed5841bb2b05/f9c324ff7c499e1db876c9a5a.js" async={true}></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

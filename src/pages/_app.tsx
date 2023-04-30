import Container from '@/components/Layout/Container';
import Footer from '@/components/Layout/Footer';
import Navigation from '@/components/Layout/Navigation'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = true;
  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} />
      {<Component {...pageProps} />}
      <Footer />
    </>
  );
}

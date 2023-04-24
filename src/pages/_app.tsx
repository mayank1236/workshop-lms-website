import Container from '@/components/Layout/Container';
import Footer from '@/components/Layout/Footer';
import Navigation from '@/components/Layout/Navigation'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = true;
  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} />
      <Container>
        {[<Component {...pageProps} />]}
      </Container>
      <Footer />
    </>
  );
}

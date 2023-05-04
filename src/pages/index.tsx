import Image from 'next/image'
import { Inter } from 'next/font/google'
import Home from '@/components/sections/home';
import About from '@/components/sections/about';
import Contact from '@/components/sections/contact';
import Faq from '@/components/sections/faq';
import Footer from '@/components/Layout/Footer';
import Navigation from '@/components/Layout/Navigation'


const inter = Inter({ subsets: ['latin'] })

export default function main() {
  const isLoggedIn = true;
  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} />
      <main className={`flex flex-col justify-between ${inter.className}`}>
        <Home />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>

  );
}

import Image from 'next/image'
import { Inter } from 'next/font/google'
import Home from '@/components/sections/home';
import About from '@/components/sections/about';
import Contact from '@/components/sections/contact';
import Faq from '@/components/sections/faq';
import Footer from '@/components/Layout/Footer';
import Navigation from '@/components/Layout/Navigation'
import Instructor from '@/components/sections/instructor';
import Schedule from '@/components/sections/schedule';
import Partners from '@/components/sections/partners';
import Included from '@/components/sections/included';


const inter = Inter({ subsets: ['latin'] })

export default function main() {
  const isLoggedIn = true;
  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} />
      <main className={`flex flex-col justify-between ${inter.className}`}>
        <Home />
        <About />
        <Instructor />
        <Schedule />
        <Included />
        <Partners />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>

  );
}

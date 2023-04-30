import Image from 'next/image'
import { Inter } from 'next/font/google'
import Home from '@/components/sections/home';
import About from '@/components/sections/about';

const inter = Inter({ subsets: ['latin'] })

export default function main() {
  return (
    <main
      className={`flex flex-col justify-between ${inter.className}`}
    >
      <Home />
      <About />
      <section className="faq">
        <h2>FAQ</h2>
      </section>
      <section className="contact">
        <h2>Contact</h2>
      </section>
    </main>
  );
}

import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex flex-col justify-between ${inter.className}`}
    >
      <section className="home">
        <h5>Welcome to out workshop</h5>
        <h2>Home</h2>
      </section>
      <section className="about">
        <h2>About</h2>
      </section>
      <section className="faq">
        <h2>FAQ</h2>
      </section>
      <section className="contact">
        <h2>Contact</h2>
      </section>
    </main>
  );
}

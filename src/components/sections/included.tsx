import React, { useRef } from 'react'

import Section from '../Layout/Section'
import Container from '../Layout/Container'

import pricing from '@/styles/pricing.module.scss';
import { useRouter } from 'next/router';



const Included = () => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    const handleClick = () => {
        btnRef.current?.click()
    }

    return (
        <Section id="included">
            <Container>
                <h2>Get Ready For An Amazing Experience!</h2>
                <div className={pricing.pricing} onClick={handleClick}>
                    <div className={pricing.price}>
                        <h3>Mandala Confluence</h3>
                        <p>Unlock a world of opportunities to learn, connect and grow as an artist</p>
                        <ul>
                            <li>Learn from 12 top instructors joining us for the workshop. They will guide you through diverse methods & techniques to help you take your mandala-making skills to the next level.</li>
                            <li>Network and connect with like-minded individuals from across the world! This is a unique opportunity to meet and interact with professional mandala artists and aspiring artists alike and build connections that will last long after the workshop ends.</li>
                            <li>Join our exclusive community on Telegram and stay connected with other participants, instructors, and organizers even after the workshop concludes.</li>
                            <li>Get 6 months' access to recordings of all LIVE events so that you can revisit and practice the techniques you learned during the workshop anytime, anywhere, until 31st December!</li>
                            <li>Take part in exciting giveaways & takeaways during the workshop and stand a chance to win some amazing prizes.</li>
                            <li>Present your work in front of top artists and receive valuable feedback to help you improve your skills and technique.</li>
                            <li>Lastly, don't miss the LIVE stationery/art supplies fair where your favorite brands and artists will showcase and sell their products at a discounted price - it's a great opportunity to stock up on high-quality art supplies and tools.</li>
                        </ul>
                        <div className={pricing.moneyBg}>
                            <p>At only <span className={pricing.highlight}>INR 6499</span> (original value~ <span className={pricing.original}>INR 24999</span>)</p>
                            <button onClick={() => router.push('/register')} ref={btnRef}>Learn from the best in the industry and join the Mandala Confluence</button>
                        </div>
                        <div className={pricing.priceBg}></div>
                    </div>
                </div>
            </Container>
        </Section>
    )
}

export default Included


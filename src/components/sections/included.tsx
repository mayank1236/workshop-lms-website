import React, { useRef } from 'react'

import Section from '../Layout/Section'
import Container from '../Layout/Container'

import pricing from '@/styles/pricing.module.scss';
import { useRouter } from 'next/router';



const Included = () => {
    const router = useRouter();

    const downloadBrochure = () => {
        // code to download brochure
    }

    return (
        <Section id="included">
            <Container>
                <h2>What's Included?</h2>
                <div className={pricing.pricing}>
                    <div className={pricing.price}>
                        <h3>Mandala Confluence</h3>
                        <p>Unlock a world of opportunities to learn, connect and grow as an artist</p>
                        <ul>
                            <li>Learn from 10 top instructors joining us for the confluence. They will guide you through diverse methods & techniques to help you take your mandala-making skills to the next level.</li>
                            <li>Network and connect with like-minded individuals from across the world through our unique as well as professional development events! This is aa amazing opportunity to meet and interact with professional mandala artists and aspiring artists alike and build connections that will last long after the confluence ends.</li>
                            <li>Join our exclusive community on Facebook and stay connected with other participants, instructors, and organizers even after the workshop concludes.</li>
                            <li>Get 6 months access to recordings of all the workshops so that you can revisit and practice the techniques you learned during the confluence anytime, anywhere, until 31st December! 2023. LIVE Q&A will not be recorded</li>
                            <li>Take part in exciting giveaways sponsored by our collaborators during the confluence and stand a chance to win some amazing prizes!</li>
                            <li>Present your work in front of top artists and receive valuable feedback to help you improve your skills and move one step closer to your goals.</li>
                            <li>Lastly, don't miss the LIVE stationery/art supplies fair where your favorite brands and artists will sell their products & services with exclusive discounts - it's a great opportunity to stock up on high-quality art supplies and tools.</li>
                        </ul>
                        <div className={pricing.moneyBg}>
                            {/* <p>At only <span className={pricing.highlight}>INR 6499</span> (original value~ <span className={pricing.original}>INR 24999</span>)</p> */}
                            <button onClick={() => downloadBrochure()}>Download Event Brochure</button>
                            <button onClick={() => router.push('https://art.us9.list-manage.com/subscribe?u=9d8dcd663984aed5841bb2b05&id=938d162999')}>Join the Waitlist</button>
                        </div>
                        <div className={pricing.priceBg}></div>
                    </div>
                </div>
            </Container>
        </Section>
    )
}

export default Included


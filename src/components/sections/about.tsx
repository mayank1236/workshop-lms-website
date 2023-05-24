import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ContentWrapper from '../Layout/ContentWrapper'
import ImageWrapper from '../Layout/ImageWrapper'
import Image from 'next/image'

import style from '@/styles/responsive.module.scss';

const About = () => {
    const rowStyle = {
        paddingBottom: '50px'
    }

    const center: { [key: string]: string } = {
        textAlign: "center"
    }

    return (
        <Section options={{
            paddingTop: "130px",
            background: "#FAFAFA"
        }} nameOfClass={style.about} id="about">
            <Container>
                <h2>Mandala Confluence</h2>
                <Row options={rowStyle} nameOfClass={style.row}>
                    <ContentWrapper>
                        <h5 style={center}>Where creativity meets opportunity…</h5>
                        <p>
                            Our vision is to empower people by providing a gateway to the beautiful world of mandala making, regardless of skill level. At the Confluence, we aim to offer diverse techniques and methods to elevate your art and provide personal and professional development opportunities to help you flourish. We strongly believe that mandala making is not just a skill but a tool for self-discovery and personal growth. Join our community of hobbyists and professionals today, and let your creativity flow!
                        </p>
                    </ContentWrapper>
                    <ImageWrapper>
                        <Image
                            src="/Mandala7.JPEG"
                            fill={true}
                            alt="girl holding a book while thinking"
                        />
                    </ImageWrapper>
                </Row>
                <Row options={rowStyle} nameOfClass={style.row}>
                    <ImageWrapper>
                        <Image
                            src="/Mandala8.JPEG"
                            fill={true}
                            alt="girl holding a book while thinking"
                        />
                    </ImageWrapper>
                    <ContentWrapper>
                        <h5 style={center}>What’s Unique?</h5>
                        <p>
                            With our Mandala confluence, we aim to bring together Mandala artists from around the world. Our workshop is designed to make aspiring artists aware of the therapeutic and meditative benefits and how they can harness them in their own lives. Featuring unique professional development opportunities via Gather Town and LIVE Q&A sessions
                            with top Mandala artists, the Confluence provides a chance to network and learn from the best in the field. And for those who can't make it to the LIVE event, we offer post-event recordings for sale so that you can learn and grow at your own convenience. Join us for the first Mandala confluence ever to unlock your creative potential, connect with like-minded artists, and explore the power of Mandala art.
                        </p>
                    </ContentWrapper>
                </Row>
                <Row options={rowStyle} nameOfClass={style.row}>
                    <ContentWrapper>
                        <h5 style={center}>Format of the Event</h5>
                        <p>
                            The Mandala Confluence will be a completely virtual event that will be delivered through Zoom and Gather Town. The virtual format enables us to achieve our goal of making this event accessible to artists from all around the world. Gather Town is a ground-breaking virtual space platform that offers a fresh approach to holding conferences, meetings, and events online. Participants may engage with each other at the event venue in the same way they would in person, thanks to the immersive 2D environment, making for a genuinely exceptional and interesting experience.
                        </p>
                    </ContentWrapper>
                    <ImageWrapper>
                        <Image
                            src="/Mandala01.png"
                            fill={true}
                            alt="girl holding a book while thinking"
                        />
                    </ImageWrapper>
                </Row>
                <Row nameOfClass={style.row}>
                    <ImageWrapper>
                        <Image
                            src="/anvita.jpeg"
                            fill={true}
                            alt="Picture of Anvita, the organizer of Mandala Confluence"
                        />
                    </ImageWrapper>
                    <ContentWrapper>
                        <h5 style={center}>Meet our Organizer</h5>
                        <p>
                            Meet Anvita Kulshrestha, a geneticist by day and an artist by night! Hailing from Delhi, India, she completed her undergraduate education in Genetics & Genomics as well as Toxicology from the University of California, Berkeley. After working as a Full-time Research Associate at Yale University, she is currently pursuing a Ph.D. in Genetics & Genomics from Duke University.
                            <br />
                            Apart from her scientific pursuits, she is also an accomplished Mandala artist and an avid Calligrapher. Art found her by chance a little over two years ago and has been a passion ever since. She loves experimenting with different art mediums and techniques to create unique amalgamations.
                        </p>
                    </ContentWrapper>
                </Row>
            </Container>
        </Section>
    )
}

export default About
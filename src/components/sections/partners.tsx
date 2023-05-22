import React from 'react'
import Section from '../Layout/Section'
import Image from 'next/image'
import style from '@/styles/partners.module.scss'
import Container from '../Layout/Container'

const Partners = () => {
    return (
        <Section id="partners">
            <Container>
                <h2>Partners/Collaborators</h2>
                <div className={style.partners}>
                    <div>
                        <Image src="/brand/ArtLounge.png" fill={true} alt={'Art Lounge'} />
                    </div>
                    <div>
                        <Image src="/brand/AyushPaper.png" fill={true} alt={'Ayush Paper'} />
                    </div>
                    <div>
                        <Image src="/brand/HappyDottingCompany.jpg" fill={true} alt={'Happy Dotting Company'} />
                    </div>
                </div>
            </Container>
        </Section>
    )
}

export default Partners
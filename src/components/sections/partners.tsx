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
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                    <div>
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                    <div>
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                    <div>
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                    <div>
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                    <div>
                        <Image src="/logo.png" fill={true} alt={'brand 1 logo'} />
                    </div>
                </div>
            </Container>
        </Section>
    )
}

export default Partners
import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ContentWrapper from '../Layout/ContentWrapper'
import ImageWrapper from '../Layout/ImageWrapper'
import Image from 'next/image'

import style from '@/styles/responsive.module.scss';

const About = () => {
    return (
        <Section options={{
            paddingTop: "130px"
        }} nameOfClass={style.about}>
            <Container>
                <Row nameOfClass={style.row}>
                    <ContentWrapper>
                        <h5>About our company</h5>
                        <h2>Master the skills to drive your career</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget aenean accumsan bibendum gravida maecenas augue elementum et neque. Suspendisse imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget aenean accumsan bibendum gravida maecenas augue elementum et neque. Suspendisse imperdiet.</p>
                    </ContentWrapper>
                    <ImageWrapper>
                        <Image
                            src="/about.png"
                            fill={true}
                            alt="girl holding a book while thinking"
                        />
                    </ImageWrapper>
                </Row>
            </Container>
        </Section>
    )
}

export default About
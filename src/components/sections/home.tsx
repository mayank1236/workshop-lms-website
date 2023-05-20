import React from 'react'
import Image from 'next/image';

import Container from '../Layout/Container'
import Section from '../Layout/Section'
import Row from '../Layout/Row'
import ImageWrapper from '../Layout/ImageWrapper';
import ContentWrapper from '../Layout/ContentWrapper';
import Star from '../resources/Star';
import Background from '../resources/Background';
import Icon from '../resources/Icon';
import Blob from '../Layout/Blob';
import BlobRow from '../Layout/BlobRow';

import style from '@/styles/responsive.module.scss';

const Home = () => {
    const achievements = [
        {
            name: 'pen',
            number: '10K',
            desc: 'Online Courses',
            color: '#f7746d',
            bg: "#fff0ee"
        },
        {
            name: 'badge',
            number: '186+',
            desc: 'Expert Tutors',
            color: '#2e35b8',
            bg: "#ecedfe"
        },
        {
            name: 'certified',
            number: '5K+',
            desc: 'Ceritified Courses',
            color: '#681986',
            bg: "#fff2f8"
        },
        {
            name: 'graduate',
            number: '55K+',
            desc: 'Online Students',
            color: '#3b97d3',
            bg: "#eafdff"
        }
    ]

    return (
        <Section options={{
            zIndex: "2"
        }} nameOfClass={style.home}>
            <Container>
                <Row nameOfClass={style.row}>
                    <ContentWrapper>
                        <h5>The Leader in Online Learning</h5>
                        <h1>Engaging & Accessible Online Courses For All</h1>
                        <button type="button" style={{ marginBottom: "40px" }}>Register</button>
                        <h5>Trusted by over 15K Users <br />worldwide since 2022</h5>
                        <Row options={{ height: "50px" }}>
                            <ContentWrapper><h2>290+</h2></ContentWrapper>
                            <ContentWrapper options={{
                                display: "inline-block",
                                width: "auto"
                            }}>
                                <h2>4.5</h2>
                            </ContentWrapper>
                            <Row options={{
                                justifyContent: "flex-start"
                            }}>
                                <Star /><Star /><Star /><Star /><Star />
                            </Row>
                        </Row>
                    </ContentWrapper>
                    <ImageWrapper>
                        <Image
                            src="/hero-img.png"
                            fill={true}
                            alt="girl holding a book while thinking"
                        />
                    </ImageWrapper>
                </Row>
                <BlobRow>
                    {
                        achievements.map(achieve => {
                            return (
                                <Blob key={achieve.name}>
                                    <Row options={{
                                        minHeight: "100%"
                                    }}>
                                        <ImageWrapper options={{ minHeight: "100%", borderRadius: "15px", background: `${achieve.bg}`, padding: "10px" }}>
                                            <Icon icon={achieve.name} color={achieve.color} />
                                        </ImageWrapper>
                                        <ContentWrapper>
                                            <h2 style={{ margin: 0, textAlign: 'left' }}>
                                                {achieve.number}
                                            </h2>
                                            <p>
                                                {achieve.desc}
                                            </p>
                                        </ContentWrapper>
                                    </Row>
                                </Blob>
                            )
                        })
                    }
                </BlobRow>
            </Container>
            {/* <Background /> */}
        </Section>
    )
}

export default Home
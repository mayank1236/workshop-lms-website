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

import style from '@/styles/animation.module.scss';

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
        }}>
            <Container>
                <Row>
                    <ContentWrapper>
                        <h5>The Leader in Online Learning</h5>
                        <h1>Engaging & Accessible Online Courses For All</h1>
                        <button type="button" className="mb-8">Register</button>
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
                <Row
                    options={{
                        position: "absolute",
                        left: "0px",
                        top: "95%",
                        height: "100px",
                        padding: "0 40px",
                        gap: "40px",
                        alignItems: "center",
                        maxWidth: "1240px",
                        margin: "0 auto",
                        right: "0"
                    }}>
                    {
                        achievements.map(achieve => {
                            return (
                                <div className={style.onHoverMoveUp}>
                                    <ContentWrapper options={{
                                        padding: "10px",
                                        background: "white",
                                        borderRadius: "15px",
                                        border: "#cac8ce 1px solid",
                                        height: "120px"
                                    }}>
                                        <Row options={{
                                            minHeight: "100%"
                                        }}>
                                            <ImageWrapper options={{ minHeight: "100%", borderRadius: "15px", background: `${achieve.bg}`, padding: "10px" }}>
                                                <Icon icon={achieve.name} color={achieve.color} />
                                            </ImageWrapper>
                                            <ContentWrapper>
                                                <h2 style={{ margin: 0 }}>
                                                    {achieve.number}
                                                </h2>
                                                <p>
                                                    {achieve.desc}
                                                </p>
                                            </ContentWrapper>
                                        </Row>
                                    </ContentWrapper>
                                </div>
                            )
                        })
                    }
                </Row>
            </Container>
            <Background />
        </Section>
    )
}

export default Home
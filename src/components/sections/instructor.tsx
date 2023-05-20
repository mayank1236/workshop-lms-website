import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ContentWrapper from '../Layout/ContentWrapper'
import Image from 'next/image'
import ImageWrapper from '../Layout/ImageWrapper'
import Icon from '../resources/Icon'

// import style from "@/styles/instructor.module.scss";

const Instructor = () => {
    const iconSize = {
        width: "20px"
    }

    const instructors = [
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        },
        {
            url: 'instructor.jpg',
            name: 'Instructor',
            handle: '@Instagram',
            instagram: 'https://www.instagram.com/',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hello I am a an artist who"ll teach in this workshop. Thankyou'
        }
    ]

    return (
        <Section id="instructors">
            <Container>
                <h2>
                    Instructors
                </h2>
                <Row options={{ flexWrap: 'wrap' }}>
                    {instructors.map(i => {
                        return (
                            <ContentWrapper
                                options={{
                                    justifyContent: "center",
                                    width: "calc(50% - 40px)",
                                    padding: "20px",
                                    borderRadius: "15px",
                                    background: "rgba(241, 91, 41, 0.13)"
                                }}
                            >
                                <Image
                                    src={`/${i.url}`}
                                    style={{
                                        borderRadius: "100%",
                                        margin: "0 auto 20px"
                                    }}
                                    width={180}
                                    height={180}
                                    alt="Instructor"
                                />
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        textAlign: "center",
                                        marginBottom: "10px",
                                        color: "#F15A29"
                                    }}
                                >{i.name}</h3>
                                <h3 style={{ margin: "0 auto 10px" }}>
                                    <a
                                        href={i.instagram}
                                        target='blank'
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            color: "#1C75BC"
                                        }}
                                    >
                                        <div style={iconSize}><Icon icon="instagram" color="#1C75BC" /></div>
                                        {i.handle}
                                    </a>
                                </h3>
                                <p>{i.description}</p>
                            </ContentWrapper>
                        )
                    })}
                </Row>
            </Container>
        </Section>
    )
}

export default Instructor
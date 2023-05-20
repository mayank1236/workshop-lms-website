import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ImageWrapper from '../Layout/ImageWrapper'
import Blob from '../Layout/Blob'
import Image from 'next/image'
import Icon from '../resources/Icon'
import ContentWrapper from '../Layout/ContentWrapper'
import Form from '../user/ContactForm'

import style from "@/styles/responsive.module.scss";

const Contact = () => {
    const contactInfo = [
        {
            icon: 'phone',
            name: 'Phone',
            info: ['(123) 456-7890']
        },
        {
            icon: 'email',
            name: 'Email Adress',
            info: ['johnsmith@example.com']
        },
        {
            icon: 'address',
            name: 'Address',
            info: ['367 Hillcrest Lane, Irvine,', 'California, United States']
        }
    ]
    return (
        <Section id="contact">
            <Container>
                <Row options={{ gap: "20px", marginBottom: "40px" }} nameOfClass={style.row}>
                    {
                        contactInfo.map((contact, index) => {

                            return (<Blob options={{
                                height: "100%",
                                alignItems: "center",
                                padding: "24px",
                                minWidth: "350px"
                            }} nameOfClass={style.item}>
                                <ImageWrapper
                                    options={{
                                        minHeight: "auto",
                                        height: "75px",
                                        width: "75px",
                                        borderRadius: "100%",
                                        background: "#fde1e0",
                                        padding: "20px",
                                        marginBottom: "20px"
                                    }}
                                >
                                    <Icon
                                        icon={contact.icon}
                                        color="#ff6575"
                                    />
                                </ImageWrapper>
                                <h5>{contact.name}</h5>
                                <div>
                                    {contact.info.map(info => { return (<p key={index}>{info}</p>) })}
                                </div>
                            </Blob>)
                        })
                    }
                </Row>
                <Row nameOfClass={style.row}>
                    <ImageWrapper>
                        <Image
                            src="/contact.jpg"
                            fill={true}
                            alt="crowd of people walking"
                        />
                    </ImageWrapper>

                    <ContentWrapper>
                        <h2 style={{ textAlign: 'left' }}>Get In Touch</h2>
                        <p>Aliquam lorem ante, dapibus in, viverra quis</p>
                        <Form />
                    </ContentWrapper>
                </Row>
            </Container>
        </Section>
    )
}

export default Contact
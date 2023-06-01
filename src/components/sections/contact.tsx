import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ImageWrapper from '../Layout/ImageWrapper'
import Image from 'next/image'
import Icon from '../resources/Icon'
import ContentWrapper from '../Layout/ContentWrapper'
import Form from '../user/ContactForm'

import { useRouter } from 'next/router'

import style from "@/styles/responsive.module.scss"



const Contact = () => {
    const router = useRouter();
    const contactInfo = [
        {
            icon: 'instagram',
            name: 'Phone',
            info: ['https://www.instagram.com/anvita.art/']
        },
        {
            icon: 'email',
            name: 'Email Adress',
            info: ['Mail@anvita.art']
        },
        {
            icon: 'facebook',
            name: 'Facebook',
            info: ['https://www.facebook.com/anvita.art']
        }
    ]
    return (
        <Section id="contact">
            <Container>
                <h2>Get In Touch</h2>
                <Row options={{ gap: "20px", justifyContent: "space-around" }} nameOfClass={style.row}>
                    {contactInfo.map((contact, index) => {

                        return (<div style={{
                            height: "100%",
                            alignItems: "center",
                            padding: "24px",
                            minWidth: "350px",
                            cursor: 'pointer'
                        }}
                            className={style.item}
                            onClick={() => { document.location.href = contact.info[0] }}
                        >
                            <ImageWrapper
                                options={{
                                    minHeight: "auto",
                                    height: "75px",
                                    width: "75px",
                                    borderRadius: "100%",
                                    background: "rgba(241, 91, 41, 0.13)",
                                    padding: "20px",
                                    margin: "0px auto 20px"
                                }}
                            >
                                <Icon
                                    icon={contact.icon}
                                    color="#1C75BC"
                                />
                            </ImageWrapper>
                        </div>)
                    })}
                </Row>
                <Row nameOfClass={style.row}>
                    <ImageWrapper>
                        <Image
                            src="/mandalaconfluence/contact.jpg"
                            fill={true}
                            alt="crowd of people walking"
                        />
                    </ImageWrapper>

                    <ContentWrapper>
                        <Form />
                    </ContentWrapper>
                </Row>
            </Container>
        </Section>
    )
}

export default Contact
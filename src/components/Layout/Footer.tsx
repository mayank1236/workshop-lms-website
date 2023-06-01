import React from 'react'
import style from '@/styles/footer.module.scss';
import Container from './Container';
import Row from './Row';
import Section from './Section';
import ContentWrapper from './ContentWrapper';
import Link from 'next/link';

const Footer = () => {
    return (
        <Section>
            <footer className={style.footer}>
                <Container>
                    <Row>
                        <div><h3>Contact Us</h3>Unit No. 510, <br />City Center, <br />Sector - 12, Dwarka, <br />New Delhi - 110075</div>
                        <ContentWrapper options={{ justifyContent: "flex-end" }}>
                            <div><Link href="/privacy-policy">Privacy Policy</Link></div>
                            <div><Link href="/terms&conditions">Terms & Conditions</Link></div>
                            <div><Link href="/aboutus">About Us</Link></div>
                            <div><Link href="/contactus">Contact Us</Link></div>
                            <div><Link href="/refund&returnpolicy">Refund & Return Policy</Link></div>
                        </ContentWrapper>
                    </Row>
                </Container>
            </footer>
        </Section>
    )
}

export default Footer
import Container from '@/components/Layout/Container';
import Footer from '@/components/Layout/Footer';
import Navigation from '@/components/Layout/Navigation';
import Section from '@/components/Layout/Section';
import React from 'react'

const privacyPolicy = () => {
    return (
        <>
            <Navigation isLoggedIn={false} />
            <Section>
                <Container>
                    <>
                        Privacy Policy
                    </>
                </Container>
            </Section>
            <Footer />
        </>
    )
}

export default privacyPolicy;
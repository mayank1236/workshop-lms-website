import Footer from '@/components/Layout/Footer'
import Navigation from '@/components/Layout/Navigation'
import Contact from '@/components/sections/contact'
import React from 'react'

const contactus = () => {
    return (
        <>
            <Navigation isLoggedIn={false} />
            <Contact />
            <Footer />
        </>
    )
}

export default contactus
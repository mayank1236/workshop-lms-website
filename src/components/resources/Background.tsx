import React from 'react'
import Image from 'next/image'

const Background = () => {
    return (
        <Image src="/background.png" style={{ zIndex: '-1' }} fill={true} alt="hero-background" />
    )
}

export default Background
import style from '@/styles/navigation.module.scss';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from './Container';

type props = {
    isLoggedIn: boolean
}

const Navigation = (props: props) => {
    const image = "https://dreamslms-wp.dreamguystech.com/wp-content/themes/dreamslms/assets/images/logo.svg";
    console.log(props);
    return (
        <header className={style.header}>
            <Container options={{
                position: "fixed",
                width: "100%",
                background: "inherit",
                boxShadow: "inherit",
                left: "0px",
                right: "0px"
            }}>
                <div className={style.logo}>
                    <Image
                        src={image}
                        alt="lms-logo"
                        fill={true}
                        className={style.logoImg}
                    ></Image>
                </div>
                <nav className={style.nav}>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/events">Events</Link></li>
                    </ul>
                </nav>
                <div className={style.buttons}>
                    <button type="button">Login</button>
                    <button type="button">Register</button>
                </div>
            </Container>
        </header>
    )
}

export default Navigation;
import style from '@/styles/navigation.module.scss';

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from './Container';

type props = {
    isLoggedIn: boolean
}

const Navigation = (props: props) => {
    const toggleBtnRef = useRef<HTMLButtonElement>(null);

    let toggle = false;

    useEffect(() => {
        const triggerToggle = (e: any) => {
            toggle = !toggle;
            toggle ? toggleBtnRef.current?.classList.add('nav-toggle--active') : toggleBtnRef.current?.classList.remove('nav-toggle--active');
        };

        toggleBtnRef.current?.addEventListener('click', triggerToggle)

        return () => toggleBtnRef.current?.removeEventListener('click', triggerToggle);
    }, [toggleBtnRef.current])

    console.log(props);
    return (
        <header className={style.header}>
            <Container options={{
                position: "fixed",
                maxWidth: "100%",
                background: "inherit",
                boxShadow: "inherit",
                left: "0px",
                right: "0px"
            }}>
                <div className={style.logo}>
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="lms-logo"
                            fill={true}
                            className={style.logoImg}
                        ></Image>
                    </Link>
                </div>
                <nav className={style.nav}>
                    <ul>
                        <li><Link href="#about" scroll={false}>About</Link></li>
                        <li><Link href="#instructors" scroll={false}>Instructors</Link></li>
                        <li><Link href="#schedule" scroll={false}>Schedule</Link></li>
                        <li><Link href="#included" scroll={false}>What's Included</Link></li>
                        <li><Link href="#partners" scroll={false}>Partners</Link></li>
                        <li><Link href="#faq" scroll={false}>FAQ</Link></li>
                        <li><Link href="#contact" scroll={false}>Contact</Link></li>
                    </ul>
                </nav>
                <div className={style.buttons}>
                    <Link href="login"><button type="button">Login</button></Link>
                    <Link href="/register"><button type="button">Register</button></Link>
                </div>
                <button ref={toggleBtnRef} className="nav-toggle">
                    <span className="nav-toggle__text">Toggle Menu</span>
                </button>
            </Container>
        </header>
    )
}

export default Navigation;
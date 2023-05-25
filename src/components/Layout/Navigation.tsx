import style from '@/styles/navigation.module.scss';

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from './Container';
import useWindowSize from '@/hooks/useWindowSize';

type props = {
    isLoggedIn: boolean
}

const Navigation = (props: props) => {
    const [toggle, setToggle] = useState(false);
    const { width } = useWindowSize();

    const toggleNav = () => {
        setToggle(!toggle);
    }

    const navBar = (<>
        <nav className={style.nav}>
            <ul>
                <li onClick={toggleNav}><Link href="#about" scroll={false}>About</Link></li>
                <li onClick={toggleNav}><Link href="#instructors" scroll={false}>Instructors</Link></li>
                <li onClick={toggleNav}><Link href="#schedule" scroll={false}>Schedule</Link></li>
                <li onClick={toggleNav}><Link href="#included" scroll={false}>What's Included</Link></li>
                <li onClick={toggleNav}><Link href="#partners" scroll={false}>Collaborators</Link></li>
                <li onClick={toggleNav}><Link href="#faq" scroll={false}>FAQs</Link></li>
                <li onClick={toggleNav}><Link href="#contact" scroll={false}>Contact US</Link></li>
            </ul>
        </nav>
        <div className={style.buttons}>
            {/* <Link onClick={toggleNav} href="login"><button type="button">Login</button></Link>
            <Link onClick={toggleNav} href="/register"><button type="button">Register</button></Link> */}
            <Link onClick={toggleNav} href='https://art.us9.list-manage.com/subscribe?u=9d8dcd663984aed5841bb2b05&id=938d162999'><button type="button">Join the Waitlist</button></Link>
        </div>
    </>);

    // console.log(props);
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
                {(width >= 1240) ?
                    (<>
                        {navBar}
                    </>) :
                    <div
                        className={toggle ? style.mobileNav : style.hideNav}
                    >
                        {navBar}
                    </div>}
                {
                    (width <= 1240) ? (<button onClick={toggleNav} className={`nav-toggle ${toggle ? 'nav-toggle--active' : ''}`}>
                        <span className="nav-toggle__text">Toggle Menu</span>
                    </button>) : (<></>)
                }
            </Container>
        </header>
    )
}

export default Navigation;
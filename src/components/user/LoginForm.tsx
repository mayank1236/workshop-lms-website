import React from 'react'
import Image from 'next/image';

import Row from '../Layout/Row';
import ContentWrapper from '../Layout/ContentWrapper';
import ImageWrapper from '../Layout/ImageWrapper';
import Container from '../Layout/Container';
import Background from '../resources/Background';

import style from '@/styles/form.module.scss';
import Link from 'next/link';

const LoginForm = () => {
    return (
        <>
            <Row
                options={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingRight: "40px"
                }}
                nameOfClass={style.row}
            >
                <ContentWrapper options={{ alignItems: "center", height: "100vh", justifyContent: "center" }}>
                    <ImageWrapper>
                        <Image src="/login.png" fill={true} alt="Login Page Illustration" />
                    </ImageWrapper>
                    <h2>Welcome to Dreams LMS</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                    <Background />
                </ContentWrapper>
                <ContentWrapper>
                    <Row options={{ height: "50px" }}>
                        <div className={style.logo}>
                            <Image
                                src="/logo.png"
                                alt="lms-logo"
                                fill={true}
                                className={style.logoImg}
                            ></Image>
                        </div>
                        <Link href="/">Back To Home</Link>
                    </Row>
                    <div className={style.form} style={{ paddingRight: "0" }}>
                        <form>
                            <label>
                                Username or Email Address
                                <input type="text" />
                            </label>
                            <label>
                                Password
                                <input type="password" />
                            </label>
                            <label>
                                <input style={{ marginRight: "10px", width: "auto", height: "12px" }} type="checkbox" name="remember" />
                                Remember me
                            </label>
                            <button style={{ width: "100%" }} type="submit">
                                Login
                            </button>
                        </form>
                    </div>
                </ContentWrapper>
            </Row>
        </>
    )
}

export default LoginForm
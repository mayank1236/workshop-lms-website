import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'

import style from '@/styles/form.module.scss';
import axios from 'axios';

const RegisterForm = () => {
    const handlePayment = async () => {
        const config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        }
        const i = await axios.post('http://localhost:3001/register', {}, config)
        console.log(i)
    }

    return (
        <Section>
            <Container>
                <h2>Register Now</h2>
                <div className={style.form} style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <form>
                        {/* <label>
                            Name
                            <input type="text" />
                        </label>
                        <label>
                            Email *
                            <input type="email" required />
                        </label>
                        <label>
                            Password *
                            <input type="password" required />
                        </label>
                        <label>
                            Contact Number
                            <input type="number" />
                        </label>
                        <label>
                            Address<br />
                            <input type="text" placeholder="Street Address, City, State, Country" />
                        </label>
                        <label>
                            Instagram
                            <input type="text" />
                        </label>
                        <label>
                            Website (if any)
                            <input type="url" />
                        </label>
                        <label>
                            <input style={{ marginRight: "10px", width: "auto", height: "12px" }} type="checkbox" name="agree" />
                            *Your email will be shared with all the instructors and partners who may reach out to you separately. You can choose to unsubscribe later if you do not wish to receive communication from them.
                        </label>
                        <label>
                            Make sure to check your inbox for a confirmation email with some pre-event tasks.
                        </label> */}
                        <button style={{ width: "100%" }} type="button" onClick={handlePayment}>
                            Pay Now
                        </button>
                    </form>
                </div>
            </Container>
        </Section>
    )
}

export default RegisterForm
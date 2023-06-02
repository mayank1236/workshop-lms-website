import React, { useState } from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'

import style from '@/styles/form.module.scss';
import axios from 'axios';

const RegisterForm = () => {
    const [payment, setPaymentForm] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [instagram, setInstagram] = useState("");
    const [website, setWebsite] = useState("");








    const handlePayment = async () => {
        console.log(name,email)
        if(name!='' && email!='')
        {
            let obj = {
                name:name,
                email:email,
                password:password,
                contact:contact,
                instagram:instagram,
                website:website,
                address:address
            }
            console.log(obj)
            const config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
            }
            const i = await axios.post('http://localhost:3001/v1/user/register',obj, config)
            console.log(i)
            if(i.data.status)
            {
                alert('Registered successfully');
            }
            else
            {
                alert('Server Error!!Please Try After Sometime')
            }
        }
        else
        {
            alert('Please Enter Email')
        }
        // const config = {
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        //     }
        // }
        // const i = await axios.post('http://localhost:3001/ccavRequestHandler', {}, config)
        // // setPaymentForm(i)

        // console.log('this is still working?')
    }

    return (
        <Section>
            <Container>
                <h2>Register Now</h2>
                <div className={style.form} style={{ maxWidth: "500px", margin: "0 auto" }}>
                    {/* <form method="POST" name="customerData" action="http://localhost:3001/ccavRequestHandler"> */}
                        <label>
                            Name
                            <input type="text" value={name} onChange={(val) => {
                                  setName(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Email *
                            <input type="email" value={email} onChange={(val) => {
                                  setEmail(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Password *
                            <input type="password" required value={password} onChange={(val) => {
                                  setPassword(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Contact Number
                            <input type="number" value={contact} onChange={(val) => {
                                  setContact(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Address<br />
                            <input type="text" placeholder="Street Address, City, State, Country"  value={address} onChange={(val) => {
                                  setAddress(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Instagram
                            <input type="text" value={instagram} onChange={(val) => {
                                  setInstagram(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            Website (if any)
                            <input type="url" value={website} onChange={(val) => {
                                  setWebsite(val.target.value);
                                  
                                }}/>
                        </label>
                        <label>
                            <input style={{ marginRight: "10px", width: "auto", height: "12px" }} type="checkbox" name="agree" />
                            *Your email will be shared with all the instructors and partners who may reach out to you separately. You can choose to unsubscribe later if you do not wish to receive communication from them.
                        </label>
                        <label>
                            Make sure to check your inbox for a confirmation email with some pre-event tasks.
                        </label>
                        <button style={{ width: "100%" }} type="button" onClick={handlePayment}>
                            Submit
                        </button>
                        {/* <button style={{ width: "100%" }} type="submit" onClick={handlePayment}>
                            Pay Now
                        </button> */}
                    {/* </form> */}
                </div>
            </Container>
        </Section>
    )
}

export default RegisterForm
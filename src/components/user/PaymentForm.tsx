import React, { useState } from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Image from 'next/image';
import Router from 'next/router'
import Link from 'next/link'



import style from '@/styles/form.module.scss';
import axios from 'axios';

const PaymentForm = () => {
    const [payment, setPaymentForm] = useState(null);
    const [transactionid, setTransactionid] = useState("");
    const [email, setEmail] = useState("");









    const handlePayment = async () => {
        console.log(name, email)
        if (transactionid != '' && email != '') {
            let obj = {
                transactionid: transactionid,
                email: email,

            }
            console.log(obj)
            const config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            }
            const i = await axios.post('http://13.127.222.180:3001/v1/user/transaction', obj, config)
            console.log(i)
            // if(i.data.status)
            // {
            //     alert('Registered successfully');
            // }
            // else
            // {
            //     alert('Server Error!!Please Try After Sometime')
            // }
            alert('Payment successfully');
            Router.push('/')
        }
        else {
            alert('Please Enter Fields')
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
            <div style={{width:" 100%", maxWidth: "230px", height: "auto", overflow: "hidden", margin: "0 auto"}}>
                    <Link href="/">
                        <Image
                            src="/mandalaconfluence/logo.png"
                            alt="lms-logo"
                            className={style.logoImg}
                            width='200' height='100'
                            // style={{ position: "relative", height: "100%", width: "100%", objectFit: "contain" }}
                        ></Image>
                    </Link>
                </div>
                <h2>Pay Now</h2>
                <div className={style.form} style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <Image src={'/mandalaconfluence/qr.jpeg'} alt={'Mandala Banner'} width='300' height='100' style={{ position: "relative", height: "300px", width: "100%", objectFit: "contain" }} />
                    <label>
                            <b>Early Bird Price Rs. 6499/7999</b>
                        </label>
                    <label>
                        The price reflected here - Rs. 5999 ($74) - will only be valid until midnight tonight. After that, it should be Rs. 6499 ($79).
                    </label>
                    <label>
                        Transaction Id *
                        <input type="text" value={transactionid} onChange={(val) => {
                            setTransactionid(val.target.value);

                        }} />
                    </label>
                    <label>
                        Registered Email *
                        <input type="email" value={email} onChange={(val) => {
                            setEmail(val.target.value);

                        }} />
                    </label>
                    <button style={{ width: "100%" }} type="button" onClick={handlePayment}>
                        Submit
                    </button>
                </div>
            </Container>
        </Section>
    )
}

export default PaymentForm
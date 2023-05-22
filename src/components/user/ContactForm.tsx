import React, { useState } from 'react'

import MailchimpSubscribe from 'react-mailchimp-subscribe';

import style from '@/styles/form.module.scss';
import axios from 'axios';

const Form = () => {
    const U = process.env.NEXT_PUBLIC_MAILCHIMP_U_ID;
    const form_id = process.env.NEXT_PUBLIC_MAILCHIMP_FORM_ID;
    const formURL = "https://us9.list-manage.com/contact-form" + "?u=" + U + "&form_id=" + form_id;
    return (
        <div className={style.form}>
            <iframe
                scrolling="no"
                src={formURL}
                style={{
                    width: "100%",
                    height: "900px",
                    overflow: "hidden",
                    border: "none"
                }}
            ></iframe>
        </div>
    )
}


export default Form


// 
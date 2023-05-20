import React from 'react'
import style from '@/styles/form.module.scss';

const Form = () => {
    return (
        <div className={style.form}>
            <form>
                <div className={style.group}>
                    <label>
                        Name
                        <input type="text" />
                    </label>
                    <label>
                        Phone Number
                        <input type="phone" />
                    </label>
                </div>
                <label>
                    Email
                    <input type="email" />
                </label>
                <label>
                    How can we help you
                    <textarea rows={9}></textarea>
                </label>
                <button type="submit">
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default Form
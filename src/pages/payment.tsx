import PaymentForm from '@/components/user/PaymentForm'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

const payment = () => {
    return (
        <div className={inter.className}>
            <PaymentForm />
        </div>
    )
}

export default payment
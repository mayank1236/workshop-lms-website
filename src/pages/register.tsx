import RegisterForm from '@/components/user/RegisterForm'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

const register = () => {
    return (
        <div className={inter.className}>
            <RegisterForm />
        </div>
    )
}

export default register
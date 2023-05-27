import { Inter } from 'next/font/google'
import React from 'react'
import LoginForm from '@/components/user/LoginForm'

const inter = Inter({ subsets: ['latin'] })

function about() {
    return (
        <div className={inter.className}>
            <LoginForm />
        </div>
    )
}

export default about
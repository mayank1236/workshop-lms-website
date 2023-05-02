import React from 'react'
import { layoutProps } from '@/types/layoutTypes';
import style from '@/styles/layout.module.scss';

const Row = ({ children, options, nameOfClass }: layoutProps) => {
    return (
        <div className={`${style.row} ${nameOfClass}`} style={options} >
            {children}
        </div>
    )
}

export default Row
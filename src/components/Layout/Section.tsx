import React from 'react';
import style from '@/styles/layout.module.scss';
import { layoutProps } from '@/types/layoutTypes';

const Section = ({ children, options, nameOfClass }: layoutProps) => {
    return (
        <section className={`${style.section} ${nameOfClass}`} style={options}>
            {children}
        </section>
    )
}

export default Section
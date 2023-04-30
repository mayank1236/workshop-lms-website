import React from 'react';
import style from '@/styles/layout.module.scss';
import { layoutProps } from '@/types/layoutTypes';

const Section = ({ children, options }: layoutProps) => {
    return (
        <section className={style.section} style={options}>
            {children}
        </section>
    )
}

export default Section
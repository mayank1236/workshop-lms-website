import React from 'react';
import style from '@/styles/layout.module.scss';
import { layoutProps } from '@/types/layoutTypes';

const Container = (props: layoutProps) => {
    return (
        <div style={props.options} className={style.container}>{props.children}</div>
    )
}

export default Container
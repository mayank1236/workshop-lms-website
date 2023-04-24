import React from 'react';
import style from '@/styles/container.module.scss';

type props = {
    children: JSX.Element[];
}

const Container = (props: props) => {
    return (
        <div className={style.container}>{...props.children}</div>
    )
}

export default Container
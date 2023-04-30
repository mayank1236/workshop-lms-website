import { layoutProps } from '@/types/layoutTypes'
import React from 'react'
import ContentWrapper from './ContentWrapper'
import style from '@/styles/animation.module.scss';

const Blob = ({ children, options }: layoutProps) => {
    return (
        <div className={style.onHoverMoveUp}>
            <ContentWrapper options={{
                padding: "10px",
                background: "white",
                borderRadius: "15px",
                border: "#cac8ce 1px solid",
                height: "120px",
                ...options
            }}>
                {children}
            </ContentWrapper>
        </div>
    )
}

export default Blob
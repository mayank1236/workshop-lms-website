import { layoutProps } from '@/types/layoutTypes'
import React from 'react'
import Row from './Row'
import style from '@/styles/responsive.module.scss';

const BlobRow = ({ children }: layoutProps) => {
    return (
        <Row
            options={{
                position: "absolute",
                left: "0px",
                top: "95%",
                height: "100px",
                padding: "0 40px",
                gap: "40px",
                alignItems: "center",
                maxWidth: "1240px",
                margin: "0 auto",
                right: "0"
            }}
            nameOfClass={style.blob}
        >
            {children}
        </Row>
    )
}

export default BlobRow
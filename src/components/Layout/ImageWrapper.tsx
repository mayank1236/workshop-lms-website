import React from 'react';

import { layoutProps } from '@/types/layoutTypes';
import style from '@/styles/layout.module.scss';

const ImageWrapper = ({ children, options }: layoutProps) => {
    return (
        <div className={style.imgWrapper} style={options}>{children}</div>
    )
}

export default ImageWrapper
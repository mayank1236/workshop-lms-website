import React from 'react';

import { layoutProps } from '@/types/layoutTypes';
import style from '@/styles/layout.module.scss';

const ContentWrapper = ({ children, options }: layoutProps) => {
    return (
        <div className={style.content} style={options}>{children}</div>
    )
}

export default ContentWrapper
import React from 'react';

import { layoutProps } from '@/types/layoutTypes';
import style from '@/styles/layout.module.scss';

const ContentWrapper = ({ children, options, nameOfClass }: layoutProps) => {
    return (
        <div className={`${style.content} ${nameOfClass}`} style={options}>{children}</div>
    )
}

export default ContentWrapper
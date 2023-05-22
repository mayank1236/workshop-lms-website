import React from 'react'
import style from '@/styles/footer.module.scss';
import Container from './Container';

const Footer = () => {
    return (
        <footer className={style.footer}>
            <Container>
                {/* <div className={style.menu}>
                    Footer
                </div>
                <div className={style.copyright}>
                    © 2023
                </div> */}
            </Container>
        </footer>
    )
}

export default Footer
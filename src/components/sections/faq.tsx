import React, { useEffect, useState } from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'

import style from '@/styles/layout.module.scss';
import res from '@/styles/responsive.module.scss';
import Icon from '../resources/Icon';

const Faq = () => {
    const faqs = [
        {
            key: '1',
            question: 'Is there a 14-days trial',
            answer: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.'
        },
        {
            key: '2',
            question: 'Is there a 14-days trial',
            answer: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.'
        },
        {
            key: '3',
            question: 'Is there a 14-days trial',
            answer: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.'
        },
        {
            key: '4',
            question: 'Is there a 14-days trial',
            answer: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.'
        }
    ];
    const [state, setState] = useState(() => {
        const obj: { [key: number]: boolean } = {};
        faqs.forEach((faq, index) => {
            obj[index] = false;
        })
        return obj;
    });

    const toggle = (index: number) => {
        setState(s => {
            const newS = { ...s }
            newS[index] = !newS[index];
            console.log(newS)
            return newS;
        });
    }



    return (
        <Section options={{ background: "#FAFAFA" }}>
            <Container>
                <h2>FAQS</h2>
                <Row options={{ flexWrap: "wrap" }} nameOfClass={res.row}>
                    {faqs.map((faq, index) => {
                        return (<div key={faq.key} onClick={() => toggle(index)} className={`${style.question} question`}
                            style={{
                                height: state[index] ? "300px" : "50px",
                            }}
                        >
                            <Row options={{ padding: '0 0 15px' }}>
                                <h3 style={{ color: state[index] ? "#FF6575" : "#002058" }}>{faq.question}</h3>
                                <div style={{ position: "relative", width: "15px", height: "15px" }}>
                                    <Icon icon={state[index] ? "minus" : "plus"} color={state[index] ? "#FF6575" : "#002058"} />
                                </div>
                            </Row>
                            <p>
                                {faq.answer}
                            </p>
                        </div>)
                    })}
                </Row>
            </Container>
        </Section>
    )
}

export default Faq
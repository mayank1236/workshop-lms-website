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
            question: 'What is the Mandala Confluence?',
            answer: 'Mandala Confluence is a virtual event that brings together Mandala artists and aspiring artists for professional development and networking opportunities.'
        },
        {
            key: '2',
            question: 'When is the event taking place?',
            answer: 'The event is scheduled from June 29th to July 2nd, 2023 (Thursday to Sunday). Check the Schedule to get more details'
        },
        {
            key: '3',
            question: 'What is the format of the event?',
            answer: 'The event will be held virtually via Zoom and Gather Town.'
        },
        // {
        //     key: '4',
        //     question: 'How much does it cost to attend the event?',
        //     answer: 'The original value of the event is INR 24999, but it is being offered at a discounted price of INR 6499.'
        // },
        // {
        //     key: '5',
        //     question: 'What are the offerings of the event?',
        //     answer: 'The price includes access to 12 top instructors, professional development opportunities, a chance to connect with other aspiring artists, 6 months of access to recordings of LIVE events, giveaways and takeaways, an opportunity to present your work to top artists and get feedback, and discounts from stationery brands.'
        // },
        {
            key: '6',
            question: 'How do I register for the event?',
            answer: 'You will be able to register through the website starting May 27, 2023. Join the waitlist to get notified when the registration opens.'
        },
        {
            key: '7',
            question: 'Can I access the event recordings after the event is over?',
            answer: 'Yes, participants will have 6 months of access to the recordings of workshops until December 31st, 2023.'
        },
        // {
        //     key: '8',
        //     question: 'Is there a limit to the number of participants who can attend?',
        //     answer: 'There is no mention of a participant limit.'
        // },
        {
            key: '9',
            question: 'How long is each workshop session?',
            answer: 'Each workshop is expected to be 60 minutes long followed by 30 minutes of Live Q&A.'
        },
        {
            key: '10',
            question: 'Can we purchase art supplies during the event?',
            answer: 'Yes, there will be a LIVE stationery/art supplies fair where brands and artists will be selling their products to participantsat exclusive discounted prices.'
        },
        {
            key: '11',
            question: 'I have a question that is not answered here',
            answer: 'Please email us at mail@anvita.art with any questions/queries'
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
            return newS;
        });
    }



    return (
        <Section options={{ background: "#FAFAFA" }} id="faq">
            <Container>
                <h2>FAQs</h2>
                <Row options={{ flexWrap: "wrap" }} nameOfClass={res.row}>
                    {faqs.map((faq, index) => {
                        return (<div key={faq.key} onClick={() => toggle(index)} className={`${style.question} question`}
                            style={{
                                height: state[index] ? "250px" : "50px",
                            }}
                        >
                            <Row options={{ padding: '0 0 15px', gap: "10px" }}>
                                <h3 style={{ color: state[index] ? "#F15A29" : "#243D86" }}>{faq.question}</h3>
                                <div style={{ position: "relative", width: "15px", height: "15px" }}>
                                    <Icon icon={state[index] ? "minus" : "plus"} color={state[index] ? "#F15A29" : "#243D86"} />
                                </div>
                            </Row>
                            <p style={{ opacity: state[index] ? '1' : '0' }}>
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
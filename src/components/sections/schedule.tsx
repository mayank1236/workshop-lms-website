import React from 'react'

import Section from '../Layout/Section'
import Container from '../Layout/Container'

import schedule from '@/styles/schedule.module.scss'

const Schedule = () => {
    const heading = {
        color: "#1C75BC"
    }
    const table = {
        marginTop: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(5,1fr)"
    }
    return (
        <Section id="schedule">
            <Container>
                <h2>Schedule</h2>
                <p>Join us for our upcoming Mandala Workshop from <span className="highlight">June 29th, 2023 to July 2nd, 2023</span>! For more information and registration, please contact us at <span className="highlight">mail@anvita.art</span>. Check out the schedule below <span className="highlight">(all times in IST)</span> to plan your availability and ensure you don't miss these exciting workshops and events we have in store for you.</p>
                <div style={table} className={schedule.table}>
                    <h5 style={heading}>Time</h5>
                    <h5 style={heading}>June 29</h5>
                    <h5 style={heading}>June 30</h5>
                    <h5 style={heading}>July 1</h5>
                    <h5 style={heading}>July 2</h5>
                    <h5 style={heading}>5:00 - 6:30 pm</h5>
                    <p>W1</p>
                    <p>Creative Marketplace</p>
                    <p>W5</p>
                    <p>W9</p>
                    <h5 style={heading}>6:30 - 8:00 pm</h5>
                    <p>W2</p>
                    <p>Member Showcase</p>
                    <p>W6</p>
                    <p>W10</p>
                    <h5 style={heading}>8:15 - 9:45 pm</h5>
                    <p>W3</p>
                    <p>Speed Dating</p>
                    <p>W7</p>
                    <p>W11</p>
                    <h5 style={heading}>9:45 - 11:15 pm</h5>
                    <p>W4</p>
                    <p>Member Showcase</p>
                    <p>W8</p>
                    <p>W12</p>
                </div>
            </Container>
        </Section>
    )
}

export default Schedule
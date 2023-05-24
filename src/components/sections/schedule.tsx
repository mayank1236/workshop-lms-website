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
                <p>Join us for the upcoming Mandala Confluence from <span className="highlight">June 29th, 2023 to July 2nd, 2023</span>(Thursday - Sunday)! Check out the schedule below to plan your availability and ensure that you don't miss these exciting workshops and events we have in store for you!</p>
                <div style={table} className={schedule.table}>
                    <h5 style={heading}>Time</h5>
                    <h5 style={heading}>Day 1 <br />(June 29) <br />Via Zoom</h5>
                    <h5 style={heading}>Day 2 <br />(June 30) <br />Via Gather Town</h5>
                    <h5 style={heading}>Day 3 <br />(July 1) <br />Via Zoom</h5>
                    <h5 style={heading}>Day 4 <br />(July 2) <br />Via Zoom</h5>
                    <h5 style={heading}>5:00 - 6:30pm IST<br /><br />7:30 - 9:00am EST</h5>
                    <p>Opening Remarks</p>
                    <p>Creative Marketplace</p>
                    <p>W4: Paridhi</p>
                    <p>W8: Leepi</p>
                    <h5 style={heading}>6:30 - 8:00pm IST<br /><br />9:00 - 10:30am EST</h5>
                    <p>W1: Divdrisht</p>
                    <p>Member Showcase</p>
                    <p>W5: Praful</p>
                    <p>W9: Chetna</p>
                    <h5 style={heading}>8:15 - 9:45pm IST<br /><br />10:45 - 12:15pm EST</h5>
                    <p>W2: Nikhat</p>
                    <p>Speed Dating</p>
                    <p>W6: Vinita</p>
                    <p>W10: Saudamini</p>
                    <h5 style={heading}>9:45 - 11:15pm IST<br /><br />12:15 - 1:45pm EST</h5>
                    <p>W3: Fernanda</p>
                    <p>Member Showcase</p>
                    <p>W7: Vaishnavi</p>
                    <p>Closing Remarks</p>
                </div>
            </Container>
        </Section>
    )
}

export default Schedule
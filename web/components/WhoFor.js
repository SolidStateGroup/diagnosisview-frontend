import React, { FunctionComponent } from 'react';
import InfoPanel from "./InfoPanel";
import PanelHeader from "./PanelHeader"; // we need this to make JSX compile
const whoIs = [
    "You are a medical student needing trusted information for an exam",
    "You are a practitioner and a patient with a rare diagnosis walks through the door",
    "You are anyone who seeks urgent medical guidance but reads conflicting information on the Internet"
]
const TheComponent = ({}) => {
    return (
        <div className="panel--white">
            <PanelHeader icon="fa fa-users" className="mb-4">
                Who DiagnosisView is for:
            </PanelHeader>
            <div>
                {whoIs.map((v)=>(
                    <Row className="no-wrap mb-4 flex-align-start">
                        <span className="fa mr-3 text-success fa-check-circle"/>
                        {v}
                    </Row>
                ))}
            </div>
            <InfoPanel>
                <span>
                    The <strong>DiagnosisView smart search</strong> pulls up links from trusted sources only, graded by level of complexity. Our intelligent matching logic guides you to the right topic, even if your search phrase is vague (e.g. ‘back’ or ‘zits’).
                </span>
            </InfoPanel>
        </div>
    )
}

export default TheComponent

import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({children,className}) => {
    return (
        <div className={"panel--info"}>
            <Row className="flex-align-start">
                <span className="fa fa-info-circle mr-2"/>
                {children}
            </Row>
        </div>
    )
}

export default TheComponent

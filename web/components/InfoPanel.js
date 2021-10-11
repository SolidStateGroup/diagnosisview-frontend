import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({children,className}) => {
    return (
        <div className={"panel--info px-3 py-3"}>
            <Row className="flex-align-start no-wrap">
                <span className="fa fa-info-circle text-primary mr-2"/>
                {children}
            </Row>
        </div>
    )
}

export default TheComponent

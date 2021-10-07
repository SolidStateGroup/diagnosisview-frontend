import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({children,className}) => {
    return (
        <Row className={"list-item " + className||""}>
            <Flex>
                {children}
            </Flex>
            <span className="list-item--icon fa fa-chevron-right"/>
        </Row>
    )
}

export default TheComponent

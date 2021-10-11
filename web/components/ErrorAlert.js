import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({children}) => {
    return (
            <Row className="error-alert row no-wrap px-2 py-2">
                <span className="fa fa-exclamation-circle mr-2"/>
                <Flex>
                    {children}
                </Flex>
            </Row>
    )
}

export default TheComponent

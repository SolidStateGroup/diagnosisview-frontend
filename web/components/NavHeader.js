import React, { FunctionComponent } from 'react'; // we need this to make JSX compile


const TheComponent: FunctionComponent = (props) => {
    return (
        <Flex className={"header full-width" + (props || "")}>
            <Row className="nav__links">
                <div className="brand-container text-center">
                    <Row style={{color: '#fff', paddingLeft:30,paddingRight:30}}>
                        <img height={34} src={"/images/brand-medium.png"}/>
                    </Row>
                </div>

            </Row>
        </Flex>
    )
}

export default TheComponent

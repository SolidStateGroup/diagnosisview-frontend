import React  from 'react'; // we need this to make JSX compile



const TheComponent = ({children, icon, className,viewMoreLink}) => {
    return (
        <Row className={"panel__header no-wrap " + className||""}>
            <Flex>
                <Row className="align-items-start">
                    <span className={icon+" mr-2"}/> {children}
                </Row>
            </Flex>
            {!!viewMoreLink && (
                <Link className="no-underline" to={viewMoreLink}>
                    <Row>
                        <div style={{display:"inline-block", marginTop:-1}}>
                            View More{" "}
                        </div>
                        <div className="ml-1 fas fa-arrow-right"/>
                    </Row>

                </Link>
            )}
        </Row>
    )
}

export default TheComponent

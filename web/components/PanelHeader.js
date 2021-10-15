import React  from 'react'; // we need this to make JSX compile



const TheComponent = ({children, icon, className,viewMoreLink}) => {
    return (
        <Row className={"panel__header " + className||""}>
            <Flex>
                <span className={icon+" mr-1"}/> {children}
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

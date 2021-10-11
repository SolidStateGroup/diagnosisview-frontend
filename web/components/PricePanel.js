import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({title, subtitle, points, price,className, children}) => {
    return (
        <div className={"panel--white panel--price py-4 " + className}>
            <Flex className="px-4" style={{height:"100%"}}>
                <div className="panel--price__title">
                    {title}
                </div>
                <div className="panel--price__subtitle">
                    {subtitle}
                </div>
                <div>

                    <hr/>
                </div>
                {points.map((v)=>(
                    <Row className="no-wrap text-left">
                        <span className="text-success mr-2 fa fa-check-circle"/> <span>{v}</span>
                    </Row>
                ))}
                <Flex/>
                <div>
                    {price? <span>
                            <span className="panel--price__title">£{price}</span>
                            <span className="panel--price__subtitle"> / per year</span>
                        </span>
                        : (
                            <span className="panel--price__title">Free</span>
                        )}
                </div>
                <div className="my-4">

                    {children}
                </div>
            </Flex>

        </div>
    )
}

export default TheComponent

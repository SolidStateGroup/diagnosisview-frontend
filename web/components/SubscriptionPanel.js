import React  from 'react'; // we need this to make JSX compile

const TheComponent = ({children,title, className}) => {
    return (
        <div className={"panel--subscription"}>
            <img height={173} className="logo" src="/images/subscription-panel.svg"/>
            <div className="panel--subscription__content">
                <h4 style={{width:210}} className="text-light">
                    {title}
                </h4>
                {children}
            </div>

        </div>
    )
}

export default TheComponent

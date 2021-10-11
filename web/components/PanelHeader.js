import React  from 'react'; // we need this to make JSX compile



const TheComponent = ({children, icon, className}) => {
    return (
        <div className={"panel__header " + className||""}>
            <span className={icon+" mr-1"}/> {children}
        </div>
    )
}

export default TheComponent

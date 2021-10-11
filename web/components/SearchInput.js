import React  from 'react'; // we need this to make JSX compile


const TheComponent = (props) => {
    return (
        <Input icon={"fa fa-search"} className="input-container--search full-width" {...props} />
    )
}

export default TheComponent

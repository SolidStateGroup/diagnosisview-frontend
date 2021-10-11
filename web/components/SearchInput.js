import React  from 'react'; // we need this to make JSX compile


const TheComponent = (props) => {
    return (
        <Input icon={"fa fa-search"} {...props} className={"input-container--search full-width " + props.className}  />
    )
}

export default TheComponent

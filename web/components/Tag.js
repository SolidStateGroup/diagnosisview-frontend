import React  from 'react'; // we need this to make JSX compile


const TheComponent = ({tag}) => {
    return (
        <span style={{ backgroundColor: Constants.tagColours[tag.code] || pallette.primary }} className="tag">
            {tag.description}
        </span>
    )
}

export default TheComponent

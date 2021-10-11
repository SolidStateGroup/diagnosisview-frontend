import React  from 'react'; // we need this to make JSX compile


const TheComponent = ({tag}) => {
    return (
        <a onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            window.open("https://blogs.ed.ac.uk/diagnosisview/about/core-conditions", "_blank")
        }}
           href="https://blogs.ed.ac.uk/diagnosisview/about/core-conditions"
           target="_blank">
            <span style={{ backgroundColor: Constants.tagColours[tag.code] || pallette.primary }} className="tag mr-2">
                {tag.description}
            </span>
        </a>

    )
}

export default TheComponent

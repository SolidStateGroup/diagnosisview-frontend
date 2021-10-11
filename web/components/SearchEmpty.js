import React  from 'react'; // we need this to make JSX compile


const TheComponent = ({}) => {
    return (
        <div className="text-center">
            <div className="my-5">
                <span className="fa fa-search text-primary" style={{fontSize:112}}/>
            </div>
            <span className="empty-search-text">Enter a search term</span>
        </div>
    )
}

export default TheComponent

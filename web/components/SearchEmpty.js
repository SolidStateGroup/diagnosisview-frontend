import React  from 'react'; // we need this to make JSX compile


const TheComponent = ({}) => {
    return (
        <div className="text-center">
            <div className="mt-lg-5 mb-lg-5 mb-md-4">
                <span className="fa fa-search text-primary" style={{fontSize:112}}/>
            </div>
            <div className="empty-search-text mb-lg-4">Enter a search term</div>
        </div>
    )
}

export default TheComponent

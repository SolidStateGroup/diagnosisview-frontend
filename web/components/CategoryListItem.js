import React  from 'react';
import ListItem from "./ListItem";
import Tag from "./Tag"; // we need this to make JSX compile


const TheComponent = ({result}) => {
    console.log(result)
    return (
        <ListItem className="list-item--no-hover list-item--no-pad">
            <Link to={"/codes/"+result.code}>
                <Row>
                    <div className="mr-2">{result.friendlyDescription}</div>
                </Row>
            </Link>
        </ListItem>
    )
}

export default TheComponent

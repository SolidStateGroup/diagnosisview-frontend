import React  from 'react';
import ListItem from "./ListItem";
import Tag from "./Tag"; // we need this to make JSX compile


const TheComponent = ({result, isActive, onClick}) => {
    return (
        <ListItem className={"list-item--no-hover list-item--dark-arrow list-item--no-pad " + (isActive && "list-item--active")}>
            <Link onClick={()=>onClick && onClick(result.id)} to={"/dashboard/search?category="+result.id}>
                <Row>
                    <div className="mr-2">{result.friendlyDescription}</div>
                </Row>
            </Link>
        </ListItem>
    )
}

export default TheComponent

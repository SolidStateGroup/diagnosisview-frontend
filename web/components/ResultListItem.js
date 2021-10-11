import React  from 'react';
import ListItem from "./ListItem";
import Tag from "./Tag"; // we need this to make JSX compile


const TheComponent = ({result}) => {
    return (
        <ListItem className="list-item--no-hover list-item--no-pad">
            <Link to={"/codes/"+result.code}>
                <Row>
                    <div className="mr-2">{result.friendlyName}</div>
                    {_.map(result.tags, tag => (
                        <Tag key={tag.id} tag={tag} />
                    ))}
                </Row>
            </Link>
        </ListItem>
    )
}

export default TheComponent

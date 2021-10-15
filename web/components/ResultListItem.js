import React  from 'react';
import ListItem from "./ListItem";
import Tag from "./Tag"; // we need this to make JSX compile


const TheComponent = ({result, date}) => {
    console.log(result)
    return (
        <ListItem className="list-item--no-hover list-item--no-pad">
            <Link to={AccountStore.model? "/dashboard/codes/"+result.code:"/codes/"+result.code}>
                <Row>
                    <Flex value={2}>
                        <div className="mr-2">{result.friendlyName}</div>
                        {_.map(result.tags, tag => (
                            <Tag key={tag.id} tag={tag} />
                        ))}
                    </Flex>
                    {date && (
                        <Flex value={1}>
                            {moment(date).format("Do MMMM YYYY HH:mm")}
                        </Flex>
                    )}
                </Row>
            </Link>
        </ListItem>
    )
}

export default TheComponent

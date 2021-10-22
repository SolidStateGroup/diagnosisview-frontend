import React  from 'react';
import ListItem from "./ListItem";
import Tag from "./Tag"; // we need this to make JSX compile


const TheComponent = ({result, date}) => {
    return (
        <ListItem className="list-item--no-hover list-item--no-pad">
            <Link to={AccountStore.model? "/dashboard/codes/"+result.code:"/codes/"+result.code}>
                <Row>
                    <Flex value={2}>
                        <Row>
                            <div className="mr-2">{result.friendlyName}</div>
                            {_.map(result.tags, tag => (
                                <Tag key={tag.id} tag={tag} />
                            ))}
                        </Row>

                    </Flex>
                    {date && (
                        <Row>
                        <Flex value={2}>
                            {moment(date).format("Do MMMM YYYY HH:mm")}
                        </Flex>
                            <div style={{ width: 130 }}/>
                        </Row>
                    )}
                </Row>
            </Link>
        </ListItem>
    )
}

export default TheComponent

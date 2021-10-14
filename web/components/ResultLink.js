import React  from 'react'; // we need this to make JSX compile
import { UncontrolledTooltip } from 'reactstrap';


const TheComponent = ({link, code, name, className}) => {
    const onFavourite = () => {
        AppActions.setFavourite(code, name, link);
    };
    const onRemoveFavourite = () => {
        AppActions.removeFavourite(code, link)
    };

    const onLinkClick = ()=>{
        window.open(link.link, "_blank")
    }

    return (
        <LinkLogoProvider>
            {({ linkLogos, isLoading }) => (
                <FavouritesProvider>
                    {({favourites})=>{
                        const isFavourite = _.find(favourites, f => f.code === code && f.link.id === link.id);
                        const logoImageUrl = Utils.getLinkLogo(linkLogos, link);
                        let style = {};
                        if (!link.displayLink) {
                            return null;
                        } else if (!SubscriptionStore.isSubscribed() && link.difficultyLevel != "GREEN" && !link.freeLink) {
                            return null;
                        }
                        const {colour,text} = Constants.difficultyLevels(link.difficultyLevel)
                        return (
                            <Row className={className + " result-link cursor-pointer"}>
                                <div onClick={onLinkClick} id={`link${link.id}`}>
                                <span style={style} className={"fa fa-info-circle text-" + link.difficultyLevel.toLowerCase()}/>
                                </div>
                                <img onClick={onLinkClick} className="ml-3" src={logoImageUrl} height={20}/>

                                <UncontrolledTooltip placement="top" target={`link${link.id}`}>
                                    {`Level = '${colour}', ${text}`}
                                </UncontrolledTooltip>
                                <Flex style={{height:"30px"}} onClick={onLinkClick}/>
                                <div  className="mr-5">
                                    {isFavourite? (
                                        <span onClick={onRemoveFavourite} className="fa fa-star"/>
                                    ): (
                                        <span onClick={onFavourite} className="far fa-star"/>
                                    )}
                                </div>
                                <span className="fas fa-chevron-right"/>
                            </Row>
                        )
                    }}
                </FavouritesProvider>
            )}
        </LinkLogoProvider>

    )
}

export default TheComponent

import React  from 'react'; // we need this to make JSX compile
import { UncontrolledTooltip } from 'reactstrap';
import AccountStore from "../../common/stores/account-store";


const TheComponent = ({link, code, name,date, className}) => {
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
                        const logoImageUrl = Utils.getLinkLogo(linkLogos, link) || Constants.linkIcons[link.linkType.value];
                        let style = {};
                        const limit =    FavouritesStore.model.length > 3 && !AccountStore.hasActiveSubscription()
                        if (!link.displayLink) {
                            return null;
                        } else if (!AccountStore.hasActiveSubscription() && link.difficultyLevel != "GREEN" && !link.freeLink) {
                            return null;
                        }
                        const {colour,text} = Constants.difficultyLevels(link.difficultyLevel)
                        return (
                            <Row className={className + " result-link cursor-pointer"}>
                                <Flex>
                                    <Row>
                                        <div onClick={onLinkClick} id={`link${link.id}`}>
                                            <span style={style} className={"fa fa-info-circle text-" + link.difficultyLevel.toLowerCase()}/>
                                        </div>
                                        <img onClick={onLinkClick} className="mx-3" src={logoImageUrl} height={20}/>
                                        {name}
                                    </Row>
                                </Flex>

                                <Flex>
                                    <Row>
                                        <UncontrolledTooltip placement="top" target={`link${link.id}`}>
                                            {`Level = '${colour}', ${text}`}
                                        </UncontrolledTooltip>
                                        {
                                            limit && !isFavourite && (
                                                <UncontrolledTooltip placement="top" target={`link${link.id}favourite`}>
                                                    Maximum number of favourites reached. {!AccountStore.getUser() ? 'Please sign in or create an account to add more.' : 'Please subscribe or renew your subscription to add more.'}
                                                </UncontrolledTooltip>
                                            )
                                        }
                                        {link.paywalled && (
                                            <div className="px-2" id={`link${link.id}lock`}>
                                                <span className={"fa fa-"+(link.paywalled === "LOCKED" ? "lock": "lock-open")}/>
                                                <UncontrolledTooltip placement="top" target={`link${link.id}lock`}>
                                                    {link.paywalled === 'LOCKED' ?
                                                        'Your user account or institution doesn\'t have a registered account for this resource, though a summary or preview may be displayed. If you have a personal login, or a separate login from your institution, you will be able to log in at the site despite the padlock.' :
                                                        'Your user account or institution has full access to this resource. Please tap the link to view the article (you may need to enter via an institutional login).'
                                                    }
                                                </UncontrolledTooltip>
                                            </div>
                                        )}
                                        {moment(date).format("Do MMMM YYYY HH:mm")}
                                        <Flex style={{height:"30px"}} onClick={onLinkClick}/>
                                        {!!AccountStore.model && (
                                            <div  className="mr-5">
                                                {isFavourite? (
                                                    <span onClick={onRemoveFavourite} className="fa fa-star"/>
                                                ): (
                                                    <span id={`link${link.id}favourite`} onClick={limit?null:onFavourite} className="far fa-star"/>
                                                )}
                                            </div>
                                        )}
                                    </Row>
                                </Flex>


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

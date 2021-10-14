import React  from 'react'; // we need this to make JSX compile
import { UncontrolledTooltip } from 'reactstrap';
import SubscriptionStore from "../../common/stores/subscription-store";
import AccountStore from "../../common/stores/account-store";


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
                        const logoImageUrl = Utils.getLinkLogo(linkLogos, link) || Constants.linkIcons[link.linkType.value];
                        let style = {};
                        const limit =    FavouritesStore.model.length > 3 && SubscriptionStore.isSubscribed()
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

                                <a className="ml-2">
                                    {name}
                                </a>

                                <UncontrolledTooltip placement="top" target={`link${link.id}`}>
                                    {`Level = '${colour}', ${text}`}
                                </UncontrolledTooltip>
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
                                <Flex style={{height:"30px"}} onClick={onLinkClick}/>
                                <img onClick={onLinkClick} className="ml-3 mr-3" src={logoImageUrl} height={20}/>

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

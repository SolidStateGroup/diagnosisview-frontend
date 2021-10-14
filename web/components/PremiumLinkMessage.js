import React  from 'react'; // we need this to make JSX compile

const PremiumLinkMessage = ({className}) => {
    if(SubscriptionStore.isSubscribed()) return null
    return (
        <div>
            <Row className={className}>
                <img className="mr-2" src="/images/amber-link.svg" height={16}/>
                <strong>Practitioner &</strong>
                <img className="mx-2" src="/images/red-link.svg" height={16}/>
                <strong>Expert links are available with a Professional Plan</strong>

            </Row>
            <div className="mt-4 text-center">
                <Link to={Constants.webPayments?"/#pricing":"/signup"}>
                <Button className={'btn btn--primary nav__button'}>
                    <span className="nav__button__text">{ 'Sign up Now'}</span>
                </Button>
                </Link>
            </div>
        </div>

    )
}

export default PremiumLinkMessage

import React  from 'react'; // we need this to make JSX compile

const PremiumLinkMessage = ({className}) => {
    if(AccountStore.hasActiveSubscription()) return null
    return (
        <div className="panel--white mb-4">
            <Row style={{opacity:0.5}} className={className+ " justify-content-center px-3 py-2"}>
                <img className="mr-2" src="/images/amber-link.svg" height={16}/>
                <strong>Practitioner &</strong>
                <img className="mx-2" src="/images/red-link.svg" height={16}/>
                <strong>Expert links are available with a Professional Plan</strong>

            </Row>
            <div className="mt-4 text-center">
                <Button onClick={()=>{
                    if (!AccountStore.model){
                        document.location = "/signup?plan=pro"
                    }
                    document.getElementsByClassName("js-manage")[0].click()
                }} className={'btn btn--primary nav__button'}>
                    <span className="nav__button__text">{ 'Sign up Now'}</span>
                </Button>
            </div>
        </div>

    )
}

export default PremiumLinkMessage

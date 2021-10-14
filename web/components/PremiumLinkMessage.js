import React  from 'react'; // we need this to make JSX compile

const PremiumLinkMessage = ({className}) => {
    if(SubscriptionStore.isSubscribed()) return null
    return (
        <Row className={className}>
            <img className="mr-2" src="/images/amber-link.svg" height={16}/>
            <strong>Practitioner &</strong>
            <img className="mx-2" src="/images/red-link.svg" height={16}/>
            <strong>Expert links are available with a Professional Plan</strong>
        </Row>
    )
}

export default PremiumLinkMessage

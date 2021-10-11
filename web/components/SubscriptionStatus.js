import React  from 'react';
import SubscriptionPanel from "./SubscriptionPanel"; // we need this to make JSX compile


const TheComponent = ({}) => {
    return (
       <AccountProvider>
           {()=>(
               <div>

                   {Constants.webPayments && (
                       <div style={{maxWidth:307}}>
                           {!AccountStore.hasActiveSubscription() && (
                               <SubscriptionPanel title="Subscribe Now">
                                   <div className="mb-2">
                                       Subscribe to see additional professional resources on all topics (demos here to <Link to="/codes/acne">Acne</Link>, <Link to="/codes/cystic-fibrosis">Cystic fibrosis</Link>, <Link to="/codes/heart-failure">Heart failure</Link>).
                                   </div>
                                   <div>
                                       Subscribing also unlocks unlimited history / favourites synchronised between devices and activates paywalled links to your institution.
                                   </div>

                                   <Link to="/dashboard/account?manage=1">
                                       <a className="button button--rounded full-width mt-4">
                                           Subscribe Now
                                       </a>
                                   </Link>

                               </SubscriptionPanel>
                           )}
                           {AccountStore.hasActiveSubscription() && (
                               <SubscriptionPanel title="You are subscribed to the Professional Plan">
                                   <Link to="/dashboard/account?manage=1">
                                       <a className="button button--rounded full-width mt-4">
                                           Manage Subscription
                                       </a>
                                   </Link>

                               </SubscriptionPanel>
                           )}
                       </div>
                   )}
               </div>
           )}

       </AccountProvider>
    )
}

export default TheComponent

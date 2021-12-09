import React, {Component}  from 'react';
import SubscriptionPanel from "./SubscriptionPanel"; // we need this to make JSX compile
import _data from '../../common/stores/base/_data'

class TheComponent extends Component {
    state = {}

    componentDidMount() {
        Chargebee.init({
            site: Project.chargebee.site,
        });
        Chargebee.registerAgain();
        Chargebee.getInstance().setCheckoutCallbacks(cart => ({
            success: (hostedPageId) => {
                AppActions.updateSubscription(hostedPageId);
            },
        }));
    }

    render() {
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
                                            <a

                                                href="javascript:void(0)"
                                                data-cb-type="checkout"
                                                data-cb-plan-id={Project.chargebee.product}
                                                className="button button--rounded full-width mt-4">
                                                Subscribe Now
                                            </a>
                                        </Link>

                                    </SubscriptionPanel>
                                )}
                                {AccountStore.hasActiveSubscription() && (
                                    <SubscriptionPanel title="You are subscribed to the Professional Plan">
                                        { AccountStore.isMobileSubscription()? Constants.mobileSubscriptionMessage
                                            : (
                                                <Link to="/dashboard/account?manage=1">
                                                    <a
                                                        onClick={(()=>{
                                                            Chargebee.getInstance().openCheckout({
                                                                // todo: this will hit an API
                                                                // hostedPage() {
                                                                //     return _data.post(`${Project.api}organisations/${AccountStore.getOrganisation().id}/get-hosted-page-url-for-subscription-upgrade/`, {
                                                                //         plan_id: props['data-cb-plan-id'],
                                                                //     });
                                                                // },
                                                                success: (res) => {
                                                                    AppActions.updateSubscription(res);
                                                                },
                                                            });
                                                        })}
                                                        className="button button--rounded full-width mt-4">
                                                        Manage Subscription
                                                    </a>
                                                </Link>
                                            )}

                                    </SubscriptionPanel>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </AccountProvider>
        );
    }
}

export default TheComponent;

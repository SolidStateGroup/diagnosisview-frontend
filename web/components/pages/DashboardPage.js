import React from 'react';
import { Component } from 'react';
import SubscriptionStatus from "../SubscriptionStatus";


class TheComponent extends Component {

    constructor() {
        super();

        this.state ={

        }
    }

    render() {
        return (
            <AccountProvider ref={c => this.accountProvider = c} onLogin={this.onLogin} onLogout={this.onLogout} onSave={()=>{
                this.setState({updatedProfile:true})
            }}>
                {({user, isLoading, isSaving, error})=>(
                    <div className="container-fluid">

                        <h4 className="mb-4">My Account</h4>
                        <div className="row">
                            <div className="col-xl-8 mb-lg-4 col-lg-12">
                            </div>
                            <div className="col-xl-4 col-lg-12">
                                <SubscriptionStatus/>
                            </div>
                        </div>
                    </div>
                )}
            </AccountProvider>
        )}
}

export default TheComponent

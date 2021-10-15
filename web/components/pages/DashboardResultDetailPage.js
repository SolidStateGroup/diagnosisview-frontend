import React from 'react';
import { Component } from 'react';
import SubscriptionStatus from "../SubscriptionStatus";
import PanelHeader from "../PanelHeader";
import ResultLink from "../ResultLink";
import ResultListItem from "../ResultListItem";
import ResultHistoryLink from "../ResultHistoryLink";
import DiagnosisDetail from "../DiagnosisDetail";

const MAX_RECENT = 5;

class TheComponent extends Component {

    constructor() {
        super();

        this.state = {}
    }

    componentDidMount() {
        AppActions.getCodes()
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-8 mb-lg-4 col-lg-12">
                        <DiagnosisDetail id={this.props.match.params.id}/>
                    </div>
                    <div className="col-xl-4 col-lg-12">
                        <SubscriptionStatus/>
                    </div>
                </div>

            </div>
        )
    }
}

export default TheComponent

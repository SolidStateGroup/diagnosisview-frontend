import React from 'react';
import { Component } from 'react';
import PanelHeader from "./PanelHeader";
import ResultLink from "./ResultLink";
import PremiumLinkMessage from "./PremiumLinkMessage";
import data from "../../common/stores/base/_data";

class TheComponent extends Component {
    state = {}
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
        };
        ES6Component(this);
    }

    componentDidMount() {
        this.listenTo(AccountStore, 'change', () => this.forceUpdate());
        this.setState({isLoading: true});
        this.get();
    }

    get = () => {
        data.get(Project.api + 'code/' + this.props.id)
            .then(res => {
                AppActions.addToHistory(res);
                const links = _.sortBy(res.links, 'displayOrder');
                this.setState({
                    description: res.fullDescription,
                    links,
                    name: res.description,
                    isLoading: false
                })
            });
    }

    render() {
        const { isLoading, description, links, name } = this.state;
        return (
            <div className="panel--white mb-4">
                <h4 className="mb-4 mt-2">
                    {name}
                </h4>
                <div className="mb-4">
                    {description}
                </div>
                <PanelHeader className="mb-4" icon="fa fa-info-circle">Learn More</PanelHeader>
                {isLoading ? <Loader /> : (
                    <div>
                        { _.map(links, link => {
                            return (
                                <ResultLink key={link.id} className="mb-3 mx-2" code={this.props.id} name={name} link={link}/>
                            );
                        })}
                    </div>
                )}
                <PremiumLinkMessage className="mx-2"/>
            </div>
        )
    }
}

export default TheComponent

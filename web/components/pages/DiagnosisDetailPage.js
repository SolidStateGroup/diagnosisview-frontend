/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../../common/stores/base/_data';
import WhoFor from "../WhoFor";
import PanelHeader from "../PanelHeader";
import ResultLink from "../ResultLink";
import PremiumLinkMessage from "../PremiumLinkMessage";

const DiagnosisDetailPage = class extends Component {

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
		data.get(Project.api + 'code/' + this.props.match.params.id)
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
			<div className="container">
				<div className="hero--shape-bg-small">
				</div>

				<div className="row mt-5">
					<div className="col-lg-8 col-md-12">
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
														<ResultLink className="mb-3 mx-2" code={this.props.match.params.id} name={name} link={link}/>
													);
												})}
										</div>
									)}
								<PremiumLinkMessage className="mx-2"/>
						</div>

					</div>
					<div className="col-lg-4 col-md-12">
						<WhoFor/>
					</div>
				</div>

			</div>
		)
	}
}

DiagnosisDetailPage.propTypes = {};


module.exports = DiagnosisDetailPage;

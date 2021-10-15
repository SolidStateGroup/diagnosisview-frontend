/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../../common/stores/base/_data';
import WhoFor from "../WhoFor";
import PanelHeader from "../PanelHeader";
import ResultLink from "../ResultLink";
import PremiumLinkMessage from "../PremiumLinkMessage";
import DiagnosisDetail from "../DiagnosisDetail";
import Footer from "../Footer";

const DiagnosisDetailPage = class extends Component {

	render() {
		return (
			<div className="container">
				<div className="hero--shape-bg-small">
				</div>
				<div className="row mt-5">
					<div className="col-lg-8 col-md-12">
						<DiagnosisDetail id={this.props.match.params.id}/>
					</div>
					<div className="col-lg-4 col-md-12">
						<WhoFor/>
					</div>
				</div>
<Footer fixed/>
			</div>
		)
	}
}

DiagnosisDetailPage.propTypes = {};


module.exports = DiagnosisDetailPage;

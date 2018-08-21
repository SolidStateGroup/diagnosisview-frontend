import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			expiryDate: moment().add(1, 'y')
		};
	}

	onOK = (id) => {
		closeModal();
		this.props.onChange(this.props.id, {
			activeSubscription: true,
			expiryDate: moment(this.state.expiryDate).valueOf()
		});
	}

	render() {
		const { expiryDate } = this.state;
		return (
			<form id="activate-subscription-modal" onSubmit={(e) => {
				e.preventDefault();
			}}>
				<h2>Confirm</h2>
				<h3>Are you sure you want to activate this users subscription?</h3>

				<FormGroup>
					<label>Expiry Date</label>
					<DatePicker
						className="react-datepicker-input-large"
						selected={this.state.expiryDate}
						onChange={expiryDate => this.setState({expiryDate})}
						showTimeSelect={true}
						dateFormat="LLL"
						minDate={moment()} />
				</FormGroup>

				<div className="pull-right">
					<Button id="cancel-activate-subscription-btn" onClick={() => closeModal()} style={{marginRight: 5}}>
						No
					</Button>
					<Button id="activate-subscription-btn" disabled={moment(this.state.expiryDate).isSameOrBefore(moment())} onClick={this.onOK}>
						Yes
					</Button>
				</div>
			</form>
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;

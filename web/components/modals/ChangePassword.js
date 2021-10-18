import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	close = (id) => {
		closeModal();
		this.props.onSave && this.props.onSave(id);
		toast('Changed password successfully');
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.passwordInput.focus()
		}, 500);
	};

	isValid = () => {
		const { password, repeatPassword } = this.state;
		if (!password || !repeatPassword) {
			return false;
		}

		return true;
	}

	changePassword = () => {
		const { password, repeatPassword } = this.state;
		if (password !== repeatPassword) {
			this.setState({error: 'Passwords do not match'});
			return;
		}

		if (password.length < 7) {
			this.setState({error: 'Password should be at least 7 characters'});
			return;
		}

		AppActions.updateUser(this.props.user.id, {username: this.props.user.username, password});
	}

	render() {
		const { password, repeatPassword } = this.state;
		return (
			<UsersProvider onSave={this.close}>
				{({ isSaving, error }) => (
					<form id="change-password-modal" onSubmit={(e) => {
						e.preventDefault();
						!isSaving && this.isValid();
					}}>
						<InputGroup
							ref={c => this.passwordInput = c}
							inputProps={{ name: 'password', className: "full-width" }}
							onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
							value={password}
							isValid={password && password.length}
							type="password" title="Password*"
							placeholder="New Password (min 7 characters)"
							disabled={isSaving} />
						<InputGroup
							inputProps={{ name: 'repeatPassword', className: "full-width" }}
							onChange={(e) => this.setState({ repeatPassword: Utils.safeParseEventValue(e) })}
							value={repeatPassword}
							isValid={repeatPassword && repeatPassword.length}
							type="password" title="Repeat Password*"
							placeholder="Repeat New Password"
							disabled={isSaving} />
						{error && <div className="text-danger">{typeof error === 'object' ? error.message : error}</div>}
						{this.state.error && <div className="text-danger">{this.state.error}</div>}
						<div className="modal-footer text-center justify-content-center">
							<Button id="cancel-change-password-btn" disabled={isSaving} onClick={() => closeModal()} style={{marginRight: 5}}>
								Cancel
							</Button>
							<Button id="change-password-btn" disabled={isSaving || !this.isValid()} onClick={this.changePassword}>
								OK
							</Button>
						</div>
					</form>
				)}

			</UsersProvider>
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;

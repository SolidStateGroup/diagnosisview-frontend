import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	saved = (id) => {
		closeModal();
		this.props.onSave && this.props.onSave(id);
		toast('User created successfully');
	}

	close = () => {
		closeModal();
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.input.focus()
		}, 500);
	};

	isValid = () => {
		const { username, password, repeatPassword } = this.state;
		if (!username || !password || !repeatPassword) {
			return false;
		}

		return true;
	}

	render() {
		const { username, password, repeatPassword } = this.state;
		return (
			<SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => (
					<UsersProvider onSave={this.saved}>
						{({ isLoading, isSaving, users, error }, { createUser }) => (
							<form id="create-user-modal" onSubmit={(e) => {
								e.preventDefault();
								!isSaving && this.isValid() && createUser({ ...this.state });
							}}>
								<FormGroup>
									<InputGroup
										ref={(e) => this.input = e}
										inputProps={{ name: 'username', className: "full-width" }}
										onChange={(e) => this.setState({ username: Utils.safeParseEventValue(e) })}
										isValid={username && username.length}
										type="text" title="Username*"
										placeholder="Username"
										disabled={isSaving} />
								</FormGroup>
								<FormGroup>
									<InputGroup
										inputProps={{ name: 'password', className: "full-width" }}
										onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
										isValid={password && password.length}
										type="password" title="Password*"
										placeholder="Password"
										disabled={isSaving} />
								</FormGroup>
								<FormGroup>
									<InputGroup
										inputProps={{ name: 'repeatPassword', className: "full-width" }}
										onChange={(e) => this.setState({ repeatPassword: Utils.safeParseEventValue(e) })}
										isValid={repeatPassword && repeatPassword.length}
										type="password" title="Repeat Password*"
										placeholder="Repeat Password"
										disabled={isSaving} />
								</FormGroup>
								<FormGroup>
									<InputGroup
										inputProps={{ name: 'firstName', className: "full-width" }}
										onChange={(e) => this.setState({ firstName: Utils.safeParseEventValue(e) })}
										type="text" title="First Name*"
										placeholder="First Name"
										disabled={isSaving} />
								</FormGroup>
								<FormGroup>
									<InputGroup
										inputProps={{ name: 'lastName', className: "full-width" }}
										onChange={(e) => this.setState({ lastName: Utils.safeParseEventValue(e) })}
										type="text" title="Last Name*"
										placeholder="Last Name"
										disabled={isSaving} />
								</FormGroup>
								<FormGroup>
									<label>Occupation</label>
									<select
										className="form-control"
										style={{padding: 0}}
										disabled={isSaving}
										onChange={e => this.setState({ occupation: Utils.safeParseEventValue(e) })}
									>
										<option value="">Select an occupation..</option>
										{_.map(['Healthcare Practitioner', 'Healthcare Student', 'Patient', 'Other'], (option, i) => {
											const isObj = typeof option === 'object';
											const label = isObj ? option.label || option.value : option;
											const value = isObj ? option.value : option;
											return (
												<option key={i} value={value}>{label}</option>
											)
										})}
									</select>
								</FormGroup>
								<FormGroup>
									<label>Institution</label>
									{settingsIsLoading || !settings ? <Loader /> : (
										<select
											className="form-control"
											style={{padding: 0}}
											disabled={isSaving}
											onChange={e => this.setState({ institution: Utils.safeParseEventValue(e) })}
										>
											<option value="">Select an institution..</option>
											{_.map(_.map(settings.institutions, institution => ({value: institution.id, label: institution.name})), (option, i) => {
												const isObj = typeof option === 'object';
												const label = isObj ? option.label || option.value : option;
												const value = isObj ? option.value : option;
												return (
													<option key={i} value={value}>{label}</option>
												)
											})}
										</select>
									)}
								</FormGroup>
								{error && error.message && <div className="text-danger">{error.message}</div>}
								<div className="modal-footer text-center justify-content-center">
									<button type="submit" className="btn btn--primary" disabled={isSaving || !this.isValid()}>
										{isSaving ? 'Creating' : 'Create User'}
									</button>
									<button type="button" className="btn btn--primary" disabled={isSaving} onClick={this.close}>
										Cancel
									</button>
								</div>
							</form>
						)}
					</UsersProvider>
				)}
			</SettingsProvider>
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;

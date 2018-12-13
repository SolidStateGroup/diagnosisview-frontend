import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {}

    componentDidMount() {
        AppActions.getExternalStandards();
    }

    close = () => {
        closeModal();
    }

    onOK = () => {
        const externalStandard = _.find(DiagnosisStore.getExternalStandards(), {id: parseInt(this.state.externalStandard)});
        this.props.onOK && this.props.onOK({
            codeString: this.state.code,
            externalStandard,
        });
        closeModal();
    }

    render() {
        const { code } = this.state;
        return (
            <CodesProvider>
				{({ isLoading, externalStandards }) => isLoading ? <Loader /> : (
                    <div className="modal-form-content">
                        <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Code</label>
                            <div>
                                <input className="input input--outline" value={code} onChange={e => this.setState({code: Utils.safeParseEventValue(e)})} />
                            </div>
                        </fieldset>
                        <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">External Standard</label>
                            <div>
                                <select className="fieldset__input input input--outline" onChange={e => this.setState({externalStandard: Utils.safeParseEventValue(e)})}>
                                    <option value=""></option>
                                    {_.map(externalStandards, (externalStandard) => (
                                        <option key={externalStandard.id} value={externalStandard.id}>{externalStandard.name}</option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>
                        <div className="modal-footer text-center justify-content-center">
                            <button
                                disabled={!this.state.code || this.props.existing.indexOf(this.state.code) !== -1 || !this.state.externalStandard}
                                className="btn btn--primary" onClick={this.onOK}
                            >
                                OK
                            </button>
                            <button className="btn btn--primary" onClick={this.close}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </CodesProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

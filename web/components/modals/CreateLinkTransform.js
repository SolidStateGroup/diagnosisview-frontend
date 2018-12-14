import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {
        link: '',
        transformation: '',
    }

    close = (id) => {
        closeModal();
        this.props.onSave && this.props.onSave(id);
        toast('Link transformation created successfully');
    }

    save = () => {
        this.setState({ isSaving: true });
        const { institution, link, transformation } = this.state;
        AppActions.addLinkTransform('INSTITUTION', institution, link, transformation);
    }

    canSave = () => {
        const { institution, link, transformation } = this.state;
        if (!institution || !link || !transformation) return false;

        if (!link.match(Utils.urlRegex) || !transformation.match(Utils.urlRegex)) return false;

        return true;
    }

    render() {
        const { link, transformation } = this.state;
        return (
            <LinkTransformProvider onSave={this.close} onError={() => this.setState({isSaving: false})}>
				{({ isSaving, error }) => (
                    <div className="modal-form-content">
                        <h5>Criteria</h5>
                        <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">INSTITUTION</label>
                            <div>
                                <select className="fieldset__input input input--outline" onChange={e => this.setState({institution: Utils.safeParseEventValue(e)})}>
                                    <option value=""></option>
                                    {_.map(Constants.institutions, institution => (
                                        <option key={institution.value} value={institution.value}>{institution.label}</option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Original URL</label>
                            <div>
                                <input className="input input--outline" value={link} onChange={e => this.setState({link: Utils.safeParseEventValue(e)})} />
                            </div>
                        </fieldset>
                        <fieldset className="fieldset pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Transformed URL</label>
                            <div>
                                <input className="input input--outline" value={transformation} onChange={e => this.setState({transformation: Utils.safeParseEventValue(e)})} />
                            </div>
                        </fieldset>
                        <div className="modal-footer text-center justify-content-center flex-column">
                            <button disabled={!this.canSave() || isSaving} className="btn btn--primary" onClick={this.save}>
                                Save link
                            </button>
                            {error ? <label className="fieldset__label text-small text-muted">Error adding link transform</label> : null}
                        </div>
                    </div>
                )}
            </LinkTransformProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
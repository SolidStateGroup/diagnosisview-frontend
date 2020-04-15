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
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <LinkTransformProvider onSave={this.close} onError={() => this.setState({isSaving: false})}>
                            {({ isSaving, error }) => (
                                <div className="modal-form-content">
                                    <h5>Criteria</h5>
                                    <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">INSTITUTION</label>
                                        <div>
                                            <select
                                                className="fieldset__input input input--outline"
                                                style={{padding: 0}}
                                                onChange={e => this.setState({institution: Utils.safeParseEventValue(e)})}
                                            >
                                                <option value="">Select an institution..</option>
                                                {_.map(settings.institutions, institution => (
                                                    <option key={institution.id} value={institution.id}>{institution.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Original URL</label>
                                        <div>
                                            <textarea
                                                className="input input--outline full-width"
                                                value={link}
                                                onChange={e => this.setState({link: Utils.safeParseEventValue(e)})}
                                                placeholder="Enter the original URL"
                                            />
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Transformed URL</label>
                                        <div>
                                            <textarea
                                                className="input input--outline full-width"
                                                value={transformation}
                                                onChange={e => this.setState({transformation: Utils.safeParseEventValue(e)})}
                                                placeholder="Enter the transformed URL"
                                            />
                                        </div>
                                    </fieldset>
                                    <div className="modal-footer text-center justify-content-center flex-column">
                                        <button disabled={!this.canSave() || isSaving} className="btn btn--primary" onClick={this.save}>
                                            Save rule
                                        </button>
                                        {error ? <label className="fieldset__label text-small text-muted">Error adding link transform</label> : null}
                                    </div>
                                </div>
                            )}
                        </LinkTransformProvider>
                    );
                }}
            </SettingsProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

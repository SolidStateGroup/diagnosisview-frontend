import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {
        code: '',
        description: '',
    }

    close = (id) => {
        closeModal();
        this.props.onSave && this.props.onSave(id);
        toast('Institution created successfully');
    }

    save = () => {
        const { code, description, hidden, image } = this.state;
        const institutions = InstitutionsStore.getInstitutions();
        if (_.find(institutions, i => i.code.toLowerCase() === code.toLowerCase() || i.description.toLowerCase() === description.toLowerCase())) {
            this.setState({error: 'Code and name must be unique'});
            return;
        }
        this.setState({ isSaving: true, error: null });
        AppActions.addInstitution({code, description, hidden, image});
    }

    canSave = () => {
        const { code, description, image } = this.state;
        if (!code || !description || !image) return false;

        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.image !== this.state.image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                $('#imagePreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.state.image);
        }
    }

    render() {
        const { code, description, hidden, image } = this.state;
        return (
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <InstitutionsProvider onSave={this.close} onError={() => this.setState({isSaving: false})}>
                            {({ isSaving, error }) => (
                                <div className="modal-form-content">
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Code</label>
                                        <div>
                                            <input
                                                className="input input--outline"
                                                value={code}
                                                onChange={e => this.setState({code: Utils.safeParseEventValue(e)})}
                                                placeholder="Code"
                                            />
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Name</label>
                                        <div>
                                            <input
                                                className="input input--outline"
                                                value={description}
                                                onChange={e => this.setState({description: Utils.safeParseEventValue(e)})}
                                                placeholder="Name"
                                            />
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Hidden?</label>
                                        <div>
                                            <Switch checked={hidden} onChange={(on) => this.setState({hidden: on})} />
                                        </div>
                                    </fieldset>
                                    <fieldset className="fieldset pt-1 pb-4">
                                        <label className="fieldset__label text-small text-muted">Logo (maximum size 50 x 50)</label>
                                        <div className="flex-column">
                                            <input
                                                type="file"
                                                onChange={e => this.setState({image: e.target.files[0]})}
                                                accept="image/*"
                                            />
                                        </div>
                                        {image ? (
                                            <div className="flex-column mt-3">
                                                <img id="imagePreview" width="50" height="50" />
                                            </div>
                                        ) : null}
                                    </fieldset>
                                    <div className="modal-footer text-center justify-content-center flex-column">
                                        {isSaving ? <Loader /> : (
                                            <button disabled={!this.canSave() || isSaving} className="btn btn--primary" onClick={this.save}>
                                                Save institution
                                            </button>
                                        )}
                                        {error ? <label className="fieldset__label text-small text-muted">Error adding institution</label> : null}
                                        {this.state.error ? <label className="fieldset__label text-small text-danger">{this.state.error}</label> : null}
                                    </div>
                                </div>
                            )}
                        </InstitutionsProvider>
                    );
                }}
            </SettingsProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

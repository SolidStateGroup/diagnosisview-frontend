import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {
        startsWith: '',
    }

    close = (id) => {
        closeModal();
        this.props.onSave && this.props.onSave(id);
        toast('Link logo created successfully');
    }

    save = () => {
        this.setState({ isSaving: true });
        const { startsWith, image, overrideDifficultyLevel } = this.state;
        AppActions.addLinkLogo(startsWith, image, overrideDifficultyLevel);
    }

    canSave = () => {
        const { startsWith, image } = this.state;
        if (!startsWith || !image) return false;

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
        const { startsWith, image, overrideDifficultyLevel } = this.state;
        return (
            <LinkLogoProvider onSave={this.close} onError={() => this.setState({isSaving: false})}>
				{({ isSaving, error }) => (
                    <div className="modal-form-content">
                        <h5>Criteria</h5>
                        <fieldset className="fieldset pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Starts With</label>
                            <div>
                                <input
                                    className="input input--outline"
                                    value={startsWith}
                                    onChange={e => this.setState({startsWith: Utils.safeParseEventValue(e)})}
                                    placeholder="Enter the original URL"
                                />
                            </div>
                        </fieldset>
                        <fieldset className="fieldset pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Logo (recommended size 254 x 57)</label>
                            <div className="flex-column">
                                <input
                                    type="file"
                                    onChange={e => this.setState({image: e.target.files[0]})}
                                    accept="image/*"
                                />
                            </div>
                            {image ? (
                                <div className="flex-column mt-3">
                                    <img id="imagePreview" width="254" height="57" />
                                </div>
                            ) : null}
                        </fieldset>
                        <fieldset className="fieldset pt-1 pb-4">
                            <label className="fieldset__label text-small text-muted">Override link complexity?</label>
                            <div>
                                <select
                                    className="form-control"
                                    style={{padding: 0}}
                                    value={overrideDifficultyLevel}
                                    onChange={(e) => this.setState({overrideDifficultyLevel: e.target.value})}
                                >
                                    <option value="DO_NOT_OVERRIDE">Do not override</option>
                                    {_.map(Constants.difficultyLevels, (option, i) => {
                                        const isObj = typeof option === 'object';
                                        const label = isObj ? option.label || option.value : option;
                                        const value = isObj ? option.value : option;
                                        return (
                                            <option key={i} value={value}>{label}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </fieldset>
                        <div className="modal-footer text-center justify-content-center flex-column">
                            {isSaving ? <Loader /> : (
                                <button disabled={!this.canSave() || isSaving} className="btn btn--primary" onClick={this.save}>
                                    Save logo
                                </button>
                            )}
                            {error ? <label className="fieldset__label text-small text-muted">Error adding link logo</label> : null}
                        </div>
                    </div>
                )}
            </LinkLogoProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

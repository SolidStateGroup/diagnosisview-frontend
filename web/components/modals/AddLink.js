import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {
        name: '',
        link: '',
        freeLink: false,
        transformationsOnly: false,
    }

    close = (id) => {
        closeModal();
    }

    add = () => {
        this.props.onAdd && this.props.onAdd({...this.state});
        closeModal();
    }

    isValid = () => {
        const { name, link, difficultyLevel, freeLink } = this.state;
        if (!name || !link || !difficultyLevel) return false;

        if (!link.match(Utils.urlRegex)) return false;

        return true;
    }

    render() {
        const { name, link, difficultyLevel, freeLink, transformationsOnly } = this.state;
        return (
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <div className="modal-form-content">
                            <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                                <label className="fieldset__label text-small text-muted">Name</label>
                                <div>
                                    <input
                                        className="input input--outline"
                                        value={name}
                                        onChange={e => this.setState({name: Utils.safeParseEventValue(e)})}
                                        placeholder="Enter link name"
                                    />
                                </div>
                            </fieldset>
                            <fieldset className="fieldset pt-1 pb-4">
                                <label className="fieldset__label text-small text-muted">Link</label>
                                <div>
                                    <input
                                        className="input input--outline full-width"
                                        value={link}
                                        onChange={e => this.setState({link: Utils.safeParseEventValue(e)})}
                                        placeholder="Enter link URL"
                                    />
                                </div>
                            </fieldset>
                            <fieldset className="fieldset pt-1 pb-4">
                                <label className="fieldset__label text-small text-muted">Difficulty Level</label>
                                <div>
                                    <select
                                        className="fieldset__input input input--outline full-width"
                                        value={difficultyLevel}
                                        onChange={(e) => this.setState({difficultyLevel: e.target.value})}
                                    >
                                        <option value="">Select difficulty level..</option>
                                        {_.map(settings.difficultyLevels, difficultyLevel => (
                                            <option key={difficultyLevel.id} value={difficultyLevel.id}>{difficultyLevel.id === 'DO_NOT_OVERRIDE' ? 'Do not override' : difficultyLevel.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="fieldset pt-1 pb-4">
                                <label className="">Displayed to free users?</label>
                                <p className="text-small"><Switch checked={freeLink} onChange={checked => this.setState({freeLink: checked})}/></p>
                                <label className="">URL transformations only?</label>
                                <p className="text-small"><Switch checked={transformationsOnly} onChange={checked => this.setState({transformationsOnly: checked})}/></p>
                            </fieldset>
                            <div className="modal-footer text-center justify-content-center">
                                <button disabled={!this.isValid()} className="btn btn--primary" onClick={this.add}>
                                    Add
                                </button>
                                <button className="btn btn--primary" onClick={this.close}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    );
                }}
            </SettingsProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

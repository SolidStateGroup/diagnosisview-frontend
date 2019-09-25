import React from "react";
import CreateLinkLogoModal from '../modals/CreateLinkLogo';

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = { linkLogos: {} }

    componentDidMount() {
        AppActions.getLinkLogos();
    }

    add = () => {
        openModal(
            <div>
                <p className="mb-0">Add new logo</p>
                <p className="text-small text-muted mb-0">Add a new logo for a partial or full URL match</p>
                <i className="far fa-times-circle modal-close clickable" onClick={() => closeModal()}></i>
            </div>,
            <CreateLinkLogoModal />
        );
    }

    edit = (logo) => {
        const linkLogos = this.state.linkLogos;
        linkLogos[logo.id] = _.cloneDeep(logo);
        this.setState({linkLogos});
    }

    cancelEdit = (id) => {
        const linkLogos = this.state.linkLogos;
        $(`#imagePreview${id}`).attr('src', linkLogos[id].imageUrl.indexOf('/api/') !== -1 ? Project.api + linkLogos[id].imageUrl.substr(5) : linkLogos[id].imageUrl);
        delete linkLogos[id];
        this.setState({linkLogos});
    }

    remove = (id) => {
        openConfirm(<h2>Confirm</h2>, <p>Are you sure you want to delete this link logo?</p>, () => AppActions.removeLinkLogo(id));
    }

    save = (id) => {
        AppActions.updateLinkLogo(id, this.state.linkLogos[id]);
    }

    onSave = (id) => {
        const linkLogos = this.state.linkLogos;
        if (linkLogos[id]) {
            delete linkLogos[id];
            this.setState({linkLogos});
        }
    }

    editField = (id, fieldName, e) => {
        const linkLogos = this.state.linkLogos;
        linkLogos[id][fieldName] = Utils.safeParseEventValue(e);
        this.setState({linkLogos});
    }

    editImage = (id, e) => {
        const linkLogos = this.state.linkLogos;
        linkLogos[id].image = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            $(`#imagePreview${id}`).attr('src', e.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        this.setState({linkLogos});
    }

    render = () => {
        return (
            <LinkLogoProvider onSave={this.onSave}>
                {({isLoading, linkLogos, isSaving}) => (
                    <Flex className={'content'}>
                        <div className="flex-row mb-3">
                            <div className="flex-1 flex-column">
                                <h1 className="content__title">Link Logos</h1>
                            </div>
                            <div className="flex-column">
                                <button className="btn btn--primary" onClick={this.add}>
                                    Add new logo
                                </button>
                            </div>
                        </div>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">STARTS WITH</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">LOGO</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">OVERRIDE LINK COMPLEXITY?</label>
                                    </div>
                                </div>
                            </div>
                            {linkLogos && linkLogos.length ? _.map(linkLogos, logo => (
                                <div key={logo.id} className="panel__row flex-row">
                                    <div className="flex-1 flex-row">
                                        <div className="col p-0">
                                            <input
                                                className="input input--outline input--fit-cell"
                                                value={this.state.linkLogos[logo.id] ? this.state.linkLogos[logo.id].startsWith : logo.startsWith}
                                                readOnly={!this.state.linkLogos[logo.id]}
                                                disabled={isSaving} onChange={(e) => this.editField(logo.id, 'startsWith', e)}
                                            />
                                        </div>
                                        <div className="col p-0">
                                            <img id={`imagePreview${logo.id}`} src={logo.imageUrl.indexOf('/api/') !== -1 ? Project.api + logo.imageUrl.substr(5) : logo.imageUrl} width="254" height="57" />
                                            {this.state.linkLogos[logo.id] ? (
                                                <input
                                                    type="file"
                                                    className="input"
                                                    value={this.state.linkLogos[logo.id] ? this.state.linkLogos[logo.id].file : undefined}
                                                    readOnly={!this.state.linkLogos[logo.id]}
                                                    disabled={isSaving} onChange={(e) => this.editImage(logo.id, e)}
                                                />
                                            ) : null}
                                        </div>
                                        <div className="col p-0">
                                            <div className="flex-row">
                                                <select
                                                    className="form-control flex-1"
                                                    style={{padding: 0}}
                                                    value={this.state.linkLogos[logo.id] ? this.state.linkLogos[logo.id].overrideDifficultyLevel : logo.overrideDifficultyLevel}
                                                    disabled={!this.state.linkLogos[logo.id]}
                                                    onChange={(e) => this.editField(logo.id, 'overrideDifficultyLevel', e)}
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
                                                <div className="ml-auto">
                                                    <div className="flex-row">
                                                        {!this.state.linkLogos[logo.id] ? (
                                                            <button className="btn btn--icon btn--icon--blue" onClick={() => this.edit(logo)} disabled={isSaving}>
                                                                <i className="far fa-edit"></i>
                                                            </button>
                                                        ) : (
                                                            <React.Fragment>
                                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.save(logo.id)} disabled={isSaving}>
                                                                    <i className="far fa-save"></i>
                                                                </button>
                                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.cancelEdit(logo.id)} disabled={isSaving}>
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </React.Fragment>
                                                        )}
                                                        <button className="btn btn--icon btn--icon--red" onClick={() => this.remove(logo.id)} disabled={isSaving}>
                                                            <i className="far fa-trash-alt"> </i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="panel__row flex-row">
                                    <div className="flex-1 flex-row">
                                        {isLoading ? <Loader /> : <label className="">No link logos have been created</label>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Flex>
                )}
            </LinkLogoProvider>
        );
    }
});

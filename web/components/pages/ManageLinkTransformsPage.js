import React from "react";
import CreateLinkTransformModal from '../modals/CreateLinkTransform';

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = { linkTransforms: {} }

    componentDidMount() {
        AppActions.getLinkTransforms();
    }

    addNew = () => {
        openModal(
            <div>
                <p className="mb-0">Add new link</p>
                <p className="text-small text-muted mb-0">Add a new resource link that requires routing through a paid proxy</p>
                <i className="far fa-times-circle modal-close clickable" onClick={() => closeModal()}></i>
            </div>,
            <CreateLinkTransformModal />
        );
    }

    edit = (transform) => {
        const linkTransforms = this.state.linkTransforms;
        linkTransforms[transform.id] = _.cloneDeep(transform);
        this.setState({linkTransforms});
    }

    remove = (id) => {
        openConfirm(<h2>Confirm</h2>, <p>Are you sure you want to delete this link transformation?</p>, () => AppActions.removeLinkTransform(id));
    }

    save = (id) => {
        const { criteria, link, transformation } = this.state.linkTransforms[id];
        AppActions.updateLinkTransform(id, { criteriaType: 'INSTITUTION', criteria, link, transformation });
    }

    onSave = (id) => {
        const linkTransforms = this.state.linkTransforms;
        if (linkTransforms[id]) {
            delete linkTransforms[id];
            this.setState({linkTransforms});
        }
    }

    editField = (id, fieldName, e) => {
        const linkTransforms = this.state.linkTransforms;
        linkTransforms[id][fieldName] = Utils.safeParseEventValue(e);
        this.setState({linkTransforms});
    }

    render = () => {
        return (
            <LinkTransformProvider onSave={this.onSave}>
                {({isLoading, linkTransforms, isSaving}) => (
                    <Flex className={'content'}>
                        <div className="flex-row mb-3">
                            <div className="flex-1 flex-column">
                                <h1 className="content__title">URL Transformation</h1>
                            </div>
                            <div className="flex-column">
                                <button className="btn btn--primary" onClick={this.addNew}>
                                    Add new link
                                </button>
                            </div>
                        </div>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">INSTITUTION</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">ORIGINAL URL</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">TRANSFORMED URL</label>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row invisible">
                                            <button className="btn btn--icon btn--icon--blue">
                                                <i className="far fa-edit"></i>
                                            </button>
                                            <button className="btn btn--icon btn--icon--red">
                                                <i className="far fa-trash-alt"> </i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {linkTransforms && linkTransforms.length ? _.map(linkTransforms, transform => (
                                <div key={transform.id} className="panel__row flex-row">
                                    <div className="flex-1 flex-row">
                                        <div className="col p-0">
                                            <select
                                                className="input input--outline input--fit-cell"
                                                value={this.state.linkTransforms[transform.id] ? this.state.linkTransforms[transform.id].criteria : transform.criteria}
                                                disabled={!this.state.linkTransforms[transform.id] || isSaving}
                                                onChange={(e) => this.editField(transform.id, 'criteria', e)}
                                            >
                                            {_.map(Constants.institutions, institution => (
                                                <option key={institution.value} value={institution.value}>{institution.label}</option>
                                            ))}
                                            </select>
                                        </div>
                                        <div className="col p-0">
                                            <input
                                                className="input input--outline input--fit-cell"
                                                value={this.state.linkTransforms[transform.id] ? this.state.linkTransforms[transform.id].link : transform.link}
                                                readOnly={!this.state.linkTransforms[transform.id]}
                                                disabled={isSaving} onChange={(e) => this.editField(transform.id, 'link', e)}
                                            />
                                        </div>
                                        <div className="col p-0">
                                            <input
                                                className="input input--outline input--fit-cell"
                                                value={this.state.linkTransforms[transform.id] ? this.state.linkTransforms[transform.id].transformation : transform.transformation}
                                                readOnly={!this.state.linkTransforms[transform.id]}
                                                disabled={isSaving} onChange={(e) => this.editField(transform.id, 'transformation', e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="flex-row">
                                            {!this.state.linkTransforms[transform.id] ? (
                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.edit(transform)} disabled={isSaving}>
                                                    <i className="far fa-edit"></i>
                                                </button>
                                            ) : (
                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.save(transform.id)} disabled={isSaving}>
                                                    <i className="far fa-save"></i>
                                                </button>
                                            )}
                                            <button className="btn btn--icon btn--icon--red" onClick={() => this.remove(transform.id)} disabled={isSaving}>
                                                <i className="far fa-trash-alt"> </i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="panel__row flex-row">
                                    <div className="flex-1 flex-row">
                                        {isLoading ? <Loader /> : <label className="">No link transforms have been created</label>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Flex>
                )}
            </LinkTransformProvider>
        );
    }
});

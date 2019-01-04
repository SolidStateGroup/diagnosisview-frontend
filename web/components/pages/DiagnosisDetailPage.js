import React from "react";
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import data from '../../../common/stores/base/_data';

import AddCodeCategoryModal from '../modals/AddCodeCategory';
import AddLinkModal from '../modals/AddLink';
import AddExternalStandardModal from '../modals/AddExternalStandard';

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = {}

    componentDidMount() {
        const code = _.get(this.props.location, 'state.code');
        if (code) {
            // Load full diagnosis
            this.setState({ isLoading: true });
            data.get(Project.api + 'code/' + code)
                .then(res => {
                    this.setState({
                        original: res,
                        isLoading: false
                    })
                });
        } else {
            // Must be a new diagnosis
            this.setState({ diagnosis: {} });
        }
    }

    toggleFreeLink = (id, on, displayOrder) => {
        const diagnosis = this.state.diagnosis;
        if (diagnosis) {
            _.find(diagnosis.links, {displayOrder}).freeLink = on;
            this.setState({diagnosis});
        } else {
            openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to ${on ? 'display this link' : 'hide this link from'} free users?`}</h3>,
                () => {
                    this.setState({isSaving: true});
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        freeLink: on,
                        difficultyLevel: _.find(this.state.original.links, {id}).difficultyLevel,
                    })
                        .then(res => {
                            const original = this.state.original;
                            const index = _.findIndex(original.links, {id});
                            original.links[index] = res;
                            this.setState({original, isSaving: false});
                        })
                        .catch(e => {
                            this.setState({isSaving: false});
                            toast('Sorry something went wrong');
                        });
                });
        }
    }

    toggleTransformationsOnly = (id, on, displayOrder) => {
        const diagnosis = this.state.diagnosis;
        if (diagnosis) {
            _.find(diagnosis.links, {displayOrder}).transformationsOnly = on;
            this.setState({diagnosis});
        } else {
            openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to ${on ? 'only display this link on matching URL transform rules?' : 'display this link without having to match URL transform rules?'}`}</h3>,
                () => {
                    this.setState({isSaving: true});
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        transformationsOnly: on,
                    })
                        .then(res => {
                            const original = this.state.original;
                            const index = _.findIndex(original.links, {id});
                            original.links[index] = res;
                            this.setState({original, isSaving: false});
                        })
                        .catch(e => {
                            this.setState({isSaving: false});
                            toast('Sorry something went wrong');
                        });
                });
        }
    }

    onDifficultyLevelChange = (id, e) => {
        const diagnosis = this.state.diagnosis;
        const value = e.target.value;
        if (diagnosis) {
            _.find(diagnosis.links, {id}).difficultyLevel = value;
            this.setState({diagnosis});
        } else {
            openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to change the difficulty on this link to ${_.find(Constants.difficultyLevels, {value}).label}?`}</h3>,
                () => {
                    this.setState({isSaving: true});
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        freeLink: _.find(this.state.original.links, {id}).freeLink,
                        difficultyLevel: value,
                    })
                        .then(res => {
                            const original = this.state.original;
                            const index = _.findIndex(original.links, {id});
                            original.links[index] = res;
                            this.setState({original, isSaving: false});
                        })
                        .catch(e => {
                            this.setState({isSaving: false});
                            toast('Sorry something went wrong');
                        });
                });
        }
    }

    onSwitchChange = (on, field) => {
        const diagnosis = this.state.diagnosis;
        diagnosis[field] = on;
        this.setState({diagnosis});
    }

    onEditField = (path, e) => {
        const diagnosis = this.state.diagnosis;
        _.set(diagnosis, path, Utils.safeParseEventValue(e));
        this.setState({diagnosis});
    }

    getNextAvailableId = (collection, key) => {
        // Just return the highest id + 1
        return _.max(_.map(collection, item => item[key])) + 1 || 1;
    }

    addCategory = () => {
        openModal(<h2>Add Category</h2>, <AddCodeCategoryModal
            onOK={category => {
                const diagnosis = this.state.diagnosis;
                diagnosis.codeCategories = diagnosis.codeCategories || [];
                diagnosis.codeCategories.push({category});
                this.setState({diagnosis});
            }}
            existing={_.map(this.state.diagnosis.codeCategories, ({category}) => category.number)}
        />)
    }

    removeCategory = (number) => {
        const diagnosis = this.state.diagnosis;
        diagnosis.codeCategories.splice(_.findIndex(diagnosis.codeCategories, ({category}) => category.number === number), 1);
        this.setState({diagnosis});
    }

    addExternalStandard = () => {
        openModal(<h2>Add External Standard</h2>, <AddExternalStandardModal
            onOK={externalStandard => {
                const diagnosis = this.state.diagnosis;
                diagnosis.externalStandards = diagnosis.externalStandards || [];
                diagnosis.externalStandards.push({...externalStandard});
                this.setState({diagnosis});
            }}
            existing={_.map(this.state.diagnosis.externalStandards, externalStandard => externalStandard.codeString)}
        />);
    }

    removeExternalStandard = (codeString) => {
        const diagnosis = this.state.diagnosis;
        diagnosis.externalStandards.splice(_.findIndex(diagnosis.externalStandards, {codeString}), 1);
        this.setState({diagnosis});
    }

    addLink = () => {
        openModal(<h2>Add Link</h2>, <AddLinkModal
            onAdd={link => {
                const diagnosis = this.state.diagnosis;
                diagnosis.links = diagnosis.links || [];
                const displayOrder = this.getNextAvailableId(diagnosis.links, 'displayOrder');
                diagnosis.links.push({...link, displayOrder});
                this.setState({diagnosis});
            }}
        />);
    }

    removeLink = (id) => {
        const diagnosis = this.state.diagnosis;
        diagnosis.links.splice(_.findIndex(diagnosis.links, (link) => link.id === id), 1);
        this.setState({diagnosis});
    }

    changeDisplayOrder = (id, up) => {
        const diagnosis = this.state.diagnosis || this.state.original;
        const linkToMove = _.find(diagnosis.links, {id});
        let linkToReplace;
        for (let i = 0; i < diagnosis.links.length; i++) {
            const link = diagnosis.links[i];
            if (link.id === id) continue;
            if (up ?
                    (link.displayOrder < linkToMove.displayOrder && (!linkToReplace || linkToReplace.displayOrder < link.displayOrder)) :
                    (link.displayOrder > linkToMove.displayOrder && (!linkToReplace || linkToReplace.displayOrder > link.displayOrder))) {
                linkToReplace = link;
            }
        }
        if (linkToReplace) {
            if (this.state.diagnosis) {
                const displayOrder = linkToMove.displayOrder;
                linkToMove.displayOrder = linkToReplace.displayOrder;
                linkToReplace.displayOrder = displayOrder;
                this.setState({diagnosis});
            } else {
                this.setState({isSaving: true});
                Promise.all([
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        displayOrder: linkToReplace.displayOrder
                    }),
                    data.put(Project.api + 'admin/code/link', {
                        id : linkToReplace.id,
                        displayOrder: linkToMove.displayOrder
                    }),
                ])
                    .then(([res, res2]) => {
                        linkToMove.displayOrder = res.displayOrder;
                        linkToReplace.displayOrder = res2.displayOrder;
                        this.setState({original: diagnosis, isSaving: false});
                    })
                    .catch(e => {
                        this.setState({isSaving: false});
                        toast('Sorry something went wrong');
                    });
            }
        }
    }

    save = () => {
        const addNew = _.get(this.props.location, 'state.addNew');
        this.setState({isSaving: true});
        const diagnosis = this.state.diagnosis;
        diagnosis.description = diagnosis.patientFriendlyName;
        // console.log('SAVING', diagnosis);
        const action = addNew ? data.post(`${Project.api}admin/code`, diagnosis) : data.put(`${Project.api}admin/code`, diagnosis);
        action.then(res => {
            this.setState({ diagnosis: null, original: res, isSaving: false });
            this.props.history.replace('/admin/diagnosis', { code: res.code });
        });
    }

    render = () => {
        const { diagnosis, original } = this.state;
        if (!diagnosis && !original) return <Flex className="centered-container"><Loader /></Flex>
        const {
            code, patientFriendlyName, created, lastUpdate, hideFromPatients, removedExternally, fullDescription,
            codeCategories, externalStandards, links,
        } = diagnosis || original;
        return (
            <CodesProvider>
                {({ isLoading, codes, isSaving }) => (
                    <Flex className={'content'}>
                        <div className="flex-row mb-2">
                            <button type="button" className="btn btn--icon btn--icon--blue pl-1" onClick={this.context.router.history.goBack}><i class="fas fa-chevron-left"></i> Back</button>
                        </div>
                        <div className="flex-row mb-3">
                            <div className="flex-1 flex-column">
                                {!diagnosis ? <h1 className="content__title">{patientFriendlyName}</h1> : <h1 className="content__title">Add Diagnosis</h1>}
                            </div>
                            {!diagnosis && code.indexOf('dv_') === 0 ? (
                                <button className="btn btn--primary" onClick={() => this.setState({diagnosis: _.cloneDeep(this.state.original)})}>
                                    Edit Diagnosis
                                </button>
                            ) : diagnosis ? (
                                <button className="btn btn--primary" onClick={this.save}>
                                    Save
                                </button>
                            ) : null}
                        </div>

                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row align-items-start">
                                    <div className="col p-0">
                                        <label className="panel__head__title">CODE</label>
                                        {!diagnosis ? <p className="text-small">{code}</p> : (
                                            <p className="mb-0">
                                                <input
                                                    className="input input--outline"
                                                    value={code}
                                                    placeholder="Diagnosis code"
                                                    onChange={(e) => this.onEditField('code', e)}
                                                />
                                            </p>
                                        )}
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                        {!diagnosis ? <p className="text-small">{patientFriendlyName}</p> : (
                                            <p className="mb-0">
                                                <input
                                                    className="input input--outline"
                                                    value={patientFriendlyName}
                                                    placeholder="Diagnosis name"
                                                    onChange={(e) => this.onEditField('patientFriendlyName', e)}
                                                />
                                            </p>
                                        )}
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">CREATED</label>
                                        {!diagnosis ? <p className="text-small">{moment(created).format('DD/MM/YYYY')}</p> : (
                                            <p className="mb-0">
                                                <input
                                                    className="input input--outline"
                                                    value={created}
                                                    placeholder="--/--/----"
                                                    readOnly
                                                />
                                            </p>
                                        )}
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">UPDATED</label>
                                        {!diagnosis ? <p className="text-small">{moment(lastUpdate).format('DD/MM/YYYY')}</p> : (
                                            <p className="mb-0">
                                                <input
                                                    className="input input--outline"
                                                    value={lastUpdate}
                                                    placeholder="--/--/----"
                                                    readOnly
                                                />
                                            </p>
                                        )}
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">HIDE FROM PATIENTS?</label>
                                        <p className="mb-0">
                                            <Switch checked={hideFromPatients} disabled={!diagnosis} onChange={(on) => this.onSwitchChange(on, 'hideFromPatients')} />
                                        </p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">REMOVED EXTERNALLY?</label>
                                        <p className="mb-0">
                                            <Switch checked={removedExternally} disabled={!diagnosis} onChange={(on) => this.onSwitchChange(on, 'removedExternally')}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <label className="panel__head__title">DESCRIPTION</label>
                                    {!diagnosis ? <p className="text-small">{fullDescription}</p> : (
                                        <p className="mb-0">
                                            <textarea
                                                className="input input--outline"
                                                value={fullDescription}
                                                placeholder="--/--/----"
                                                onChange={(e) => this.onEditField('fullDescription', e)}
                                            />
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h5 className="panel__title">Categories</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row align-items-start">
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DESCRIPTION</label>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row invisible">
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red">
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {_.map(codeCategories, ({category}) => (
                                <div key={category.number} className="panel__row flex-row">
                                    <div className="col p-0">
                                        <p className="text-small">{category.friendlyDescription}</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">{category.icd10Description}</p>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row">
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red" onClick={() => this.removeCategory(category.number)}>
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {diagnosis ? (
                                <div className="justify-content text-center">
                                    <button className="btn btn--hollow my-3" onClick={this.addCategory}><i className="fas fa-plus-circle" /> Add</button>
                                </div>
                            ) : null}
                        </div>

                        <h5 className="panel__title">External Standards</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row align-items-start">
                                    <div className="col p-0">
                                        <label className="panel__head__title">CODE</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DESCRIPTION</label>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row invisible">
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red">
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {_.map(externalStandards, ({codeString, externalStandard}) => (
                                <div key={codeString} className="panel__row flex-row">
                                    <div className="col p-0">
                                        <p className="text-small">{codeString}</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">{externalStandard.name}</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">{externalStandard.description}</p>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row">
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red" onClick={() => this.removeExternalStandard(codeString)}>
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {diagnosis ? (
                                <div className="justify-content text-center">
                                    <button className="btn btn--hollow my-3" onClick={this.addExternalStandard}><i className="fas fa-plus-circle" /> Add</button>
                                </div>
                            ) : null}
                        </div>

                        <h5 className="panel__title">Links</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row align-items-start">
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">CREATED</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">LAST UPDATED</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DIFFICULTY LEVEL</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DISPLAY TO FREE USERS?</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">URL TRANSFORMS ONLY?</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">URL</label>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row invisible">
                                            <div className="flex-1 flex-column">
                                                <button className="btn btn--icon btn--icon--blue" style={{padding: 0}}>
                                                    <i className="fas fa-chevron-up text-small"> </i>
                                                </button>
                                                <button className="btn btn--icon btn--icon--blue" style={{padding: 0}}>
                                                    <i className="fas fa-chevron-down text-small"> </i>
                                                </button>
                                            </div>
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red">
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {_.map(_.sortBy(links, "displayOrder"), ({id, name, created, lastUpdate, difficultyLevel, freeLink, link, transformationsOnly, displayOrder}, index) => (
                                <div key={displayOrder} className="panel__row flex-row">
                                    <div className="col p-0">
                                        <p className="text-small">{name}</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">{moment(created).format('DD/MM/YYYY')}</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">{moment(lastUpdate).format('DD/MM/YYYY')}</p>
                                    </div>
                                    <div className="col p-0">
                                        <select
                                            className="form-control input--fit-cell"
                                            style={{padding: 0}}
                                            value={difficultyLevel}
                                            disabled={isSaving}
                                            onChange={(e) => this.onDifficultyLevelChange(id, e)}
                                        >
                                            <option value=""></option>
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
                                    <div className="col p-0">
                                        <p className="text-small"><Switch checked={freeLink} onChange={checked => this.toggleFreeLink(id, checked, displayOrder)}/></p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small"><Switch checked={transformationsOnly} onChange={checked => this.toggleTransformationsOnly(id, checked, displayOrder)} /></p>
                                    </div>
                                    <div className="col p-0">
                                        <a className="text-small" style={{wordBreak: 'break-all'}} href={link}>{link}</a>
                                    </div>
                                    <div className="ml-auto ">
                                        <div className="flex-row">
                                            <div className="flex-1 flex-column">
                                                {index !== 0 ? (
                                                    <button className="btn btn--icon btn--icon--blue" style={{padding: 0}} onClick={() => this.changeDisplayOrder(id, true)}>
                                                        <i className="fas fa-chevron-up text-small"> </i>
                                                    </button>
                                                ) : null}
                                                {index !== links.length - 1 ? (
                                                    <button className="btn btn--icon btn--icon--blue" style={{padding: 0}} onClick={() => this.changeDisplayOrder(id, false)}>
                                                        <i className="fas fa-chevron-down text-small"> </i>
                                                    </button>
                                                ) : null}
                                            </div>
                                            {diagnosis ? (
                                                <button className="btn btn--icon btn--icon--red" onClick={() => this.removeLink(id)}>
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {diagnosis ? (
                                <div className="justify-content text-center">
                                    <button className="btn btn--hollow my-3" onClick={this.addLink}><i className="fas fa-plus-circle" /> Add</button>
                                </div>
                            ) : null}
                        </div>
                    </Flex>
                )}
            </CodesProvider>
        );
    }
});

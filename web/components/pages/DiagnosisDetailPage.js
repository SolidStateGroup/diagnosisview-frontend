import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import data from '../../../common/stores/base/_data';

import AddCodeCategoryModal from '../modals/AddCodeCategory';
import AddLinkModal from '../modals/AddLink';
import AddSynonym from '../modals/AddSynonym';
import AddExternalStandardModal from '../modals/AddExternalStandard';


module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = {
        edit:false,
        selectedTags: [],
    }

    componentDidMount() {
        this.load(this.props.location);
    }

    load = (location) => {
        const code = _.get(location, 'state.code');
        if (code) {
            const edit = _.get(location, 'state.edit');
            // Load full diagnosis
            this.setState({ isLoading: true });
            data.get(Project.api + 'admin/code/' + code)
                .then(res => {
                    this.setState({
                        edit:true,
                        original: res,
                        isLoading: false,
                        diagnosis: edit ? _.cloneDeep(res) : undefined,
                        selectedTags: _.cloneDeep(res.tags),
                    })
                });
        } else {
            // Must be a new diagnosis
            this.setState({ edit:false, diagnosis: {} });
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentCode = _.get(this.props.location, 'state.code');
        const nextCode = _.get(nextProps.location, 'state.code');
        if (currentCode !== nextCode) {
            this.load(nextProps.location);
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
                    const original = this.state.original;
                    const index = _.findIndex(original.links, {id});
                    this.setState({isSaving: true});
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        freeLink: on,
                        transformationsOnly: original.links[index].transformationsOnly,
                        displayOrder:displayOrder,
                        difficultyLevel: _.find(this.state.original.links, {id}).difficultyLevel,
                    })
                        .then(res => {
                            original.links[index] = res;
                            this.setState({original, isSaving: false});
                        })
                        .catch(e => {
                            this.setState({isSaving: false});                            
                            e.json().then(err => alert(`Save Error - ${err.message}`));                                                        
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
                    const original = this.state.original;
                    const index = _.findIndex(original.links, {id});
                    this.setState({isSaving: true});
                    data.put(Project.api + 'admin/code/link', {
                        id,
                        transformationsOnly: on,
                        freeLink: original.links[index].freeLink,
                    })
                        .then(res => {
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

    onTagSelected = (e) => {
        const code = Utils.safeParseEventValue(e);
        if (!code) return;
        const settings = SettingsStore.getSettings();
        if (!settings) return;
        const tag = _.find(settings.tags, {code});
        const selectedTags = this.state.selectedTags || [];
        selectedTags.push(tag);
        this.setState({selectedTags});
    }

    removeSelectedTag = (code) => {
        const selectedTags = this.state.selectedTags || [];
        const index = _.findIndex(selectedTags, {code});
        if (index === -1) return;
        selectedTags.splice(index, 1);
        this.setState({selectedTags});
    }

    onDifficultyLevelChange = (id, e) => {
        const diagnosis = this.state.diagnosis;
        const value = e.target.value;
        const settings = SettingsStore.getSettings();
        if (!settings) return;
        if (diagnosis) {
            _.find(diagnosis.links, {id}).difficultyLevel = value;
            this.setState({diagnosis});
        } else {
            openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to change the difficulty on this link to ${_.find(settings.difficultyLevels, {id: value}).name}?`}</h3>,
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
    getNextAvailableIdByLevel = (collection,level) => {    
        const LEVEL_RANGES={
            "GREEN" : {low:1, high:9},
            "AMBER" : {low:11, high:19},
            "RED" : {low:21, high:29},
        }
    
        for (let index = LEVEL_RANGES[level].low; index <= LEVEL_RANGES[level].high; index++) {                  
           if(_.find(collection, d => d.displayOrder == index)){              
           }else{
               return index
           }
        }        
        return getNextAvailableId(collection, "displayOrder")
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
                const displayOrder = this.getNextAvailableIdByLevel(diagnosis.links,link.difficultyLevel);
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

    addSynonym = () => {
        openModal(<h2>Add Synonym</h2>, <AddSynonym
            onAdd={synonym => {                
                const diagnosis = this.state.diagnosis;
                if (diagnosis) {
                    diagnosis.synonyms = diagnosis.synonyms || [];                                            
                    diagnosis.synonyms.push(synonym);                
                    this.setState({diagnosis});
                } else {
                    const synonyms = this.state.original.synonyms || [];
                    synonyms.push(synonym);
                    this.updateSynonyms(synonyms);
                }
            }}
        />);
    }
    removeSynonymByName = (name) => {        
        const diagnosis = this.state.diagnosis;
        if (diagnosis) {                
            diagnosis.synonyms.splice(_.findIndex(diagnosis.synonyms, ['name', name]), 1);        
            this.setState({diagnosis}); 
        } else {
            const synonyms = this.state.original.synonyms || [];
            synonyms.splice(_.findIndex(this.state.original.synonyms, ['name', name]), 1);
            this.updateSynonyms(synonyms);   
        }
    }

    updateSynonyms = (synonyms) => {
        this.setState({isSaving: true});
        data.put(Project.api + 'admin/code/synonyms', {
                id: this.state.original.id,
                synonyms,
            })
            .then(res => {
                this.setState({ isSaving: false, original: res });
            })
            .catch(e => {
                this.setState({isSaving: false});                            
                e.json().then(err => (err.message ? toast(`${err.message}`) : toast('Sorry something went wrong!')));                                                        
            });
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

    changeDisplayOrderMany = (from, to, id, difficultyLevel) => {
        const dir = from > to ? -1: 1;
        const diagnosis = this.state.diagnosis || this.state.original;     
             
        if (to == 10 || to == 20 || to == 30 || to < 1 || to > 29) {        
            const error = " Invalid order number, must be Green: 1-9, Amber: 11-19, Red: 21-29."
            toast(error);
            console.warn('ERROR: ', error)
            return
           } 
       if (this.checkLinkLevelError(difficultyLevel,to)) return
             
       if (!_.isEmpty(_.filter(diagnosis.links, d => (d.displayOrder == to && d.id != id)))) {             
        const error = " Invalid order number, must be unique"
        toast(error);
        console.warn('ERROR: ', error)
        return

       }                
           // const difficultyLevelToChangeTo =  to <= 9 ? "GREEN" : to <= 19 ? "AMBER" :"RED"
   
            let linksToReplace = _.filter(diagnosis.links, d => d.id === id);                
            
            if (linksToReplace) {
                if (this.state.diagnosis) {                                      
                    linksToReplace.forEach(d => d.displayOrder = d.displayOrder === from ? to : d.displayOrder - dir);
                    let link = _.find(linksToReplace, d => d.id === id)
                    link.difficultyLevel = difficultyLevel                    
                    this.setState({diagnosis});
                } else {                    
                    this.setState({isSaving: true});
                    Promise.all(linksToReplace.map(d => data.put(Project.api + 'admin/code/link', {
                            id: d.id,
                            displayOrder: d.displayOrder === from ? to : d.displayOrder - dir,
                            difficultyLevel: difficultyLevel
                        })))
                        .then((resArr) => {                           
                            resArr.forEach((r) => {
                                let link = _.find(diagnosis.links, d => d.id === r.id)
                                link.displayOrder = r.displayOrder
                                link.difficultyLevel = r.difficultyLevel
                            });

                            this.setState({original: diagnosis, isSaving: false});
                        })
                        .catch(e => {
                            this.setState({isSaving: false});
                            toast('Sorry something went wrong');

                            console.error('ERROR: ', e)
                        });
                }
            }
    }

    checkLinkLevelError = (difficultyLevel,displayOrder) => {
        switch (difficultyLevel) {
            case "GREEN":                
                if(displayOrder <= 0 || displayOrder >= 10) {
                    const error = " Invalid order number, must be Green: 1-9."
                    toast(error);
                    console.warn('ERROR: ', error)
                    return true
                }
            break;
            case "AMBER":
                if(displayOrder <= 10 || displayOrder >= 20) {
                    const error = " Invalid order number, must be Amber: 11-19."
                    toast(error);
                    console.warn('ERROR: ', error)
                    return true
                }
            break;
            case "RED":
                if(displayOrder <= 20 || displayOrder >= 30){
                    const error = " Invalid order number, must be Red: 21-29."
                    toast(error);
                    console.warn('ERROR: ', error)
                    return true
                }
            break;
            const error = " No difficulty level set to perform validation on"
            toast(error);
            console.error('ERROR: ', error)            
            return true
            default:
                break;
        }
        return false
    }
    
    validateLinks = (links) => {
        if(_.isEmpty(links)) return true       
        return (!links.some(link => this.checkLinkLevelError(link.difficultyLevel,link.displayOrder)))
    }

    save = () => {                
        const addNew = _.get(this.props.location, 'state.addNew');
        this.setState({isSaving: true});
        const diagnosis = this.state.diagnosis;        
        if(this.validateLinks(diagnosis.links)){
            diagnosis.description = diagnosis.patientFriendlyName;
            diagnosis.tags = _.map(this.state.selectedTags, ({code}) => ({code}));
           
            const action = addNew ? data.post(`${Project.api}admin/code`, diagnosis) : data.put(`${Project.api}admin/code`, diagnosis);
            action.then(res => {
                this.setState({ diagnosis: null, original: res, isSaving: false });
                this.props.history.replace('/admin/diagnosis', { code: res.code });
                alert('Diagnosis Saved!')
            }, error => {                   
                error.json().then(err => alert(`Save Error - ${err.message}`));
            });
        }
    }

    render = () => {
        const { diagnosis, original, edit, selectedTags } = this.state;
        if (!diagnosis && !original) return <Flex className="centered-container"><Loader /></Flex>
        const {
            code, patientFriendlyName, created, lastUpdate, hideFromPatients, removedExternally, fullDescription,
            codeCategories, externalStandards, links,synonyms, tags,
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
                                {!diagnosis ? <h1 className="content__title">{patientFriendlyName}</h1> : edit ?<h1 className="content__title">Edit Diagnosis</h1> : <h1 className="content__title">Add Diagnosis</h1>}
                            </div>
                            {!diagnosis ? (
                                <button className="btn btn--primary" onClick={() => this.setState({diagnosis: _.cloneDeep(this.state.original), edit:true})}>
                                    Edit Diagnosis
                                </button>
                            ) : diagnosis ? (
                                <button className="btn btn--primary" onClick={this.save} disabled={isSaving}>
                                    {isSaving ? 'Saving..' : 'Save'}
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
                                            <Switch checked={hideFromPatients} disabled={!diagnosis} onChange={(on) => this.onSwitchChange(on, 'hideFromPatients')} className={hideFromPatients ? 'rc-switch-disabled-red' : ''} />
                                        </p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">REMOVED EXTERNALLY?</label>
                                        <p className="mb-0">
                                            <Switch checked={removedExternally} disabled={!diagnosis} onChange={(on) => this.onSwitchChange(on, 'removedExternally')} className={removedExternally ? 'rc-switch-disabled-red' : ''} />
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
                                                onChange={(e) => this.onEditField('fullDescription', e)}
                                            />
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <label className="panel__head__title">TAGS</label>
                                    {!!diagnosis && (
                                        <SettingsProvider>
                                        {({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                                            if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                                            return (
                                                <div className="mb-2">
                                                    <select
                                                        className="fieldset__input input input--outline tag-container"
                                                        onChange={this.onTagSelected}
                                                    >
                                                        <option value="">Select a tag..</option>
                                                        {_.map(_.filter(settings.tags, tag => !_.find(selectedTags, {code: tag.code})), ({code, description}) => (
                                                            <option key={code} value={code}>{description}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        }}
                                    </SettingsProvider>
                                    )}
                                    <Row className="text-small">{_.map(!diagnosis ? tags : selectedTags, tag => (
                                        <Row key={tag.code} className="input input--outline tag" style={{backgroundColor: Constants.tagColours[tag.code] || 'rgb(37, 117, 222)'}}>
                                            <span className="mr-2">{tag.description}</span>
                                            {!!diagnosis && (
                                            <button className="btn--icon tag--icon clickable" onClick={() => this.removeSelectedTag(tag.code)}>
                                                <i className="fas fa-times"> </i>
                                            </button>
                                            )}
                                        </Row>
                                    ))}</Row>
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
                                        <label className="panel__head__title">DISPLAY TO FREE USERS?</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">PAYWALL ONLY?</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">URL</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DIFFICULTY LEVEL</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">POSITION</label>
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
                            {_.map(_.sortBy(links, "displayOrder"), ({id, name, created, lastUpdate, difficultyLevel, freeLink, link, transformationsOnly, displayOrder}, index) => (
                                <div key={id} className="panel__row flex-row">
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
                                        <p className="text-small"><Switch checked={freeLink} onChange={checked => this.toggleFreeLink(id, checked, displayOrder)}/></p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small"><Switch checked={transformationsOnly} onChange={checked => this.toggleTransformationsOnly(id, checked, displayOrder)} /></p>
                                    </div>
                                    <div className="col p-0">
                                        <a className="text-small" style={{wordBreak: 'break-all'}} href={link}>{link}</a>
                                    </div>                                
                                    <DisplayOrderBox id={id} dropdownInitialValue={difficultyLevel} isSaving={isSaving} initialValue={displayOrder} onSubmit={(val, diffLevel) => this.changeDisplayOrderMany(displayOrder, val, id, diffLevel)}/>
                                                                                                                                            
                                    <div className="ml-auto ">
                                        <div className="flex-row">                                           
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

                        <h5 className="panel__title">Synonyms</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row align-items-start">
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
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
                            {_.map(_.sortBy(synonyms, "name"), ({name}, index) => (
                                <div key={name} className="panel__row flex-row">
                                    <div className="col p-0">
                                        <p className="text-small">{name}</p>
                                    </div>                                                                                                                                                
                                    <div className="ml-auto ">
                                        <div className="flex-row">                                           
                                            <button className="btn btn--icon btn--icon--red" onClick={() => this.removeSynonymByName(name)}>
                                                <i className="far fa-trash-alt"> </i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="justify-content text-center">
                                <button className="btn btn--hollow my-3" onClick={this.addSynonym}><i className="fas fa-plus-circle" /> Add</button>
                            </div>
                        </div>
                    </Flex>
                )}
            </CodesProvider>
        );
    }
});

const DisplayOrderBox = class extends React.Component {
    static getDerivedStateFromProps(props, state){
        if(!state || props.initialValue !== state.initialValue || props.dropdownInitialValue !== state.dropdownInitialValue) {
            return {
                initialValue: props.initialValue,
                value: props.initialValue,
                dropdownValue:props.dropdownInitialValue,
                dropdownInitialValue:props.dropdownInitialValue

            }
        }
        return null;
    }

    state = {};

    render(){
        const {value, initialValue, dropdownValue, dropdownInitialValue} = this.state;
        const {onSubmit, isSaving ,id} = this.props;        
      
        return(
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <React.Fragment>
                            <div className="col p-0">
                                <select
                                    className="input input--outline input--fit-cell"
                                    value={dropdownValue}
                                    disabled={isSaving}
                                    onChange={(e) => this.setState({dropdownValue: e.target.value})}
                                >                
                                    {_.map(settings.difficultyLevels, difficultyLevel => (
                                        <option key={difficultyLevel.id} value={difficultyLevel.id}>{difficultyLevel.id === 'DO_NOT_OVERRIDE' ? 'Do not override' : difficultyLevel.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col p-0">
                                <div className="container col"> 
                                    <input type='number' className="input input--outline col" value={value} onChange={val => this.setState({value: Utils.safeParseEventValue(val)})}/>
                                    {(initialValue != value || dropdownValue != dropdownInitialValue) && <React.Fragment>
                                        <button className="btn btn--icon btn--icon--blue p-2" onClick={() => onSubmit(value, dropdownValue)}><i className="fas fa-check" /></button>
                                        <button className="btn btn--icon btn--icon--blue p-2" onClick={() => this.setState({value: initialValue,dropdownValue:dropdownInitialValue})}><i className="fas fa-times" /></button>
                                    </React.Fragment>}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                }}
            </SettingsProvider>
        )
    } 
}
/*
const DisplayOrderBox = ({initialValue, onSubmit}) => {
    const [value, setValue] = useState(initialValue);
    useEffect(() => setValue(initialValue), [initialValue]);
    return <div>
        <input type='number' value={value} onChange={val => setValue(val)}/>
        {initialValue != value && <button onClick={() => onSubmit(val)}>Set</button>}
    </div>;
};*/
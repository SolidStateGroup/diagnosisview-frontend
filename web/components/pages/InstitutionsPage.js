import React from "react";
import ReactTable from "react-table";

import CreateInstitution from '../modals/CreateInstitution';

const theadProps = () => ({
    style: {
        fontWeight: '400',
    }
})

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = {
        institutions: {},
    }

    componentDidMount() {
        AppActions.getInstitutions();
    }

    add = () => {
        openModal(
            <div>
                <p className="mb-0">Add new institution</p>
                <i className="far fa-times-circle modal-close clickable" onClick={() => closeModal()}></i>
            </div>,
            <CreateInstitution />
        );
    }

    edit = (institution) => {
        const institutions = this.state.institutions;
        institutions[institution.id] = _.cloneDeep(institution);
        this.setState({institutions});
    }

    cancelEdit = (id) => {
        const institutions = this.state.institutions;
        delete institutions[id];
        this.setState({institutions});
    }

    remove = (id) => {
        openConfirm(<h2>Confirm</h2>, <p>Are you sure you want to delete this institution?</p>, () => AppActions.removeInstitution(id));
    }

    removeLogo = (id) => {
        openConfirm(<h2>Confirm</h2>, <p>Are you sure you want to delete the logo for this institution?</p>, () => AppActions.removeInstitutionLogo(id));
    }

    save = (id) => {
        const institutions = InstitutionsStore.getInstitutions();
        if (_.find(institutions, i => i.id !== id && (i.code.toLowerCase() === this.state.institutions[id].code.toLowerCase() || i.description.toLowerCase() === this.state.institutions[id].description.toLowerCase()))) {
            alert('Code and name must be unique');
            return;
        }
        AppActions.updateInstitution(id, this.state.institutions[id]);
    }

    onSave = (id) => {
        const institutions = this.state.institutions;
        if (institutions[id]) {
            delete institutions[id];
            this.setState({institutions});
        }
    }

    editField = (id, fieldName, e) => {
        const institutions = this.state.institutions;
        institutions[id][fieldName] = Utils.safeParseEventValue(e);
        this.setState({institutions});
    }

    editSwitch = (id, fieldName, checked) => {
        const institutions = this.state.institutions;
        institutions[id][fieldName] = checked;
        this.setState({institutions});
    }

    editImage = (id, e) => {
        const institutions = this.state.institutions;
        if (e.target.files[0].size > 1048576) {
            alert('File size must be 1MB or less');
            e.target.value = "";
            institutions[id].image = null;
            this.setState({institutions});
            return;
        }
        institutions[id].image = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            $(`#imagePreview${id}`).attr('src', e.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        this.setState({institutions});
    }

    renderEditable = (cellInfo, isSaving) => {
        const id = cellInfo.original.id;
        return (
            <input
                className="form-control input input--outline input-mini"
                readOnly={!this.state.institutions[id] || isSaving}
                onChange={e => this.editField(id, cellInfo.column.id, e)}
                value={this.state.institutions[id] && this.state.institutions[id][cellInfo.column.id]
                        ? this.state.institutions[id][cellInfo.column.id] : cellInfo.original[cellInfo.column.id]
                }
            />
        )
    }

    render = () => {
        return (
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <InstitutionsProvider onSave={this.onSave}>
                            {({isLoading, institutions, isSaving}) => (
                                <Flex className={'content'}>
                                    <div className="flex-row mb-3">
                                        <div className="flex-1 flex-column">
                                            <h1 className="content__title">Institutions</h1>
                                        </div>
                                        <div className="flex-column">
                                            <button className="btn btn--primary" onClick={this.add}>
                                                Add new institution
                                            </button>
                                        </div>
                                    </div>

                                    <ReactTable data={institutions} columns={[{
                                        accessor: 'code',
                                        Header: 'Code',
                                        style: {cursor: 'pointer'},
                                        Cell: (cellInfo) => this.renderEditable(cellInfo, isSaving),
                                        Filter: ({filter, onChange}) => (
                                            <input
                                                type='text'
                                                placeholder="Filter by code"
                                                className="input input--outline full-width"
                                                value={filter ? filter.value : ''}
                                                onChange={event => this.onFilterChange(event, onChange)}
                                            />
                                        )
                                    }, {
                                        accessor: 'description',
                                        Header: 'Name',
                                        style: {cursor: 'pointer'},
                                        Cell: (cellInfo) => this.renderEditable(cellInfo, isSaving),
                                        Filter: ({filter, onChange}) => (
                                            <input
                                                type='text'
                                                placeholder="Filter by name"
                                                className="input input--outline full-width"
                                                value={filter ? filter.value : ''}
                                                onChange={event => this.onFilterChange(event, onChange)}
                                            />
                                        )
                                    }, {
                                        width: 180,
                                        filterable: false,
                                        accessor: 'created',
                                        Header: 'Created',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                {moment(row.original.created).format('DD/MM/YYYY HH:mm')}
                                            </div>
                                        ),
                                    }, {
                                        width: 180,
                                        filterable: false,
                                        accessor: 'lastUpdate',
                                        Header: 'Last Updated',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                {row.original.lastUpdate ? moment(row.original.lastUpdate).format('DD/MM/YYYY HH:mm') : 'Never updated'}
                                            </div>
                                        ),
                                    }, {
                                        width: 100,
                                        filterable: false,
                                        accessor: 'hidden',
                                        Header: 'Hidden',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                <Switch checked={this.state.institutions[row.original.id] ? this.state.institutions[row.original.id].hidden : row.original.hidden} disabled={!this.state.institutions[row.original.id] || isSaving} onChange={(on) => this.editSwitch(row.original.id, 'hidden', on)} className={!this.state.institutions[row.original.id] && row.original.hidden ? 'rc-switch-disabled-green' : ''} />
                                            </div>
                                        ),
                                    }, {
                                        width: 100,
                                        filterable: false,
                                        accessor: 'stats.users',
                                        Header: 'Total Users',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                {_.get(row.original, 'stats.users') || 0}
                                            </div>
                                        ),
                                    }, {
                                        width: 100,
                                        filterable: false,
                                        accessor: 'stats.subscriptions',
                                        Header: 'Subscribed Users',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                {_.get(row.original, 'stats.subscriptions') || 0}
                                            </div>
                                        ),
                                    }, {
                                        width: 160,
                                        filterable: false,
                                        accessor: 'logo',
                                        Header: 'Logo',
                                        style: {cursor: 'pointer'},
                                        Cell: row => (
                                            <div className="col p-0">
                                                {row.original.logoUrl && !this.state.institutions[row.original.id] && (
                                                    <Row>
                                                        <img id={`imagePreview${row.original.id}`} src={row.original.logoUrl.indexOf('/api/') !== -1 ? Project.api + row.original.logoUrl.substr(5) : row.original.logoUrl} width="50" height="50" className="institution-logo" />
                                                        <button className="btn btn--icon btn--icon--red" onClick={() => this.removeLogo(row.original.id)} disabled={isSaving}>
                                                            <i className="far fa-trash-alt"> </i>
                                                        </button>
                                                    </Row>
                                                )}
                                                {this.state.institutions[row.original.id] ? (
                                                    <React.Fragment>
                                                        <input
                                                            type="file"
                                                            id="file"
                                                            className="input logo-file-input"
                                                            value={this.state.institutions[row.original.id] ? this.state.institutions[row.original.id].file : undefined}
                                                            readOnly={!this.state.institutions[row.original.id]}
                                                            disabled={isSaving} onChange={(e) => this.editImage(row.original.id, e)}
                                                            accept="image/*"
                                                        />
                                                        <label for="file" className="clickable logo-file-label"><i className="fas fa-file-upload pr-2"></i><span className="text-small">{this.state.institutions[row.original.id].image ? this.state.institutions[row.original.id].image.name : '(Max size = 1MB)'}</span></label>
                                                    </React.Fragment>
                                                ) : null}
                                            </div>
                                        ),
                                    }, {
                                        width: 145,
                                        filterable: false,
                                        Cell: row => (
                                            <div className="flex-1 flex-row">
                                                <div className="ml-auto">
                                                    <div className="flex-row">
                                                        {!this.state.institutions[row.original.id] ? (
                                                            <button className="btn btn--icon btn--icon--blue" onClick={() => this.edit(row.original)} disabled={isSaving}>
                                                                <i className="far fa-edit"></i>
                                                            </button>
                                                        ) : (
                                                            <React.Fragment>
                                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.save(row.original.id)} disabled={isSaving}>
                                                                    <i className="far fa-save"></i>
                                                                </button>
                                                                <button className="btn btn--icon btn--icon--blue" onClick={() => this.cancelEdit(row.original.id)} disabled={isSaving}>
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </React.Fragment>
                                                        )}
                                                        <button className="btn btn--icon btn--icon--red" onClick={() => this.remove(row.original.id)} disabled={isSaving}>
                                                            <i className="far fa-trash-alt"> </i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }]}
                                        loading={isLoading}
                                        defaultPageSize={10}
                                        filterable={true}
                                        defaultFilterMethod={(filter, row, column) => {
                                            const id = filter.pivotId || filter.id
                                            return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1 : false
                                        }}
                                        defaultSorted={[
                                            {
                                                id: 'code',
                                                desc: false
                                            }
                                        ]}
                                        getTheadProps={theadProps}
                                        showPaginationTop
                                    />

                                    {/* <div className="panel mb-5">
                                        <div className="panel__head">
                                            <div className="flex-1 flex-row">
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Code</label>
                                                </div>
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Name</label>
                                                </div>
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Created</label>
                                                </div>
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Last Updated</label>
                                                </div>
                                                <div className="col p-0 hidden-col">
                                                    <label className="panel__head__title">Hidden</label>
                                                </div>
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Total Users</label>
                                                </div>
                                                <div className="col p-0">
                                                    <label className="panel__head__title">Subscribed Users</label>
                                                </div>
                                            </div>
                                        </div>
                                        {institutions && institutions.length ? _.map(institutions, institution => (
                                            <div key={institution.id} className="panel__row flex-row">
                                                <div className="flex-1 flex-row">
                                                    <div className="col p-0">
                                                        <input
                                                            className="input input--outline input--fit-cell"
                                                            value={this.state.institutions[institution.id] ? this.state.institutions[institution.id].code : institution.code}
                                                            readOnly={!this.state.institutions[institution.id]}
                                                            disabled={isSaving} onChange={(e) => this.editField(institution.id, 'code', e)}
                                                        />
                                                    </div>
                                                    <div className="col p-0">
                                                        <input
                                                            className="input input--outline input--fit-cell"
                                                            value={this.state.institutions[institution.id] ? this.state.institutions[institution.id].description : institution.description}
                                                            readOnly={!this.state.institutions[institution.id]}
                                                            disabled={isSaving} onChange={(e) => this.editField(institution.id, 'description', e)}
                                                        />
                                                    </div>
                                                    <div className="col p-0">
                                                        <input
                                                            className="input input--outline input--fit-cell"
                                                            value={institution.created}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col p-0">
                                                        <input
                                                            className="input input--outline input--fit-cell"
                                                            value={institution.lastUpdate}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col p-0 hidden-col">
                                                        <Switch checked={institution.hidden} disabled={!this.state.institutions[institution.id] || isSaving} onChange={(on) => this.editSwitch(institution.id, 'removedExternally', on)} className={institution.hidden ? 'rc-switch-disabled-red' : ''} />
                                                    </div>
                                                    <div className="col p-0">
                                                        <input
                                                            className="input input--outline input--fit-cell"
                                                            value={institution.stats.users}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col p-0">
                                                        <div className="flex-row">
                                                            <input
                                                                className="input input--outline input--fit-cell"
                                                                value={institution.stats.subscriptions}
                                                                readOnly
                                                            />
                                                            <div className="ml-auto">
                                                                <div className="flex-row">
                                                                    {!this.state.institutions[institution.id] ? (
                                                                        <button className="btn btn--icon btn--icon--blue" onClick={() => this.edit(institution)} disabled={isSaving}>
                                                                            <i className="far fa-edit"></i>
                                                                        </button>
                                                                    ) : (
                                                                        <React.Fragment>
                                                                            <button className="btn btn--icon btn--icon--blue" onClick={() => this.save(institution.id)} disabled={isSaving}>
                                                                                <i className="far fa-save"></i>
                                                                            </button>
                                                                            <button className="btn btn--icon btn--icon--blue" onClick={() => this.cancelEdit(institution.id)} disabled={isSaving}>
                                                                                <i className="fas fa-times"></i>
                                                                            </button>
                                                                        </React.Fragment>
                                                                    )}
                                                                    <button className="btn btn--icon btn--icon--red" onClick={() => this.remove(institution.id)} disabled={isSaving}>
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
                                                    {isLoading ? <Loader /> : <label className="">No institutions have been created</label>}
                                                </div>
                                            </div>
                                        )}
                                    </div> */}
                                </Flex>
                            )}
                        </InstitutionsProvider>
                    );
                }}
            </SettingsProvider>
        );
    }
});

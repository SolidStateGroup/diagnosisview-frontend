import React from "react";
import ReactTable from "react-table";
import CreateUserModal from '../modals/CreateUser';
import ChangePasswordModal from '../modals/ChangePassword';
import ActivateSubscriptionModal from '../modals/ActivateSubscription';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import JSONPretty from 'react-json-pretty';

const theadProps = () => ({
    style: {
        fontWeight: '400'
    }
})

const ExpandRow = hot(module)(class extends React.Component {
    onActiveSubscription = (checked) => {
        const {row, onChange} = this.props;
        if (!checked) {
            // openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to de-activate this users subscription?`}</h3>, () => onChange(row.original.id, {activeSubscription: checked}));
            return;
        } else {
            openModal(<ActivateSubscriptionModal id={row.original.id} onChange={onChange} />)
        }
    }
    renderPaymentDataRow = (cellInfo) => {
        const response = JSON.parse(cellInfo.row.response);

    }
    render() {
        const { id, dateCreated, paymentData } = this.props.row.original;
        const { isSaving, onChange, changes } = this.props;
        const activeSubscription = (changes && changes[id] && _.has(changes[id], 'activeSubscription')) ? changes[id].activeSubscription : this.props.row.original.activeSubscription;
        const expiryDate = (changes && changes[id] && _.has(changes[id], 'expiryDate')) ? changes[id].expiryDate : this.props.row.original.expiryDate;
        return (
            <div className="px-3 pb-3">
                <label className="label-margin-right">Created</label>
                <Input
                    readOnly
                    value={dateCreated ? moment(dateCreated).format('DD/MM/YYYY HH:mm') : '--/--/---- --:--'} />
                <Row>
                    <label className="label-margin-right">Active Subscription</label>
                    <Switch
                        checked={activeSubscription}
                        onChange={this.onActiveSubscription}
                        disabled={isSaving} />
                    {activeSubscription && expiryDate ? (
                        <Row>
                            <label className="label-margin-horizontal">Expiry Date</label>
                            <DatePicker
                                className="react-datepicker-input-small"
                                selected={moment(expiryDate)}
                                onChange={date => onChange(id, {expiryDate: moment(date).valueOf()})}
                                showTimeSelect={true}
                                dateFormat="LLL"
                                minDate={moment()} />
                        </Row>
                    ) : null}
                </Row>
                <ReactTable data={paymentData} columns={[{
                        accessor: 'response',
                        Header: 'Payment Data',
                        style: {cursor: 'pointer'},
                    }]}
                    defaultPageSize={2}
                    SubComponent={row => <JSONPretty json={row.row.response} themeClassName="custom-json-pretty"/>}
                    getTheadProps={theadProps}
                />
            </div>
        )
    }
});

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        AppActions.getUsers();
    }

    save = () => {
        openConfirm(<h2>Confirm</h2>, <h3>Are you sure you want to save your changes?</h3>, () => AppActions.updateUsers(this.state.changes));
    }

    onSave = () => {
        this.setState({changes: null});
    }

    reset = () => {
        openConfirm(<h2>Confirm</h2>, <h3>Are you sure you want to lose all of your changes?</h3>, () => this.setState({changes: null}));
    }

    create = () => {
        openModal(<p>Create User</p>, <CreateUserModal />)
    }

    delete = (user) => {
        openConfirm(<h2>Confirm</h2>, <h3>Are you sure you want to delete <span style={{fontWeight: 'bold'}}>{user.username}</span>? (User is only soft deleted)</h3>, () => AppActions.deleteUser(user));
    }

    changePassword = (user) => {
        openModal(<h2>Change Password</h2>, <ChangePasswordModal user={user} />)
    }

    onExpandRowChange = (uid, newChanges) => {
        var changes = this.state.changes || {};
        changes[uid] = changes[uid] || {};
        _.each(newChanges, (value, key) => {
            changes[uid][key] = value;
        });
        console.log(changes);
        this.setState({changes});
    }

    renderEditableDropdown = (cellInfo, options, users, isSaving, disabled = false) => {
        const uid = users[cellInfo.index].id;
        const selectedOption = this.state.changes && this.state.changes[uid] && this.state.changes[uid][cellInfo.column.id]
            ? this.state.changes[uid][cellInfo.column.id] : users[cellInfo.index][cellInfo.column.id];
        return (
            <select
                className="form-control"
                style={{padding: 0}}
                value={selectedOption}
                disabled={disabled || isSaving}
                onChange={e => {
                    var changes = this.state.changes || {};
                    changes[uid] = changes[uid] || {};
                    changes[uid][cellInfo.column.id] = e.target.value;
                    this.setState({changes});
                }}
            >
                <option value=""></option>
                {_.map(options, (option, i) => {
                    const isObj = typeof option === 'object';
                    const label = isObj ? option.label || option.value : option;
                    const value = isObj ? option.value : option;
                    return (
                        <option key={i} value={value}>{label}</option>
                    )
                })}
            </select>
        )
    }

    renderEditable = (cellInfo, users, isSaving) => {
        const uid = users[cellInfo.index].id;
        return (
            <input
                className="form-control input input--outline input-mini"
                readOnly={isSaving}
                onChange={e => {
                    if (e.target.value === users[cellInfo.index][cellInfo.column.id]) {
                        return;
                    }
                    var changes = this.state.changes || {};
                    changes[uid] = changes[uid] || {};
                    changes[uid][cellInfo.column.id] = e.target.value;
                    this.setState({changes});
                }}
                value={this.state.changes && this.state.changes[uid] && this.state.changes[uid][cellInfo.column.id]
                        ? this.state.changes[uid][cellInfo.column.id] : users[cellInfo.index][cellInfo.column.id]
                }
            />
        )
    }

    renderReadOnly = (cellInfo, users, lastCell) => {
        const input = (
            <input
                className="input input--outline input-mini full-width"
                value={users[cellInfo.index][cellInfo.column.id]}
                readOnly
            />
        );
        return !lastCell ? input : (
            <div className="flex-row">
                <div className="flex-1 flex-row">
                    {input}
                </div>
                <div className="ml-auto">
                    <div className="flex-row">
                        <button className="btn btn--icon btn--icon--blue" onClick={() => this.changePassword(cellInfo.original)}>
                            <i className="fas fa-lock"></i>
                        </button>
                        <button className="btn btn--icon btn--icon--red" onClick={() => this.delete(cellInfo.original)}>
                            <i className="far fa-trash-alt"> </i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render = () => {
        return (
            <SettingsProvider>
				{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                    if (settingsIsLoading || !settings) return <Flex className="centered-container"><Loader /></Flex>;
                    return (
                        <UsersProvider onSave={this.onSave}>
                            {({isLoading, isSaving, users}) => (
                                <Flex className="content">
                                    <div className="flex-row pb-3 mb-3 border-bottom">
                                        <div className="flex-1 flex-column">
                                            <h1 className="content__title">Manage Users</h1>
                                        </div>
                                        <div className="flex-column">
                                            <button className="btn btn--primary" onClick={this.create}>
                                                Create User
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="ml-auto">
                                            <div className="flex-row mb-3">
                                                <div className="flex-column">
                                                    <Button onClick={this.reset} disabled={!this.state.changes} className="btn btn--primary btn--hollow">Reset Changes</Button>
                                                </div>
                                                <div className="flex-column">
                                                    <Button onClick={this.save} disabled={!this.state.changes} className="btn btn--primary btn--hollow">Save Changes</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <ReactTable data={users} columns={[{
                                            accessor: 'username',
                                            Header: 'Username',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderReadOnly(cellInfo, users),
                                            Filter: ({filter, onChange}) => (
                                                <input
                                                    type='text'
                                                    placeholder="Search username"
                                                    className="input input--outline full-width"
                                                    value={filter ? filter.value : ''}
                                                    onChange={event => onChange(event.target.value)}
                                                />
                                            ),
                                        }, {
                                            accessor: 'firstName',
                                            Header: 'First Name',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderEditable(cellInfo, users, isSaving),
                                            Filter: ({filter, onChange}) => (
                                                <input
                                                    type='text'
                                                    placeholder="Search first name"
                                                    className="input input--outline full-width"
                                                    value={filter ? filter.value : ''}
                                                    onChange={event => onChange(event.target.value)}
                                                />
                                            ),
                                        }, {
                                            accessor: 'lastName',
                                            Header: 'Last Name',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderEditable(cellInfo, users, isSaving),
                                            Filter: ({filter, onChange}) => (
                                                <input
                                                    type='text'
                                                    placeholder="Search last name"
                                                    className="input input--outline full-width"
                                                    value={filter ? filter.value : ''}
                                                    onChange={event => onChange(event.target.value)}
                                                />
                                            ),
                                        }, {
                                            accessor: 'occupation',
                                            Header: 'Occupation',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderEditableDropdown(cellInfo,
                                                ['Healthcare Practitioner', 'Healthcare Student', 'Patient', 'Other'], users, isSaving),
                                            Filter: ({filter, onChange}) => (
                                                <input
                                                    type='text'
                                                    placeholder="Search occupation"
                                                    className="input input--outline full-width"
                                                    value={filter ? filter.value : ''}
                                                    onChange={event => onChange(event.target.value)}
                                                />
                                            ),
                                        }, {
                                            accessor: 'institution',
                                            Header: 'Institution',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderEditableDropdown(cellInfo,
                                                _.map(settings.institutions, institution => ({value: institution.id, label: institution.name})), users, isSaving),
                                            Filter: ({filter, onChange}) => (
                                                <input
                                                    type='text'
                                                    placeholder="Search institution"
                                                    className="input input--outline full-width"
                                                    value={filter ? filter.value : ''}
                                                    onChange={event => onChange(event.target.value)}
                                                />
                                            ),
                                        }, {
                                            accessor: 'roleType',
                                            Header: 'Role',
                                            style: {cursor: 'pointer'},
                                            Cell: (cellInfo) => this.renderReadOnly(cellInfo, users, true),
                                            Filter: ({filter, onChange}) => (
                                                <div className="flex-row">
                                                    <div className="flex-1 flex-row">
                                                        <input
                                                            type='text'
                                                            placeholder="Search role"
                                                            className="input input--outline full-width"
                                                            value={filter ? filter.value : ''}
                                                            onChange={event => onChange(event.target.value)}
                                                        />
                                                    </div>
                                                    <div className="ml-auto">
                                                        <div className="flex-row invisible">
                                                            <button className="btn btn--icon btn--icon--blue" onClick={() => this.changePassword(cellInfo.original)}>
                                                                <i className="fas fa-lock"></i>
                                                            </button>
                                                            <button className="btn btn--icon btn--icon--red" onClick={() => this.delete(cellInfo.original)}>
                                                                <i className="far fa-trash-alt"> </i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        }]}
                                        loading={isLoading}
                                        defaultPageSize={50}
                                        filterable={true}
                                        defaultFilterMethod={(filter, row, column) => {
                                            const id = filter.pivotId || filter.id
                                            return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1 : false
                                        }}
                                        SubComponent={row => <ExpandRow row={row} isSaving={isSaving} onChange={this.onExpandRowChange} changes={this.state.changes} />}
                                        freezeWhenExpanded={true}
                                        getTheadProps={theadProps}
                                        showPaginationTop
                                    />
                                </Flex>
                            )}
                        </UsersProvider>
                    );
                }}
            </SettingsProvider>
        );
    }
});

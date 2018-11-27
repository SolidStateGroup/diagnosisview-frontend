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

const ExpandRow = class extends React.Component {
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
            <div>
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
}

module.exports = class extends React.Component {
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
            <Input
                className="form-control table-input"
                contentEditable={!isSaving}
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
                disableHighlight={true}
            />
        )
    }

    renderReadOnly = (cellInfo, users) => {
        return (
            <Input
                className="form-control table-input"
                value={users[cellInfo.index][cellInfo.column.id]}
                disableHighlight={true}
                readOnly
            />
        )
    }

    render = () => {
        return (
            <UsersProvider onSave={this.onSave}>
                {({isLoading, isSaving, users}) => (
                    <Flex>
                        <Row>
                            <Flex>
                                <Button onClick={this.create}>Create User</Button>
                            </Flex>
                        </Row>
                        <Row>
                            <Flex>
                                <Button onClick={this.save} disabled={!this.state.changes}>Save Changes</Button>
                            </Flex>
                            <Flex>
                                <Button onClick={this.reset} disabled={!this.state.changes}>Reset Changes</Button>
                            </Flex>
                        </Row>
                        <ReactTable data={users} columns={[{
                                accessor: 'username',
                                Header: 'Username',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderReadOnly(cellInfo, users)
                            }, {
                                accessor: 'firstName',
                                Header: 'First Name',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderEditable(cellInfo, users, isSaving)
                            }, {
                                accessor: 'lastName',
                                Header: 'Last Name',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderEditable(cellInfo, users, isSaving)
                            }, {
                                accessor: 'occupation',
                                Header: 'Occupation',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderEditableDropdown(cellInfo,
                                    ['Healthcare Practitioner', 'Healthcare Student', 'Patient', 'Other'], users, isSaving)
                            }, {
                                accessor: 'institution',
                                Header: 'Institution',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderEditableDropdown(cellInfo,
                                    ['University of Edinburgh', 'Other', 'None'], users, isSaving)
                            }, {
                                accessor: 'roleType',
                                Header: 'Role',
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => this.renderReadOnly(cellInfo, users)
                            }, {
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => <Button onClick={() => this.changePassword(cellInfo.original)}><span className="icon ion-ios-unlock" /></Button>,
                                filterable: false,
                                width: 46
                            }, {
                                style: {cursor: 'pointer'},
                                Cell: (cellInfo) => <Button onClick={() => this.delete(cellInfo.original)}><span className="icon ion-md-trash" /></Button>,
                                filterable: false,
                                width: 46
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
                        />
                    </Flex>
                )}
            </UsersProvider>
        );
    }
};

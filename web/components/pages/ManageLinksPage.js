import React from "react";
import ReactTable from "react-table";
import CreateLinkModal from '../modals/CreateLink';
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

    addNew = () => {
        openModal(<div><p className="mb-0">Add new link</p><p className="text-small text-muted mb-0">Add a new resource link that requires routing through a paid proxy</p><i className="far fa-times-circle modal-close"></i></div>, <CreateLinkModal />)
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
                                            <i className="fas fa-chevron-right float-right"> </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <select className="input input--outline">
                                            <option>Institution 1</option>
                                            <option>Institution 2</option>
                                            <option>Institution 3</option>
                                            <option>Institution 4</option>
                                        </select>
                                    </div>
                                    <div className="col p-0">
                                        <input className="input input--outline" value="http://www.testinglink.co.uk/journal/treatment" />
                                    </div>
                                    <div className="col p-0">
                                        <input className="input input--outline" value="http://www.testinglink.co.uk.ezproxy.co.uk/journal/treatment" />
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <div className="flex-row">
                                        <button className="btn btn--icon btn--icon--blue">
                                            <i className="far fa-edit"></i>
                                        </button>
                                        <button className="btn btn--icon btn--icon--red">
                                            <i className="far fa-trash-alt"> </i>
                                        </button>
                                        <i className="fas fa-chevron-right float-right"> </i>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <select className="input input--outline">
                                            <option>Institution 1</option>
                                            <option>Institution 2</option>
                                            <option>Institution 3</option>
                                            <option>Institution 4</option>
                                        </select>
                                    </div>
                                    <div className="col p-0">
                                        <input className="input input--outline" value="http://www.testinglink.co.uk/journal/treatment" />
                                    </div>
                                    <div className="col p-0">
                                        <input className="input input--outline" value="http://www.testinglink.co.uk.ezproxy.co.uk/journal/treatment" />
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <div className="flex-row">
                                        <button className="btn btn--icon btn--icon--blue">
                                            <i className="far fa-edit"></i>
                                        </button>
                                        <button className="btn btn--icon btn--icon--red">
                                            <i className="far fa-trash-alt"> </i>
                                        </button>
                                        <i className="fas fa-chevron-right float-right"> </i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Flex>
                )}
            </UsersProvider>
        );
    }
};

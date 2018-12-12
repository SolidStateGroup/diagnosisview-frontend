import React from "react";
import ReactTable from "react-table";
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import JSONPretty from 'react-json-pretty';

const theadProps = () => ({
    style: {
        fontWeight: '400'
    }
})

const ExpandRow = class extends React.Component {

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
                                <h1 className="content__title">Anal Cancer</h1>
                            </div>
                            <div className="flex-column">
                                <img src="/images/nhs-choices.png" alt="NHS Choices"/>
                            </div>
                            <div className="flex-1 flex-column">
                                <button className="btn btn--primary" onClick={this.addNew}>
                                    Edit Diagnosis
                                </button>
                            </div>
                        </div>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">Diagnosis</label>
                                        <p className="text-small">Anal cancer (anal-cancer)</p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">CREATED</label>
                                        <p className="text-small">12/12/2012</p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">UPDATED</label>
                                        <p className="text-small">12/12/2012</p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">HIDE FROM PATIENT?</label>
                                        <p className="mb-0">
                                            <Switch checked={true} onChange={null}/>
                                        </p>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">REMOVED EXTERNALLY?</label>
                                        <p className="mb-0">
                                            <Switch checked={true} onChange={null}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <label className="panel__head__title">DESCRIPTION</label>
                                    <p className="text-small">Read about the symptoms of anal cancer, how its's diagnosed and treated.  Plus what causes the condition.</p>
                                </div>
                            </div>
                        </div>

                        <h5>Categories</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DESCRIPTION</label>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <p className="text-small">Cancer</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">Neoplasms (C00-D49)</p>
                                </div>
                            </div>
                        </div>

                        <h5>External Standards</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">CODE</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">NAME</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">DESCRIPTION</label>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <p className="text-small">C21</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">ICD-10</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">ICD-10</p>
                                </div>
                            </div>
                        </div>

                        <h5>Links</h5>
                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <p className="text-small">NAME</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">CREATED</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">LAST UPDATED</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">DIFFICULTY LEVEL</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">DISPLAY TO FREE USERS?</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="text-small">URL</p>
                                    </div>
                                </div>
                            </div>
                            <div className="panel__row flex-row">
                                <div className="col p-0">
                                    <p className="text-small">Medline Plus (USA)</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">12/12/2012</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">12/12/2012</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">Green</p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small"><Switch checked={true} onChange={null}/></p>
                                </div>
                                <div className="col p-0">
                                    <p className="text-small">http://www.test.com/article/something</p>
                                </div>
                            </div>
                        </div>
                    </Flex>
                )}
            </UsersProvider>
        );
    }
};

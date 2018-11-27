import React from "react";
import ReactTable from "react-table";
import data from '../../../common/stores/base/_data';

const theadProps = () => ({
    style: {
        fontWeight: '400'
    }
})

const ExpandRow = class extends React.Component {
    state = { isLoading: true };
    componentDidMount() {
        data.get(Project.api + 'code/' + this.props.code)
            .then(res => {
                this.setState({
                    diagnosis: res,
                    isLoading: false
                })
            })
    }
    toggleFreeLink = (row, on) => {
        openConfirm(<h2>Confirm</h2>, <h3>{`Are you sure you want to ${on ? 'display this link' : 'hide this link from'} free users?`}</h3>,
            () => {
                AppActions.updateLink(this.state.diagnosis.code, row.original.id, {freeLink: on, difficultyLevel: row.original.difficultyLevel});
                this.state.diagnosis.links[row.index].freeLink = on;
                this.forceUpdate();
            });
    }
    renderLinkDifficultyDropdown = (cellInfo, options, isSaving, disabled = false) => {
        const { diagnosis } = this.state;
        const selectedOption = diagnosis.links[cellInfo.index][cellInfo.column.id];
        return (
            <select
                className="form-control"
                style={{padding: 0}}
                value={selectedOption}
                disabled={disabled || isSaving}
                onChange={e => {
                    AppActions.updateLink(diagnosis.code, diagnosis.links[cellInfo.index].id, {difficultyLevel: e.target.value, freeLink: cellInfo.original.freeLink});
                    diagnosis.links[cellInfo.index].difficultyLevel = e.target.value;
                    this.forceUpdate();
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
    renderReadOnly = (value) => {
        return (
            <Input
                className="form-control table-input"
                value={value}
                disableHighlight={true}
                readOnly
            />
        )
    }
    render() {
        if (this.state.isLoading) return <div className="centered-container"><Loader /></div>;

        const { isSaving, diagnosis } = this.state;
        const { fullDescription, links, created, lastUpdate, sourceType, hideFromPatients, removedExternally, patientFriendlyName, externalStandards, codeCategories } = diagnosis;
        return (
            <div className="pad10">
                <div style={{ position: 'relative', top: 0, right: 0 }}>
                    {sourceType === 'NHS_CHOICES' && <img src={require('../../images/nhs-choices.png')} className="float-right" width={100} height={30} />}
                    {sourceType === 'MEDLINE_PLUS' && <img src={require('../../images/logo-medlineplus.png')} className="float-right" width={100} height={30} />}
                </div>
                <label>Description</label>
                <textarea
                    readOnly
                    value={fullDescription || ''} />
                <Row>
                    <Row>
                        <label className="label-margin-right">Patient Friendly Name</label>
                        <Input
                            readOnly
                            value={patientFriendlyName}
                            className="label-margin-right"
                            containerStyle={{width: patientFriendlyName.length * 8}} />
                    </Row>
                    <Row>
                        <label className="label-margin-right">Created</label>
                        <Input
                            readOnly
                            className="label-margin-right"
                            value={created ? moment(created).local().format('DD/MM/YYYY HH:mm') : '--/--/---- --:--'} />
                    </Row>
                    <Row>
                        <label className="label-margin-right">Last Updated</label>
                        <Input
                            className="label-margin-right"
                            readOnly
                            value={lastUpdate ? moment(lastUpdate).local().format('DD/MM/YYYY HH:mm') : '--/--/---- --:--'} />
                    </Row>
                </Row>
                <Row>
                    <label className="label-margin-right">Hide from patients?</label>
                    <Switch checked={hideFromPatients} />
                    <label className="label-margin-horizontal">Removed externally?</label>
                    <Switch checked={removedExternally} />
                </Row>
                <label>Categories</label>
                <ReactTable data={codeCategories} columns={[{
                        id: 'friendlyDescription',
                        accessor: row => row.category.friendlyDescription,
                        Header: 'Name',
                        Cell: row => this.renderReadOnly(codeCategories[row.index]['category'][row.column.id])
                    }, {
                        id: 'icd10Description',
                        accessor: row => row.category.icd10Description,
                        Header: 'Description',
                        Cell: row => this.renderReadOnly(codeCategories[row.index]['category'][row.column.id])
                    }]}
                    defaultPageSize={codeCategories.length < 5 ? codeCategories.length : 5}
                    getTdProps={() => ({
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    })}
                    getTheadProps={theadProps}
                />
                <label>External Standards</label>
                <ReactTable data={externalStandards} columns={[{
                        accessor: 'codeString',
                        Header: 'Code',
                        Cell: row => this.renderReadOnly(externalStandards[row.index][row.column.id])
                    }, {
                        id: 'name',
                        accessor: row => row.externalStandard.name,
                        Header: 'Name',
                        Cell: row => this.renderReadOnly(externalStandards[row.index]['externalStandard'][row.column.id])
                    }, {
                        id: 'description',
                        accessor: row => row.externalStandard.description,
                        Header: 'Description',
                        Cell: row => this.renderReadOnly(externalStandards[row.index]['externalStandard'][row.column.id])
                    }]}
                    defaultPageSize={externalStandards.length < 5 ? externalStandards.length : 5}
                    getTdProps={() => ({
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    })}
                    getTheadProps={theadProps}
                />
                <label>Links</label>
                <ReactTable data={links} columns={[{
                        accessor: 'name',
                        Header: 'Name',
                        Cell: row => this.renderReadOnly(links[row.index][row.column.id])
                    }, {
                        accessor: 'created',
                        Header: 'Created',
                        Cell: row => this.renderReadOnly(row.value ? moment(row.value).local().format('DD/MM/YYYY HH:mm') : '--/--/---- --:--')
                    }, {
                        accessor: 'lastUpdate',
                        Header: 'Last Updated',
                        Cell: row => this.renderReadOnly(row.value ? moment(row.value).local().format('DD/MM/YYYY HH:mm') : '--/--/---- --:--')
                    }, {
                        accessor: 'difficultyLevel',
                        Header: 'Difficulty Level',
                        Cell: (cellInfo) => this.renderLinkDifficultyDropdown(cellInfo,
                            [{value: 'GREEN', label: 'Green'}, {value: 'AMBER', label: 'Amber'}, {value: 'RED', label: 'Red'}], isSaving)
                    }, {
                        accessor: 'freeLink',
                        Header: 'Displayed to free users?',
                        Cell: row => <Switch checked={row.value} onChange={checked => this.toggleFreeLink(row, checked)} />
                    }, {
                        accessor: 'link',
                        Header: 'URL',
                        Cell: row => (
                            <a href={row.value} target="_blank">{row.value}</a>
                        )
                    }]}
                    defaultPageSize={links.length < 5 ? links.length : 5}
                    getTdProps={() => ({
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    })}
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
        AppActions.getCodes();
    }

    render = () => {
        return (
            <CodesProvider>
                {({ isLoading, codes }) => (
                    <Flex className={'content'}>
                        <div className="flex-row mb-3">
                            <div className="flex-1 flex-column">
                                <h1 className="content__title">Diagnosis</h1>
                            </div>
                            <div className="flex-column">
                                <button className="btn btn--primary">
                                    Add new diagnosis
                                </button>
                            </div>
                        </div>

                        <div className="panel mb-5">
                            <div className="panel__head">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <label className="panel__head__title">Diagnosis Code</label>
                                    </div>
                                    <div className="col p-0">
                                        <label className="panel__head__title">Diagnosis Name</label>
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
                                        <input className="input input--outline" placeholder="Search diagnosis code" />
                                    </div>
                                    <div className="col p-0">
                                        <input className="input input--outline" placeholder="Search diagnosis Name" />
                                    </div>
                                </div>
                                <div className="ml-auto">
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
                            <div className="panel__row flex-row">
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        <p className="panel__row__text mb-0">anal-cancer</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="panel__row__text mb-0">Anal Cancer</p>
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
                                        <p className="panel__row__text mb-0">anal-cancer</p>
                                    </div>
                                    <div className="col p-0">
                                        <p className="panel__row__text mb-0">Anal Cancer</p>
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

                        <ReactTable data={codes} columns={[{
                            accessor: 'code',
                            Header: 'Code',
                            style: {cursor: 'pointer'}
                        }, {
                            accessor: 'friendlyName',
                            Header: 'Name',
                            style: {cursor: 'pointer'}
                        }]}
                            loading={isLoading}
                            defaultPageSize={100}
                            filterable={true}
                            SubComponent={row => <ExpandRow code={row.row.code} />}
                            freezeWhenExpanded={true}
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
                            getTrProps={(state, rowInfo, col, instance) => {
                                return {
                                  onClick: (e) => {
                                    const { expanded } = state;
                                    const path = rowInfo.nestingPath[0];
                                    const diff = { [path]: expanded[path] ? false : true };

                                    instance.setState({
                                      expanded: {
                                        ...expanded,
                                        ...diff
                                      }
                                    });
                                  }
                                };
                            }}
                            getTheadProps={theadProps}
                        />
                    </Flex>
                )}
            </CodesProvider>
        );
    }
};

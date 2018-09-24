import React from "react";
import ReactTable from "react-table";
import data from '../../../common/stores/base/_data';

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
    renderLinkDifficultyDropdown = (cellInfo, options, diagnosis, isSaving, disabled = false) => {
        const selectedOption = diagnosis.links[cellInfo.index][cellInfo.column.id];
        return (
            <select
                className="form-control"
                style={{padding: 0}}
                value={selectedOption}
                disabled={disabled || isSaving}
                onChange={e => {
                    AppActions.updateLinkDifficulty(diagnosis.code, diagnosis.links[cellInfo.index].id, e.target.value);
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
        const { fullDescription, links, created, lastUpdate, sourceType, hideFromPatients, removedExternally, patientFriendlyName, externalStandards } = diagnosis;
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
                    <label className="label-margin-right">Patient Friendly Name</label>
                    <Input
                        readOnly
                        value={patientFriendlyName} />
                    <label className="label-margin-horizontal">Created</label>
                    <Input
                        readOnly
                        value={moment(created).local().format('DD/MM/YYYY HH:mm')} />
                    <label className="label-margin-horizontal">Last Updated</label>
                    <Input
                        readOnly
                        value={moment(lastUpdate).local().format('DD/MM/YYYY HH:mm')} />
                </Row>
                <Row>
                    <label className="label-margin-right">Hide from patients?</label>
                    <Switch checked={hideFromPatients} />
                    <label className="label-margin-horizontal">Removed externally?</label>
                    <Switch checked={removedExternally} />
                </Row>
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
                    defaultPageSize={5}
                    getTdProps={() => ({
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    })}
                />
                <label>Links</label>
                <ReactTable data={links} columns={[{
                        accessor: 'name',
                        Header: 'Name',
                        Cell: row => this.renderReadOnly(links[row.index][row.column.id])
                    }, {
                        accessor: 'created',
                        Header: 'Created',
                        Cell: row => this.renderReadOnly(moment(row.value).local().format('DD/MM/YYYY HH:mm'))
                    }, {
                        accessor: 'lastUpdate',
                        Header: 'Last Updated',
                        Cell: row => this.renderReadOnly(moment(row.value).local().format('DD/MM/YYYY HH:mm'))
                    }, {
                        accessor: 'difficultyLevel',
                        Header: 'Difficulty Level',
                        Cell: (cellInfo) => this.renderLinkDifficultyDropdown(cellInfo,
                            [{value: 'GREEN', label: 'Green'}, {value: 'AMBER', label: 'Amber'}, {value: 'RED', label: 'Red'}], diagnosis, isSaving)
                    }, {
                        accessor: 'link',
                        Header: 'URL',
                        Cell: row => (
                            <a href={row.value} target="_blank">{row.value}</a>
                        )
                    }]}
                    defaultPageSize={5}
                    getTdProps={() => ({
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }
                    })}
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
                    <Flex>
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
                             }} />
                    </Flex>
                )}
            </CodesProvider>
        );
    }
};

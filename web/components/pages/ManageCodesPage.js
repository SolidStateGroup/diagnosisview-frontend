import React from "react";
import ReactTable from "react-table";

const theadProps = () => ({
    style: {
        fontWeight: '400',
    }
})

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            filtered: _.get(this.props.history, 'location.state.filtered') || [],
            sorted: _.get(this.props.history, 'location.state.sorted') || [],
            page: _.get(this.props.history, 'location.state.page') || 0,
        };
    }

    componentDidMount() {
        AppActions.getCodes(true);
    }

    add = () => {
        this.props.history.push('/admin/diagnosis', { addNew: true });
    }

    edit = (e, code) => {
        e.stopPropagation();
        this.props.history.push('/admin/diagnosis', {code, edit: true});
    }

    delete = (e, code) => {
        e.stopPropagation();
        openConfirm(<h2>Confirm</h2>, <h3>Are you sure you want to delete this diagnosis?</h3>, () => AppActions.deleteCode(code));
    }

    onFilterChange = (event, onChange) => {
        onChange(event.target.value);
        this.setState({page: 0});
    }

    render = () => {
        const { filtered, page, sorted } = this.state;
        return (
            <CodesProvider>
                {({ isLoading, codes }) => (
                    <Flex className={'content'}>
                        <div className="flex-row mb-3">
                            <div className="flex-1 flex-column">
                                <h1 className="content__title">Codes</h1>
                            </div>
                            <div className="flex-column">
                                <button className="btn btn--primary" onClick={this.add}>
                                    Add new diagnosis
                                </button>
                            </div>
                        </div>

                        <ReactTable data={codes} columns={[{
                            accessor: 'code',
                            Header: 'Code',
                            style: {cursor: 'pointer'},
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
                            accessor: 'friendlyName',
                            Header: 'Name',
                            style: {cursor: 'pointer'},
                            Filter: ({filter, onChange}) => (
                                <input
                                    type='text'
                                    placeholder="Filter by name"
                                    className="input input--outline full-width"
                                    value={filter ? filter.value : ''}
                                    onChange={event => this.onFilterChange(event, onChange)}
                                />
                            ),
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
                            width: 100,
                            filterable: false,
                            accessor: 'hideFromPatients',
                            Header: 'Hidden',
                            style: {cursor: 'pointer'},
                            Cell: row => (
                                <div className="col p-0">
                                    {row.original.hideFromPatients ? 'Yes' : 'No'}
                                </div>
                            ),
                        }, {
                            width: 140,
                            filterable: false,
                            accessor: 'removedExternally',
                            Header: 'Removed Externally',
                            style: {cursor: 'pointer'},
                            Cell: row => (
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        {row.original.removedExternally ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            ),
                        }, {
                            width: 140,
                            filterable: false,
                            Cell: row => (
                                <div className="flex-1 flex-row">
                                    <div className="ml-auto">
                                        <div className="flex-row">
                                            <React.Fragment>
                                                <button className="btn btn--icon btn--icon--blue" onClick={(e) => this.edit(e, row.original.code)}>
                                                    <i className="far fa-edit"></i>
                                                </button>
                                                <button className="btn btn--icon btn--icon--red" onClick={(e) => this.delete(e, row.original.code)}>
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            </React.Fragment>
                                            <i className="fas fa-chevron-right float-right ml-3"> </i>
                                        </div>
                                    </div>
                                </div>
                            )
                        }]}
                            loading={isLoading}
                            defaultPageSize={100}
                            page={page}
                            onPageChange={page => this.setState({page})}
                            filterable={true}
                            defaultFilterMethod={(filter, row, column) => {
                                const id = filter.pivotId || filter.id
                                return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1 : false
                            }}
                            filtered={filtered}
                            onFilteredChange={(filtered) => this.setState({filtered})}
                            sorted={sorted}
                            onSortedChange={(sorted) => this.setState({sorted})}
                            defaultSorted={[
                                {
                                    id: 'code',
                                    desc: false
                                }
                            ]}
                            getTrProps={(state, rowInfo, col, instance) => {
                                return {
                                  onClick: (e) => {
                                    this.props.history.replace(this.props.history.location.pathname, { ...(this.props.history.location.state || {}), filtered, page, sorted });
                                    this.props.history.push('/admin/diagnosis', {code: rowInfo.original.code });
                                  }
                                };
                            }}
                            getTheadProps={theadProps}
                            showPaginationTop
                        />
                    </Flex>
                )}
            </CodesProvider>
        );
    }
});

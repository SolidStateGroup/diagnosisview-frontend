import React from "react";
import ReactTable from "react-table";

const theadProps = () => ({
    style: {
        fontWeight: '400'
    }
})

module.exports = hot(module)(class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        AppActions.getCodes();
    }

    add = () => {
        this.props.history.push('/admin/diagnosis', { addNew: true });
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
                                <button className="btn btn--primary" onClick={this.add}>
                                    Add new diagnosis
                                </button>
                            </div>
                        </div>

                        <ReactTable data={codes} columns={[{
                            accessor: 'code',
                            Header: 'Diagnosis Code',
                            style: {cursor: 'pointer'},
                            Filter: ({filter, onChange}) => (
                                <input
                                    type='text'
                                    placeholder="Search diagnosis code"
                                    className="input input--outline full-width"
                                    value={filter ? filter.value : ''}
                                    onChange={event => onChange(event.target.value)}
                                />
                            )
                        }, {
                            accessor: 'friendlyName',
                            Header: 'Diagnosis Name',
                            style: {cursor: 'pointer'},
                            Filter: ({filter, onChange}) => (
                                <input
                                    type='text'
                                    placeholder="Search diagnosis name"
                                    className="input input--outline full-width"
                                    value={filter ? filter.value : ''}
                                    onChange={event => onChange(event.target.value)}
                                />
                            ),
                            Cell: row => (
                                <div className="flex-1 flex-row">
                                    <div className="col p-0">
                                        {row.original.friendlyName}
                                    </div>
                                    <div className="ml-auto">
                                        <div className="flex-row">
                                        {row.original.code.indexOf('dv_') === 0 ? (
                                            <React.Fragment>
                                                <button className="btn btn--icon btn--icon--blue">
                                                    <i className="far fa-edit"></i>
                                                </button>
                                                <button className="btn btn--icon btn--icon--red">
                                                    <i className="far fa-trash-alt"> </i>
                                                </button>
                                            </React.Fragment>
                                        ) : null}
                                            <i className="fas fa-chevron-right float-right"> </i>
                                        </div>
                                    </div>
                                </div>
                            )
                        }]}
                            loading={isLoading}
                            defaultPageSize={100}
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
                            getTrProps={(state, rowInfo, col, instance) => {
                                return {
                                  onClick: (e) => {
                                    this.props.history.push('/admin/diagnosis', {code: rowInfo.original.code});
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

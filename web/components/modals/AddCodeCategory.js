import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    state = {}

    componentDidMount() {
        AppActions.getCodeCategories();
    }

    close = () => {
        closeModal();
    }

    onOK = () => {
        this.props.onOK && this.props.onOK(_.find(DiagnosisStore.getCategories(), category => category.number == this.state.category));
        closeModal();
    }

    render() {
        console.log(this.props.existing);
        return (
            <CodesProvider>
				{({ isLoading, categories }) => isLoading ? <Loader /> : (
                    <div className="modal-form-content">
                        <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                            <div>
                                <select
                                    className="fieldset__input input input--outline"
                                    style={{padding: 0}}
                                    onChange={e => this.setState({category: Utils.safeParseEventValue(e)})}
                                >
                                    <option value="">Select a category..</option>
                                    {_.map(_.filter(categories, category => this.props.existing.indexOf(category.number) === -1), (category) => (
                                        <option key={category.number} value={category.number}>{category.friendlyDescription}</option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>
                        <div className="modal-footer text-center justify-content-center">
                            <button disabled={!this.state.category} className="btn btn--primary" onClick={this.onOK}>
                                OK
                            </button>
                            <button className="btn btn--primary" onClick={this.close}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </CodesProvider>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

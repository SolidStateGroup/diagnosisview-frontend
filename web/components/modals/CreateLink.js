import React, { Component, PropTypes } from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    close = (id) => {
        closeModal();
        this.props.onSave && this.props.onSave(id);
        toast('Link created successfully');
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.input.focus()
        }, 500);
    };


    render() {
        const {} = this.state;
        return (
            <div className="modal-form-content">
                <h5>Criteria</h5>
                <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
                    <label className="fieldset__label text-small text-muted">INSTITUTION</label>
                    <div>
                        <select className="fieldset__input input input--outline">
                            <option>Institution 1</option>
                            <option>Institution 2</option>
                            <option>Institution 3</option>
                            <option>Institution 4</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset className="fieldset pt-1 pb-4">
                    <label className="fieldset__label text-small text-muted">Original URL</label>
                    <div>
                        <input className="input input--outline" value="http://www.testinglink.co.uk/journal/treatment" />
                    </div>
                </fieldset>
                <fieldset className="fieldset pt-1 pb-4">
                    <label className="fieldset__label text-small text-muted">Transformed URL</label>
                    <div>
                        <input className="input input--outline" value="http://www.testinglink.co.uk/journal/treatment" />
                    </div>
                </fieldset>
                <div className="modal-footer text-center justify-content-center">
                    <button className="btn btn--primary">
                        Save link
                    </button>
                </div>
            </div>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

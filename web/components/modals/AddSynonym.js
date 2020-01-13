import React, { Component, PropTypes } from "react";

const TheComponent = class extends Component {
  displayName: "TheComponent";

  state = {
    name: ""
  };

  close = id => {
    closeModal();
  };

  add = () => {
    this.props.onAdd && this.props.onAdd({ ...this.state });
    closeModal();
  };

  isValid = () => {
    const { name } = this.state;
    if (!name) return false;
    return true;
  };

  render() {
    const { name } = this.state;
    return (
      <div className="modal-form-content">
        <fieldset className="fieldset fieldset--border-bottom  pt-1 pb-4">
          <label className="fieldset__label text-small text-muted">Name</label>
          <div>
            <input
              className="input input--outline"
              value={name}
              onChange={e =>
                this.setState({ name: Utils.safeParseEventValue(e) })
              }
              placeholder="Enter Synonym name"
            />
          </div>
        </fieldset>
        <div className="modal-footer text-center justify-content-center">
          <button
            disabled={!this.isValid()}
            className="btn btn--primary"
            onClick={this.add}
          >
            Add
          </button>
          <button className="btn btn--primary" onClick={this.close}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

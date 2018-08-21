import React, {Component, PropTypes} from 'react';
import AccountStore from '../stores/account-store';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.count = 1;
        this.start = this.props.start || new Date().valueOf();
    }

    componentDidMount() {
        console.info(this.props.id, this.count++, new Date().valueOf()-this.start);
    }

    componentWillUpdate() {
       this.start = new Date().valueOf();
    }

    componentDidUpdate() {
        console.info(this.props.id, this.count++, new Date().valueOf()-this.start);
    }

    render() {
        return this.props.children
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;

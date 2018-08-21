var NetworkIndicator = Component({
	displayName: 'NetworkIndicator',
	componentDidMount: function () {
		NetInfo.addEventListener(
			'change',
			this._handleReachabilityChange
		);
		NetInfo.fetch().done(
			this._handleReachabilityChange
		);
	},
	getInitialState: function () {
		return {isConnected: true};
	},
	componentWillUnmount: function () {
		NetInfo.removeEventListener(
			'change',
			this._handleReachabilityChange
		);
	},
	_handleReachabilityChange: function (isConnected) {
		this.setState({
			isConnected: isConnected != "none"
		});
		this.props.onChange && this.props.onChange(isConnected != "none");
	},
	render: function () {
		return (
			<Scale style={styles.bar} duration={200} value={!this.state.isConnected}>
				<Text style={styles.barText}>No internet connection.</Text>
			</Scale>
		);
	},
});


module.exports = NetworkIndicator;

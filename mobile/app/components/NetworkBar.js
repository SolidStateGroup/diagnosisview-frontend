module.exports = class extends React.Component {
	state = {};
	heartbeat = () => {
		fetch(Project.api.substr(0, Project.api.length - 4) + 'public/status')
			.then(res => {
				this.setState({dbIsDown: !res.ok})
			})
			.catch(e => this.setState({dbIsDown: true}));
	}
	componentDidMount() {
		// Set up heartbeat to server every 10 secs
		this.heartbeat();
		this.interval = setInterval(this.heartbeat, 10 * 1000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	render() {
		return (
			<NetworkProvider>
				{(isConnected) => (
					<View>
						<SlideUp duration={200}
								style={ [{backgroundColor: pallette.third}]}
								value={!isConnected || this.state.dbIsDown} height={64}>
							<Row>
								<Column>
									<ION style={{fontSize: em(2), color: 'white'}} name="md-warning"/>
								</Column>
								<Column style={{width: DeviceWidth - 100}}>
									<Text style={[Styles.barText]}>
										{this.props.message || "The server connection appears to be down. Please try again later."}
									</Text>
								</Column>
							</Row>
						</SlideUp>
					</View>
				)}
			</NetworkProvider>
		)
	}
};

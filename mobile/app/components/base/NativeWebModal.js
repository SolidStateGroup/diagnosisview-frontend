//propTypes: uri: RequiredString
const NativeModal = class extends React.Component {
	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {}
	}

	onNavigatorEvent(event) {
		if (event.id == 'close' || event.id == 'back') {
			this.props.navigator.dismissModal();
		} else if (event.id == 'backPress') { // Overriding the Android hardware back button
			if (this.state.canGoBack) {
				this.refs.webview.goBack();
			} else {
				this.props.navigator.dismissModal();
			}
		} else {
			this.refs.webview.goBack();
		}

	}

	onNavigationStateChange = (navState) => {

		const buttons = navState.canGoBack ? {
			leftButtons: [
				{
					icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
					id: 'back2', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			]
		} : {
			leftButtons: [
				{
					icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
					id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			]
		};

		this.setState({canGoBack: navState.canGoBack});
		this.props.navigator.setButtons(buttons);

		// this.props.navigator.setTitle({
		//     title: navState.title || this.props.title,
		//     navigatorStyle: {
		//         navBarTextColor: styleVariables.navColor,
		//         navBarButtonColor: styleVariables.navColor
		//     },
		// });

	}

	render() {
		return (
			<Flex style={{backgroundColor: 'white'}}>
				<WebView
					onNavigationStateChange={this.onNavigationStateChange}
					ref="webview"
					style={{flex: 1}}
					source={{uri: this.props.uri && this.props.uri.replace('http:', 'https:')}}
					scalesPageToFit={true}
				/>
			</Flex>
		);
	}
};

module.exports = NativeModal;

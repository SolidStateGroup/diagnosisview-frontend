//propTypes: uri: RequiredString
state = {isLoading: true};
const NativeModal = class extends React.Component {
	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = state
	}

	onNavigatorEvent(event) {
		if (event.id == 'close') {
			this.props.navigator.dismissModal();
		} else if (event.id == routeHelper.navEvents.SHOW) {
			API.getContacts()
				.then(({error, contacts}) => {
					state = {contacts, error, isLoading: false};
					this.setState({contacts, error, isLoading: false})
				})
		} else {
		}

	}

	onDone = () => {
		this.props.navigator.dismissModal();
		this.props.onChange(this.state.value);
	};

	render() {
		const {multiple} = this.props;
		const {isLoading, contacts, value, error} = this.state;
		return (
			<Delay>
				<Flex style={[Styles.body, Styles.container]}>
					<Flex style={Styles.centeredContainer}><Loader/></Flex>
					<Button>Done</Button>
				</Flex>

				<Flex style={[Styles.body, Styles.container]}>
					{ isLoading && <Flex style={Styles.centeredContainer}><Loader/></Flex> }
					{ contacts && <Fade style={{flex: 1}} autostart={true} value={1}>
						<Select
							placeholder="Search by name"
							items={contacts}
							value={value}
							onChange={(value) => this.setState({value})}
							multiple={multiple}
							renderRow={({givenName, familyName}, isSelected, toggleItem) => (
								<ListItem style={Styles.listItem} onPress={toggleItem}>
									<Text style={Styles.listItemText}>
										{givenName}
									</Text>
									<ION
										style={[Styles.listIcon, {color: isSelected ? colour.primary : colour.listItemNav}]}
										name={isSelected ? "ios-checkbox" : "ios-checkbox-outline"}/>
								</ListItem>
							)}
							filterItem={(contact, search) => contact.search.indexOf(search) !== -1}
						/>
					</Fade>}
					<Button onPress={this.onDone}>Done</Button>
				</Flex>
			</Delay>
		);
	}
};

module.exports = NativeModal;

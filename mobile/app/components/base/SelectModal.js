//propTypes: uri: RequiredString
const NativeModal = class extends React.Component {
	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
		this.state = {isLoading: true, value: props.value}
	}

	onNavigatorEvent(event) {
		if (event.id == 'close') {
			this.props.navigator.dismissModal();
		} else if (event.id == routeHelper.navEvents.SHOW) {

		} else {
		}

	}

	onDone = () => {
		this.props.navigator.dismissModal();
		this.props.onChange(this.state.value);
	};

	render() {
		const {isLoading, multiple, items} = this.props;
		const {value} = this.state;
		return (
			<Flex style={[Styles.body,{backgroundColor:'white'}]}>
				{isLoading && <Flex style={Styles.centeredContainer}><Loader/></Flex>}
				{items && <Fade style={{flex: 1}} autostart={true} value={1}>
					<Select
						placeholder={this.props.placeholder || "Search"}
						items={items}
						value={value}
						onChange={(value) => this.setState({value})}
						multiple={multiple}
						renderRow={(item, isSelected, toggleItem) => this.props.renderRow(item, isSelected, toggleItem)}
						filterItem={this.props.filterItem}
					/>
				</Fade>}
				<FormGroup>
					<Column>
						<Button onPress={this.onDone}>Done</Button>
					</Column>
				</FormGroup>
			</Flex>
		);
	}
};

module.exports = NativeModal;

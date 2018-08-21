import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	isSelected = (i) => {
		const {multiple} = this.props;
		const value = this.props.value || [];
		return multiple ? value.indexOf(i) !== -1 : value == i;
	};

	setItem = (i, selected) => {
		const {multiple, value, onChange} = this.props;
		if (multiple) {
			if (selected) {
				onChange((value || []).concat(i));
			} else {
				const index = _.findIndex(value, i);
				value.splice(index, 1);
				onChange(value);
			}
		} else {
			if (selected) {
				onChange(i);
			} else {
				onChange(null);
			}
		}

	};

	render() {
		const {renderRow, renderNoResults, filterItem, placeholder, style} = this.props;
		const {search} = this.state;
		let data = filterItem ? _.filter(this.props.items, (i) => (
			!search || filterItem(i, search)
		)) : this.props.items;


		return (
			<Flex style={[Styles.body, {style}]}>
				{
					filterItem &&
					<FormGroup>
						<Column>
							<TextInput placeholder={placeholder}
									   onChangeText={(search) => this.setState({search: search.toLowerCase()})}/>
						</Column>
					</FormGroup>
				}
				{
					data && data.length ? (
						<FlatList
							data={data}
							renderItem={({item, index}) => {
								const isSelected = this.isSelected(item);
								const toggleItem = () => {
									this.setItem(item, !isSelected)
								};
								return renderRow(item, isSelected, toggleItem);
							}}
						/>
					) : renderNoResults ? renderNoResults() :
						<Text style={Styles.center}>No Results Found for: <Bold>{search}</Bold></Text>
				}

			</Flex>
		);
	}
};

TheComponent.propTypes = {
	value: React.PropTypes.any,
	items: React.PropTypes.array,
	multiple: React.PropTypes.bool,
	filterItem: React.PropTypes.func,
	renderRow: React.PropTypes.func,
	placeholder: React.PropTypes.string,
};

module.exports = TheComponent;

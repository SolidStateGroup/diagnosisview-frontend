import React, {Component, PropTypes} from 'react';
import FavouritesStore from '../stores/favourites-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: FavouritesStore.isLoading,
			favourites: FavouritesStore.getFavourites()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(FavouritesStore, 'change', () => {
			this.setState({
				isLoading: FavouritesStore.isLoading,
				isSaving: FavouritesStore.isSaving,
				favourites: FavouritesStore.getFavourites(),
				error: FavouritesStore.error,
			});
		});

		this.listenTo(FavouritesStore, 'loaded', () => {
			this.props.onLogin && this.props.onLogin();
		})

		this.listenTo(FavouritesStore, 'saved', () => {
			this.props.onSave && this.props.onSave(FavouritesStore.savedId);
		});

		this.listenTo(FavouritesStore, 'problem', () => {
			this.setState({
				isLoading: FavouritesStore.isLoading,
				isSaving: FavouritesStore.isSaving,
				error: FavouritesStore.error
			})
		});
	}

	render() {
		var {isLoading, isSaving, favourites, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				favourites,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;

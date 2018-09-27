import React, {Component, PropTypes} from 'react';

const BrokenLink = class extends Component {
	displayName: 'BrokenLink'

	state = {};

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={[Styles.lightbox]}>
					<View style={[{alignSelf: 'center'}]}>
						<Text style={Styles.textCenter}>
							This link has been removed / updated at source. It might be necessary to remove this link from your favourites and search for the diagnosis again.
						</Text>
					</View>

					<FormGroup>
						<Button style={{alignSelf: 'center', width: 200}} onPress={() => this.props.navigator.dismissLightBox()}>
							Ok
						</Button>
					</FormGroup>
				</View>
			</View>
		);
	}
};

BrokenLink.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = BrokenLink;

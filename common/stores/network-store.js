var BaseStore = require('./base/_store');
import {NetInfo} from 'react-native';


var store = Object.assign({}, BaseStore, {
	id: 'network',
	isConnected: true,
	isDBDown: false
});

var handleIsConnected = (isConnected) => {
	if (isConnected != store.isConnected) {
		store.isConnected = isConnected;
		store.changed();
		if (isConnected) {
			AppActions.connected(isConnected);
		} else {
			AppActions.disconnected(isConnected);
		}
	}
};

const heartbeat = () => {
	fetch(`${Project.public}status`)
		.then(res => {
			store.isDBDown = !res.ok;
		})
		.catch(e => {
			store.isDBDown = true;
		})
		.then(() => {
			store.changed();
		});
}

module.exports = store;

NetInfo.isConnected.addEventListener(
	'connectionChange',
	handleIsConnected
);

heartbeat();
setInterval(heartbeat, 10 * 1000);
